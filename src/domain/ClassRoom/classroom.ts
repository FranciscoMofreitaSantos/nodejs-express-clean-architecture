import {ClassroomStudentList} from "./classroomStudentList";
import {ClassroomId} from "./classroomId";
import {Teacher} from "./teacher";
import {AggregateRoot} from "../../core/domain/AggregateRoot";
import {StudentId} from "../Student/studentId";
import {UniqueEntityID} from "../../core/domain/UniqueEntityID";
import {Result} from "../../core/logic/Result";
import {Guard} from "../../core/logic/Guard";
import {Email} from "../Shared/email";


interface ClassroomProps {
    name: string;
    students: ClassroomStudentList;
    teacher: Teacher;
}

export class Classroom extends AggregateRoot<ClassroomProps> {


    get classroomId (): ClassroomId {
        return ClassroomId.create(this._id.toValue());
    }

    get name(): string {
        return this.props.name;
    }

    get students(): ClassroomStudentList {
        return this.props.students;
    }

    get teacher(): Teacher {
        return this.props.teacher;
    }

    private constructor(props: ClassroomProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public addStudent(studentId: StudentId): void {
        this.props.students.add(studentId);
    }

    public removeStudent(studentId: StudentId): void {
        this.props.students.remove(studentId);
    }

    public updateName(name: string): void {
        this.props.name = name;
    }


    public updateTeacherName(name: string): void {
        const newTeacher = Teacher.create({
            name: name,
            email: this.props.teacher.email
        }).getValue();

        this.props.teacher = newTeacher;
    }

    public updateTeacherEmail(email: Email): void {
        const newTeacher = Teacher.create({
            name: this.props.teacher.name,
            email: email
        }).getValue();

        this.props.teacher = newTeacher;
    }

    public static create(props: ClassroomProps, id?: UniqueEntityID): Result<Classroom> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            {argument: props.name, argumentName: 'name'},
            {argument: props.teacher, argumentName: 'teacher'}
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Classroom>(guardResult.message);
        }

        const classroom = new Classroom({
            ...props,
            students: props.students ? props.students : ClassroomStudentList.create([])
        }, id);

        return Result.ok<Classroom>(classroom);
    }
}
