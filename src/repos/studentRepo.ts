import { Service, Inject } from 'typedi';
import { Model, Document } from 'mongoose';
import { IStudentRepo } from "../domain/IRepos/IStudentRepo";
import { Student } from "../domain/Student/student";
import StudentMapper from "../mappers/studentMapper";
import {IStudentPersistence} from "../schemas/studentSchema";
import {query} from "winston";
import {StudentId} from "../domain/Student/studentId";

@Service()
export default class StudentRepo implements IStudentRepo {
    constructor(
        @Inject('studentSchema')
        private studentModel: Model<IStudentPersistence & Document>,
        @Inject('studentMapper')
        private studentMapper: StudentMapper
    ) { }

    public async exists(student: Student): Promise<boolean> {
        const idX = student.id.toString();
        const res = await this.studentModel.findOne({ domainId: idX });
        return !!res;
    }

    public async save(student: Student): Promise<Student> {
        const studentId = student.id.toString();
        const studentEmail = student.email.value;

        const existsWithEmail = await this.studentModel.findOne({
            email: studentEmail,
            domainId: { $ne: studentId }
        });

        if (existsWithEmail) {
            throw new Error(`A student with email: ${studentEmail} already exists`);
        }

        const query = { domainId: studentId };
        const rawStudent = this.studentMapper.toPersistence(student);
        await this.studentModel.updateOne(query, rawStudent, { upsert: true });

        return student;
    }

    public async findByEmail(email: string): Promise<Student | null> {
        const userEntity = await this.studentModel.findOne({ email: email.toLowerCase() });
        return !!userEntity ? this.studentMapper.toDomain(userEntity) : null;
    }

    public async findAll(): Promise<Student[]> {
        const students = await this.studentModel.find();
        return students.map(s => this.studentMapper.toDomain(s)!);
    }

    public async delete(id: string): Promise<boolean> {
        const res = await this.studentModel.deleteOne({ domainId: id });
        return res.deletedCount > 0;
    }

    public async findById(id: string): Promise<Student | null> {
        const res = await this.studentModel.findOne({ domainId: id });
        return !!res ? this.studentMapper.toDomain(res) : null;
    }

    public async findByIds(ids: StudentId[] | string[]): Promise<Student[]> {
        const idStrings = ids.map(id => id.toString());

        const students = await this.studentModel.find({
            domainId: {
                $in: idStrings
            }
        });

        return students
            .map(s => this.studentMapper.toDomain(s))
            .filter(s => s !== null) as Student[];
    }


}