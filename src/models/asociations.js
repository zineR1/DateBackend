import { Event } from "./Event.js";
import { PurchasedTicket } from "./PurchasedTicket.js";
import { User } from "./User.js";
import { Guest } from "./Guest.js";
import { Receipt } from "./Receipt.js";
import { Bond } from "./Bond.js";

User.hasMany(PurchasedTicket, { foreignKey: "userId" });
Event.hasMany(PurchasedTicket, { foreignKey: "eventId" });
Event.hasMany(Guest, { foreignKey: "eventId" });

PurchasedTicket.belongsTo(User, { foreignKey: "userId" });
PurchasedTicket.belongsTo(Event, { foreignKey: "eventId" });
PurchasedTicket.belongsTo(Receipt, { foreignKey: "receiptId" });

Guest.belongsTo(Event, { foreignKey: "eventId" });
Guest.belongsTo(User, { foreignKey: "userId" });

Receipt.hasMany(PurchasedTicket, { foreignKey: "receiptId" });

// Relaciones entre usuarios y solicitudes de amistad
User.hasMany(BondRequest, { as: 'SentRequests', foreignKey: 'requesterId' });
User.hasMany(BondRequest, { as: 'ReceivedRequests', foreignKey: 'receiverId' });

// Relaciones entre usuarios y vínculos
User.belongsToMany(User, {
  as: "Bonds",
  through: Bond,
  foreignKey: "userId",
  otherKey: "bondId",
});

User.belongsToMany(User, {
  as: "BondOf", // Para la relación inversa
  through: Bond,
  foreignKey: "bondId",
  otherKey: "userId",
});

// Relación entre BondRequest y Event
BondRequest.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(BondRequest, { foreignKey: 'eventId' });
