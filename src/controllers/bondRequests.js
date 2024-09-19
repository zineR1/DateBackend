import { BondRequest } from "../models/BondRequest";
import { Bond } from "../models/Bond";
import { User } from "../models/User";

export const sendBondRequest = async (req, res) => {
  const { requesterId, receiverId } = req.body;

  try {
    const existingRequest = await BondRequest.findOne({
      where: { requesterId, receiverId, status: "pending" },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Ya existe una solicitud pendiente." });
    }

    const bondRequest = await BondRequest.create({ requesterId, receiverId });
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
    const bondRequests = await BondRequest.findAll({
      where: {
        bondId: userId,
        status: "pending",
        eventId: eventId,
      },
      include: [
        {
          model: User,
          as: "SentRequests",
          attributes: ["userId", "name", "lastName", "profilePictures"],
        },
      ],
    });

    if (bondRequests.length === 0) {
      return res.status(404).json({
        message: "No tienes solicitudes pendientes en este evento",
      });
    }

    return res.status(200).json(bondRequests);
  } catch (error) {
    console.error("Error fetching bond requests:", error);
    return res.status(500).json({ message: "Error fetching bond requests" });
  }
};
