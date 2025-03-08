import mongoose, { Schema } from "mongoose";

//Model for all token who the user can not use again
interface BlacklistToken extends Document {
    token: string;
    createdAt: Date;
}

const blacklistedTokenSchema: Schema = new Schema({
    token: { 
        type: String, 
        required: true, 
        unique: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: '1h' 
    },
});
  
export default mongoose.model<BlacklistToken>('BlacklistedToken', blacklistedTokenSchema);