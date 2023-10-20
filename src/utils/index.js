import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Exception from './exception.js';

dotenv.config();

const JWT_SECRET = '123';

class Utils {
    static tokenGenerator = (user) => {
        const payload = {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email
        }

        const token = jsonwebtoken.sign(payload, JWT_SECRET, {expiresIn: '24h'});
        return token;
    }

    static isValidToken = (token) => {
        return new Promise((resolve) => {
            jsonwebtoken.verify(token, JWT_SECRET, (error, payload) => {
                if(error) {
                    console.log('error', error);
                    return resolve(false);
                }
                console.log('payload', payload);
                return resolve(payload);
            })
            return token;
        })
    }

    static createHash = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    static validatePassword = (password, user) => {
        return bcrypt.compareSync(password, user.password);
    }
     
}

export default Utils;