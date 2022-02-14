import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IRole extends mongoose.Document {
    type: string;
    name: string;
}

const RoleSchema = new Schema(
    {
        type: {
            type: String,
            required: [true],
            unique: [true],
        },
        name: {
            type: String,
            required: [true],
            unique: [true],
        },
    },
    { timestamps: true }
);

export default mongoose.model<IRole>('Role', RoleSchema);
