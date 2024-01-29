import { PurchasedTicket } from "../models/PurchasedTicket.js";
import { User } from "../models/User.js";
import { Guest } from "../models/Guest.js";

export const getTickets = async (req, res) => {
  try {
    const tickets = await PurchasedTicket.findAll();
    res.json(tickets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await PurchasedTicket.findOne({
      where: {
        id: id,
      },
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { price, sold, userId, eventId } = req.body;

    const newTicket = await PurchasedTicket.create({
      price,
      sold,
      userId,
      eventId,
    });

    res.json(newTicket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { price, sold, userId } = req.body;
  try {
    const ticket = await PurchasedTicket.findOne({
      where: { id },
    });

    ticket.set({
      price,
      sold,
      userId,
    });

    ticket.save();
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PurchasedTicket.destroy({
      where: { id },
    });
    console.log(result);
    return res.status(204).send("Borrado");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const transferTicket = async (req, res) => {
  const { eventId, ticketId, userIdBuyer, userIdReceiver } = req.params;
  try {
    //VERIFICO QUE AMBOS USUARIOS EXISTAN
    const userBuyerExist = await User.findOne({
      where: {
        userId: parseInt(userIdBuyer),
      },
    });
    const userReceiverExist = await User.findOne({
      where: {
        userId: parseInt(userIdReceiver),
      },
    });
    //TRAIGO LA ENTRADA NO ASIGNADA A TRANSFERIR
    if (userBuyerExist && userReceiverExist) {
      const ticketNA = await PurchasedTicket.findOne({
        where: {
          userId: parseInt(userIdBuyer),
          ticketId: parseInt(ticketId),
          eventId: parseInt(eventId),
        },
      });
      //MODIFICO TICKET NO ASIGNADO
      ticketNA.assigned = true;
      ticketNA.owner = parseInt(userIdReceiver);
      ticketNA.userId = parseInt(userIdReceiver);
      ticketNA.save();
      //AGREGO LA ENTRADA Y EL EVENTO AL USUARIO A TRANSFERIR
      const userReceiver = await User.findOne({
        where: {
          userId: parseInt(userIdReceiver),
        },
      });
      if (
        !userReceiver.ownedTickets ||
        userIdReceiver.ownedTickets[0] === null ||
        !userReceiver.ownedTickets.find(
          (ticket) => ticket.eventId === parseInt(eventId)
        )
      ) {
        if (
          !userReceiver.ownedTickets ||
          !Array.isArray(userReceiver.ownedTickets) ||
          userReceiver.ownedTickets[0] === null
        ) {
          userReceiver.ownedTickets = [ticketNA];
        } else {
          userReceiver.ownedTickets = [...userReceiver.ownedTickets, ticketNA];
        }
        if (
          !userReceiver.events ||
          !Array.isArray(userReceiver.events) ||
          userReceiver.events[0] === null
        ) {
          userReceiver.events = [parseInt(eventId)];
        } else {
          userReceiver.events = [...userReceiver.events, parseInt(eventId)];
        }
        userReceiver.save();
        //AGREGO A LOS INVITADOS DEL EVENTO  AL USUARIO A TRANSFERIR
        const newGuest = await Guest.create({
          userId: parseInt(userIdReceiver),
          eventId: parseInt(eventId),
        });

        newGuest.save();
        res.send("Entrada transferida con éxito");
      } else {
        return res.status(500).json({
          message:
            "Ya tenés tu entrada para este evento, no podés adquirir más.",
        });
      }
    } else {
      return res.status(500).json({
        message:
          "No existe el usuario comprador o el que debe recibir la entrada.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
