import { Request, Response } from 'express';
import * as authControllers from '../../src/controllers/authController';
import User from '../../src/models/User';
import BlacklistToken from '../../src/models/BlacklistToken';
import { generateToken } from '../../src/config/jwt';
import { handleResponse } from '../../src/utils/response';

// Mock de los modelos y funciones externas
jest.mock('../../src/models/User');
jest.mock('../../src/models/BlacklistToken');
jest.mock('../../src/config/jwt');
jest.mock('../../src/utils/response');

const mockRequest = (body: any = {}, headers: any = {}) => ({
    body,
    headers
} as Request);

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
};

describe('Auth Controllers', () => {
    let res: Response;
    
    beforeEach(() => {
        jest.clearAllMocks();
        res = mockResponse();
    });

    describe('register', () => {
        it('Should register a new user successfully', async () => {
            const req = mockRequest({
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            });

            const mockUser = {
                id: '123',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                save: jest.fn().mockResolvedValue(this)
            };
            
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User as unknown as jest.Mock).mockImplementation(() => mockUser); // Mockear el constructor
            (generateToken as jest.Mock).mockReturnValue('mocked-token');
        
            await authControllers.register(req, res);
        
            expect(generateToken).toHaveBeenCalledWith({
                id: '123',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe'
            });
        });
        

        it('Should handle existing user', async () => {
            const req = mockRequest({
                email: 'existing@example.com',
                password: 'password123'
            });

            (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

            await authControllers.register(req, res);

            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                'This user alreary exist',
                409
            );
        });
    });

    describe('login', () => {
        it('should login user with valid credentials', async () => {
        const req = mockRequest({
            email: 'test@example.com',
            password: 'password123'
        });

        const mockUser = {
            id: '123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            comparePassword: jest.fn().mockResolvedValue(true)
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue('mocked-token');

        await authControllers.login(req, res);

        expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
        expect(handleResponse).toHaveBeenCalledWith(res, true, { token: 'mocked-token' });
        });

        it('should handle invalid credentials', async () => {
        const req = mockRequest({
            email: 'wrong@example.com',
            password: 'wrongpassword'
        });

        (User.findOne as jest.Mock).mockResolvedValue(null);

        await authControllers.login(req, res);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'Invalid credentials',
            401
        );
        });
    });

    describe('logout', () => {
        it('should blacklist token successfully', async () => {
        const req = mockRequest({}, {
            authorization: 'Bearer valid-token'
        });

        (BlacklistToken.prototype.save as jest.Mock).mockResolvedValue({});

        await authControllers.logout(req, res);

        expect(BlacklistToken.prototype.save).toHaveBeenCalledWith();
        expect(handleResponse).toHaveBeenCalledWith(
            res,
            true,
            null,
            'Successful logout'
        );
        });

        it('should handle missing token', async () => {
        const req = mockRequest({}, {});
        
        await authControllers.logout(req, res);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            true,
            null,
            'Successful logout'
        );
        });
    });

    // Tests adicionales para casos edge
    describe('error handling', () => {
        it('should handle database errors in register', async () => {
        const req = mockRequest({
            email: 'test@example.com',
            password: 'password123'
        });

        (User.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));

        await authControllers.register(req, res);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'DB Error',
            400
        );
        });

        it('should handle password comparison errors in login', async () => {
        const req = mockRequest({
            email: 'test@example.com',
            password: 'password123'
        });

        const mockUser = {
            comparePassword: jest.fn().mockRejectedValue(new Error('Comparison failed'))
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);

        await authControllers.login(req, res);

        expect(handleResponse).toHaveBeenCalledWith(
            res,
            false,
            null,
            'Comparison failed',
            500
        );
        });
    });
});
