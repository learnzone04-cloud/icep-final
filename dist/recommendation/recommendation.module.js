"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const UserInteraction_1 = require("./entities/UserInteraction");
const UserProfile_1 = require("./entities/UserProfile");
const UserRecommendation_1 = require("./entities/UserRecommendation");
const UserTagPreference_1 = require("./entities/UserTagPreference");
const recommendation_service_1 = require("./services/recommendation.service");
const event_tracking_service_1 = require("./services/event-tracking.service");
const background_job_service_1 = require("./services/background-job.service");
const recommendation_controller_1 = require("./controllers/recommendation.controller");
const recommendation_gateway_1 = require("./gateways/recommendation.gateway");
const tags_module_1 = require("../tags/tags.module");
let RecommendationModule = class RecommendationModule {
};
exports.RecommendationModule = RecommendationModule;
exports.RecommendationModule = RecommendationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                UserInteraction_1.UserInteraction,
                UserProfile_1.UserProfile,
                UserRecommendation_1.UserRecommendation,
                UserTagPreference_1.UserTagPreference,
            ]),
            schedule_1.ScheduleModule.forRoot(),
            tags_module_1.TagsModule,
        ],
        controllers: [recommendation_controller_1.RecommendationController],
        providers: [
            recommendation_service_1.RecommendationService,
            event_tracking_service_1.EventTrackingService,
            background_job_service_1.BackgroundJobService,
            recommendation_gateway_1.RecommendationGateway,
        ],
        exports: [
            recommendation_service_1.RecommendationService,
            event_tracking_service_1.EventTrackingService,
            background_job_service_1.BackgroundJobService,
            recommendation_gateway_1.RecommendationGateway,
        ],
    })
], RecommendationModule);
//# sourceMappingURL=recommendation.module.js.map