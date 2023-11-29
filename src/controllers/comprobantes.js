import multer from "multer";
import { Comprobante } from "../models/Comprobante.js";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const URL_API_DATE =
  process.env.NODE_ENV === "production"
    ? "https://datebackendpruebas.onrender.com"
    : "http://localhost:3001";

export const getComprobantes = async (req, res) => {
  try {
    const comprobantes = await Comprobante.findAll();
    res.json(comprobantes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getComprobanteById = async (req, res) => {
  const { userId, eventId } = req.params;
console.log(userId,"USERID")
  try {
    const comprobante = await Comprobante.findOne({
      where: {
        userId: userId,
        eventId: eventId
      },
    });

    if (!comprobante) {
      return res.status(404).json({ message: "Comprobante no encontrado" });
    }

    res.send(comprobante);
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

export const createComprobante = async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const comprobante = await Comprobante.findOne({
      where: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    });

    if (!comprobante) {
      let newComprobante = await Comprobante.create({
        eventId: parseInt(eventId),
        userId: parseInt(userId),
        comprobantes: [],
      });

      if (req.file && req.file.filename) {
        newComprobante.comprobantes = [
          `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
        ];

        await newComprobante.save();
        res.json(newComprobante);
      } else {
        return res.status(400).send("Error en la subida de la imagen");
      }
    } else {
      comprobante.comprobantes = [
        comprobante.comprobantes[0],
        `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
      ];

      await comprobante.save();
      res.json(comprobante);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComprobante = async (req, res) => {
  const { posicion, userId, eventId } = req.params;
  console.log(posicion, "posicion");
  console.log(userId, "userId");
  console.log(eventId, "eventID");

  try {
    const comprobante = await Comprobante.findOne({
      where: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    });

    if (!comprobante) {
      return res.status(404).json({ message: "comprobante no encontrado" });
    }

    console.log(comprobante);
    //Verifica que la posición sea válida (1, 2)
    if (parseInt(posicion) < 0 || parseInt(posicion) > 1) {
      return res.status(400).send("Posición no válida");
    }

    if (comprobante.comprobantes[0] || comprobante.comprobantes[1]) {
      const imagePath = comprobante.comprobantes[posicion];
      let arr = imagePath.split("/");

      fs.unlink(`src/public/comprobantes/${arr[5]}`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log("File deleted!");
      });
    }

    if (parseInt(posicion) == 0 && !comprobante.comprobantes[1]) {
      //comprobante.comprobantes = [];
      await comprobante.destroy();
    }
    if (parseInt(posicion) == 0 && comprobante.comprobantes[1]) {
      comprobante.comprobantes = [comprobante.comprobantes[1]];
    }
    if (parseInt(posicion) == 1) {
      comprobante.comprobantes = [comprobante.comprobantes[0]];
    }

    comprobante.save();

    // if(!comprobante.comprobantes[0] || !comprobante.comprobantes[1]) {
    //     
    // }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
