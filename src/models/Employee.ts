import mongoose, { Document, Schema } from "mongoose";

//Model for employees
interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    job_position: string;
    birthdate: Date;
}

const employeeSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    job_position: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    }
});

export default mongoose.model<IEmployee>('Employee', employeeSchema);