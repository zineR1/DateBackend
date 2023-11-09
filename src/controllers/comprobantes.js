import multer from "multer";
import { Comprobante } from '../models/Comprobante.js';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const URL_API_DATE =
  process.env.NODE_ENV === "production"
    ? "https://datebackendpruebas.onrender.com"
    : "http://localhost:3001";

export const getComprobantes = async(req, res) => {
    try {
        const comprobantes = await Comprobante.findAll();
        res.json(comprobantes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getComprobanteById = async(req, res) => {
    const { id } = req.params;

    try {
        const comprobante = await Comprobante.findOne({
            where: {
                id: id
            }
        });
    } catch (error) {
        
    }
}

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

export const createComprobante = async(req, res) => {
    const { userId, eventId } = req.params;
    
    try {
        
        const comprobante = await Comprobante.findOne({
            where: {
                userId: userId,
                eventId: eventId
            }
        });

        if(!comprobante) {
            let newComprobante = await Comprobante.create({
                eventId: parseInt(eventId),
                userId: parseInt(userId),
                comprobantes: []
            });
    
    
            if(req.file && req.file.filename) {

                    newComprobante.comprobantes = [
                        `${URL_API_DATE}/public/comprobantes/${req.file.filename}`,
                        null
                    ];
                 
                await newComprobante.save();
                res.json(newComprobante);
            }else {
                return res.status(400).send("Error en la subida de la imagen");
              }
        } else {
            comprobante.comprobantes = [
                comprobante.comprobantes[0],
                `${URL_API_DATE}/public/comprobantes/${req.file.filename}`
            ]

            await comprobante.save();
                res.json(comprobante);
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

 