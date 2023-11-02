import { Event } from '../models/Event.js';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import Utils from '../utils/index.js';
import multer from 'multer';
import path from 'path';

export const getEvents = async(req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events)
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
    const { id, cantidad, organizadoresNomb } = req.body;

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
        return {...e.dataValues, nombreEntrada: event.nombreEvento, cantidadEntradas: cantidad, descripcion:event.descripcion, invitados: users }
    })
    event.entradas = test;
    res.send(userEvent)

}



export const agregarInvitado = async(req, res) => {
    const { id, nombre, apellido, userName, foto, comprobante, confirmado, entrada, total} = req.body;


    const nuevoInvitado = {
        nombre,
        apellido,
        userName,
        foto,
        comprobante,
        confirmado,
        entrada,
        total
      };

      const event = await Event.findOne({
        where: {
            id: id
        }
    })
    

  if (!event) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      } 
      
     

       // Asegurarse de que el evento tenga un array de invitados
     if (!event.invitados) {
        event.invitados = [];
        event.invitados.push(nuevoInvitado);
        console.log(event.invitados, " Invitados if");
    } else {
        event.invitados = [ ...event.invitados, nuevoInvitado]
        console.log(event.invitados, " Invitados else");

    } 

    /* if(!event.invitados) {
        event.invitados = [];
    }
    event.invitados.push(nuevoInvitado); */
    // Agregar el nuevo invitado al array de invitados del evento
    
    
  // Guardar los cambios en la base de datos

    try {
    await event.save();
    res.json(event.invitados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el invitado' });
  }  
  
}

export const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findOne({
            where: {
                id: id,
            }
        })
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
          }

        res.status(200).json(event);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addOrganizadores = async(req, res) => {
    const {nombre, apellido, username, foto} = req.body;
    const { id } = req.params;

    try {
        const event = await Event.findOne({
            where: {
                id: id
            }
        })

        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
          }
        const data = {
            nombre: nombre,
            apellido: apellido,
            username: username,
            foto: foto
        }
        if (!event.organizadores) {
            event.organizadores = [];
            event.organizadores.push(data);
            console.log(event.organizadores, " Invitados if");
        } else {
            event.organizadores = [ ...event.organizadores, data]
            console.log(event.organizadores, " Invitados else");
    
        } 

        await event.save();
        res.json(event.organizadores);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteOrganizador  = async(req, res) => {
    const { username } = req.body;
    const { id } = req.params;

    try {
        const event = await Event.findOne({
            where: {
                id: id
            }
        })

        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
          }
           const result = event.organizadores.filter(e => e.username !== username); 
            
          event.organizadores = result;

          event.save();
          res.send(event.organizadores)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
} 


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/comprobantes')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
  });

  export const upload = multer({
    storage: storage
  })

  export const addInvitado = async(req, res) => {
    const { id } = req.params;
    const { invitado } = req.body;

    try {
        const event = await Event.findOne({
            where: {
                id: id
            }
        })


        if(!event.invitados) {
            event.invitados = [];
            event.invitados.push(invitado)
        }else {
            event.invitados = [...event.invitados, invitado]
        }



        await event.save()
        console.log(event.invitados)
    } catch (error) {
        return res.status(500).json({ message: error.message });   
    }
  }
  

export const addComprobantes = async(req, res) => {
    const { id } = req.params;
    const { userName } = req.body;

    try {
        const event = Event.findOne({
            where: {
                id: id
            }
        });

        if(!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        const invitado = event.invitados.find(e => e.userName === userName)

        if(!invitado.comprobante) {
            invitado.comprobante = [];
            invitado.comprobante.push(req.file.filename);
        } else {
            invitado.comprobante = [...invitado.comprobante, req.file.filename];
        }

        event.invitados.forEach((e) => {
            if(e.userName === userName) {
                e = invitado
            }
        });

        await event.save();
        res.send(event.invitados)

    } catch (error) {
        
    }
}



export const deleteComprobante = async(req, res) => {
    
}