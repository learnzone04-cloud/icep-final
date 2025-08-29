import { TypeEntity } from '../../types/entity/Type';
export declare class Tag {
    id: number;
    name: string;
    typeId: number;
    type: TypeEntity;
    createdAt: Date;
}
