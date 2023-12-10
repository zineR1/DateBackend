import { Guest } from "../../../models/Guest.js";
import { User } from "../../../models/User.js";
import { Event } from "../../../models/Event.js";
import { createPurchasedTicketsRoot } from "../purchasedTicketsRoot/purchasedTicketsRoot.js";
import colors from "colors";

export const createGuestRoot = async () => {
  const root1 = process.env.EMAIL_ROOT1;
  const root2 = process.env.EMAIL_ROOT2;
  const eventRoot1 = process.env.EVENT_ROOT1;
  const eventRoot2 = process.env.EVENT_ROOT2;
  const dbUser1 = await User.findOne({ where: { email: root1 } });
  const dbUser2 = await User.findOne({ where: { email: root2 } });
  const dbEvent1 = await Event.findOne({ where: { eventName: eventRoot1 } });
  const dbEvent2 = await Event.findOne({ where: { eventName: eventRoot2 } });
  const dbGuest1 = await Guest.findOne({
    where: { userId: dbUser1.userId, eventId: dbEvent1.eventId },
  });
  const dbGuest2 = await Guest.findOne({
    where: { userId: dbUser2.userId, eventId: dbEvent2.eventId },
  });

  if (dbUser1 && dbEvent1 && !dbGuest1) {
    const guest1 = await Guest.create({
      userId: dbUser1.userId,
      eventId: dbEvent2.eventId,
    });
    if (guest1) {
      console.log(colors.bold.cyan("----> guest1 created"));
    } else {
      console.log(colors.bold.cyan("----> guest1 already exists"));
    }
  }

  if (dbUser2 && dbEvent2 && !dbGuest2) {
    const guest2 = await Guest.create({
      userId: dbUser2.userId,
      eventId: dbEvent1.eventId,
    });
    if (guest2) {
      console.log(colors.bold.cyan("----> guest2 created"));
      createPurchasedTicketsRoot(dbUser1, dbUser2, dbEvent1, dbEvent2);
    } else {
      console.log(colors.bold.cyan("----> guest2 already exists"));
    }
  }
};
