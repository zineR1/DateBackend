import { User } from "../models/User.js";

export const getBondsById = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  try {
    // Obtener los vínculos donde el usuario es el que inicia el vínculo o el receptor del vínculo
    const bonds = await User.findOne({
      where: { userId: userId },
      include: [
        {
          model: User,
          as: "Bonds",
          attributes: [
            "userId",
            "name",
            "lastName",
            "profilePictures",
            "contactMethods",
          ],
        },
        {
          model: User,
          as: "BondOf",
          attributes: [
            "userId",
            "name",
            "lastName",
            "profilePictures",
            "contactMethods",
          ],
        },
      ],
    });

    if (!bonds) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const userBonds = bonds.Bonds;

    return res.status(200).json(userBonds);
  } catch (error) {
    console.error("Error al obtener los vínculos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
