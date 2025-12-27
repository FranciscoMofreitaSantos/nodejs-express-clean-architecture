import {Result} from "../../core/logic/Result";
import {IClassroomDTO, IClassroomReadModelDTO} from "../../dto/classroomDTO";

export default interface IClassroomService {

    createClassroom(dto: IClassroomDTO): Promise<Result<IClassroomReadModelDTO>>;

    updateClassroom(dto: IClassroomDTO): Promise<Result<IClassroomReadModelDTO>>;

    getAll(): Promise<Result<IClassroomReadModelDTO[]>>;

    getByTeacherEmail(email: string): Promise<Result<IClassroomReadModelDTO[]>>;

    deleteClassroom(id: string): Promise<Result<void>>;

    addStudentsToClassroom(classroomId: string, studentIds: string[]): Promise<Result<IClassroomReadModelDTO>>;

    deleteStudentsFromClassroom(classroomId: string, studentIds: string[]): Promise<Result<IClassroomReadModelDTO>>;
}