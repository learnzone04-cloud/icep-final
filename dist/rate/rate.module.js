"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rate_service_1 = require("./rate.service");
const rate_controller_1 = require("./rate.controller");
const rate_entity_1 = require("./entities/rate.entity");
const Student_1 = require("../student/entity/Student");
const Teacher_1 = require("../teacher/entity/Teacher");
let RateModule = class RateModule {
};
exports.RateModule = RateModule;
exports.RateModule = RateModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([rate_entity_1.Rate, Student_1.Student, Teacher_1.TeacherEntity])],
        controllers: [rate_controller_1.RateController],
        providers: [rate_service_1.RateService],
        exports: [rate_service_1.RateService],
    })
], RateModule);
//# sourceMappingURL=rate.module.js.map