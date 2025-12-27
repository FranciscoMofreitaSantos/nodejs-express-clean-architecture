export interface IClassroomDTO {
    id: string;
    name: string;
    teacher: {
        name: string;
        email: string;
    };
    students: string[];
}
