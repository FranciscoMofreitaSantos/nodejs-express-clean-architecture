import { Inject, Service } from "typedi";
import { Document, Model } from "mongoose";
import { IClassroomRepo } from "../domain/IRepos/IClassroomRepo";
import { IClassroomPersistence } from "../schemas/classroomSchema";
import ClassroomMapper from "../mappers/classroomMapper";
import { ClassroomId } from "../domain/ClassRoom/classroomId";
import { StudentId } from "../domain/Student/studentId";
import { Classroom } from "../domain/ClassRoom/classroom";
import { Email } from "../domain/Shared/email";
import {Teacher} from "../domain/ClassRoom/teacher";

@Service()
export default class ClassroomRepo implements IClassroomRepo {
    constructor(
        @Inject('classroomSchema')
        private classroomModel: Model<IClassroomPersistence & Document>,
        @Inject('classroomMapper')
        private classroomMapper: ClassroomMapper
    ) {}


    public async exists(classroom: Classroom): Promise<boolean> {
        const idX = classroom.id.toString();
        const res = await this.classroomModel.findOne({ domainId: idX });
        return !!res;
    }


    public async save(classroom: Classroom): Promise<Classroom> {
        const query = { domainId: classroom.id.toString() };
        const rawClassroom = this.classroomMapper.toPersistence(classroom);

        await this.classroomModel.updateOne(query, rawClassroom, { upsert: true });

        return classroom;
    }


    public async findById(id: ClassroomId | string): Promise<Classroom | null> {
        const idX = id instanceof ClassroomId ? id.toString() : id;
        const res = await this.classroomModel.findOne({ domainId: idX });

        return !!res ? this.classroomMapper.toDomain(res) : null;
    }


    public async findAll(): Promise<Classroom[]> {
        const res = await this.classroomModel.find();
        return res.map(item => this.classroomMapper.toDomain(item));
    }


    public async findByTeacherEmail(email: Email | string): Promise<Classroom[] | null> {
        const emailStr = email instanceof Email ? email.value : email;

        const res = await this.classroomModel.find({ "teacher.email": emailStr.toLowerCase() });

        return res.length > 0 ? res.map(item => this.classroomMapper.toDomain(item)) : null;
    }


    public async delete(id: ClassroomId | string): Promise<boolean> {
        const idX = id instanceof ClassroomId ? id.toString() : id;
        const res = await this.classroomModel.deleteOne({ domainId: idX });
        return res.deletedCount > 0;
    }


    public async addStudentsToClassroom(id: ClassroomId | string, students: StudentId[] | string[]): Promise<Classroom> {
        const idX = id instanceof ClassroomId ? id.toString() : id;
        const studentIds = students.map(s => s.toString());

        const updated = await this.classroomModel.findOneAndUpdate(
            { domainId: idX },
            { $addToSet: { students: { $each: studentIds } } },
            { new: true }
        );

        if (!updated) throw new Error("Classroom not found");
        return this.classroomMapper.toDomain(updated);
    }


    public async deleteStudentsFromClassroom(id: ClassroomId | string, students: StudentId[] | string[]): Promise<boolean> {
        const idX = id instanceof ClassroomId ? id.toString() : id;
        const studentIds = students.map(s => s.toString());

        const res = await this.classroomModel.updateOne(
            { domainId: idX },
            { $pull: { students: { $in: studentIds } } }
        );

        return res.modifiedCount > 0;
    }


    public async findAllTeachers(): Promise<Teacher[]> {
        const classroomsRaw = await this.classroomModel.find();
        const teachersMap = new Map<string, any>();

        classroomsRaw.forEach(raw => {
            if (raw.teacher && raw.teacher.email) {
                const email = raw.teacher.email.toLowerCase();
                if (!teachersMap.has(email)) {
                    teachersMap.set(email, {
                        name: raw.teacher.name,
                        email: raw.teacher.email
                    });
                }
            }
        });

        return Array.from(teachersMap.values());
    }


    public async findByName(name: string): Promise<Classroom | null> {
        const res = await this.classroomModel.findOne({ name: name });
        return !!res ? this.classroomMapper.toDomain(res) : null;
    }

}