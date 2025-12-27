import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { StudentId } from "./studentId";
import {Email} from "../Shared/email";

interface StudentProps {
    name: string;
    email: Email;
}

export class Student extends AggregateRoot<StudentProps> {
    get studentId (): StudentId {
        return StudentId.create(this._id.toValue());
    }

    get name (): string { return this.props.name; }
    get email (): Email { return this.props.email; }

    private constructor(props: StudentProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: StudentProps, id?: UniqueEntityID): Result<Student> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: 'name' },
            { argument: props.email, argumentName: 'email' }
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Student>(guardResult.message);
        }

        return Result.ok<Student>(new Student(props, id));
    }
}