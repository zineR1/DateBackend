import { PurchasedTicket } from "../models/PurchasedTicket.js";
import { User } from "../models/User.js";
import { Guest } from "../models/Guest.js";
import { Receipt } from "../models/Receipt.js";
import { Event } from "../models/Event.js";
import CryptoJS from "crypto-js";

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

const createCode = async (eventId) => {
  const tickets = await PurchasedTicket.findAll({
    where: {
      eventId: eventId,
    },
  });
  const existingCodes = tickets.map((ticket) => ticket.code);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let newCode;
  do {
    const number = Math.floor(Math.random() * 1000); // Número aleatorio de 0 a 999
    const letter = letters[Math.floor(Math.random() * letters.length)]; // Letra aleatoria del abecedario
    newCode = `${number.toString().padStart(3, "0")}${letter}`;
  } while (existingCodes.includes(newCode)); // Verificar si el código ya existe
  return newCode;
};

export const createTicket = async (req, res) => {
  try {
    const { encryptedData } = req.body;
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const { ticketId, eventId, userId, quantity } = decryptedData;
    const userInfo = await User.findOne({
      where: {
        userId: userId,
      },
    });
    const alreadyGuest = await Guest.findOne({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
    const ticketsInfo = await PurchasedTicket.findAll({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });
    const eventInfo = await Event.findOne({
      where: {
        eventId: eventId,
      },
    });
    const alreadyTicket = ticketsInfo.length > 0;
    const alreadyEventUser =
      userInfo.events && userInfo.events.includes(eventId);

    if (!alreadyGuest && !alreadyEventUser && !alreadyTicket) {
      //Crea todos los tickets
      var createdTickets = [];
      for (let i = 0; i < quantity; i++) {
        const newCode = await createCode(eventId);
        const newTicket = {
          userId: userId,
          eventId: eventId,
          ticketIdEntry: ticketId,
          assigned: false,
          status: { text: "pending", time: null },
          code: newCode,
        };

        //Modifica todos menos el primer ticket
        if (i === 0) {
          newTicket.assigned = true;
          newTicket.owner = userId;
        }
        const dbTicket = await PurchasedTicket.create({
          userId: newTicket.userId,
          eventId: newTicket.eventId,
          ticketIdEntry: newTicket.ticketIdEntry,
          assigned: newTicket.assigned,
          owner: newTicket.owner,
          status: newTicket.status,
          code: newTicket.code,
        });
        createdTickets.push(dbTicket);
      }
      //Modifica la cantidad de tickets vendidos en el evento
      let updatedTicket = eventInfo.tickets.find(
        (ticket) => ticket.id === ticketId
      );
      updatedTicket.quantitySold += quantity;
      //Si con la compra llega al total de entradas disponibles, agotarlas.
      if (updatedTicket.quantitySold === updatedTicket.availableTickets) {
        updatedTicket.status = "Agotada";
      }
      const ticketsFiltered = eventInfo.tickets.filter(
        (ticket) => ticket.id !== updatedTicket.id
      );
      const modifiedTickets = [...ticketsFiltered, updatedTicket];
      eventInfo.tickets = modifiedTickets;
      eventInfo.save();
      //Agregar como guest al usuario comprador
      await Guest.create({
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      });

      //Agregar al user en su prop events el evento
      if (userInfo.events && userInfo.events[0] && userInfo.events.length > 0) {
        userInfo.events = [...userInfo.events, eventId];
      } else {
        userInfo.events = [eventId];
      }
      userInfo.save();
      //Crear el recibo de la compra
      const calcularCostoTotal = (ticketsComprados, ticketsDisponibles) => {
        let costoTotal = 0;
        ticketsComprados.forEach((ticketComprado) => {
          const ticket = ticketsDisponibles.find(
            (t) => t.id === ticketComprado.ticketIdEntry
          );
          if (ticket) {
            costoTotal += ticket.price;
          }
        });

        return costoTotal;
      };
      await Receipt.create({
        userId: userId,
        eventId: eventId,
        purchasedTickets: createdTickets.map((ticket) => ticket.ticketId),
        totalAmount: calcularCostoTotal(createdTickets, eventInfo.tickets),
        receipts: "",
        status: "confirmado",
      });
      res.json(createdTickets);
    }
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
    await PurchasedTicket.destroy({
      where: { id },
    });
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
        await Guest.create({
          userId: parseInt(userIdReceiver),
          eventId: parseInt(eventId),
        });
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
