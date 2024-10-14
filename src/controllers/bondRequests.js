import { User } from "../models/User.js";
import { Bond } from "../models/Bond.js";
import { BondRequest } from "../models/BondRequest.js";
import { Op } from "sequelize";
import { sendWebNotification } from "../services/firebase/webNotification.service.js";

export const sendBondRequest = async (req, res) => {
  const { requesterId, receiverId, eventId } = req.body;

  try {
    const user = await User.findByPk(receiverId);
    if (user) {
      const token = user.notificationToken;
      if (token) {
        await sendWebNotification({
          token,
          title: "Vincufy",
          body: "Recibiste una nueva solicitud de vinculación. ¡Descubrí quién es!",
          link: "BondRequests",
          icon: "../public/imagen/icon.png",
        });
      }
    }

    const existingRequest = await BondRequest.findOne({
      where: { requesterId, receiverId, status: "pending" },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Ya existe una solicitud pendiente." });
    }

    const bondRequest = await BondRequest.create({
      requesterId,
      receiverId,
      eventId,
    });
    return res.status(201).json(bondRequest);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al enviar la solicitud de vínculo.", error });
  }
};

export const respondToBondRequest = async (req, res) => {
  const { requestId, status } = req.body;

  try {
    const bondRequest = await BondRequest.findByPk(requestId);
    const user = await User.findByPk(bondRequest.requesterId);
    if (user) {
      const token = user.notificationToken;
      const name = user.name;
      if (token && name) {
        await sendWebNotification({
          token,
          title: "Vincufy",
          body: `${name} aceptó tu solicitud de vinculación. Escribile a través de sus métodos de contacto `,
          link: "MyBondsStack",
          icon: "../public/imagen/icon.png",
        });
      }
    }

    if (!bondRequest) {
      return res.status(404).json({ message: "Solicitud no encontrada." });
    }

    if (status === "accepted") {
      await Bond.create({
        userId: bondRequest.requesterId,
        bondId: bondRequest.receiverId,
      });

      await Bond.create({
        userId: bondRequest.receiverId,
        bondId: bondRequest.requesterId,
      });
    }

    // Actualizar el estado de la solicitud
    bondRequest.status = status;
    await bondRequest.save();

    return res
      .status(200)
      .json({ message: `Solicitud ${status} exitosamente.` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al responder a la solicitud.", error });
  }
};

export const getPendingBondRequests = async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    // let bondRequestsSent = await BondRequest.findAll({
    //   where: {
    //     requesterId: userId,
    //     status: "pending",
    //     eventId: eventId,
    //   },
    //   include: [
    //     {
    //       model: User,
    //       as: "Receiver",
    //       attributes: [
    //         "userId",
    //         "name",
    //         "lastName",
    //         "description",
    //         "city",
    //         "profilePictures",
    //       ],
    //     },
    //   ],
    // });

    let bondRequestReceived = await BondRequest.findAll({
      where: {
        receiverId: userId,
        status: "pending",
        eventId: eventId,
      },
      include: [
        {
          model: User,
          as: "Requester",
          attributes: [
            "userId",
            "name",
            "lastName",
            "description",
            "age",
            "city",
            "profilePictures",
            "contactMethods",
            "sentimentalSituation",
          ],
        },
      ],
    });

    return res
      .status(200)
      .json(bondRequestReceived.length ? bondRequestReceived : []);
  } catch (error) {
    console.error("Error fetching bond requests:", error);
    return res.status(500).json({ message: "Error fetching bond requests" });
  }
};

export const checkBondRequestsStatus = async (req, res) => {
  const { userId, guestId, eventId } = req.params;

  // Convertir los IDs de string a number
  const userIdNum = parseInt(userId, 10);
  const guestIdNum = parseInt(guestId, 10);
  const eventIdNum = parseInt(eventId, 10);

  try {
    const bondRequest = await BondRequest.findOne({
      where: {
        eventId: eventIdNum,
        [Op.or]: [
          { requesterId: userIdNum, receiverId: guestIdNum },
          { requesterId: guestIdNum, receiverId: userIdNum },
        ],
      },
    });

    if (!bondRequest) {
      return res.status(200).json({ status: "noBondRequest" });
    }

    // Determinar quién es el solicitante y quién es el receptor
    const isRequestFromUser =
      bondRequest.requesterId === userIdNum &&
      bondRequest.receiverId === guestIdNum;
    const isRequestFromGuest =
      bondRequest.requesterId === guestIdNum &&
      bondRequest.receiverId === userIdNum;

    if (bondRequest.status === "pending") {
      if (isRequestFromUser) {
        return res.status(200).json({ status: "pendingRequestSent" });
      } else if (isRequestFromGuest) {
        return res.status(200).json({
          status: "pendingRequestReceived",
          requestId: bondRequest.requestId,
        });
      }
    }

    if (bondRequest.status === "accepted") {
      return res.status(200).json({ status: "bond" });
    }

    return res.status(400).json({
      message: `La solicitud está en estado: ${bondRequest.status}`,
    });
  } catch (error) {
    console.error(
      "Error al gestionar la solicitud de estado de vinculación:",
      error
    );
    return res.status(500).json({
      message: "Error al gestionar la solicitud de estado de vinculación",
    });
  }
};
