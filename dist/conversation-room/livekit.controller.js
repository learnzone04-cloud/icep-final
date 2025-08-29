"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitController = void 0;
const common_1 = require("@nestjs/common");
const livekit_service_1 = require("./livekit.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LiveKitController = class LiveKitController {
    constructor(liveKitService) {
        this.liveKitService = liveKitService;
    }
    async getToken(body, req) {
        return this.liveKitService.buildTokenWithAccessCheck(body.roomName, req.user);
    }
    async getDebugToken(roomName, req) {
        const user = req.user;
        const userName = (user.name || '').trim().replace(/\s+/g, ' ');
        const userRole = (user.role || '').toLowerCase();
        const identity = `id:${user.id}|name:${userName}|role:${userRole}`;
        console.log('Debug token generation:', {
            roomName,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                normalizedRole: userRole
            },
            identity
        });
        const token = await this.liveKitService.generateToken(roomName, identity, 3600);
        const wsUrl = 'wss://icep-oha22jm9.livekit.cloud';
        return {
            token,
            wsUrl,
            identity,
            debug: {
                roomName,
                userInfo: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    normalizedRole: userRole
                }
            }
        };
    }
    async completeRoom(roomId, req) {
        const user = req.user;
        if (user.role !== 'Teacher') {
            throw new Error('Only teachers can complete rooms');
        }
        await this.liveKitService.markRoomAsCompleted(parseInt(roomId));
        return { success: true, message: 'Room marked as completed' };
    }
    async cancelRoom(roomId, req) {
        const user = req.user;
        if (user.role !== 'Teacher') {
            throw new Error('Only teachers can cancel rooms');
        }
        await this.liveKitService.cancelRoom(parseInt(roomId));
        return { success: true, message: 'Room cancelled' };
    }
};
exports.LiveKitController = LiveKitController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "getToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('debug-token/:roomName'),
    __param(0, (0, common_1.Param)('roomName')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "getDebugToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('room/:roomId/complete'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "completeRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('room/:roomId/cancel'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "cancelRoom", null);
exports.LiveKitController = LiveKitController = __decorate([
    (0, common_1.Controller)('livekit'),
    __metadata("design:paramtypes", [livekit_service_1.LiveKitService])
], LiveKitController);
//# sourceMappingURL=livekit.controller.js.map