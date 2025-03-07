import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/jwt';

const generateToken = (payload: JWTPayload): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, secret, {
        expiresIn: '1h'
    });
};

const verifyToken = (token: string): JWTPayload | null => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    try {
        return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
        console.error('There was an error trying to verify the JWT: ', error);
        return null;
    }
};


export { generateToken, verifyToken };
