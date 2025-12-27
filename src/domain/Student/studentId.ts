import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class StudentId extends UniqueEntityID {
    private constructor (id?: string | number) {
        super(id);
    }

    public static create (id?: string | number): StudentId {
        return new StudentId(id);
    }
}