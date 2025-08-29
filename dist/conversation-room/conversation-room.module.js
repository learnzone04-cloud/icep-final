"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRoomModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ConversationRoom_1 = require("./entity/ConversationRoom");
const ConversationRoomParticipant_1 = require("./entity/ConversationRoomParticipant");
const livekit_service_1 = require("./livekit.service");
const livekit_controller_1 = require("./livekit.controller");
const conversation_room_service_1 = require("./conversation-room.service");
const conversation_room_controller_1 = require("./conversation-room.controller");
const conversation_room_participant_service_1 = require("./conversation-room-participant.service");
const placement_test_entity_1 = require("../placement-test/placement-test.entity");
const Teacher_1 = require("../teacher/entity/Teacher");
const Student_1 = require("../student/entity/Student");
const StudentType_1 = require("../student-type/entity/StudentType");
const Type_1 = require("../types/entity/Type");
const User_1 = require("../users/entity/User");
const notification_module_1 = require("../notification/notification.module");
const discounts_module_1 = require("../discounts/discounts.module");
let ConversationRoomModule = class ConversationRoomModule {
};
exports.ConversationRoomModule = ConversationRoomModule;
exports.ConversationRoomModule = ConversationRoomModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ConversationRoom_1.ConversationRoom,
                ConversationRoomParticipant_1.ConversationRoomParticipant,
                placement_test_entity_1.PlacementTest,
                Teacher_1.TeacherEntity,
                Student_1.Student,
                StudentType_1.StudentType,
                Type_1.TypeEntity,
                User_1.UserEntity,
            ]),
            notification_module_1.NotificationModule,
            discounts_module_1.DiscountsModule,
        ],
        providers: [livekit_service_1.LiveKitService, conversation_room_service_1.ConversationRoomService, conversation_room_participant_service_1.ConversationRoomParticipantService],
        controllers: [livekit_controller_1.LiveKitController, conversation_room_controller_1.ConversationRoomController],
        exports: [],
    })
], ConversationRoomModule);
//# sourceMappingURL=conversation-room.module.js.map