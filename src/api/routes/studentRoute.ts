import {Router} from "express";
import {Container} from "typedi";
import {celebrate, Joi} from "celebrate";

import config from "../../config";
import CreateStudentController from "../../controllers/Student/createStudentController";
import UpdateStudentController from "../../controllers/Student/updateStudentController";
import DeleteStudentController from "../../controllers/Student/deleteStudentController";
import GetAllStudentsController from "../../controllers/Student/getAllStudentsController";
import GetStudentByEmailController from "../../controllers/Student/getStudentByEmailController";


const route = Router();

export default (app: Router) => {
    app.use("/student", route);

    const createCtrl = Container.get(config.controllers.student.create.name) as CreateStudentController;
    const updateCtrl = Container.get(config.controllers.student.update.name) as UpdateStudentController;
    const deleteCtrl = Container.get(config.controllers.student.delete.name) as DeleteStudentController;
    const getAllCtrl = Container.get(config.controllers.student.getAll.name) as GetAllStudentsController;
    const getByEmailCtrl = Container.get(config.controllers.student.getByEmail.name) as GetStudentByEmailController;


    route.post(
        "/",
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                classroomId: Joi.string().optional(),
            })
        }),
        (req, res) => createCtrl.execute(req, res)
    );


    route.put(
        "/:id",
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                classroomId: Joi.string().optional(),
            })
        }),
        (req, res) => updateCtrl.execute(req, res)
    );


    route.delete(
        "/:id",
        celebrate({
            params: Joi.object({
                id: Joi.string().required(),
            })
        }),
        (req, res) => deleteCtrl.execute(req, res)
    );

    route.get("/", (req, res) => getAllCtrl.execute(req, res));
    route.get("/search/email/:email", (req, res) => getByEmailCtrl.execute(req, res));
};