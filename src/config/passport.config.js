import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User.js';

const JWT_SECRET = '123';

const cookieExtractor = (req) => {
    let token = null

    if(req && req.cookies){
        token = req.cookies.token
    }
    return token
}

const initPassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    },(payload, done) => {
        return done(null, payload);
    }))
}

export default initPassport;