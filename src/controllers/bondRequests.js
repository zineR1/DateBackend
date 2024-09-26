import { User } from "../models/User.js";
import { Bond } from "../models/Bond.js";
import { BondRequest } from "../models/BondRequest.js";
import { Op } from "sequelize";

export const sendBondRequest = async (req, res) => {
  const { requesterId, receiverId, eventId } = req.body;

  try {
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
    let bondRequestsSent = await BondRequest.findAll({
      where: {
        requesterId: userId,
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
    let bondRequestReceived = await BondRequest.findAll({
      where: {
        receiverId: userId,
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

    if (bondRequestsSent.length === 0) {
      bondRequestsSent = [];
    }
    if (bondRequestReceived.length === 0) {
      bondRequestReceived = [];
    }

    return res.status(200).json({
      bondRequestsSent: bondRequestsSent,
      bondRequestReceived: bondRequestReceived,
    });
  } catch (error) {
    console.error("Error fetching bond requests:", error);
    return res.status(500).json({ message: "Error fetching bond requests" });
  }
};

export const checkBondRequestsStatus = async (req, res) => {
  const { userId, guestId, eventId } = req.params;
  try {
    const bondRequest = await BondRequest.findOne({
      where: {
        eventId: eventId,
        [Op.or]: [
          { requesterId: userId, receiverId: guestId },
          { requesterId: guestId, receiverId: userId },
        ],
      },
    });

    if (!bondRequest) {
      return res.status(200).json({ status: "noBondRequest" });
    }

    if (
      bondRequest.requesterId === guestId &&
      bondRequest.receiverId === userId
    ) {
      if (bondRequest.status === "pending") {
        return res.status(200).json({ status: "pendingRequestReceived" });
      }
    }

    switch (bondRequest.status) {
      case "pending":
        return res.status(200).json({ status: "pendingRequestSent" });
      case "accepted":
        return res.status(200).json({ status: "bond" });
      default:
        return res.status(400).json({
          message: `La solicitud está en estado: ${bondRequest.status}`,
        });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error al gestionar la solicitud de estado de vinculación",
    });
  }
};
