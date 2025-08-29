import { TypesService } from './types.service';
import { CreateTypeDto } from './dtos/create-type.dto';
import { UpdateTypeDto } from './dtos/update-type.dto';
export declare class TypesController {
    private readonly typeService;
    constructor(typeService: TypesService);
    createType(req: any, body: CreateTypeDto): any;
    get(): any;
    deleteType(id: number): any;
    updateType(id: number, body: UpdateTypeDto): any;
}
