import {Mapper} from "../core/infra/Mapper";
import {Student} from "../domain/Student/student";
import {IStudentDTO} from "../dto/studentDTO";
import {Email} from "../domain/Shared/email";
import {ClassroomId} from "../domain/ClassRoom/classroomId";
import {UniqueEntityID} from "../core/domain/UniqueEntityID";
import {IStudentPersistence} from "../schemas/studentSchema";

export default class StudentMapper extends Mapper<Student, IStudentDTO, IStudentPersistence> {

    toDomain(raw: IStudentPersistence): Student | null {
        const emailOrError = Email.create(raw.email);

        const studentOrError = Student.create({
            name: raw.name,
            email: emailOrError.getValue(),
            classroomId: raw.classroomId ? ClassroomId.create(raw.classroomId) : undefined
        }, new UniqueEntityID(raw.domainId));

        return studentOrError.isSuccess ? studentOrError.getValue() : null;
    }

    toDTO(domain: Student): IStudentDTO {
        return {
            id: domain.id.toString(),
            name: domain.name,
            email: domain.email.value,
            classroomId: domain.classroomId?.toString()
        };
    }

    toPersistence(domain: Student): IStudentPersistence {
        return {
            domainId: domain.id.toString(),
            name: domain.name,
            email: domain.email.value,
            classroomId: domain.classroomId?.toString()
        };
    }
}