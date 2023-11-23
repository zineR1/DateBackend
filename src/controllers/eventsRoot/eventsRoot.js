import { Event } from "../../models/Event.js";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

export const createEventRoot = async () => {
  const eventRoot1 = process.env.EVENT_ROOT1;
  const eventRoot2 = process.env.EVENT_ROOT2;
  const dbEvent1 = await Event.findOne({ where: { nombreEvento: eventRoot1 } });
  const dbEvent2 = await Event.findOne({ where: { nombreEvento: eventRoot2 } });

  const URL_API_DATE =
    process.env.NODE_ENV === "production"
      ? "https://datebackendpruebas.onrender.com"
      : "http://localhost:3001";

  if (!dbEvent1) {
    const event1 = await Event.create({
      flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
      nombreEvento: eventRoot1,
      fechaEvento: "2026-02-04",
      horaInicio: "00:00",
      horaFin: "06:00",
      descripcion: "Fiesta Cerveza",
      state: "pendiente",
      ubicacion: "Cordoba",
      tipoEntrada: "multiple",
      entradas: [
        {
          id: 0,
          nombreEntrada: "Early bird",
          precioEntrada: 1500,
          cantidadEntradas: 200,
          descripcion:
            "Aprovechá la entrada con precio promocional, pronto se agotan.",
          estado: "Agotada",
          vendidas: 4,
        },
        {
          id: 1,
          nombreEntrada: "Entrada general",
          precioEntrada: 2500,
          cantidadEntradas: 200,
          descripcion: "",
          estado: "Disponible",
          vendidas: 4,
        },
        {
          id: 2,
          nombreEntrada: "Entrada vip",
          precioEntrada: 3500,
          cantidadEntradas: 200,
          descripcion:
            "Incluye una entrada con acceso al espacio vip standing, con baño accesible y barra privada.",
          estado: "Disponible",
          vendidas: 4,
        },
        {
          id: 3,
          nombreEntrada: "Mesa vip",
          precioEntrada: 8500,
          cantidadEntradas: 200,
          descripcion:
            "Incluye mesa en espacio vip con consumiciones por el valor de $8.000 y 4 entradas vip.",
          estado: "Disponible",
          vendidas: 4,
        },
      ],
      organizadores: [
        {
          id: 1,
          nombre: "root1",
          apellido: "Root",
          foto: "http://localhost:3001/public/imagen/defaultPic.png",
        },
      ],
      invitados: [
        {
          nombre: "root2",
          apellido: "Root",
          userName: "root2",
          foto: `${URL_API_DATE}/public/imagen/defaultPic.png`,
          comprobante: [],
          pago: true,
          state: "pendiente",
          entradas: [
            {
              idEntrada: 1,
              asignada: true,
              nombreEntrada: "Entrada general",
              dueño: {
                id: 2,
                nombre: "root2",
                userName: "root2",
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
          total: 4500,
        },
      ],
      datosBanco: {
        titular: "Alejandro Heredia",
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
      flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
      nombreEvento: eventRoot2,
      fechaEvento: "2026-02-04",
      horaInicio: "00:00",
      horaFin: "06:00",
      descripcion: "Fiesta Fernet",
      state: "pendiente",
      ubicacion: "Cordoba",
      tipoEntrada: "multiple",
      entradas: [
        {
          id: 0,
          nombreEntrada: "Early bird",
          precioEntrada: 1500,
          cantidadEntradas: 200,
          descripcion:
            "Aprovechá la entrada con precio promocional, pronto se agotan.",
          estado: "Agotada",
          vendidas: 4,
        },
        {
          id: 1,
          nombreEntrada: "Entrada general",
          precioEntrada: 2500,
          cantidadEntradas: 200,
          descripcion: "",
          estado: "Disponible",
          vendidas: 4,
        },
        {
          id: 2,
          nombreEntrada: "Entrada vip",
          precioEntrada: 3500,
          cantidadEntradas: 200,
          descripcion:
            "Incluye una entrada con acceso al espacio vip standing, con baño accesible y barra privada.",
          estado: "Disponible",
          vendidas: 4,
        },
        {
          id: 3,
          nombreEntrada: "Mesa vip",
          precioEntrada: 8500,
          cantidadEntradas: 200,
          descripcion:
            "Incluye mesa en espacio vip con consumiciones por el valor de $8.000 y 4 entradas vip.",
          estado: "Disponible",
          vendidas: 4,
        },
      ],
      organizadores: [
        {
          id: 2,
          nombre: "root2",
          apellido: "Root",
          foto: "http://localhost:3001/public/imagen/defaultPic.png",
        },
      ],
      invitados: [
        {
          nombre: "root1",
          apellido: "Root",
          userName: "root1",
          foto: `${URL_API_DATE}/public/imagen/defaultPic.png`,
          comprobante: [],
          pago: true,
          state: "pendiente",
          entradas: [
            {
              idEntrada: 1,
              asignada: true,
              nombreEntrada: "Entrada general",
              dueño: {
                id: 1,
                nombre: "root1",
                apellido: "Root",
                userName: "root1",
                foto: "http://localhost:3001/public/imagen/defaultPic.png",
                nacimiento: "1997-02-04",
                telefono: "123456789"
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
          total: 4500,
        },
      ],
      datosBanco: {
        titular: "Agustin Dalvit",
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
