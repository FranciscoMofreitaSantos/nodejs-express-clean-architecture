import mongoose from 'mongoose';
import {IStudentPersistence} from "../../schemas/studentSchema";


const StudentSchema = new mongoose.Schema(
    {

        domainId: {
            type: String,
            unique: true,
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            unique: true,
            required: true,
            index: true,
            lowercase: true,
            trim: true
        },

        classroomId: {
            type: String,
            required: false,
            default: null
        }
    },
    {
        timestamps: true
    }
);


export default mongoose.model<IStudentPersistence & mongoose.Document>('Student', StudentSchema);