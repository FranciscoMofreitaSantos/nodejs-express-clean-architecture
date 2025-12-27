import { Entity } from "../../core/domain/Entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import {Email} from "../Shared/email";


interface TeacherProps {
    name: string;
    email: Email;
}

export class Teacher extends Entity<TeacherProps> {
    get name(): string { return this.props.name; }
    get email(): Email { return this.props.email; }

    private constructor(props: TeacherProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: TeacherProps, id?: UniqueEntityID): Result<Teacher> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: 'name' },
            { argument: props.email, argumentName: 'email' }
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Teacher>(guardResult.message);
        }

        return Result.ok<Teacher>(new Teacher(props, id));
    }
}