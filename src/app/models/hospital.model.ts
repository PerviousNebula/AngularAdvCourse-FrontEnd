// Models
import { User } from './user.model';

export class Hospital {
    constructor(
        public name:string,
        public img?:string,
        public user?:User,
        public _id?:string
    ) { }
}