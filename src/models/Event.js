import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';


/* 
    la tabla tickets va a tener todas las entradas compradas
    esas entradas van a estar relacionadas con un usuario y con un evento
    es decir que cuando un usuario compre una entrada de un evento esto se va a registrar
    en la tabla Tickets
*/

export const Event = sequelize.define('events', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    flyer: {
        type: DataTypes.STRING
    },
    nombreEvento: {
        type: DataTypes.STRING,
    },
    fechaEvento: {
        type: DataTypes.STRING
    },
    horaInicio: {
        type: DataTypes.STRING
    },
    horaFin: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    ubicacion: {
        type: DataTypes.STRING
    },
    tipoEntrada: {
        type: DataTypes.ENUM('simple', 'multiple'),
        defaultValue: 'simple'
    },
    entradas: {
        type: DataTypes.JSON
    },
    organizadores: {
        type: DataTypes.JSON
    },
    invitados: {
        type: DataTypes.JSON
    }
})