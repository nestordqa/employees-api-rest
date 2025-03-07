import { Response } from 'express';
import { ResponseObject } from '../types/response';

const handleResponse = <T>(
    res: Response,
    success: boolean,
    data: T | null = null,
    error: string | null = null,
    statusCode: number = 200
): void => {
    const response: ResponseObject<T> = { success };
    if (data) response.data = data;
    if (error) response.error = error;
    res.status(statusCode).json(response);
};

export { handleResponse };
