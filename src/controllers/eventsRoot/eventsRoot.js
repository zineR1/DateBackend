import { Event } from '../../models/Event.js';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();

export const createEventRoot = async() => {

    const eventRoot1 = process.env.EVENT_ROOT1;
    const eventRoot2 = process.env.EVENT_ROOT2;
    const dbEvent1 = await Event.findOne({where: {nombreEvento: eventRoot1}});
    const dbEvent2 = await Event.findOne({where: {nombreEvento: eventRoot2}});

    const URL_API_DATE =
  process.env.NODE_ENV === "production"
    ? "https://datebackendpruebas.onrender.com"
    : "http://localhost:3001";

    if(!dbEvent1) {
        const event1 = await Event.create({
            flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
            nombreEvento: eventRoot1,
            fechaEvento: '2026-02-04',
            horaInicio: '00:00',
            horaFin: '06:00',
            descripcion: 'Fiesta Cerveza',
            state: 'pendiente',
            ubicacion: 'Cordoba',
            tipoEntrada: 'multiple',
            entradas: [
                {
                    id: 0,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                },
                {
                    id: 1,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                },
                {
                    id: 2,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                },
                {
                    id: 3,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                }
            ],
            organizadores: ['root1'],
            invitados: [
                {nombre: 'root2', apellido: 'Root', userName: 'root2', foto: `${URL_API_DATE}/public/imagen/defaultPic.png`, comprobante: [], entradas:  [{idEntrada: 1, asignada: true, dueño: 'root1', estado: {texto: 'pendiente', hora: null}, codigo: '282G'}, {idEntrada: 1, asignada: false, dueño: '', estado: {texto: 'pendiente', hora: null},codigo: '628C'}, {idEntrada: 1, asignada: false, dueño: '', estado: {texto: 'pendiente', hora: null},codigo: '862X'}], total: 4500}
            ],
            datosBanco: {
                titular: 'Alejandro Heredia',
                cbu: '121223235534',
                alias: 'TRONCO.PARED.MP',
                banco: 'Santander Río',


            }

        });
        if(event1) {
            console.log(colors.bold.magenta('----> event1 created'))
        } else {
            console.log(colors.bold.magenta('----> envent1 already exists'));
        } 
    }


    //--------------------

    if(!dbEvent2) {
        const event2 = await Event.create({
            flyer: `${URL_API_DATE}/public/imagen/defaultPicEvent.png`,
            nombreEvento: eventRoot2,
            fechaEvento: '2026-02-04',
            horaInicio: '00:00',
            horaFin: '06:00',
            descripcion: 'Fiesta Fernet',
            state: 'pendiente',
            ubicacion: 'Cordoba',
            tipoEntrada: 'multiple',
            entradas: [
                {
                    id: 0,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                },
                {
                    id: 1,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                },
                {
                    id: 2,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                },
                {
                    id: 3,
                    nombreEntrada: "Early bird",
                    precioEntrada: 1500,
                    cantidadEntradas: 200,
                    descripcion: "Aprovechá la entrada con precio promocional, pronto se agotan.",
                    estado: "Agotada",
                    vendidas: 4
                }
            ],
            organizadores: ['root2'],
            invitados: [
                {nombre: 'root1', apellido: 'Root', userName: 'root1', foto: `${URL_API_DATE}/public/imagen/defaultPic.png`, comprobante: [], entradas:   [{idEntrada: 1, asignada: true, dueño: 'root1', estado: {texto: 'pendiente', hora: null}, codigo: '282T'}, {idEntrada: 1, asignada: false, dueño: '', estado: {texto: 'pendiente', hora: null},codigo: '628B'}, {idEntrada: 1, asignada: false, dueño: '', estado: {texto: 'pendiente', hora: null},codigo: '862V'}], total: 4500}
            ],
            datosBanco: {
                titular: 'Agustin Dalvit',
                cbu: '121223235534',
                alias: 'TRONCO.PARED.MP',
                banco: 'Santander Río',


            }

        });
        if(event2) {
            console.log(colors.bold.magenta('----> event2 created'))
        } else {
            console.log(colors.bold.magenta('----> envent2 already exists'));
        } 
    }
    

}