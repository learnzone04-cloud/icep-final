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
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("./stripe.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let StripeController = class StripeController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async createPaymentIntent(amount, currency) {
        return this.stripeService.createPaymentIntent(amount, currency);
    }
    async confirmPayment(body) {
        const { paymentIntentId, paymentMethodId, reservationId } = body;
        try {
            const intent = await this.stripeService.confirmPayment(paymentIntentId, paymentMethodId);
            return intent;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)('amount')),
    __param(1, (0, common_1.Body)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('confirm'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "confirmPayment", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('stripe'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map