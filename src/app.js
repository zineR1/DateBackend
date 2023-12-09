import express from "express";
import routerUsers from "./routes/users.js";
import routerTickets from "./routes/purchasedTickets.js";
import routerAuth from "./routes/auth.js";
import routerEvents from "./routes/events.js";
// import routerInstagram from "./routes/instagramApi.js";
import routerComprobantes from './routes/receipts.js';
import passport from "passport";
import cookieParser from "cookie-parser";
import initPassport from "./config/passport.config.js";
import cors from "cors";

const app = express();

  
const allowedOrigins = [
  "https://datefrontendpruebas.onrender.com",
  "https://datefrontendpruebas.onrender.com/#",
  "http://localhost:3000",
  "http://localhost:3001",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Acceso no permitido por CORS"));
    }
  },
};
//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.static('public'))
app.use('/public', express.static('src/public'));

initPassport();
app.use(passport.initialize());
app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "https://datefrontendpruebas.onrender.com");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(cors({origin: allowedOrigins}));
app.use(routerUsers);
app.use(routerTickets);
app.use(routerAuth);
app.use(routerEvents);
// app.use(routerInstagram);
app.use(routerComprobantes);

export default app;
