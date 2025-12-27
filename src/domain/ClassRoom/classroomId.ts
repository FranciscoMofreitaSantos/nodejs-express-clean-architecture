import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class ClassroomId extends UniqueEntityID {
    private constructor (id?: string | number) {
        super(id);
    }

    public static create (id?: string | number): ClassroomId {
        return new ClassroomId(id);
    }
}