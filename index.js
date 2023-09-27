const server = require("./src/server");
const colors = require("colors");
const app = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;

server.use(app.static(path.join(__dirname, "client/build")));

// Start server
server.listen(PORT, () => {
  console.log(colors.black.bgGreen(`==>> Server is running on PORT: ${PORT} `));
});
