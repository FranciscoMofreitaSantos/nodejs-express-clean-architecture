export interface IClassroomDTO {
    id: string;
    name: string;
    teacher: {
        name: string;
        email: string;
    };
    students: string[];
}

export interface IClassroomReadModelDTO {
    id: string;
    name: string;
    teacher: {
        name: string;
        email: string;
    };
    students: {
        id : string,
        name: string,
        email: string
    } [];
}
