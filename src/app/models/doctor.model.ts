import { Hospital } from './hospital.model';
import { User } from './user.model';

export class Doctor {
    constructor(
        public name:string,
        public img?:string,
        public hospital?:Hospital,
        public user?:User,
        public _id?:string
    ) { }
}