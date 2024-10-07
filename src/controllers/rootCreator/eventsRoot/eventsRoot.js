import { Event } from "../../../models/Event.js";
import colors from "colors";
import dotenv from "dotenv";
import { createGuestRoot } from "../guestsRoot/guestsRoot.js";

dotenv.config();

export const createEventRoot = async () => {
  const eventRoot1 = process.env.EVENT_ROOT1;
  const eventRoot2 = process.env.EVENT_ROOT2;
  const dbEvent1 = await Event.findOne({ where: { eventName: eventRoot1 } });
  const dbEvent2 = await Event.findOne({ where: { eventName: eventRoot2 } });
  const urlBackend = process.env.URL_API;

  if (!dbEvent1) {
    const event1 = await Event.create({
      flyer: `${urlBackend}/public/imagen/defaultPicEvent.png`,
      eventName: eventRoot1,
      startEventDate: "2024-09-26",
      endEventDate: "2024-12-26",
      startEventTime: "10:00:00",
      endEventTime: "24:00:00",
      startPreEventTime: "02:00:00",
      preEventDate: "2024-12-26",
      description: "Fiesta del Sugus",
      eventStatus: "en curso",
      preEventStatus: "en curso",
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
          price: 100,
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
      startEventDate: "2024-09-26",
      endEventDate: "2024-12-26",
      startEventTime: "10:00:00",
      endEventTime: "24:00:00",
      startPreEventTime: "02:00:00",
      preEventDate: "2024-12-26",
      description: "Fiesta del Marchi",
      eventStatus: "en curso",
      preEventStatus: "en curso",
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
          price: 100,
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
      await createGuestRoot();
    } else {
      console.log(colors.bold.magenta("----> event2 already exists"));
    }
  }
};
