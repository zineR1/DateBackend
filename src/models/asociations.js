import { Event } from './Event.js';
import { PurchasedTicket } from './PurchasedTicket.js';
import { User } from './User.js';
import { Guest } from './Guest.js';
import { Receipt } from './Receipt.js';

//RELACIONES DE ALE
// Event.hasMany(User, {as: "evento", foreignKey: "eventId"})
// User.belongsTo(Event)

//RELACIONES MIAS
User.hasMany(PurchasedTicket, { foreignKey: 'userId' });

PurchasedTicket.belongsTo(User, { foreignKey: 'userId' });
PurchasedTicket.belongsTo(Event, { foreignKey: 'eventId' });
PurchasedTicket.belongsTo(Receipt, { foreignKey: 'receiptId' });

Event.hasMany(PurchasedTicket, { foreignKey: 'eventId' });
Event.hasMany(Guest, { foreignKey: 'eventId' });

Guest.belongsTo(Event, { foreignKey: 'eventId' });
Guest.belongsTo(User, { foreignKey: 'userId' })

Receipt.hasMany(PurchasedTicket, { foreignKey: 'receiptId' });
