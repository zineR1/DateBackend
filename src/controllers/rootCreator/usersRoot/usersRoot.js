import { User } from "../../../models/User.js";
import { createGuestRoot } from "../guestsRoot/guestsRoot.js";
import Utils from "../../../utils/index.js";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

export const createRootUser = async () => {
  const root1 = process.env.EMAIL_ROOT1;
  const root2 = process.env.EMAIL_ROOT2;
  const root3 = process.env.EMAIL_ROOT3;
  const pass = Utils.createHash(process.env.PASSWORD_ROOT);
  const dbUser1 = await User.findOne({ where: { email: root1 } });
  const dbUser2 = await User.findOne({ where: { email: root2 } });
  const dbUser3 = await User.findOne({ where: { email: root3 } });
  const urlBackend = process.env.URL_BACKEND_FOR_APP;

  if (!dbUser1) {
    const user1 = await User.create({
      name: "root1",
      lastName: "Root",
      userName: "root1",
      email: root1,
      password: pass,
      description: "De viaje por el mundo",
      profilePictures: [
        `${urlBackend}/public/imagen/defaultPic.png`,
        `${urlBackend}/public/imagen/defaultPic.png`,
        `${urlBackend}/public/imagen/defaultPic.png`,
      ],
      age: 27,
      dateOfBirth: "02/04/1997",
      genre: "Masculino",
      city: "Ciudad de Córdoba",
      sentimentalSituation: {
        label: "Soltero/a",
        value: "single",
      },
      phone: "123456789",
      ownedTickets: [
        {
          eventId: 2,
          ticketIdEntry: 2,
        },
      ],
      events: [1, 2],
    });

    if (user1) {
      console.log(colors.bold.green("----> admin1 created"));
    }
  } else {
    console.log(colors.bold.green("----> admin1 already exists"));
  }

  if (!dbUser2) {
    const user2 = await User.create({
      name: "root2",
      lastName: "Root",
      userName: "root2",
      email: root2,
      password: pass,
      description: "Buscando amigos para salir de fiesta",
      age: 36,
      profilePictures: [
        `${urlBackend}/public/imagen/defaultPic.png`,
        `${urlBackend}/public/imagen/defaultPic.png`,
        `${urlBackend}/public/imagen/defaultPic.png`,
      ],
      dateOfBirth: "09/02/1987",
      genre: "Masculino",
      city: "La Plata",
      sentimentalSituation: {
        label: "Soltero/a",
        value: "single",
      },
      phone: "987654321",
      ownedTickets: [
        {
          eventId: 1,
          ticketIdEntry: 3,
        },
      ],
      events: [1, 2],
    });

    if (user2) {
      console.log(colors.bold.green("----> admin2 created"));
      createGuestRoot();
    }
  } else {
    console.log(colors.bold.green("----> admin2 already exists"));
  }

  if (!dbUser3) {
    const user3 = await User.create({
      name: "root3",
      lastName: "Root",
      userName: "root3",
      email: root3,
      password: pass,
      description: "Quiero generar contactos para emprender",
      age: 28,
      profilePictures: [
        `${urlBackend}/public/imagen/defaultPic.png`,
        `${urlBackend}/public/imagen/defaultPic.png`,
        `${urlBackend}/public/imagen/defaultPic.png`,
      ],
      dateOfBirth: "09/02/1987",
      genre: "Femenino",
      city: "Carlos Paz",
      sentimentalSituation: {
        label: "Soltero/a",
        value: "single",
      },
      phone: "987654321",
      ownedTickets: [
        {
          eventId: 1,
          ticketIdEntry: 3,
        },
      ],
      events: [1, 2],
    });

    if (user3) {
      console.log(colors.bold.green("----> admin3 created"));
      createGuestRoot();
    }
  } else {
    console.log(colors.bold.green("----> admin3 already exists"));
  }
};
