import { Event } from "../../../models/Event.js";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

export const createEventRoot = async () => {
  const eventRoot1 = process.env.EVENT_ROOT1;
  const eventRoot2 = process.env.EVENT_ROOT2;
  const dbEvent1 = await Event.findOne({ where: { eventName: eventRoot1 } });
  const dbEvent2 = await Event.findOne({ where: { eventName: eventRoot2 } });
  const urlBackend = process.env.URL_BACKEND;


  if (!dbEvent1) {
    const event1 = await Event.create({
      flyer: `${urlBackend}/public/imagen/defaultPicEvent.png`,
      eventName: eventRoot1,
      eventDate: "02-04-2026",
      startTime: "00:00",
      endTime: "06:00",
      description: "Fiesta del Sugus",
      status: "pendiente",
      location: "Cordoba",
      ticketType: "multiple",
      tickets: [
        {
          id: 0,
          ticketName: "Early bird",
          price: 1500,
          availableTickets: 200,
          description:
            "Aprovechá la entrada con precio promocional, pronto se agotan.",
          status: "Agotada",
          quantitySold: 4,
        },
        {
          id: 1,
          ticketName: "Entrada general",
          price: 2500,
          availableTickets: 200,
          description: "",
          status: "Disponible",
          quantitySold: 4,
        },
        {
          id: 2,
          ticketName: "Entrada vip",
          price: 3500,
          availableTickets: 200,
          description:
            "Incluye una entrada con acceso al espacio vip standing, con baño accesible y barra privada.",
          status: "Disponible",
          quantitySold: 4,
        },
        {
          id: 3,
          ticketName: "Mesa vip",
          price: 8500,
          availableTickets: 200,
          description:
            "Incluye mesa en espacio vip con consumiciones por el valor de $8.000 y 4 entradas vip.",
          status: "Disponible",
          quantitySold: 4,
        },
      ],
      organizers: [1],
      bankDetails: {
        titular: "Agustin Dalvit",
        cbu: "121223235534",
        alias: "TRONCO.PARED.MP",
        banco: "Santander Río",
      },
    });
    if (event1) {
      console.log(colors.bold.magenta("----> event1 created"));
    } else {
      console.log(colors.bold.magenta("----> envent1 already exists"));
    }
  }

  //--------------------

  if (!dbEvent2) {
    const event2 = await Event.create({
      flyer: `${urlBackend}/public/imagen/defaultPicEvent.png`,
      eventName: eventRoot2,
      eventDate: "02-04-2026",
      startTime: "00:00",
      endTime: "06:00",
      description: "Fiesta del Marchi",
      status: "pendiente",
      location: "Cordoba",
      ticketType: "multiple",
      tickets: [
        {
          id: 0,
          ticketName: "Early bird",
          price: 1500,
          availableTickets: 200,
          description:
            "Aprovechá la entrada con precio promocional, pronto se agotan.",
          status: "Agotada",
          quantitySold: 4,
        },
        {
          id: 1,
          ticketName: "Entrada general",
          price: 2500,
          availableTickets: 200,
          description: "",
          status: "Disponible",
          quantitySold: 4,
        },
        {
          id: 2,
          ticketName: "Entrada vip",
          price: 3500,
          availableTickets: 200,
          description:
            "Incluye una entrada con acceso al espacio vip standing, con baño accesible y barra privada.",
          status: "Disponible",
          quantitySold: 4,
        },
        {
          id: 3,
          ticketName: "Mesa vip",
          price: 8500,
          availableTickets: 200,
          description:
            "Incluye mesa en espacio vip con consumiciones por el valor de $8.000 y 4 entradas vip.",
          status: "Disponible",
          quantitySold: 4,
        },
      ],
      organizers: [2],
      bankDetails: {
        titular: "Lucas Marchi",
        cbu: "121223235534",
        alias: "TRONCO.PARED.MP",
        banco: "Santander Río",
      },
    });
    if (event2) {
      console.log(colors.bold.magenta("----> event2 created"));
    } else {
      console.log(colors.bold.magenta("----> envent2 already exists"));
    }
  }
};
