import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../../src/models/User';

describe('User Model', () => {
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
        await mongoose.connection.db?.dropDatabase();
    });

    it('Should create and save user successfully', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        };

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe(userData.email.toLowerCase());
        expect(savedUser.firstName).toBe(userData.firstName);
        expect(savedUser.lastName).toBe(userData.lastName);
        expect(savedUser.password).not.toBe(userData.password);
    });

    it('Should require email and password', async () => {
        const user = new User({ firstName: 'John' });
        
        let error = null;
        try {
            await user.validate();
        } catch (err) {
            error = err;
        }
        
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error).toBeDefined();
    });

    it('Should enforce unique email constraint', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123'
        };

        // Creates the first user
        await new User(userData).save();
        
        // Tries to create a user with the same email
        let error = null;
        try {
            await new User(userData).save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
    });

    it('Should automatically lowercase and trim email', async () => {
        const user = await new User({
            email: '  TEST@EXAMPLE.COM  ',
            password: 'password123'
        }).save();

        expect(user.email).toBe('test@example.com');
    });

    it('Should hash password before saving', async () => {
            const password = 'password123';
            const user = await new User({
            email: 'test@example.com',
            password: password
        }).save();

        expect(user.password).not.toBe(password);
        expect(await bcrypt.compare(password, user.password)).toBe(true);
    });

    it('Should not re-hash password when updating other fields', async () => {
        const user = await new User({
            email: 'test@example.com',
            password: 'password123'
        }).save();

        const originalHash = user.password;
        user.firstName = 'Jane';
        const updatedUser = await user.save();

        expect(updatedUser.password).toBe(originalHash);
    });

    describe('ComparePassword', () => {
        it('Should return true for correct password', async () => {
            const password = 'password123';
            const user = await new User({
                email: 'test@example.com',
                password: password
            }).save();

            expect(await user.comparePassword(password)).toBe(true);
        });

        it('Should return false for incorrect password', async () => {
            const user = await new User({
                email: 'test@example.com',
                password: 'password123'
            }).save();

            expect(await user.comparePassword('wrongpassword')).toBe(false);
        });
    });
});
