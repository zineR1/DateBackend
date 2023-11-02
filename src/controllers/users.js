import  multer from 'multer';
import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import Utils from "../utils/index.js";
import emailService from "../services/email.service.js";
import { uploader } from '../utils.js';
import FormData from 'form-data';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();


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
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const tickets = await Ticket.findAll({
      where: {
        userId: user.id,
      },
    });

    res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
    email,
    password,
    events,
    
  } = req.body;

 /*  const nwAge = (date) => {
    const fechaNac = new Date(date);
    const fechaActual = new Date();
    const diferenciaTiempo = fechaActual - fechaNac;
    const edad = Math.floor(diferenciaTiempo / (365.25 * 24 * 60 * 60 * 1000));
    return edad;
  }; */
  const nwPass = Utils.createHash(password);

  console.log(nwPass);
  try {
    const newUSer = await User.create({
      email,
      nwPass,
      events
    });
    newUSer.password = nwPass;
    newUSer.pictures =['http://localhost:3001/public/imagen/defaultPic.png', 'http://localhost:3001/public/imagen/defaultPic.png', 'http://localhost:3001/public/imagen/defaultPic.png'];
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
    pictures,
    age,
    dateOfBirth,
    genre,
    city,
    sentimentalSituation,
    phone,
  } = req.body.payload

  try {
    let user = await User.findByPk(id);

    user.name = name;
    user.lastName = lastName;
    user.email = email;
    //user.password = password;
    user.description = description;
     user.userName = userName;
     user.pictures = pictures;
    user.age = age;
    user.dateOfBirth = dateOfBirth;
    user.genre = genre;
    user.city = city;
    user.sentimentalSituation = sentimentalSituation;
    user.phone = phone;

    console.log(req.body.payload);
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

  if (!user) {
    return res
      .status(401)
      .json({ massage: " Usuario o Contraseña Incorrecto" });
  }

  if (!Utils.validatePassword(password, user)) {
    return res
      .status(401)
      .json({ massage: " Usuario o Contraseña Incorrecto" });
  }

  const token = Utils.tokenGenerator(user);
  res
    .cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })
    .status(200)
    .json({ id: user.id, success: true, token: token });
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
  const  {email}  = req.body;
  console.log(req.body);
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
      cb(null, 'src/public/imgs')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
});

export const upload = multer({
  storage: storage
})



export const deletePicture = async (req, res) => {
  const { id, posicion } = req.params;  

  try {
    const user = await User.findOne({
      where: {
        id: id
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verifica que la posición sea válida (1, 2 o 3)
    if (posicion < 0 || posicion > 2) {
      return res.status(400).send("Posición no válida");
    }

    // Establece la imagen en la posición especificada como null para eliminarla
    
    if (posicion == 0) {
      user.pictures = [null, user.pictures[1], user.pictures[2]];
    }

    if (posicion == 1) {
      user.pictures = [user.pictures[0], null, user.pictures[2]];
    }
    if (posicion == 2) {
      user.pictures = [user.pictures[0], user.pictures[1], null];
    }
    
    
    

    // Guarda el usuario actualizado en la base de datos
    await user.save();
    console.log(user.pictures);
    res.send(user)
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const updatePicture = async (req, res) => {
  const { id, posicion } = req.params;
  const URL_API_DATE = process.env.NODE_ENV === 'production'
   ? "https://datebackendpruebas.onrender.com"
   : "http://localhost:3001";
//const URL_API_DATE = "https://datebackendpruebas.onrender.com";

  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!Array.isArray(user.pictures)) {
      user.pictures = ['http://localhost:3001/public/imagen/imagenPorDefecto.jpg', 'http://localhost:3001/public/imagen/imagenPorDefecto.jpg', 'http://localhost:3001/public/imagen/imagenPorDefecto.jpg'];
    }

    // Verifica que la posición sea válida (1, 2 o 3)
    if (posicion < 0 || posicion > 2) {
      return res.status(400).send("Posición no válida");
    }
    
    
    // Verifica si la subida de la imagen se ha realizado correctamente
    if (req.file && req.file.filename) {
      // user.pictures[posicion] = req.file.filename;
      if (posicion == 0) {
        user.pictures = [`http://localhost:3001/public/imgs/${req.file.filename}`, user.pictures[1], user.pictures[2]];
      }
      if (posicion == 1) {
        user.pictures = [user.pictures[0], `http://localhost:3001/public/imgs/${req.file.filename}`, user.pictures[2]];
      }
      if (posicion == 2) {
        user.pictures = [user.pictures[0], user.pictures[1], `http://localhost:3001/public/imgs/${req.file.filename}`];
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


