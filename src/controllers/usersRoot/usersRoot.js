import { User } from "../../models/User.js";
import Utils from "../../utils/index.js";
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
      age: 26,
      pictures: [
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
      ],
      dateOfBirth: "1997-02-04",
      genre: "M",
      city: "Cordoba",
      sentimentalSituation: "single",
      phone: "123456789",
      events: [
        {
          id: 2,
          flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
          nombreEvento: "Event Default 2",
          fechaEvento: "2026-02-04",
          state: "Pendiente",
          entradas: [
            {
              idEntrada: 1,
              asignada: true,
              nombreEntrada: "Entrada general",
              dueño: {
                id: 1,
                nombre: "root1",
                apellido: "Root",
                foto: "http://localhost:3001/public/imagen/defaultPic.png",
                nacimiento: "1997-02-04",
                telefono: "987654321"
              },
              estado: { texto: "pendiente", hora: null },
              codigo: "282T",
            },
            {
              idEntrada: 1,
              asignada: false,
              nombreEntrada: "Entrada general",
              dueño: "",
              estado: { texto: "pendiente", hora: null },
              codigo: "628B",
            },
            {
              idEntrada: 1,
              asignada: false,
              nombreEntrada: "Entrada general",
              dueño: "",
              estado: { texto: "pendiente", hora: null },
              codigo: "862V",
            },
          ],
        },
        {
          id: 1,
          flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
          nombreEvento: "Event Default 1",
          fechaEvento: "2026-02-04",
          state: "Tu evento",
        },
      ],
    });

    if (user1) {
      console.log(colors.bold.cyan("----> admin1 created"));
    } else {
      console.log(colors.bold.cyan("----> admin2 already exists"));
    }
  }

  if (!dbUser2) {
    const user2 = await User.create({
      name: "root2",
      lastName: "Root",
      userName: "root2",
      email: root2,
      password: pass,
      age: 36,
      pictures: [
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
      ],
      dateOfBirth: "1987-09-02",
      genre: "M",
      city: "Cordoba",
      sentimentalSituation: "single",
      phone: "987654321",
      events: [
        {
          id: 1,
          flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
          nombreEvento: "Event Default 1",
          fechaEvento: "2026-02-04",
          state: "Pendiente",
          entradas: [
            {
              idEntrada: 1,
              asignada: true,
              nombreEntrada: "Entrada general",
              dueño: {
                id: 2,
                nombre: "root2",
                apellido: "Root",
                foto: "http://localhost:3001/public/imagen/defaultPic.png",
                nacimiento: "1987-09-02",
                telefono: "987654321"
              },
              estado: { texto: "pendiente", hora: null },
              codigo: "282G",
            },
            {
              idEntrada: 1,
              asignada: false,
              nombreEntrada: "Entrada general",
              dueño: "",
              estado: { texto: "pendiente", hora: null },
              codigo: "628C",
            },
            {
              idEntrada: 1,
              asignada: false,
              nombreEntrada: "Entrada general",
              dueño: "",
              estado: { texto: "pendiente", hora: null },
              codigo: "862X",
            },
          ],
        },
        {
          id: 2,
          flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
          nombreEvento: "Event Default 2",
          fechaEvento: "2026-02-04",
          state: "Tu evento",
        },
      ],
    });

    if (user2) {
      console.log(colors.bold.magenta("----> admin2 created"));
    }
  } else {
    console.log(colors.bold.magenta("----> admin2 already exists"));
  }
};
