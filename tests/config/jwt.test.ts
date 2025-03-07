import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../src/config/jwt';
import { JWTPayload } from '../../src/types/jwt';

describe('JWT Functions', () => {
    beforeEach(() => {
        // Configure environment variable befeor each test
        process.env.JWT_SECRET = 'wecaria-secret';
    });

    afterEach(() => {
        // Cleans environment variables
        delete process.env.JWT_SECRET;
    });

    it('It must generate a JWT correctly', async () => {
        // Creates a payload
        const payload: JWTPayload = {
            id: '12345',
        };

        // Generates a JWT
        const token = generateToken(payload);

        expect(token).not.toBeNull();
        expect(token).not.toBeUndefined();

        // Try to verify the JWT
        const verifiedPayload = verifyToken(token);
        expect(verifiedPayload).not.toBeNull();

        // Verify if the verified token is valid
        expect(verifiedPayload?.id).toEqual(payload.id);
    });

    it('It must verify correctly the JWT', async () => {
        // Creates a payload
        const payload: JWTPayload = {
            id: '12345',
        };
    
        // Generates a JWT
        const token = generateToken(payload);
    
        // Verify the JWT
        const verifiedPayload = verifyToken(token);
        expect(verifiedPayload).not.toBeNull();
    
        // Verify if the verified token is valid
        expect(verifiedPayload?.id).toEqual(payload.id);
    });

    it('It must handle errors when verifying fails', async () => {
        // Put an invalid token
        const invalidToken = 'invalid';

        // Verify the invalid token
        const verifiedPayload = verifyToken(invalidToken);
        expect(verifiedPayload).toBeNull();
    });

    it('It must handle the error when the secret is not defined and try to verify JWT', async () => {
        // Deletes the secret
        delete process.env.JWT_SECRET;

        // Creates a payload
        const payload: JWTPayload = {
            id: '12345',
        };

        // Generates the token with a temporal secret
        process.env.JWT_SECRET = 'mi-secreto-de-prueba';
        const token = generateToken(payload);
        delete process.env.JWT_SECRET; // Deletes agian the secret

        // Verify token without secret
        expect(() => verifyToken(token)).toThrowError('JWT_SECRET is not defined');
    });
});
