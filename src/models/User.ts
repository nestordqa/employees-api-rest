import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';

//Model for users
interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
});

// Hook for hashing password before save it
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method for password compare
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
