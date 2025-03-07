import { Response } from 'express';
import { ResponseObject } from '../../src/types/response';
import { handleResponse } from '../../src/utils/response';

describe('handleResponse', () => {
    let res: Partial<Response>;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('Should return a successful response', () => {
        const data = { message: 'Success' };
        const expectedResponse: ResponseObject<typeof data> = {
            success: true,
            data,
        };

        handleResponse(res as Response, true, data);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('Should return a successful response without data', () => {
        const expectedResponse: ResponseObject<null> = {
            success: true,
        };

        handleResponse(res as Response, true);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('Should return an error response', () => {
        const errorMessage = 'An error occurred';
        const expectedResponse: ResponseObject<null> = {
            success: false,
            error: errorMessage,
        };

        handleResponse(res as Response, false, null, errorMessage);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('Should return a response with a custom status code', () => {
        const data = { message: 'Created' };
        const expectedResponse: ResponseObject<typeof data> = {
            success: true,
            data,
        };
        const statusCode = 201;

        handleResponse(res as Response, true, data, null, statusCode);

        expect(res.status).toHaveBeenCalledWith(statusCode);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
});
