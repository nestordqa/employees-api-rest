import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { handleResponse } from '../utils/response';
import BlacklistToken from '../models/BlacklistToken';

interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    //Validates if header exist and it sintaxys is OK
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return handleResponse(res, false, null, 'Token not found', 401);
    }

    //Takes just the token, without the bearer word
    const token = authHeader.split(' ')[1];

    try {
        const blacklistedToken = await BlacklistToken.findOne({ token });
        //Checks if it is in the blacklist and stop the execution if it is
        if (blacklistedToken) {
            return handleResponse(res, false, null, 'Invalid token (Logged out)', 401);
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            //Checks if the token is valid
            return handleResponse(res, false, null, 'Invalid token', 401);
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        return handleResponse(res, false, null, 'There was an error verifying the token', 500);
    }
};
