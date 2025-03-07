import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../src/config/jwt';
import { JWTPayload } from '../../src/types/jwt';

describe('JWT Functions', () => {
    beforeEach(() => {
        // Configura las variables de entorno antes de cada test
        process.env.JWT_SECRET = 'wecaria-secret';
        process.env.JWT_EXPIRATION = '1h'; // Configura la expiración
    });

    afterEach(() => {
        // Limpia las variables de entorno después de cada test
        delete process.env.JWT_SECRET;
        delete process.env.JWT_EXPIRATION;
    });

    it('It must generate a JWT correctly', async () => {
        // Crea un payload
        const payload: JWTPayload = {
            userId: '12345',
        };

        // Genera el JWT
        const token = generateToken(payload);

        expect(token).not.toBeNull();
        expect(token).not.toBeUndefined();

        // Verifica que el JWT se pueda verificar correctamente
        const verifiedPayload = verifyToken(token);
        expect(verifiedPayload).not.toBeNull();

        // Verifica que el payload verificado contenga las propiedades esperadas
        expect(verifiedPayload?.userId).toEqual(payload.userId);
    });

    it('It must verify correctly the JWT', async () => {
        // Crea un payload
        const payload: JWTPayload = {
            userId: '12345',
        };
    
        // Genera JWT
        const token = generateToken(payload);
    
        // Verifica JWT
        const verifiedPayload = verifyToken(token);
        expect(verifiedPayload).not.toBeNull();
    
        // Verifica que el payload verificado contenga las propiedades esperadas
        expect(verifiedPayload?.userId).toEqual(payload.userId);
    });

    it('It must handle errors when verifying fails', async () => {
        // Establece un token inválido
        const invalidToken = 'token-invalido';

        // Verifica el token inválido
        const verifiedPayload = verifyToken(invalidToken);
        expect(verifiedPayload).toBeNull();
    });

    it('It must handle the error when the secret is not defined and try to verify JWT', async () => {
        // Elimina el secreto para simular un error
        delete process.env.JWT_SECRET;

        // Crea un payload
        const payload: JWTPayload = {
            userId: '12345',
        };

        // Genera el token con un secreto temporal
        process.env.JWT_SECRET = 'mi-secreto-de-prueba';
        const token = generateToken(payload);
        delete process.env.JWT_SECRET; // Elimina nuevamente el secreto

        // Verifica el JWT sin el secreto
        expect(() => verifyToken(token)).toThrowError('JWT_SECRET is not defined');
    });
});
