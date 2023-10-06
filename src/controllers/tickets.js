import { Ticket } from '../models/Ticket.js'
import { User } from '../models/User.js'

export const getTickets = async(req, res) => {
    try {
        const tickets = await Ticket.findAll();
        res.json(tickets);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getTicketById = async(req, res) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findOne({
            where: {
                id: id
            }
        })
        if(!ticket) {
            return res.status(404).json({message: 'Ticket no encontrado'});
        }
        res.status(200).json(ticket);
    } catch (error) {
        return res.status(500).json({message: error.message});        
    }
}

export const createTicket = async(req, res) => {
    try {
        const { price, sold, userId } = req.body;

        const newTicket = await Ticket.create({
            price,
            sold,
            userId
         });
    
        res.json(newTicket);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const updateTicket = async(req, res) => {
    const { id } = req.params;
    const { price, sold, userId } = req.body;
    try {
        const ticket = await Ticket.findOne({
            where: {id}
        })

        ticket.set({
            price,
            sold,
            userId
        })

        ticket.save();
        return res.status(200).json(ticket);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const deleteTicket = async(req, res) => {
    try {
        const { id } = req.params
        const result = await Ticket.destroy({
            where: {id}
        })
        console.log(result);
        return res.status(204).send("Borrado");
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}