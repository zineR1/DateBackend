import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import Utils from "../utils/index.js";
import emailService from "../services/email.service.js";

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

    res.status(200).json({ usuario: user, entradas: tickets });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
    email,
    password,
    events
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
    password,
    description,
    userName,
    pictures,
    age,
    dateOfBirth,
    genre,
    city,
    sentimentalSituation,
    phone,
  } = req.body;

  try {
    let user = await User.findByPk(id);

    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.description = description;
     user.userName = userName;
     user.pictures = pictures;
    user.age = age;
    user.dateOfBirth = dateOfBirth;
    user.genre = genre;
    user.city = city;
    user.sentimentalSituation = sentimentalSituation;
    user.phone = phone;

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
    .json({ success: true, token: token });
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
