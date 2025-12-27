import { Router } from 'express';
import studentRoute from "./routes/studentRoute";

export default () => {
    const app = Router();

    studentRoute(app);


    return app;
}