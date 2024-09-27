import { Event } from "../models/Event.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const urlBackend = process.env.URL_API;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/events");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const uploadEvent = multer({
  storage: storage,
});

export const uploadEventImage = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findOne({
      where: {
        eventId: id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    event.flyer = `${urlBackend}/public/events/${req.file.filename}`;

    event.save();

    res.send(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  const {
    eventName,
    eventDate,
    startTime,
    endTime,
    description,
    status,
    location,
    ticketType,
    tickets,
    organizers,
    bankDetails,
  } = req.body;

  try {
    const newEvent = await Event.create({
      flyer: req.filename
        ? req.filename
        : `${urlBackend}/public/imagen/defaultEventPic.png`,
      eventName,
      eventDate,
      startTime,
      endTime,
      description,
      status,
      location,
      ticketType,
      tickets,
      organizers,
      bankDetails,
    });
    res.json(newEvent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editEvent = async (req, res) => {
  const { id } = req.params;
  const {
    eventName,
    eventDate,
    startTime,
    endTime,
    description,
    status,
    location,
    ticketType,
    tickets,
    organizers,
    bankDetails,
  } = req.body;

  try {
    const event = await Event.findOne({
      where: {
        eventId: parseInt(id),
      },
    });

    event.eventName = eventName;
    event.eventDate = eventDate;
    event.startTime = startTime;
    event.endTime = endTime;
    event.description = description;
    event.status = status;
    event.location = location;
    event.ticketType = ticketType;
    event.tickets = tickets;
    event.organizers = organizers;
    event.bankDetail = bankDetails;
    await event.save();

    res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const changeEventPicture = async (req, res) => {
  const { id } = req.params;

  try {
    let event = await Event.findOne({
      where: {
        eventId: parseInt(id),
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (req.file && req.file.filename) {
      event.flyer = req.file.filename;
    } else {
      return res.status(400).send("Error al subir la imagen");
    }

    await event.save();

    res.status(200).send(event);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const deleteEventPicture = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findOne({
      where: {
        eventId: parseInt(id),
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const imagePath = event.flyer;
    let arr = imagePath.split("/");

    fs.unlink(`src/public/events/${arr[5]}`, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log("File deleted!");
    });

    event.flyer = `${urlBackend}/public/imagen/defaultEventPic.png`;
    await event.save();
    res.send("Event Picture Deleted!!!");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
