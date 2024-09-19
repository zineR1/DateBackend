import { PurchasedTicket } from "../../../models/PurchasedTicket.js";
import { Receipt } from "../../../models/Receipt.js";
import colors from "colors";

export const createReceiptsRoot = async (
  user1,
  user2,
  user3,
  event1,
  event2
) => {
  const dbTickets1 = await PurchasedTicket.findAll({
    where: { userId: user1.userId, eventId: event2.eventId },
  });
  const dbTickets1ID = dbTickets1.map((tickets) => tickets.ticketId);
  const dbTickets2 = await PurchasedTicket.findAll({
    where: { userId: user2.userId, eventId: event1.eventId },
  });
  const dbTickets2ID = dbTickets2.map((tickets) => tickets.ticketId);
  const dbTickets3 = await PurchasedTicket.findAll({
    where: { userId: user3.userId, eventId: event1.eventId },
  });
  const dbTickets3ID = dbTickets3.map((tickets) => tickets.ticketId);

  const receipt1 = await Receipt.findOne({
    where: { userId: user1.userId, eventId: event2.eventId },
  });
  const receipt2 = await Receipt.findOne({
    where: { userId: user2.userId, eventId: event1.eventId },
  });
  const receipt3 = await Receipt.findOne({
    where: { userId: user3.userId, eventId: event1.eventId },
  });

  function calcularCostoTotal(ticketsComprados, ticketsDisponibles) {
    let costoTotal = 0;

    ticketsComprados.forEach((ticketComprado) => {
      const ticket = ticketsDisponibles.find(
        (t) => t.id === ticketComprado.ticketIdEntry
      );
      if (ticket) {
        costoTotal += ticket.price;
      }
    });

    return costoTotal;
  }

  if (user1 && event2 && dbTickets1[0] && !receipt1) {
    const receipt1 = await Receipt.create({
      userId: user1.userId,
      eventId: event2.eventId,
      purchasedTickets: dbTickets1ID,
      totalAmount: calcularCostoTotal(dbTickets1, event2.tickets),
      receipts: "",
    });

    if (receipt1) {
      console.log(colors.bold.blue("----> Receipt user1 created"));
    }
  }

  if (user2 && event1 && dbTickets2[0] && !receipt2) {
    const receipt2 = await Receipt.create({
      userId: user2.userId,
      eventId: event1.eventId,
      purchasedTickets: dbTickets2ID,
      totalAmount: calcularCostoTotal(dbTickets2, event1.tickets),
      receipts: "",
    });

    if (receipt2) {
      console.log(colors.bold.blue("----> Receipt user2 created"));
    }
  }

  if (user3 && event1 && dbTickets3[0] && !receipt3) {
    const receipt3 = await Receipt.create({
      userId: user3.userId,
      eventId: event1.eventId,
      purchasedTickets: dbTickets3ID,
      totalAmount: calcularCostoTotal(dbTickets3, event1.tickets),
      receipts: "",
    });

    if (receipt3) {
      console.log(colors.bold.blue("----> Receipt user3 created"));
    }
  }
};
