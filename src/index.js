import http from 'http';
import app from './app.js';
import { sequelize } from './database/database.js';
import { Server } from 'socket.io';

async function main() {

      
        await sequelize.sync()
        const server = http.createServer(app);
        const io = new Server;
        io.on('connection', (socket) => {
            console.log('A user connected');

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });

        server.listen(3001, console.log("running on 3001"));

    }
///servidor con sockets


main(); 
