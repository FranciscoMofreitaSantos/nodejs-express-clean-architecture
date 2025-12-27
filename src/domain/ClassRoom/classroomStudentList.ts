import { WatchedList } from "../../core/domain/WatchedList";
import {StudentId} from "../Student/studentId";


export class ClassroomStudentList extends WatchedList<StudentId> {
    private constructor (initialItems?: StudentId[]) {
        super(initialItems);
    }

    public compareItems (a: StudentId, b: StudentId): boolean {
        return a.equals(b);
    }

    public static create (initialItems?: StudentId[]): ClassroomStudentList {
        return new ClassroomStudentList(initialItems ? initialItems : []);
    }
}