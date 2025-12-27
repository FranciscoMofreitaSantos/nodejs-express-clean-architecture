import {Repo} from "../../core/infra/Repo";
import {Classroom} from "../ClassRoom/classroom";
import {ClassroomId} from "../ClassRoom/classroomId";
import {StudentId} from "../Student/studentId";
import {Email} from "../Shared/email";
import {Teacher} from "../ClassRoom/teacher";

export interface IClassroomRepo extends Repo<Classroom> {
    save(classroom: Classroom): Promise<Classroom>;

    findById(id: ClassroomId | string): Promise<Classroom | null>;

    findByTeacherEmail(email: Email | string): Promise<Classroom[]>;

    findByName(name: string): Promise<Classroom | null>;

    findAll(): Promise<Classroom[]>;

    delete(id: ClassroomId | string): Promise<boolean>;

    addStudentsToClassroom(id: ClassroomId | string, students: StudentId[] | string[]): Promise<Classroom>;

    deleteStudentsFromClassroom(id: ClassroomId | string, students: StudentId[] | string[]): Promise<boolean>;

    findAllTeachers() : Promise<Teacher[]>;
}