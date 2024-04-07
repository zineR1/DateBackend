import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { PurchasedTicket } from "../models/PurchasedTicket.js";
import { Receipt } from "../models/Receipt.js";
import { Guest } from "../models/Guest.js";
import multer from "multer";
import path from "path";

const urlBackend = process.env.URL_BACKEND_QA;

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

// export const soldTickets = async (req, res) => {
//   const { id, cantidad, organizadoresNomb } = req.body;

//   const event = await Event.findOne({
//     where: {
//       id: id,
//     },
//   });

//   const tickets = await Ticket.findAll();
//   const arr = [];
//   const arrUsrs = [];

//   tickets.forEach((e) => {
//     if (e.eventId == event.id) {
//       arr.push(e);
//     }
//   });

//   const users = await User.findAll();
//   users.forEach((e) => {});

//   const test = arr.map((e) => {
//     return {
//       ...e.dataValues,
//       nombreEntrada: event.nombreEvento,
//       cantidadEntradas: cantidad,
//       descripcion: event.descripcion,
//       invitados: users,
//     };
//   });
//   event.entradas = test;
//   res.send(userEvent);
// };

// export const agregarInvitado = async (req, res) => {
//   const {
//     id,
//     nombre,
//     apellido,
//     userName,
//     foto,
//     comprobante,
//     pago,
//     state,
//     entradas,
//     total,
//   } = req.body;

//   const nuevoInvitado = {
//     nombre,
//     apellido,
//     userName,
//     foto,
//     comprobante,
//     pago,
//     state,
//     entradas,
//     total,
//   };
//   const event = await Event.findOne({
//     where: {
//       id: id,
//     },
//   });

//   if (!event) {
//     return res.status(404).json({ message: "Evento no encontrado" });
//   }
//   let existe = event.invitados.find(
//     (invitado) => invitado.userName === userName
//   )
//     ? true
//     : false;

//   if (existe) {
//     let filtrados = event.invitados.filter(
//       (invitado) => invitado.userName !== userName
//     );
//     event.invitados = [...filtrados, nuevoInvitado];
//   } else {
//     if (!event.invitados) {
//       event.invitados = [];
//       event.invitados.push(nuevoInvitado);
//     } else {
//       event.invitados = [...event.invitados, nuevoInvitado];
//     }
//   }

//   try {
//     await event.save();
//     res.json(event.invitados);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al agregar el invitado" });
//   }
// };

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

