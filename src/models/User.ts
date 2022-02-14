import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: string;
    hashPassword: (reqPassword: string) => string;
    vaidateEmail: (reqEmail: string) => boolean;
    verifyPassword: (reqPassword: string) => boolean;
    tokenCount: number;
}

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'email required'],
            unique: [true, 'email already exists'],
        },
        name: {
            type: String,
            required: [true, 'name required'],
        },
        password: {
            type: String,
            required: [true, 'password required'],
        },
        role: {
            type: String,
        },
        tokenCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

UserSchema.methods.hashPassword = function hashPassword(reqPassword) {
    return bcrypt.hashSync(reqPassword, 10);
};

UserSchema.methods.verifyPassword = function verifyPassword(reqPassword) {
    return bcrypt.compareSync(reqPassword, this.password);
};

export default model<IUser>('User', UserSchema);
