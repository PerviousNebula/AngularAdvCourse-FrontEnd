import { SubCategory } from '../interfaces.index';

export interface Category {
    title:string;
    icon:string;
    subcategories:Array<SubCategory>
}
