import jwt from 'jsonwebtoken';

interface Payload{
    userId?: string,
    role?: string,
}
const generateToken = (payload: Payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '7d'});
    return token;
}

export default generateToken;