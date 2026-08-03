// middleware/auth.js
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { JWT_SECRET } from '../config.js';


const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}
// Configure passport
passport.use(new JWTStrategy(opts, (jwtPayload, done) => {
  try {
    if (jwtPayload) {
      console.log('This is the Payload : ',jwtPayload)
      return done(null, jwtPayload);
    }
    return done(null, false);
  } catch (error) {
    console.log(error)
  }
}));

// Middleware to check if user has specific role
export const checkRole = (roles) => (req, res, next) => {
  console.log(req.user)
  if (!req.user) return res.status(401).send('Unauthorized');

  if (roles.includes(req.user.Role)) {
    return next();
  }

  return res.status(403).send('Forbidden');
};


