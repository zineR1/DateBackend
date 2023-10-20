import { Event } from './Event.js';
import { Ticket } from './Ticket.js';
import { User } from './User.js';

Event.hasMany(User, {as: "evento", foreignKey: "eventId"})

User.belongsTo(Event)