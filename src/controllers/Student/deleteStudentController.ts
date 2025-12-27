import { Service, Inject } from 'typedi';
import { BaseController } from "../../core/infra/BaseController";
import IStudentService from "../../services/IServices/IStudentService";

@Service()
export default class DeleteStudentController extends BaseController {
    constructor(
        @Inject('studentService')
        private studentService: IStudentService) {
        super();
    }

    protected async executeImpl(): Promise<any> {
        const studentId = this.req.params.id;

        const result = await this.studentService.deleteStudent(studentId);

        if (result.isFailure) {
            return this.clientError(String(result.errorValue()));
        }

        return this.ok(this.res);
    }
}