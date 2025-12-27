import {Result} from "../../core/logic/Result";
import {IStudentDTO} from "../../dto/studentDTO";

export default interface IStudentService {
    createStudent(dto: IStudentDTO): Promise<Result<IStudentDTO>>;

    updateStudent(dto: IStudentDTO): Promise<Result<IStudentDTO>>;

    getAll(): Promise<Result<IStudentDTO[]>>;

    getByEmail(email: string): Promise<Result<IStudentDTO>>;

    deleteStudent(id: string): Promise<Result<void>>;
}