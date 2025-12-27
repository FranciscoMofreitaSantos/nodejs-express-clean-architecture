// src/services/classroomService.ts
import { Inject, Service } from "typedi";
import { IClassroomRepo } from "../domain/IRepos/IClassroomRepo";
import { IStudentRepo } from "../domain/IRepos/IStudentRepo";
import StudentMapper from "../mappers/studentMapper";
import ClassroomMapper from "../mappers/classroomMapper";
import IClassroomService from "./IServices/IClassroomService";
import { Result } from "../core/logic/Result";
import { IClassroomDTO, IClassroomReadModelDTO } from "../dto/classroomDTO";
import { Classroom } from "../domain/ClassRoom/classroom";
import { Teacher } from "../domain/ClassRoom/teacher";
import { Email } from "../domain/Shared/email";
import { ClassroomStudentList } from "../domain/ClassRoom/classroomStudentList";

@Service()
export default class ClassroomService implements IClassroomService {
    constructor(
        @Inject('classroomRepo') private classroomRepo: IClassroomRepo,
        @Inject('studentRepo') private studentRepo: IStudentRepo,
        @Inject('classroomMapper') private classroomMapper: ClassroomMapper,
        @Inject('studentMapper') private studentMapper: StudentMapper
    ) {}

    public async createClassroom(dto: IClassroomDTO): Promise<Result<IClassroomReadModelDTO>> {
        const nameExists = await this.classroomRepo.findByName(dto.name);
        if (nameExists) return Result.fail<IClassroomReadModelDTO>(`Classroom name ${dto.name} already exists`);

        const teacherEmailExists = await this.classroomRepo.findTeacherByEmail(dto.teacher.email);
        if (teacherEmailExists) return Result.fail<IClassroomReadModelDTO>(`Teacher with email ${dto.teacher.email} already exists`);

        const teacherOrError = Teacher.create({
            name: dto.teacher.name,
            email: Email.create(dto.teacher.email).getValue()
        });
        if (teacherOrError.isFailure) return Result.fail<IClassroomReadModelDTO>(teacherOrError.errorValue().toString());

        const classroomOrError = Classroom.create({
            name: dto.name,
            teacher: teacherOrError.getValue(),
            students: ClassroomStudentList.create([])
        });
        if (classroomOrError.isFailure) return Result.fail<IClassroomReadModelDTO>(classroomOrError.errorValue().toString());

        const classroom = classroomOrError.getValue();

        if (dto.students && dto.students.length > 0) {
            const students = await this.studentRepo.findByIds(dto.students);
            if (students.length !== dto.students.length) return Result.fail<IClassroomReadModelDTO>("One or more student IDs are invalid");

            for (const student of students) {
                if (student.classroomId) return Result.fail<IClassroomReadModelDTO>(`Student ${student.name} already in a classroom`);
                student.assignToClassroom(classroom.id);
                classroom.addStudent(student.id);
                await this.studentRepo.save(student);
            }
        }

        await this.classroomRepo.save(classroom);
        const resultDTO = await this.getReadModel(classroom);
        return Result.ok<IClassroomReadModelDTO>(resultDTO);
    }

    public async addStudentsToClassroom(classroomId: string, studentIds: string[]): Promise<Result<IClassroomReadModelDTO>> {
        const classroom = await this.classroomRepo.findById(classroomId);
        if (!classroom) return Result.fail<IClassroomReadModelDTO>("Classroom not found");

        const students = await this.studentRepo.findByIds(studentIds);
        if (students.length !== studentIds.length) return Result.fail<IClassroomReadModelDTO>("One or more students not found");

        for (const student of students) {
            if (student.classroomId && student.classroomId.toString() !== classroomId) {
                return Result.fail<IClassroomReadModelDTO>(`Student ${student.name} already belongs to another classroom`);
            }

            student.assignToClassroom(classroom.id);
            classroom.addStudent(student.id);
            await this.studentRepo.save(student);
        }

        await this.classroomRepo.save(classroom);
        const resultDTO = await this.getReadModel(classroom);
        return Result.ok<IClassroomReadModelDTO>(resultDTO);
    }

