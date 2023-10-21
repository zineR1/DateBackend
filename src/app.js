import express from 'express';
import routerUsers from './routes/users.js';
import routerTickets from './routes/tickets.js';
import routerAuth from './routes/auth.js';
import routerEvents from './routes/events.js';
import routerInstagram from './routes/instagramApi.js'
import passport from 'passport';
import cookieParser from 'cookie-parser';
import initPassport from './config/passport.config.js';
import cors from 'cors';

const app = express();

//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(cookieParser());

initPassport();
app.use(passport.initialize());

app.use(routerUsers);
app.use(routerTickets);
app.use(routerAuth);
app.use(routerEvents);
app.use(routerInstagram);

export default app;