import { NewWordService } from './new-word.service';
import { CreateNewWordDto } from './dtos/create-word.dto';
import { UpdateNewWordDto } from './dtos/update-word.dto';
export declare class NewWordController {
    private readonly service;
    constructor(service: NewWordService);
    createWord(req: any, body: CreateNewWordDto): Promise<import("./entity/NewWord").NewWord>;
    get(): Promise<import("./entity/NewWord").NewWord[]>;
    update(req: any, body: UpdateNewWordDto, id: number): Promise<import("./entity/NewWord").NewWord>;
    delete(id: number): Promise<import("./entity/NewWord").NewWord>;
}
