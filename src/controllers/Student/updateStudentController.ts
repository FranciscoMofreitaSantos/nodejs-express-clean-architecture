import {Service, Inject} from 'typedi';
import {BaseController} from "../../core/infra/BaseController";
import {IStudentDTO} from "../../dto/studentDTO";
import IStudentService from "../../services/IServices/IStudentService";

@Service()
export default class UpdateStudentController extends BaseController {
    constructor(
        @Inject('studentService')
        private studentService: IStudentService) {
        super();
    }

    protected async executeImpl(): Promise<any> {
        const dto = this.req.body as IStudentDTO;
        dto.id = this.req.params.id || dto.id;

        const result = await this.studentService.updateStudent(dto);

        if (result.isFailure) {
            return this.clientError(result.errorValue().toString());
        }

        return this.ok(this.res, result.getValue());
    }
}