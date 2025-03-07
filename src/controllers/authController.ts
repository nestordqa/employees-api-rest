import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../config/jwt';
import { handleResponse } from '../utils/response';
import BlacklistToken from '../models/BlacklistToken';
import { JWTPayload } from '../types/jwt';

//User register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        //Desturcture of required fields. Just email and password are required
        const { email, password, firstName, lastName } = req.body;

        const exist = await User.findOne({ email });
        // Checks if user exists
        if (exist) {
            // The response is an error if the user exists
            handleResponse(res, false, null, 'This user alreary exist', 409);
            return;
        }

        const user = new User({ email, password, firstName, lastName });
        //Save the new user in the DB
        await user.save();

        //Generates a new JWT to return it
        const token = generateToken({
            id: user?.id,
            email: user.email,
            firstName: user?.firstName,
            lastName: user?.lastName
        } as JWTPayload);
        //Respond with a success register
        handleResponse(res, true, { token });
    } catch (error: any) {
        //Hnalde error
        handleResponse(res, false, null, error.message, 400);
    }
};

//User login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        //Destructure of request body
        const { email, password } = req.body;
        // Searching the user by email
        const user = await User.findOne({ email });

        if (!user) {
            //If user does not exist
            handleResponse(res, false, null, 'Invalid credentials', 401);
            return;
        }

        const isMatch = await user.comparePassword(password);

        //Checks if the password received is equal than the one in the DB
        if (!isMatch) {
            handleResponse(res, false, null, 'Invalid credentials', 401);
            return;
        }

        //Gnerates a new JWT
        const token = generateToken({
            id: user?.id,
            email: user.email,
            firstName: user?.firstName,
            lastName: user?.lastName
        } as JWTPayload);

        //Returns the logged user
        handleResponse(res, true, { token });
    } catch (error: any) {
        //Handle error
        handleResponse(res, false, null, error.message, 500);
    }
};

//User logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        //Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const blacklistedToken = new BlacklistToken({ token });
            //if token exist, put it into the blacklist for never use it again and disable it
            await blacklistedToken.save();
        }
        //Successfull logout
        handleResponse(res, true, null, 'Successful logout');
    } catch (error: any) {
        //Logout error
        handleResponse(res, false, null, error.message, 500);
    }
};
