import { Event } from '../models/Event.js';
import multer from 'multer';
import path from 'path';

const URL_API_DATE =
    process.env.NODE_ENV === "production"
      ? "https://datebackendpruebas.onrender.com"
      : "http://localhost:3001";

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

export const uploadEventImage = async(req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findOne({
            where: {
                id: id
            }
        });

        if(!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        event.flyer = `${URL_API_DATE}/public/events/${req.file.filename}`

        event.save();

        res.send(event);


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

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

        if(!newEvent.flyer) {
            newEvent.flyer = `${URL_API_DATE}/public/imagen/defaultEventPic.png`
        }

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

export const changeEventPicture = async(req, res) => {
    const { id } = req.params;

    try {
        let event = await Event.findOne({
            where: {
                id: id
            }
    
             
        });
    
        if(!event) {
            return res.status(404).json({message: "Evento no encontrado"});
        }
    
        if(req.file && req.file.filename) {
            event.flyer = req.file.filename;
        }else {
            return res.status(400).send("Error al subir la imagen");
        }
    
        await event.save();
    
        res.status(200).send(event);
    } catch (error) {
        return res.status(400).send(error.message);
    }

};