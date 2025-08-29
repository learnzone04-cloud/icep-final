"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const discounts_service_1 = require("./discounts.service");
const discounts_controller_1 = require("./discounts.controller");
const discount_entity_1 = require("./entities/discount.entity");
const coupon_entity_1 = require("./entities/coupon.entity");
const course_entity_1 = require("../course/entities/course.entity");
const ConversationRoom_1 = require("../conversation-room/entity/ConversationRoom");
const Student_1 = require("../student/entity/Student");
const auth_module_1 = require("../auth/auth.module");
let DiscountsModule = class DiscountsModule {
};
exports.DiscountsModule = DiscountsModule;
exports.DiscountsModule = DiscountsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([
                discount_entity_1.Discount,
                coupon_entity_1.Coupon,
                course_entity_1.Course,
                ConversationRoom_1.ConversationRoom,
                Student_1.Student,
            ]),
        ],
        controllers: [discounts_controller_1.DiscountsController],
        providers: [discounts_service_1.DiscountsService],
        exports: [discounts_service_1.DiscountsService],
    })
], DiscountsModule);
//# sourceMappingURL=discounts.module.js.map