    public async deleteStudentsFromClassroom(classroomId: string, studentIds: string[]): Promise<Result<IClassroomReadModelDTO>> {
        const classroom = await this.classroomRepo.findById(classroomId);
        if (!classroom) return Result.fail<IClassroomReadModelDTO>("Classroom not found");

        const students = await this.studentRepo.findByIds(studentIds);

        for (const student of students) {
            student.removeFromClassroom();
            classroom.removeStudent(student.id);
            await this.studentRepo.save(student);
        }

        await this.classroomRepo.save(classroom);
        const resultDTO = await this.getReadModel(classroom);
        return Result.ok<IClassroomReadModelDTO>(resultDTO);
    }

    public async getAll(): Promise<Result<IClassroomReadModelDTO[]>> {
        const classrooms = await this.classroomRepo.findAll();
        const results = await Promise.all(classrooms.map(c => this.getReadModel(c)));
        return Result.ok<IClassroomReadModelDTO[]>(results);
    }

    public async getByTeacherEmail(email: string): Promise<Result<IClassroomReadModelDTO[]>> {
        const classrooms = await this.classroomRepo.findByTeacherEmail(email);
        if (!classrooms) return Result.ok<IClassroomReadModelDTO[]>([]);

        const results = await Promise.all(classrooms.map(c => this.getReadModel(c)));
        return Result.ok<IClassroomReadModelDTO[]>(results);
    }

    public async updateClassroom(dto: IClassroomDTO): Promise<Result<IClassroomReadModelDTO>> {
        const classroom = await this.classroomRepo.findById(dto.id);
        if (!classroom) return Result.fail<IClassroomReadModelDTO>("Classroom not found");

        if (dto.name !== classroom.name) {
            const nameExists = await this.classroomRepo.findByName(dto.name);
            if (nameExists) {
                return Result.fail<IClassroomReadModelDTO>(`Classroom name "${dto.name}" already exists`);
            }
            classroom.updateName(dto.name);
        }

        if (dto.teacher.email !== classroom.teacher.email.value) {
            const teacherEmailExists = await this.classroomRepo.findTeacherByEmail(dto.teacher.email);
            if (teacherEmailExists) {
                return Result.fail<IClassroomReadModelDTO>(`Teacher with email "${dto.teacher.email}" is already assigned to another classroom`);
            }

            const emailOrError = Email.create(dto.teacher.email);
            if (emailOrError.isFailure) return Result.fail<IClassroomReadModelDTO>(emailOrError.errorValue().toString());

            classroom.updateTeacherEmail(emailOrError.getValue());
        }

        if (dto.teacher.name !== classroom.teacher.name) {
            classroom.updateTeacherName(dto.teacher.name);
        }

        await this.classroomRepo.save(classroom);

        const resultDTO = await this.getReadModel(classroom);
        return Result.ok<IClassroomReadModelDTO>(resultDTO);
    }

    public async deleteClassroom(id: string): Promise<Result<void>> {
        const classroom = await this.classroomRepo.findById(id);
        if (!classroom) return Result.fail<void>("Classroom not found");

        const studentIds = classroom.students.getItems().map(id => id.toString());
        const students = await this.studentRepo.findByIds(studentIds);

        for (const student of students) {
            student.removeFromClassroom();
            await this.studentRepo.save(student);
        }

        const success = await this.classroomRepo.delete(id);
        return success ? Result.ok<void>() : Result.fail<void>("Error deleting classroom");
    }

    private async getReadModel(classroom: Classroom): Promise<IClassroomReadModelDTO> {
        const studentIds = classroom.students.getItems().map(id => id.toString());
        const students = await this.studentRepo.findByIds(studentIds);
        const studentsDTOs = students.map(s => this.studentMapper.toDTO(s));
        return ClassroomMapper.toReadModelDTO(classroom, studentsDTOs);
    }
}