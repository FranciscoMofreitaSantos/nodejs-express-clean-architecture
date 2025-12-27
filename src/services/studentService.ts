import {Service, Inject} from 'typedi';
import {IStudentDTO} from "../dto/studentDTO";
import {Result} from "../core/logic/Result";
import {Email} from "../domain/Shared/email";
import {IStudentRepo} from "../domain/IRepos/studentRepo";
import {Student} from "../domain/Student/student";
import StudentMapper from "../mappers/studentMapper";
import IStudentService from "./IServices/IStudentService";

@Service()
export default class StudentService implements IStudentService {
    constructor(
        @Inject('studentRepo')
        private studentRepo: IStudentRepo,
        @Inject('studentMapper')
        private studentMapper: StudentMapper
    ) {
    }

    public async createStudent(dto: IStudentDTO): Promise<Result<IStudentDTO>> {
        const emailOrError = Email.create(dto.email);
        if (emailOrError.isFailure)
            return Result.fail<IStudentDTO>(emailOrError.errorValue().toString());

        const studentOrError = Student.create({
            name: dto.name,
            email: emailOrError.getValue()
        });

        if (studentOrError.isFailure)
            return Result.fail<IStudentDTO>(studentOrError.errorValue().toString());

        const student = studentOrError.getValue();
        await this.studentRepo.save(student);
        return Result.ok<IStudentDTO>(this.studentMapper.toDTO(student));
    }

    public async updateStudent(dto: IStudentDTO): Promise<Result<IStudentDTO>> {
        const student = await this.studentRepo.findById(dto.id);
        if (!student)
            return Result.fail<IStudentDTO>("Student not found.");

        const emailOrError = Email.create(dto.email);
        if (emailOrError.isFailure)
            return Result.fail<IStudentDTO>(emailOrError.errorValue().toString());

        student.changeName(dto.name);
        student.changeEmail(emailOrError.getValue());

        await this.studentRepo.save(student);
        return Result.ok<IStudentDTO>(this.studentMapper.toDTO(student));
    }

    public async getAll(): Promise<Result<IStudentDTO[]>> {
        const students = await this.studentRepo.findAll();
        return Result.ok<IStudentDTO[]>(students.map(s => this.studentMapper.toDTO(s)));
    }

    public async getByEmail(email: string): Promise<Result<IStudentDTO>> {
        const student = await this.studentRepo.findByEmail(email);
        if (!student) return Result.fail<IStudentDTO>("Student not found.");
        return Result.ok<IStudentDTO>(this.studentMapper.toDTO(student));
    }

    public async deleteStudent(id: string): Promise<Result<void>> {
        const deleted = await this.studentRepo.delete(id);
        return deleted ? Result.ok<void>() : Result.fail<void>("Error deleting.");
    }
}