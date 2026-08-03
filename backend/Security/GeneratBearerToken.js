
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const GeneratBearerToken = (userpayload) => {
    const Token = jwt.sign(userpayload , JWT_SECRET , { expiresIn : '1h' })

    if(Token){
        return 'Bearer ' + Token   
    }

}

export default GeneratBearerToken