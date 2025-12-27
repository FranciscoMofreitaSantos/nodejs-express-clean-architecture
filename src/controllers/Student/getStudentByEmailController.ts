import { Service, Inject } from 'typedi';
import { BaseController } from "../../core/infra/BaseController";
import IStudentService from "../../services/IServices/IStudentService";

@Service()
export default class GetStudentByEmailController extends BaseController {
    constructor(
        @Inject('studentService')
        private studentService: IStudentService) {
        super();
    }

    protected async executeImpl(): Promise<any> {
        const email = this.req.params.email;

        const result = await this.studentService.getByEmail(email);

        if (result.isFailure) {
            return this.notFound(result.errorValue().toString());
        }

        return this.ok(this.res, result.getValue());
    }
}