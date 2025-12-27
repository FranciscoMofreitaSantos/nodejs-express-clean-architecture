export interface IClassroomPersistence {
    domainId: string;
    name: string;
    teacher: {
        name: string;
        email: string;
    };
    students: string[];
}