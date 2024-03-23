import multer from "multer";
import { Receipt } from "../models/Receipt.js";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { PurchasedTicket } from "../models/PurchasedTicket.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";

dotenv.config();
const urlBackend = process.env.URL_BACKEND;


export const getComprobantes = async (req, res) => {
  try {
    const comprobantes = await Receipt.findAll();
    res.json(comprobantes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getComprobanteById = async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const comprobante = await Receipt.findOne({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
    const eventInfo = await Event.findOne({
      where: {
        eventId: eventId,
      },
    });
    if (!comprobante) {
      const entradaTransferida = await PurchasedTicket.findOne({
        where: {
          userId: userId,
          eventId: eventId,
        },
      });
      if (entradaTransferida) {
        const purchasedTickets = {
          ticketId: entradaTransferida.ticketId,
          assigned: entradaTransferida.assigned,
          status: entradaTransferida.status,
          code: entradaTransferida.code,
          ticketName: eventInfo.tickets.find(
            (tickets) => tickets.id === entradaTransferida.ticketIdEntry
          ).ticketName,
        };
        const ownerInfo = await User.findByPk(entradaTransferida.owner);
        if (ownerInfo) {
          purchasedTickets.owner = {
            userId: ownerInfo.userId,
            name: ownerInfo.name,
            lastName: ownerInfo.lastName,
            userName: ownerInfo.userName,
            profilePictures: ownerInfo.profilePictures[0],
            phone: ownerInfo.phone,
          };
        }
        const data = {
          eventInfo: {
            eventId: eventInfo.eventId,
            flyer: eventInfo.flyer,
            eventName: eventInfo.eventName,
            eventDate: eventInfo.eventDate,
            startTime: eventInfo.startTime,
            endTime: eventInfo.endTime,
            description: eventInfo.description,
            location: eventInfo.location,
          },
          purchasedTickets: [purchasedTickets],
        };
        return res.send(data);
      } else {
        return res.status(404).json({ message: "Comprobante no encontrado" });
      }
    }

    const purchasedTickets = await PurchasedTicket.findAll({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    const data = {
      receiptId: comprobante.receiptId,
      eventInfo: {
        eventId: eventInfo.eventId,
        flyer: eventInfo.flyer,
        eventName: eventInfo.eventName,
        eventDate: eventInfo.eventDate,
        startTime: eventInfo.startTime,
        endTime: eventInfo.endTime,
        description: eventInfo.description,
        location: eventInfo.location,
      },
      status: comprobante.status,
      totalAmount: comprobante.totalAmount,
      receipts: comprobante.receipts,
      purchasedTickets: await Promise.all(
        purchasedTickets.map(async (ticket) => {
          const ticketInfo = {
            ticketId: ticket.ticketId,
            assigned: ticket.assigned,
            status: ticket.status,
            code: ticket.code,
            ticketName: eventInfo.tickets.find(
              (tickets) => tickets.id === ticket.ticketIdEntry
            ).ticketName,
          };
          const ownerInfo = await User.findByPk(ticket.owner);
          if (ownerInfo) {
            ticketInfo.owner = {
              userId: ownerInfo.userId,
              name: ownerInfo.name,
              lastName: ownerInfo.lastName,
              userName: ownerInfo.userName,
              profilePictures: ownerInfo.profilePictures[0],
              phone: ownerInfo.phone,
            };
          }
          return ticketInfo;
        })
      ),
    };

    return res.send(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/comprobantes");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
});

export const createComprobante = async (req, res) => {
  const { userId, eventId } = req.params;
  const { purchasedTickets, totalAmount } = req.body;

  try {
    const comprobante = await Receipt.findOne({
      where: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    });

    if (!comprobante) {
      let newComprobante = await Receipt.create({
        eventId: parseInt(eventId),
        userId: parseInt(userId),
        purchasedTickets: purchasedTickets,
        totalAmount: totalAmount,
        // receipts: [],
      });

      // if (req.file && req.file.filename) {
      //   newComprobante.comprobantes = [
      //     `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
      //   ];

      //     await newComprobante.save();
      //     res.json(newComprobante);
      //   } else {
      //     return res.status(400).send("Error en la subida de la imagen");
      //   }
      // } else {
      //   comprobante.comprobantes = [
      //     comprobante.comprobantes[0],
      //     `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
      //   ];

      // await comprobante.save();
      res.json(newComprobante);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadComprobante = async (req, res) => {
  const { userId, eventId } = req.params;
  try {
    const comprobante = await Receipt.findOne({
      where: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    });
    if (!comprobante) {
      return res.status(500).json({ message: "El comprobante no existe" });
    } else {
      if (req.file && req.file.filename) {
        if (!comprobante.receipts[0]) {
          comprobante.receipts = [
            `${urlBackend}/public/comprobantes/${req.file.filename}`,
          ];
        } else {
          comprobante.receipts = [
            comprobante.receipts[0],
            `${urlBackend}/public/comprobantes/${req.file.filename}`,
          ];
        }
        await comprobante.save();
        res.json(comprobante);
      } else {
        return res.status(400).send("Error en la subida de la imagen");
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComprobante = async (req, res) => {
  const { posicion, userId, eventId } = req.params;

  try {
    const comprobante = await Receipt.findOne({
      where: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    });

    if (!comprobante) {
      return res.status(404).json({ message: "comprobante no encontrado" });
    }

    if (parseInt(posicion) < 0 || parseInt(posicion) > 1) {
      return res.status(400).send("Posición no válida");
    }

    if (comprobante.receipts[0] || comprobante.receipts[1]) {
      const imagePath = comprobante.receipts[posicion];
      let arr = imagePath.split("/");

      fs.unlink(`src/public/comprobantes/${arr[5]}`, function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });
    }

    if (parseInt(posicion) == 0 && !comprobante.receipts[1]) {
      await comprobante.destroy();
    }
    if (parseInt(posicion) == 0 && comprobante.receipts[1]) {
      comprobante.receipts = [comprobante.receipts[1]];
    }
    if (parseInt(posicion) == 1) {
      comprobante.receipts = [comprobante.receipts[0]];
    }

    comprobante.save();
    res.send("Comprobante borrado");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
