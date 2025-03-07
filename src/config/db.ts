import mongoose from "mongoose";

//DB Conenction
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error) {
        console.error('There was an error trying to connect to the DB: ', error);
        process.exit(1); // Exit from the API if it fails
    }
};

export default connectDB;