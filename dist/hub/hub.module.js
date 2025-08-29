"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const hub_service_1 = require("./hub.service");
const hub_gateway_1 = require("./hub.gateway");
const hub_message_entity_1 = require("./entities/hub-message.entity");
const Type_1 = require("../types/entity/Type");
const ws_jwt_auth_guard_1 = require("./ws-jwt-auth.guard");
const User_1 = require("../users/entity/User");
const profanity_filter_service_1 = require("./profanity-filter.service");
let HubModule = class HubModule {
};
exports.HubModule = HubModule;
exports.HubModule = HubModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([hub_message_entity_1.HubMessage, Type_1.TypeEntity, User_1.UserEntity]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '50000000s' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [hub_service_1.HubService, hub_gateway_1.HubGateway, ws_jwt_auth_guard_1.WsJwtAuthGuard, profanity_filter_service_1.ProfanityFilterService],
        exports: [hub_service_1.HubService],
    })
], HubModule);
//# sourceMappingURL=hub.module.js.map