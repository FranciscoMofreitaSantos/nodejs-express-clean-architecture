import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { ClassroomStudentList } from "./classroomStudentList";
import { ClassroomId } from "./classroomId";
import { Teacher } from "./teacher";

interface ClassroomProps {
    name: string;
    students: ClassroomStudentList;
    teacher: Teacher;
}

export class Classroom extends AggregateRoot<ClassroomProps> {

    get classroomId (): ClassroomId {
        return ClassroomId.create(this._id.toValue());
    }

    get name (): string { return this.props.name; }
    get students (): ClassroomStudentList { return this.props.students; }
    get teacher (): Teacher { return this.props.teacher; }

    private constructor(props: ClassroomProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ClassroomProps, id?: UniqueEntityID): Result<Classroom> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: 'name' },
            { argument: props.teacher, argumentName: 'teacher' }
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