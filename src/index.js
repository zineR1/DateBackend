import http from "http";
import app from "./app.js";
import { sequelize } from "./database/database.js";
// import { Server } from "socket.io";
import { createRootUser } from './controllers/usersRoot/usersRoot.js';
import { createEventRoot } from './controllers/eventsRoot/eventsRoot.js'
import colors from 'colors';

const PORT = process.env.PORT || 3001;

async function main() {
  await sequelize.sync({ force: false });
  const server = http.createServer(app);
  // const io = new Server();
  // io.on("connection", (socket) => {
  //   console.log("A user connected");

  //   socket.on("disconnect", () => {
  //     console.log("User disconnected");
  //   });
  // });

  server.listen(PORT, () => {
    console.log(colors.black.bgGreen(`Server running on ${PORT}`))
    createRootUser();
    createEventRoot();
  });
}
///servidor con sockets

main();
