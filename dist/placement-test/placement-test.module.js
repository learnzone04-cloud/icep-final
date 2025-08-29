"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementTestModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const placement_test_entity_1 = require("./placement-test.entity");
const placement_test_service_1 = require("./placement-test.service");
const placement_test_controller_1 = require("./placement-test.controller");
const Type_1 = require("../types/entity/Type");
const StudentType_1 = require("../student-type/entity/StudentType");
let PlacementTestModule = class PlacementTestModule {
};
exports.PlacementTestModule = PlacementTestModule;
exports.PlacementTestModule = PlacementTestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([placement_test_entity_1.PlacementTest, Type_1.TypeEntity, StudentType_1.StudentType]),
            axios_1.HttpModule,
        ],
        providers: [placement_test_service_1.PlacementTestService],
        controllers: [placement_test_controller_1.PlacementTestController],
    })
], PlacementTestModule);
//# sourceMappingURL=placement-test.module.js.map