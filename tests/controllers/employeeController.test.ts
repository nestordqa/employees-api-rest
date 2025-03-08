import { Request, Response } from 'express';
import * as employeeControllers from '../../src/controllers/employeeController';
import Employee from '../../src/models/Employee';
import { handleResponse } from '../../src/utils/response';

// Mock de las dependencias
jest.mock('../../src/models/Employee');
jest.mock('../../src/utils/response');

const mockRequest = (body: any = {}, params: any = {}) => ({
    body,
    params
} as Request);

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
};

describe('Employees Controllers', () => {
    let res: Response;

    beforeEach(() => {
        jest.clearAllMocks();
        res = mockResponse();
    });

    describe('createEmployee', () => {
        it('Should create a new employee successfully', async () => {
            const req = mockRequest({
                firstName: 'Nestor',
                lastName: 'Quinones',
                job_position: 'Fullstack Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            });
        
            (Employee.findOne as jest.Mock).mockResolvedValue(null);
            (Employee.prototype.save as jest.Mock).mockResolvedValue(req.body);
        
            await employeeControllers.createEmployee(req, res);
        
            expect(Employee.findOne).toHaveBeenCalledWith({
                firstName: 'Nestor',
                lastName: 'Quinones',
                job_position: 'Fullstack Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            });
            expect(Employee.prototype.save).toHaveBeenCalled();
        });

        it('Should handle existing employee', async () => {
            const req = mockRequest({
                firstName: 'Nestor',
                lastName: 'Quinones',
                job_position: 'Fullstack Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            });

            (Employee.findOne as jest.Mock).mockResolvedValue(req.body);

            await employeeControllers.createEmployee(req, res);

            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                'This employee already exists',
                409
            );
        });

        it('Should handle errors during employee creation', async () => {
            const req = mockRequest({
                firstName: 'Nestor',
                lastName: 'Quinones',
                job_position: 'Fullstack Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            });

            (Employee.findOne as jest.Mock).mockResolvedValue(null);
            (Employee.prototype.save as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await employeeControllers.createEmployee(req, res);

            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                'There was an error: Error: DB Error',
                400
            );
        });
    });

    describe('getEmployees', () => {
        it('Should return all employees successfully', async () => {
            const req = mockRequest();
            const mockEmployees = [{ id: '1', firstName: 'John' }, { id: '2', firstName: 'Jane' }];
            
            (Employee.find as jest.Mock).mockResolvedValue(mockEmployees);

            await employeeControllers.getEmployees(req, res);

            expect(handleResponse).toHaveBeenCalledWith(res, true, mockEmployees);
        });

        it('Should handle errors during fetching employees', async () => {
            const req = mockRequest();
            
            (Employee.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await employeeControllers.getEmployees(req, res);

            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                'There was an error: Error: DB Error',
                500
            );
        });
    });

    describe('getEmployee', () => {
        it('Should return an employee by ID successfully', async () => {
            const req = mockRequest({}, { id: '123' });
            const mockEmployee = { id: '123', firstName: 'Nestor' };

            (Employee.findById as jest.Mock).mockResolvedValue(mockEmployee);

            await employeeControllers.getEmployee(req, res);

            expect(handleResponse).toHaveBeenCalledWith(res, true, mockEmployee);
        });

        it('Should handle employee not found', async () => {
            const req = mockRequest({}, { id: '123' });

            (Employee.findById as jest.Mock).mockResolvedValue(null);

            await employeeControllers.getEmployee(req, res);

            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                'Employee not found',
                404
            );
        });

        it('Should handle errors during fetching an employee', async () => {
            const req = mockRequest({}, { id: '123' });

            (Employee.findById as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await employeeControllers.getEmployee(req, res);

            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                'There was an error: Error: DB Error',
                500
            );
        });
    });

    describe('updateEmployee', () => {
        it('Should update an existing employee successfully', async () => {
            const req = mockRequest({
                firstName: "Messi"
            }, { id: "123" });
          
            const updatedMockEmployee = { id: "123", firstName: "Messi" };
            
            (Employee.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedMockEmployee);
            
            await employeeControllers.updateEmployee(req, res);
            
            expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {
                new: true,
                runValidators: true
            });
            expect(handleResponse).toHaveBeenCalledWith(res, true, updatedMockEmployee);
        });
    
        it("Should handle employee not found during update", async () => {
            const req = mockRequest({}, { id: "123" });
    
            (Employee.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    
            await employeeControllers.updateEmployee(req, res);
    
            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                "Employee not found",
                404
            );
        });
    
        it("Should handle errors during update", async () => {
            const req = mockRequest({}, { id: "123" });
    
            (Employee.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error("DB Error"));
    
            await employeeControllers.updateEmployee(req, res);
    
            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                "There was an error: Error: DB Error",
                400
            );
        });
  });

    describe('deleteEmployee', () => {
        it('Should delete an existing employee successfully', async () => {
            const req = mockRequest({}, { id: "123" });
    
            (Employee.findByIdAndDelete as jest.Mock).mockResolvedValue({ id: "123" });
    
            await employeeControllers.deleteEmployee(req, res);
    
            expect(Employee.findByIdAndDelete).toHaveBeenCalledWith("123");
            expect(handleResponse).toHaveBeenCalledWith(res, true, null, "Employe deleted");
        });
    
        it("Should handle ID not provided", async () => {
            const req = mockRequest({}, {});
    
            await employeeControllers.deleteEmployee(req, res);
    
            expect(handleResponse).toHaveBeenCalledWith(res, false, null, "ID is required", 404);
        });
    
        it("Should handle employee not found during delete", async () => {
            const req = mockRequest({}, { id: "123" });
    
            (Employee.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    
            await employeeControllers.deleteEmployee(req, res);
    
            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                "Employee not found",
                404
            );
        });
    
        it("Should handle errors during delete", async () => {
            const req = mockRequest({}, { id: "123" });
    
            (Employee.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error("DB Error"));
    
            await employeeControllers.deleteEmployee(req, res);
    
            expect(handleResponse).toHaveBeenCalledWith(
                res,
                false,
                null,
                "There was an error: Error: DB Error",
                500
            );
        });
    });
});
