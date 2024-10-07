import http from "http";
import app from "./app.js";
import { sequelize } from "./database/database.js";
// import { Server } from "socket.io";
import { createRootUser } from "./controllers/rootCreator/usersRoot/usersRoot.js";
import colors from "colors";

const PORT = process.env.PORT || 3001;

async function main() {
  await sequelize.sync({ force: true });
  const server = http.createServer(app);

  ///servidor con sockets
  // const io = new Server();
  // io.on("connection", (socket) => {
  //   console.log("A user connected");

  //   socket.on("disconnect", () => {
  //     console.log("User disconnected");
  //   });
  // });

  server.listen(PORT, async () => {
    console.log(colors.black.bgGreen(`Server running on ${PORT}`));
    await createRootUser();
    console.log(colors.black.bgGreen(`All test registers created`));
  });
}

main();
