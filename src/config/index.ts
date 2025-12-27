import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";

const envPath = path.resolve(process.cwd(), `.env.${env}`);

const result = dotenv.config({path: envPath});

if (result.error) {
    console.warn(`⚠️  Could not load ${envPath}. Falling back to .env`);
    dotenv.config();
}

console.log(`Loaded environment: ${env}`);
console.log(`Using env file: ${envPath}`);

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        console.error(`❌ Missing required environment variable: ${name}`);
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

export default {
    port: parseInt(process.env.PORT || "3000", 10),

    databaseURL: required("MONGODB_URI"),

    logs: {
        level: process.env.LOG_LEVEL || "info",
    },

    api: {
        prefix: "/api",
    },


    anotherApiYouMightHaveURL: process.env.ANOTHER_API_URL || "",

    controllers: {
        student: {
            create: {
                name: "CreateStudentController",
                path: "../controllers/Student/createStudentController"
            },
            update: {
                name: "UpdateStudentController",
                path: "../controllers/Student/updateStudentController"
            },
            delete: {
                name: "DeleteStudentController",
                path: "../controllers/Student/deleteStudentController"
            },
            getAll: {
                name: "GetAllStudentsController",
                path: "../controllers/Student/getAllStudentsController"
            },
            getByEmail: {
                name: "GetStudentByEmailController",
                path: "../controllers/Student/getStudentByEmailController"
            }
        }
    },

    repos: {
        student: {
            name: "studentRepo",
            path: "../repos/studentRepo"
        },
    },

    services: {
        student: {
            name: "studentService",
            path: "../services/studentService"
        },
    },

    schemas: {
        student: {
            name: "studentSchema",
            path: "../persistence/schemas/studentSchema"
        },
    },

    mappers: {
        student: {
            name: "studentMapper",
            path: "../mappers/studentMapper"
        },
    }
};