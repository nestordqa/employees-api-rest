import { Request, Response } from "express";
import { handleResponse } from "../utils/response";
import Employee from "../models/Employee";

//Get all positions
export const getPositions = async (req: Request, res: Response) => {
    try {
        const url = process.env.POSITIONS_API_URL;
        if (!url) {
            //If url api rest does not exist, throws an error
            handleResponse(res, false, null, 'Positions API URL not found in .env file', 500);
            return;
        }
        const request = await fetch(url);
        if (request && request.status === 200) {
            //If the request is success, positions array
            const response = await request.json();
            handleResponse(res, true, response);
            return;
        }
        //If rquest fails
        handleResponse(res, false, null, `There was an error trying to get positions`, 500);
    } catch (error) {
        //If there is an error
        handleResponse(res, false, null, `There was an error: ${error}`, 500);
    }
};

//Create an employee
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, job_position, birthdate } = req.body;
        //Checks if employee already exists
        const exist = await Employee.findOne({
            firstName,
            lastName,
            job_position,
            birthdate
        });
        if (exist) {
            //If exist, returns an error
            handleResponse(res, false, null, 'This employee already exists', 409);    
            return;
        }
        const employee = new Employee({
            firstName,
            lastName,
            job_position,
            birthdate
        });
        //Create the new employee
        await employee.save();
        handleResponse(res, true, employee, null, 201);
        return;
    } catch (error) {
        //Throws an error if it fails
        handleResponse(res, false, null, `There was an error: ${error}`, 400);
        return;
    }
};

//Gets all employees
export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await Employee.find();
        //Returns all employees
        handleResponse(res, true, employees);
        return;
    } catch (error) {
        handleResponse(res, false, null, `There was an error: ${error}`, 500);
        return;
    }
};

//Gets employee by id
export const getEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            //If employee does not exist, return an error
            handleResponse(res, false, null, 'Employee not found', 404);
            return;
        }
        //returns the selected employee
        handleResponse(res, true, employee);
    } catch (error) {
        handleResponse(res, false, null, `There was an error: ${error}`, 500);
        return;
    }
};

//Update an employee  
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!employee) {
            //If the employee does not exist, throws an error
            handleResponse(res, false, null, 'Employee not found', 404);
            return;
        }
        // returns the updated employee
        handleResponse(res, true, employee);
        return;
    } catch (error) {
        handleResponse(res, false, null, `There was an error: ${error}`, 400);
        return;
    }
};
  
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            handleResponse(res, false, null, 'ID is required', 404);
            return;
        }
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            //If the employee does not exist, throws an error
            handleResponse(res, false, null, 'Employee not found', 404);
            return;
        }
        //Returns a success when user is deleted
        handleResponse(res, true, null, 'Employe deleted');
        return;
    } catch (error) {
        handleResponse(res, false, null, `There was an error: ${error}`, 500);
        return;
    }
};