export const getAdminEventInfo = async (req, res) => {
  const { eventId } = req.params;
  try {
    const eventInfo = await Event.findOne({
      where: {
        eventId: eventId,
      },
    });
    if (!eventInfo) {
      return res.send("Este evento no existe");
    }
    const receiptInfo = await Receipt.findAll({
      where: {
        eventId: eventId,
      },
    });
    const tickets = await PurchasedTicket.findAll({
      where: {
        eventId: eventId,
      },
    });
    const guestInfo = await Guest.findAll({
      where: {
        eventId: eventId,
      },
    });
    const guestList = guestInfo.map((guest) => guest.userId);
    const userGuestInfo = await User.findAll({
      where: {
        userId: guestList,
      },
    });
    const organizerInfo = await User.findAll({
      where: {
        userId: eventInfo.organizers,
      },
    });
    const organizerInfoFormated = organizerInfo.map((organizer) => {
      return {
        userId: organizer.userId,
        name: organizer.name,
        lastName: organizer.lastName,
        userName: organizer.userName,
        profilePictures: organizer.profilePictures[0],
        age: organizer.age,
        dateOfBirth: organizer.dateOfBirth,
        genre: organizer.genre,
        phone: organizer.phone,
      };
    });
    const userGuestInfoFormated = userGuestInfo.map((guest) => {
      return {
        userId: guest.userId,
        name: guest.name,
        lastName: guest.lastName,
        userName: guest.userName,
        profilePictures: guest.profilePictures[0],
        age: guest.age,
        dateOfBirth: guest.dateOfBirth,
        genre: guest.genre,
        phone: guest.phone,
        tickets: tickets.filter((ticket) => ticket.userId === guest.userId),
      };
    });
    const totalQuantity = eventInfo.tickets.reduce(
      (acumulador, elemento) => acumulador + elemento.quantitySold,
      0
    );
    const adminEventInfo = {
      eventId: eventInfo.eventId,
      mercadoPagoToken: eventInfo.mercadoPagoToken,
      flyer: eventInfo.flyer,
      eventName: eventInfo.eventName,
      guests: userGuestInfoFormated,
      organizers: organizerInfoFormated,
      quantity: totalQuantity,
      totalAmount: receiptInfo.reduce(
        (acumulador, elemento) => acumulador + elemento.totalAmount,
        0
      ),
    };
    res.json(adminEventInfo);
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

    const users = await User.findAll();
    const usersOrganizers = users.filter((user) =>
      event.organizers.includes(user.userId)
    );
    const formatedUsers = usersOrganizers.map((user) => {
      return {
        userId: user.userId,
        name: user.name,
        lastName: user.lastName,
        profilePictures: user.profilePictures[0],
        userName: user.userName,
      };
    });
    res.json(formatedUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addOrganizadores = async (req, res) => {
  const { eventId, userId } = req.params;
  try {
    const event = await Event.findOne({
      where: {
        eventId: parseInt(eventId),
      },
    });
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    if (!event.organizers) {
      event.organizers = [];
      event.organizers.push(parseInt(userId));
    }
    if (event.organizers && !event.organizers.includes(parseInt(userId))) {
      event.organizers = [...event.organizers, parseInt(userId)];
    }
    await event.save();

    const user = await User.findOne({
      where: {
        userId: parseInt(userId),
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (!user.events[0] || user.events[0] === null) {
      user.events = [parseInt(eventId)];
    } else {
      user.events = [...user.events, parseInt(eventId)];
    }
    await user.save();
    const response = { organizers: event.organizers, userEvents: user.events };
    console.log(response, "Response Admin Added");
    res.json(response);
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

    await event.save();
    const user = await User.findOne({
      where: {
        userId: parseInt(userId),
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (user.events.includes(parseInt(eventId))) {
      user.events = user.events.filter((event) => event !== parseInt(eventId));
    }
    await user.save();
    res.send("Organizador eliminado con éxito");
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

// export const updateComprobante = async (req, res) => {
//   const { id, posicion, userName } = req.params;
//   //const {  } = req.body;

//   try {
//     let event = await Event.findOne({
//       where: {
//         id: id,
//       },
//     });

//     if (!event) {
//       return res.status(404).json({ message: "Evento no encontrado" });
//     }

//     if (posicion < 0 || posicion > 1) {
//       return res.status(400).send("Posición no válida");
//     }

//     event.invitados.forEach((e) => {
//       if (e.userName === userName) {
//         if (posicion == 0) {
//           e.comprobante = [
//             `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
//             e.comprobante[1],
//           ];
//         }
//         if (posicion == 1) {
//           e.comprobante = [
//             e.comprobante[0],
//             `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
//           ];
//         }
//       } else {
//         return res.status(400).send("Error en la subida de la imagen");
//       }
//     });

//     //     event.invitados.forEach((e) => {
//     //        if(e.userName === userName) {
//     //             e.comprobante.push(req.file.filename)
//     //     }
//     // });

//     await event.save(); // Guarda el evento actualizado en la base de datos
//     // res.json({ img: `/public/comprobantes/${req.file.filename}`, posicion });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const deleteComprobante = async (req, res) => {
//   const { id, posicion } = req.params;
//   const { userName } = req.body;

//   try {
//     const event = await Event.findOne({
//       where: {
//         id: id,
//       },
//     });

//     if (!event) {
//       return res.status(404).json({ message: "Evento no encontrado" });
//     }

//     //Verifica que la posición sea válida (1, 2)
//     if (posicion < 0 || posicion > 1) {
//       return res.status(400).send("Posición no válida");
//     }

//     event.invitados.forEach((e) => {
//       if (e.userName == userName) {
//         if (posicion == 0) {
//           e.comprobante = [null, e.comprobante[1]];
//         }
//         if (posicion == 1) {
//           e.comprobante = [e.comprobante[0], null];
//         }
//       } else {
//         return res.status(400).send("Error al borrar la imagen");
//       }
//     });

//     await event.save();
//     res.send(invitado.comprobante);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
