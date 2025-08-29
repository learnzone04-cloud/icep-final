import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PlacementTest } from './placement-test.entity';
import { TypeEntity } from '../types/entity/Type';
import { StudentType } from '../student-type/entity/StudentType';
export declare class PlacementTestService {
    private readonly placementTestRepository;
    private readonly typeRepository;
    private readonly studentTypeRepository;
    private readonly httpService;
    private readonly configService;
    constructor(placementTestRepository: Repository<PlacementTest>, typeRepository: Repository<TypeEntity>, studentTypeRepository: Repository<StudentType>, httpService: HttpService, configService: ConfigService);
    generateQuestions(typeId: number): Promise<any>;
    evaluateAnswers(studentId: number, answers: any, test: any, typeId: number): Promise<PlacementTest>;
}
