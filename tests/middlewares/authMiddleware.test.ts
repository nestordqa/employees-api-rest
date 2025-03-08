import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../src/middlewares/authMiddleware';
import { verifyToken } from '../../src/config/jwt';
import BlacklistToken from '../../src/models/BlacklistToken';
import { handleResponse } from '../../src/utils/response';

// Mock de dependencias
jest.mock('../../src/config/jwt');
jest.mock('../../src/models/BlacklistToken');
jest.mock('../../src/utils/response');

describe('authMiddleware', () => {
    let req: any;
    let res: Partial<Response>;
    let next: jest.MockedFunction<NextFunction>;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        req = {
            headers: {},
            userId: undefined
        };
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        next = jest.fn() as jest.MockedFunction<NextFunction>;
    });

    it('Should return 401 if no Bearer token is provided', async () => {
        await authMiddleware(req as Request, res as Response, next);
        
        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'Token not found',
            401
        );
    });

    it('Should return 401 if token is blacklisted', async () => {
        req.headers.authorization = 'Bearer blacklisted-token';
        (BlacklistToken.findOne as jest.Mock).mockResolvedValue({ token: 'blacklisted-token' });

        await authMiddleware(req as Request, res as Response, next);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'Invalid token (Logged out)',
            401
        );
    });

    it('Should return 401 if token is invalid', async () => {
        req.headers.authorization = 'Bearer invalid-token';
        (BlacklistToken.findOne as jest.Mock).mockResolvedValue(null);
        (verifyToken as jest.Mock).mockReturnValue(null);

        await authMiddleware(req as Request, res as Response, next);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'Invalid token',
            401
        );
    });

    it('Should set userId and call next for valid token', async () => {
        const mockDecoded = { id: 'user123' };
        req.headers.authorization = 'Bearer valid-token';
        
        (BlacklistToken.findOne as jest.Mock).mockResolvedValue(null);
        (verifyToken as jest.Mock).mockReturnValue(mockDecoded);

        await authMiddleware(req as Request, res as Response, next);

        expect(req.userId).toBe('user123');
        expect(next).toHaveBeenCalled();
    });

    it('Should handle internal errors', async () => {
        req.headers.authorization = 'Bearer error-token';
        (BlacklistToken.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));

        await authMiddleware(req as Request, res as Response, next);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'There was an error verifying the token',
            500
        );
    });

    // Test adicional para formato de token incorrecto
    it('Should handle invalid token format', async () => {
        req.headers.authorization = 'InvalidFormat';
        await authMiddleware(req as Request, res as Response, next);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'Token not found',
            401
        );
    });
});
