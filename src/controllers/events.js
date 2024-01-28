import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { PurchasedTicket } from "../models/PurchasedTicket.js";
import { Receipt } from "../models/Receipt.js";
import { Guest } from "../models/Guest.js";
import multer from "multer";
import path from "path";

const URL_API_DATE =
  process.env.NODE_ENV === "production"
    ? "https://datebackendpruebas.onrender.com"
    : "http://localhost:3001";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await PurchasedTicket.destroy({
      where: { eventId: id },
    });
    await Receipt.destroy({
      where: { eventId: id },
    });
    await Guest.destroy({
      where: { eventId: id },
    });
    //Elimina el id del evento eliminado de los events de los users
    const users = await User.findAll();
    const usersWithEvent = users.filter((user) =>
      user.events.includes(parseInt(id))
    );
    const updatedUsers = usersWithEvent.map((user) => ({
      ...user,
      events: user.events.filter((eventId) => eventId !== parseInt(id)),
    }));
    for (const user of updatedUsers) {
      await User.update(
        { events: user.events },
        { where: { userId: user.dataValues.userId } }
      );
    }
    await Event.destroy({
      where: {
        eventId: id,
      },
    });
    res.status(204).json({ message: "Evento Borrado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const soldTickets = async (req, res) => {
  const { id, cantidad, organizadoresNomb } = req.body;

  const event = await Event.findOne({
    where: {
      id: id,
    },
  });

  const tickets = await Ticket.findAll();
  const arr = [];
  const arrUsrs = [];

  tickets.forEach((e) => {
    if (e.eventId == event.id) {
      arr.push(e);
    }
  });

  const users = await User.findAll();
  users.forEach((e) => {});

  const test = arr.map((e) => {
    return {
      ...e.dataValues,
      nombreEntrada: event.nombreEvento,
      cantidadEntradas: cantidad,
      descripcion: event.descripcion,
      invitados: users,
    };
  });
  event.entradas = test;
  res.send(userEvent);
};

export const agregarInvitado = async (req, res) => {
  const {
    id,
    nombre,
    apellido,
    userName,
    foto,
    comprobante,
    pago,
    state,
    entradas,
    total,
  } = req.body;

  const nuevoInvitado = {
    nombre,
    apellido,
    userName,
    foto,
    comprobante,
    pago,
    state,
    entradas,
    total,
  };
  const event = await Event.findOne({
    where: {
      id: id,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Evento no encontrado" });
  }
  let existe = event.invitados.find(
    (invitado) => invitado.userName === userName
  )
    ? true
    : false;

  if (existe) {
    let filtrados = event.invitados.filter(
      (invitado) => invitado.userName !== userName
    );
    event.invitados = [...filtrados, nuevoInvitado];
  } else {
    if (!event.invitados) {
      event.invitados = [];
      event.invitados.push(nuevoInvitado);
    } else {
      event.invitados = [...event.invitados, nuevoInvitado];
    }
  }

  try {
    await event.save();
    res.json(event.invitados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el invitado" });
  }
};

export const getEventById = async (req, res) => {
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

    res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrganizadores = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findOne({
      where: {
        eventId: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(event.organizers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addOrganizadores = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const event = await Event.findOne({
      where: {
        eventId: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    // const data = {
    //   nombre: nombre,
    //   apellido: apellido,
    //   userName: userName,
    //   foto: foto,
    // };

    if (!event.organizers) {
      event.organizers = [];
      event.organizers.push(userId);
    }
    if (event.organizers && !event.organizers.includes(userId)) {
      event.organizers = [...event.organizers, userId];
    }

    await event.save();
    res.json(event.organizers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrganizador = async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const event = await Event.findOne({
      where: {
        eventId: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    const result = event.organizers.filter((id) => id !== parseInt(userId));

    event.organizers = result;

    event.save();
    res.send(event.organizers);
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

export const updateComprobante = async (req, res) => {
  const { id, posicion, userName } = req.params;
  //const {  } = req.body;

  try {
    let event = await Event.findOne({
      where: {
        id: id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (posicion < 0 || posicion > 1) {
      return res.status(400).send("Posición no válida");
    }

    event.invitados.forEach((e) => {
      if (e.userName === userName) {
        if (posicion == 0) {
          e.comprobante = [
            `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
            e.comprobante[1],
          ];
        }
        if (posicion == 1) {
          e.comprobante = [
            e.comprobante[0],
            `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
          ];
        }
      } else {
        return res.status(400).send("Error en la subida de la imagen");
      }
    });

    //     event.invitados.forEach((e) => {
    //        if(e.userName === userName) {
    //             e.comprobante.push(req.file.filename)
    //     }
    // });

    await event.save(); // Guarda el evento actualizado en la base de datos
    // res.json({ img: `/public/comprobantes/${req.file.filename}`, posicion });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComprobante = async (req, res) => {
  const { id, posicion } = req.params;
  const { userName } = req.body;

  try {
    const event = await Event.findOne({
      where: {
        id: id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    //Verifica que la posición sea válida (1, 2)
    if (posicion < 0 || posicion > 1) {
      return res.status(400).send("Posición no válida");
    }

    event.invitados.forEach((e) => {
      if (e.userName == userName) {
        if (posicion == 0) {
          e.comprobante = [null, e.comprobante[1]];
        }
        if (posicion == 1) {
          e.comprobante = [e.comprobante[0], null];
        }
      } else {
        return res.status(400).send("Error al borrar la imagen");
      }
    });

    await event.save();
    res.send(invitado.comprobante);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
