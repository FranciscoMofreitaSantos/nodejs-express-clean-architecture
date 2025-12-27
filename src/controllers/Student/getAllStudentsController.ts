// src/controllers/student/getAllStudentsController.ts
import { Service, Inject } from 'typedi';
import { BaseController } from "../../core/infra/BaseController";
import IStudentService from "../../services/IServices/IStudentService";

@Service()
export default class GetAllStudentsController extends BaseController {
    constructor(
        @Inject('studentService')
        private studentService: IStudentService) {
        super();
    }

    protected async executeImpl(): Promise<any> {
        const result = await this.studentService.getAll();

        if (result.isFailure) {
            return this.clientError(result.errorValue().toString());
        }

        return this.ok(this.res, result.getValue());
    }
}