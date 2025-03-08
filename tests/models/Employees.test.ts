import mongoose from 'mongoose';
import Employee from '../../src/models/Employee';

describe('Employee Model', () => {
    beforeAll(async () => {
        // DB Connect before all
        await mongoose.connect('mongodb://localhost:27017/employees');
    });

    afterAll(async () => {
        // Disconnect db after all test
        await mongoose.disconnect();
    });

    afterEach(async () => {
        // Clean DB After each test
        await Employee.deleteMany({});
    });

    describe('Validations', () => {
        it('firstName required', async () => {
            const employee = new Employee({
                lastName: 'Wayne',
                job_position: 'Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            });

            let error = null;
            try {
                await employee.validate();
            } catch (err) {
                error = err;
            }
            
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error).toBeDefined();
        });

        it('lastName required', async () => {
            const employee = new Employee({
                firstName: 'Bruce',
                job_position: 'Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            });

            let error = null;
            try {
                await employee.validate();
            } catch (err) {
                error = err;
            }
            
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error).toBeDefined();
        });

        it('job_position required', async () => {
            const employee = new Employee({
                firstName: 'Bruce',
                lastName: 'Wayne',
                birthdate: '1996-05-31T00:00:00.000Z'
            });

            let error = null;
            try {
                await employee.validate();
            } catch (err) {
                error = err;
            }
            
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error).toBeDefined();
        });

        it('birthdate required', async () => {
            const employee = new Employee({
                firstName: 'Bruce',
                lastName: 'Wayne',
                job_position: 'Developer'
            });

            let error = null;
            try {
                await employee.validate();
            } catch (err) {
                error = err;
            }
            
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error).toBeDefined();
        });

        it('Should validate the type of birthdate', async () => {
            const employee = new Employee({
                firstName: 'John',
                lastName: 'Doe',
                job_position: 'Developer',
                birthdate: 'invalid-date'
            });

            let error = null;
            try {
                await employee.validate();
            } catch (err) {
                error = err;
            }
            
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error).toBeDefined();
        });
    });

    describe('CRUD Flow', () => {
        it('Should create and save a new employee', async () => {
            const employeeData = {
                firstName: 'Néstor',
                lastName: 'Quiñones',
                job_position: 'Fullstack Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            };

            const employee = new Employee(employeeData);
            const savedEmployee = await employee.save();

            expect(savedEmployee._id).toBeDefined();
            expect(savedEmployee.firstName).toBe(employeeData.firstName);
            expect(savedEmployee.lastName).toBe(employeeData.lastName);
            expect(savedEmployee.job_position).toBe(employeeData.job_position);
        });

        it('Should update a employee', async () => {
            const employee = await new Employee({
                firstName: 'Clark',
                lastName: 'Kent',
                job_position: 'Developer',
                birthdate: '1996-05-31T00:00:00.000Z'
            }).save();

            const updated = await Employee.findByIdAndUpdate(
                employee._id,
                { job_position: 'Senior Developer' },
                { new: true }
            );

            expect(updated?.job_position).toBe('Senior Developer');
        });

        it('Should delete a employee', async () => {
            const employee = await new Employee({
                firstName: 'Clark',
                lastName: 'Kent',
                job_position: 'Developer',
                birthdate: new Date('1990-01-01')
            }).save();

            await Employee.findByIdAndDelete(employee._id);
            const found = await Employee.findById(employee._id);
            
            expect(found).toBeNull();
        });
    });
});
