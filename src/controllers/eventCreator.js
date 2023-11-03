import { Event } from '../models/Event.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/events')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

export const uploadEvent = multer({
    storage: storage
});

export const createEvent = async(req, res) => {
    
    /* 
        El campo entrada va a ser enviado desde el front. el id debereia ser generado por aqui
        El cmpo organizadores tambien sera enviado desde el front
        el campor invitados 
    */


    const {
        nombreEvento,
        fechaEvento,
        horaInicio,
        horaFin,
        descripcion,
        ubicacion,
        tipoEntrada,
        entradas,
        organizadores,
        invitados,
        datosBanco
    } = req.body;
    
    try {
        const newEvent = await Event.create({
            flyer: req.filename,
            nombreEvento,
            fechaEvento,
            horaInicio,
            horaFin,
            ubicacion,
            descripcion,
            tipoEntrada,
            entradas,
            organizadores,
            invitados,
            datosBanco
        });
        res.json(newEvent);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const editEvent = async(req, res) => {
    const { id } = req.params;
    const {flyer, 
           nombreEvento, 
           fechaEvento,
           horaInicio,
           horaFin,
           descripcion,
           ubicacion,
           url,
           tipoEntrada,
           entradas,
           datosBanco
        } = req.body;

        try {
            const event = await Event.findOne({
                where: {
                    id: id
                }
            });

        //event.flyer = req.file.filename
        event.nombreEvento = nombreEvento
        event.fechaEvento = fechaEvento
        event.horaInicio = horaInicio
        event.horaFin = horaFin
        event.descripcion = descripcion
        event.ubicacion = ubicacion
        event.url = url
        event.tipoEntrada = tipoEntrada
        event.entradas = entradas
        event.datosBanco = datosBanco
        await event.save();

        res.json(event)


        } catch (error) {
            return res.status(500).json({ message: error.message })         
        }


        
}