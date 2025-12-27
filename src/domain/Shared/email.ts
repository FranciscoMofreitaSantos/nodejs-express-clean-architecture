import {ValueObject} from "../../core/domain/ValueObject";
import {Guard} from "../../core/logic/Guard";
import {Result} from "../../core/logic/Result";


interface EmailProps {
    value: string;
}

export class Email extends ValueObject<EmailProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: EmailProps) {
        super(props);
    }

    private static isValidEmail(email: string): boolean {
        const re = /^[^\s@]+@nodeddd\.[^\s@.]+$/;
        return re.test(email);
    }

    public static create(email: string): Result<Email> {
        const guardResult = Guard.againstNullOrUndefined(email, 'email');

        if (!guardResult.succeeded) {
            return Result.fail<Email>(guardResult.message);
        }

        if (!this.isValidEmail(email)) {
            return Result.fail<Email>(`The email "${email}" is invalid. All emails should belong to domain @nodeddd`);
        }

        return Result.ok<Email>(new Email({ value: email.toLowerCase() }));
    }
}