import { Event } from "./Event.js";
import { PurchasedTicket } from "./PurchasedTicket.js";
import { User } from "./User.js";
import { Guest } from "./Guest.js";
import { Receipt } from "./Receipt.js";
import { Bond } from "./Bond.js";
import { BondRequest } from "./BondRequest.js";

User.hasMany(PurchasedTicket, { foreignKey: "userId" });
Event.hasMany(PurchasedTicket, { foreignKey: "eventId" });

PurchasedTicket.belongsTo(User, { foreignKey: "userId" });
PurchasedTicket.belongsTo(Event, { foreignKey: "eventId" });
PurchasedTicket.belongsTo(Receipt, { foreignKey: "receiptId" });

// Relaciones entre usuarios e invitados
User.hasMany(Guest, { foreignKey: "userId" });
Event.hasMany(Guest, { foreignKey: "eventId" });
Guest.belongsTo(User, { foreignKey: "userId" });
Guest.belongsTo(Event, { foreignKey: "eventId" });

Receipt.hasMany(PurchasedTicket, { foreignKey: "receiptId" });

// Relaciones entre usuarios y solicitudes de amistad
User.hasMany(BondRequest, { as: "SentRequests", foreignKey: "requesterId" });
User.hasMany(BondRequest, { as: "ReceivedRequests", foreignKey: "receiverId" });
BondRequest.belongsTo(User, { foreignKey: "requesterId", as: "Requester" }); // Asociación para el que envía
BondRequest.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" }); // Asociación para el que recibe

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
BondRequest.belongsTo(Event, { foreignKey: "eventId" });
Event.hasMany(BondRequest, { foreignKey: "eventId" });