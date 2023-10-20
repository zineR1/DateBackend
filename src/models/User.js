import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Ticket } from './Ticket.js';

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
   /*  pictures: {
        type: DataTypes.ARRAY
    }, */
    age: {
        type: DataTypes.INTEGER
    },
    dateOfBirth: {
        type: DataTypes.STRING
    },
    /* genre: {
        types: DataTypes.STRING
    },
 */    city: {
        type: DataTypes.STRING
    },
    sentimentalSituation: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.INTEGER

    }

});

User.hasMany(Ticket, {
    foreignKey: 'userId',
    sourceKey: 'id'
});

Ticket.belongsTo(User, {
    foreignKey: 'userId',
    targetId: 'id'
})