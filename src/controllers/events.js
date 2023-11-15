import { Event } from "../models/Event.js";
import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import Utils from "../utils/index.js";
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
    await Event.destroy({
      where: {
        id: id,
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
    // confirmado,
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

  let existe = event.invitados.includes(
    (invitado) => invitado.userName === userName
  );
  if (existe) {
    let filtrados = event.invitados.filter(
      (invitado) => invitado.userName !== userName
    );

    event.invitados = filtrados.push(nuevoInvitado);
  } else {
    if (!event.invitados) {
      event.invitados = [];
      event.invitados.push(nuevoInvitado);
      console.log(event.invitados, " Invitados if");
    } else {
      event.invitados = [...event.invitados, nuevoInvitado];
      console.log(event.invitados, " Invitados else");
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
        id: id,
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

export const addOrganizadores = async (req, res) => {
  const { nombre, apellido, userName, foto } = req.body;
  const { id } = req.params;

  try {
    const event = await Event.findOne({
      where: {
        id: id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    const data = {
      nombre: nombre,
      apellido: apellido,
      userName: userName,
      foto: foto,
    };
    if (!event.organizadores) {
      event.organizadores = [];
      event.organizadores.push(data);
      console.log(event.organizadores, " Invitados if");
    } else {
      event.organizadores = [...event.organizadores, data];
      console.log(event.organizadores, " Invitados else");
    }

    await event.save();
    res.json(event.organizadores);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrganizador = async (req, res) => {
  const { userName } = req.body;
  const { id } = req.params;

  try {
    const event = await Event.findOne({
      where: {
        id: id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    const result = event.organizadores.filter((e) => e.userName !== userName);

    event.organizadores = result;

    event.save();
    res.send(event.organizadores);
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

    console.log(event.invitados);
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
