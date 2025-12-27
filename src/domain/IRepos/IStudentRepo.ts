import {Student} from "../Student/student";
import {Repo} from "../../core/infra/Repo";
import {StudentId} from "../Student/studentId";
import {Email} from "../Shared/email";

export interface IStudentRepo extends Repo<Student> {
    save(student: Student): Promise<Student>;
    findByEmail(email: Email | string): Promise<Student | null>;
    findById(id: StudentId | string): Promise<Student | null>;
    findByIds(ids: StudentId[] | string[]) : Promise<Student[]>;
    findAll(): Promise<Student[]>;
    delete(id: StudentId | string): Promise<boolean>;
}