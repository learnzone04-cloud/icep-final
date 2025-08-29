import { TypeEntity } from './entity/Type';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dtos/create-type.dto';
import { UpdateTypeDto } from './dtos/update-type.dto';
export declare class TypesService {
    private typeRepo;
    constructor(typeRepo: Repository<TypeEntity>);
    create(data: CreateTypeDto): Promise<TypeEntity>;
    find(): Promise<TypeEntity[]>;
    findOneById(id: number): Promise<TypeEntity>;
    delete(id: number): Promise<TypeEntity>;
    update(id: number, data: UpdateTypeDto): Promise<TypeEntity>;
}
