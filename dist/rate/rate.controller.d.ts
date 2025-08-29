import { RateService } from './rate.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
export declare class RateController {
    private readonly rateService;
    constructor(rateService: RateService);
    create(createRateDto: CreateRateDto, req: any): Promise<import("./entities/rate.entity").Rate>;
    findAll(): Promise<import("./entities/rate.entity").Rate[]>;
    findByTeacherId(teacherId: number): Promise<import("./entities/rate.entity").Rate[]>;
    findOne(id: number): Promise<import("./entities/rate.entity").Rate>;
    update(id: number, updateRateDto: UpdateRateDto, req: any): Promise<import("./entities/rate.entity").Rate>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
