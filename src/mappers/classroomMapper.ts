import {Mapper} from "../core/infra/Mapper";
import {Classroom} from "../domain/ClassRoom/classroom";
import {IClassroomDTO} from "../dto/classroomDTO";
import {ClassroomStudentList} from "../domain/ClassRoom/classroomStudentList";
import {StudentId} from "../domain/Student/studentId";
import {Teacher} from "../domain/ClassRoom/teacher";
import {Email} from "../domain/Shared/email";
import {UniqueEntityID} from "../core/domain/UniqueEntityID";
import {IClassroomPersistence} from "../schemas/classroomSchema";

export default class ClassroomMapper extends Mapper<Classroom, IClassroomDTO, IClassroomPersistence> {

    toDomain(raw: IClassroomPersistence): Classroom | null {
        const teacherEmail = Email.create(raw.teacher.email).getValue();
        const teacher = Teacher.create({
            name: raw.teacher.name,
            email: teacherEmail
        }).getValue();


        const studentIds = raw.students.map(id => StudentId.create(id));
        const studentsList = ClassroomStudentList.create(studentIds);


        const classroomOrError = Classroom.create({
            name: raw.name,
            teacher: teacher,
            students: studentsList
        }, new UniqueEntityID(raw.domainId));

        return classroomOrError.isSuccess ? classroomOrError.getValue() : null;
    }

    toDTO(domain: Classroom): IClassroomDTO {
        return {
            id: domain.id.toString(),
            name: domain.name,
            teacher: {
                name: domain.teacher.name,
                email: domain.teacher.email.value
            },
            students: domain.students.getItems().map(id => id.toString())
        };
    }

    toPersistence(domain: Classroom): IClassroomPersistence {
        return {
            domainId: domain.id.toString(),
            name: domain.name,
            teacher: {
                name: domain.teacher.name,
                email: domain.teacher.email.value
            },
            students: domain.students.getItems().map(id => id.toString())
        };
    }
}