import { PlacementTestService } from './placement-test.service';
export declare class PlacementTestController {
    private readonly placementTestService;
    constructor(placementTestService: PlacementTestService);
    generateQuestions(typeId: number): Promise<any>;
    submitAnswers(req: any, answers: any, test: any, typeId: number): Promise<import("./placement-test.entity").PlacementTest>;
}
