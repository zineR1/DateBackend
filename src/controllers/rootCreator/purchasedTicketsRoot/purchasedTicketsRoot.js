import { PurchasedTicket } from "../../../models/PurchasedTicket.js";
import { createReceiptsRoot } from "../receiptsRoot/receiptsRoot.js";
import colors from "colors";

export const createPurchasedTicketsRoot = async (
  user1,
  user2,
  event1,
  event2
) => {
  const dbTickets1 = await PurchasedTicket.findAll({
    where: { userId: user1.userId, eventId: event2.eventId },
  });
  const dbTickets2 = await PurchasedTicket.findAll({
    where: { userId: user2.userId, eventId: event1.eventId },
  });

  if (user1 && event2 && !dbTickets1[0]) {
    const created1 = await PurchasedTicket.create({
      userId: user1.userId,
      eventId: event2.eventId,
      ticketIdEntry: 2,
      assigned: true,
      owner: user1.userId,
      status: { text: "pendiente", time: null },
      code: "282G",
    });

    const created2 = await PurchasedTicket.create({
      userId: user1.userId,
      eventId: event2.eventId,
      ticketIdEntry: 2,
      assigned: false,
      status: { text: "pendiente", time: null },
      code: "628C",
    });

    const created3 = await PurchasedTicket.create({
      userId: user1.userId,
      eventId: event2.eventId,
      ticketIdEntry: 2,
      assigned: false,
      status: { text: "pendiente", time: null },
      code: "753G",
    });
    if (created1 && created2 && created3) {
      console.log(colors.bold.red("----> Tickets user1 created"));
    }
  }

  if (user2 && event1 && !dbTickets2[0]) {
    const created1 = await PurchasedTicket.create({
      userId: user2.userId,
      eventId: event1.eventId,
      ticketIdEntry: 3,
      assigned: true,
      owner: user2.userId,
      status: { text: "pendiente", time: null },
      code: "734K",
    });

    const created2 = await PurchasedTicket.create({
      userId: user2.userId,
      eventId: event1.eventId,
      ticketIdEntry: 3,
      assigned: false,
      status: { text: "pendiente", time: null },
      code: "276X",
    });

    const created3 = await PurchasedTicket.create({
      userId: user2.userId,
      eventId: event1.eventId,
      ticketIdEntry: 3,
      assigned: false,
      status: { text: "pendiente", time: null },
      code: "796L",
    });
    if (created1 && created2 && created3) {
      console.log(colors.bold.red("----> Tickets user2 created"));
      createReceiptsRoot(user1,user2,event1,event2)
    }
  }
};
