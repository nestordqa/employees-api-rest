import mongoose from 'mongoose';
import connectDB from '../../src/config/db'; // Importa la función desde tu archivo

jest.mock('mongoose', () => ({
    connect: jest.fn(),
    connection: {
        readyState: 1, // Estado de conexión exitosa
    },
}));

describe('connectDB', () => {
    beforeEach(() => {
        // Reinicia el mock antes de cada test
        jest.resetAllMocks();
    });

    it('Must connect correctly to the DB', async () => {
        // DB URL
        process.env.MONGODB_URI = 'mongodb://localhost:27017/employees';

        (mongoose.connect as jest.Mock).mockResolvedValueOnce({
            connection: {
                readyState: 1, // Success status conection
            },
        });

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledTimes(1);
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI); // Verifies the URI
    });

    it('Must handle errors when connection fails', async () => {
        // Forcing an error
        (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Error de conexión'));

        const consoleErrorSpy = jest.spyOn(console, 'error');
        const processExitSpy = jest.spyOn(process, 'exit');
        processExitSpy.mockImplementation((code) => {
            throw new Error(`process.exit(${code}) was called`);
        });

        await expect(connectDB()).rejects.toThrowError('process.exit(1) was called');

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(processExitSpy).toHaveBeenCalledTimes(1);
        expect(processExitSpy).toHaveBeenCalledWith(1);

        consoleErrorSpy.mockRestore();
        processExitSpy.mockRestore();
    });
});
