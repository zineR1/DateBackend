import multer from "multer";
// import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { Receipt } from "../models/Receipt.js";
import Utils from "../utils/index.js";
import emailService from "../services/email.service.js";
import { uploader } from "../utils.js";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { Console } from "console";

dotenv.config();
const URL_API_DATE =
  process.env.NODE_ENV === "production"
    ? "https://datebackendpruebas.onrender.com"
    : "http://localhost:3001";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: {
        userId: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserEvents = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      const eventsId = user.events;
      const events = await Event.findAll({
        where: {
          eventId: eventsId,
        },
      });

      const eventsWithOpStatus = [];
      for (const event of events) {
        let opStatus = null;
        // Verificar si el usuario es organizador del evento
        if (event.organizers.includes(parseInt(userId))) {
          opStatus = "owner";
        } else {
          const receipt = await Receipt.findOne({
            where: { eventId: event.eventId },
          });
          opStatus = receipt ? receipt.status : null;
        }

        const eventWithOpStatus = {
          ...event.toJSON(),
          opStatus,
        };
        eventsWithOpStatus.push(eventWithOpStatus);
      }

      res.status(200).send(eventsWithOpStatus);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar los eventos del usuario" });
  }
};

export const createUser = async (req, res) => {
  const { email, password, events } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    return res.status(401).json({ message: "Este usuario ya existe" });
  }

  const nwPass = Utils.createHash(password);
  try {
    const newUSer = await User.create({
      email: email,
      password: nwPass,
      events: events,
    });
    newUSer.profilePictures = [
      `${URL_API_DATE}/public/imagen/defaultPic.png`,
      `${URL_API_DATE}/public/imagen/defaultPic.png`,
      `${URL_API_DATE}/public/imagen/defaultPic.png`,
    ];
    newUSer.events = [];
    await newUSer.save();

    res.json(newUSer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    lastName,
    email,
    //password,
    description,
    userName,
    // profilePictures,
    age,
    dateOfBirth,
    genre,
    city,
    sentimentalSituation,
    phone,
    events,
  } = req.body.payload;
  try {
    let user = await User.findByPk(id);
    // let existe = (user.events[0] && user.events[0] !== null) && user.events.find((event) => event.id === events.id)
    //   ? true
    //   : false;
    // if (existe) {
    //   let filtrados = user.events.filter((event) => event.id !== events.id);

    //   user.events = [...filtrados, events];
    // } else {
    if (!user.events[0] || user.events[0] === null) {
      user.events = [events];
    } else {
      user.events = [...user.events, events];
    }
    // }

    user.name = name ? name : user.name;
    user.lastName = lastName ? lastName : user.lastName;
    user.userName = userName ? userName : user.userName;
    user.email = email ? email : user.email;
    // user.password = user.password;
    user.description = description ? description : user.description;
    // user.profilePictures = user.profilePictures;
    user.age = age ? age : user.age;
    user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth;
    user.genre = genre ? genre : user.genre;
    user.city = city ? city : user.city;
    user.sentimentalSituation = sentimentalSituation
      ? sentimentalSituation
      : user.sentimentalSituation;
    user.phone = phone ? phone : user.phone;
    user.instagramToken = user.instagramToken;
    await user.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.destroy({
      where: {
        id: id,
      },
    });
    res.status(204).json({ message: "Usuario Borrado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  try {
    if (!user) {
      return res
        .status(401)
        .json({ massage: "No existe un usuario con este mail" });
    }

    if (!Utils.validatePassword(password, user)) {
      return res.status(401).json({ massage: "Contraseña Incorrecta" });
    }

    const token = Utils.tokenGenerator(user);
    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(200)
      .json({ id: user.userId, success: true, token: token });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email: email } });
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "fuera de linea" });
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res
      .status(401)
      .json({ massage: " Usuario o Contraseña Incorrecto" });
  }
  let pasw = Utils.createHash(password);

  user.password = pasw;
  user.save();

  res.json(user);
};

export const correoReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ massage: " Usuario o Contraseña Incorrecto" });
    }
    const page = `
            <div>
                <h1>Reset Contraseña Vinculando</h1>
                <h3>Hola ${user.name} restaura tu contraseña con este link</h3>
                <a href="https://datefrontendpruebas.onrender.com/#/forgotPw2">Cambiar Contraseña</a> 
            </div>
          
          `;
    const result = await emailService.sendEmail(
      user.email,
      "Hola Como estas",
      page
    );
    res.send("email enviado");
  } catch (error) {
    res.send(error.message);
  }
  //
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/imgs");
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

export const deletePicture = async (req, res) => {
  const { id, posicion } = req.params;

  try {
    const user = await User.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verifica que la posición sea válida (1, 2 o 3)
    if (posicion < 0 || posicion > 2) {
      return res.status(400).send("Posición no válida");
    }

    // Establece la imagen en la posición especificada como null para eliminarla

    const imagePath = user.profilePictures[posicion];
    let arr = imagePath.split("/");
    fs.unlink(`src/public/imgs/${arr[5]}`, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log("File deleted!");
    });

    if (posicion == 0) {
      user.profilePictures = [
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        user.profilePictures[1],
        user.profilePictures[2],
      ];
    }

    if (posicion == 1) {
      user.profilePictures = [
        user.profilePictures[0],
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        user.profilePictures[2],
      ];
    }
    if (posicion == 2) {
      user.profilePictures = [
        user.profilePictures[0],
        user.profilePictures[1],
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
      ];
    }

    await user.save();
    res.send(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePicture = async (req, res) => {
  const { id, posicion } = req.params;

  try {
    const user = await User.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!Array.isArray(user.profilePictures)) {
      user.profilePictures = [
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
        `${URL_API_DATE}/public/imagen/defaultPic.png`,
      ];
    }

    // Verifica que la posición sea válida (1, 2 o 3)
    if (posicion < 0 || posicion > 2) {
      return res.status(400).send("Posición no válida");
    }

    // Verifica si la subida de la imagen se ha realizado correctamente
    if (req.file && req.file.filename) {
      // Establece la imagen en la posición especificada como null para eliminarla
      const imagePath = user.profilePictures[posicion];
      let arr = imagePath.split("/");
      if (arr[5] !== "defaultPic.png") {
        fs.unlink(`src/public/imgs/${arr[5]}`, function (err) {
          if (err) throw err;
          // if no error, file has been deleted successfully
          console.log("File deleted to change!");
        });
      }
      // user.pictures[posicion] = req.file.filename;
      if (posicion == 0) {
        user.profilePictures = [
          `${URL_API_DATE}/public/imgs/${req.file.filename}`,
          user.profilePictures[1],
          user.profilePictures[2],
        ];
      }
      if (posicion == 1) {
        user.profilePictures = [
          user.profilePictures[0],
          `${URL_API_DATE}/public/imgs/${req.file.filename}`,
          user.profilePictures[2],
        ];
      }
      if (posicion == 2) {
        user.profilePictures = [
          user.profilePictures[0],
          user.profilePictures[1],
          `${URL_API_DATE}/public/imgs/${req.file.filename}`,
        ];
      }
      await user.save(); // Guarda el usuario actualizado en la base de datos
      res.json({ img: `/public/imgs/${req.file.filename}`, posicion });
    } else {
      return res.status(400).send("Error en la subida de la imagen");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
