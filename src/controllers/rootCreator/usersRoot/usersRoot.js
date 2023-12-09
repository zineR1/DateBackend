import { User } from "../../../models/User.js";
import { createGuestRoot } from "../guestsRoot/guestsRoot.js";
import Utils from "../../../utils/index.js";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

export const createRootUser = async () => {
  const root1 = process.env.EMAIL_ROOT1;
  const root2 = process.env.EMAIL_ROOT2;
  const pass = Utils.createHash(process.env.PASSWORD_ROOT);
  const dbUser1 = await User.findOne({ where: { email: root1 } });
  const dbUser2 = await User.findOne({ where: { email: root2 } });

  const URL_API_DATE =
    process.env.NODE_ENV === "production"
      ? "https://datebackendpruebas.onrender.com"
      : "http://localhost:3001";

  if (!dbUser1) {
    const user1 = await User.create({
      name: "root1",
      lastName: "Root",
      userName: "root1",
      email: root1,
      password: pass,
      description: "De viaje por el mundo",
      profilePictures: [
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
      ],
      age: 26,
      dateOfBirth: "1997-02-04",
      genre: "Masculino",
      city: "Ciudad de Córdoba",
      sentimentalSituation: "Soltero",
      phone: "123456789",
      ownedTickets: [{
        eventId: 2,
        ticketIdEntry: 2,
      }],
      events: [2],
    });

    if (user1) {
      console.log(colors.bold.green("----> admin1 created"));
    } else {
      console.log(colors.bold.green("----> admin1 already exists"));
    }
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
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
      ],
      dateOfBirth: "1987-09-02",
      genre: "Masculino",
      city: "La Plata",
      sentimentalSituation: "Soltero",
      phone: "987654321",
      ownedTickets: [{
        eventId: 1,
        ticketIdEntry: 3,
      }],
      events: [1],
    });

    if (user2) {
      console.log(colors.bold.green("----> admin2 created"));
      createGuestRoot();
    }
  } else {
    console.log(colors.bold.green("----> admin2 already exists"));
  }
};
