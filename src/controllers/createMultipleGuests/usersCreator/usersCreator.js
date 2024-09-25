import { Guest } from "../../../models/Guest.js";
import { User } from "../../../models/User.js";
import { Event } from "../../../models/Event.js";
import Utils from "../../../utils/index.js";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

const generateRandomImage = () => {
  const width = 200;
  const height = 300;
  return `https://picsum.photos/${width}/${height}?random=${Math.floor(
    Math.random() * 1000
  )}`;
};

const generateRandomUserData = (index, eventId) => {
  return {
    name: `User${index}`,
    lastName: `LastName${index}`,
    userName: `user${index}`,
    email: `user${index}@example.com`,
    password: Utils.createHash("password123"),
    description: `Descripción del usuario ${index}`,
    profilePictures: [
      generateRandomImage(),
      generateRandomImage(),
      generateRandomImage(),
    ],
    age: Math.floor(Math.random() * 50) + 18,
    dateOfBirth: `${Math.floor(Math.random() * 30 + 1)}/01/${Math.floor(
      Math.random() * 40 + 1980
    )}`,
    genre: Math.random() > 0.5 ? "Masculino" : "Femenino",
    city: "Ciudad de Ejemplo",
    sentimentalSituation: {
      label: "Soltero/a",
      value: "single",
    },
    phone: `${Math.floor(Math.random() * 900000000) + 100000000}`,
    events: [eventId],
  };
};

export const createRandomGuestsForEvent = async (req, res) => {
  const { numberOfUsers, eventId } = req.body;

  if (!numberOfUsers || !eventId) {
    return res.status(400).json({ message: "numberOfUsers and eventId are required." });
  }

  const parsedEventId = parseInt(eventId, 10);
  const parsedNumberOfUsers = parseInt(numberOfUsers, 10);

  if (isNaN(parsedEventId) || isNaN(parsedNumberOfUsers)) {
    return res.status(400).json({ message: "eventId and numberOfUsers must be valid integers." });
  }

  const dbEvent = await Event.findOne({ where: { eventId: parsedEventId } });
  if (!dbEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Obtener el último índice de usuario creado
  const lastUser = await User.findOne({
    order: [['userId', 'DESC']], // Asegúrate de que 'userId' sea el campo correcto
  });

  // Asegúrate de que lastUser.userId sea una cadena antes de usar replace
  const startIndex = lastUser && lastUser.userId 
    ? parseInt(String(lastUser.userId).replace('user', '')) + 1 
    : 1;

  for (let i = 0; i < parsedNumberOfUsers; i++) {
    const index = startIndex + i; // Ajustar el índice basado en el último usuario
    const userData = generateRandomUserData(index, eventId);
    const user = await User.create(userData);

    if (user) {
      const guest = await Guest.create({
        userId: user.userId,
        eventId: dbEvent.eventId,
      });

      if (guest) {
        console.log(`----> Guest for User random ${index} added to Event ${parsedEventId}`);
      }
    }
  }

  return res.status(201).json({
    message: `${parsedNumberOfUsers} guests created for event ${parsedEventId}`,
  });
};
