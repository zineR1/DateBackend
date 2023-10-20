import { Event } from '../models/Event.js';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import Utils from '../utils/index.js';

export const getEvents = async(req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events)
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const createEvent = async(req, res) => {
    
    const {
        flyer,
        nombreEvento,
        fechaEvento,
        horaInicio,
        horaFin,
        descripcion,
        ubicacion,
        tipoEntrada,
        entradas,
        organizadores,
        invitados
    } = req.body;
    
    try {
        const newEvent = await Event.create({
            flyer,
            nombreEvento,
            fechaEvento,
            horaInicio,
            horaFin,
            ubicacion,
            descripcion,
            tipoEntrada,
            entradas,
            organizadores,
            invitados
        });

        res.json(newEvent);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const deleteEvent = async(req, res) => {
    
    const { id } = req.params;

    try {
        await Event.destroy({
            where: {
                id: id
            }
        })
        res.status(204).json({message: "Evento Borrado"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const soldTickets = async(req, res) => {
    const { id, cantidad } = req.body;

    const event = await Event.findOne({
        where: {
            id: id
        }
    });

    const tickets = await Ticket.findAll();
    const arr = [];
    const arrUsrs = [];
    
    tickets.forEach((e) =>{
        if(e.eventId == event.id) {
            arr.push(e)
        }
    })

    const users = await User.findAll();
    users.forEach((e) => {
        
    })

    const test = arr.map((e) => {
        return {...e.dataValues, nombreEntrada: event.nombreEvento, cantidadEntradas: cantidad, descripcion:event.descripcion }
    })
    event.entradas = test;
    res.send(userEvent)

}


