import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

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
    userName: {
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
      genre: {
        type: DataTypes.STRING
    }, 
    city: {
        type: DataTypes.STRING
    },
    sentimentalSituation: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING

    },
    instagramToken: {
        type: DataTypes.STRING
    },

}
);

/* User.hasMany(Ticket, {
    foreignKey: 'userId',
    sourceKey: 'id'
});

Ticket.belongsTo(User, {
    foreignKey: 'userId',
    targetId: 'id'
}) */