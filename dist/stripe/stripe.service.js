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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let StripeService = class StripeService {
    constructor(configService) {
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-05-28.basil',
        });
    }
    async createPaymentIntent(amount, currency) {
        const amountMinor = this.toMinorUnits(amount, currency);
        const min = this.getMinimumMinorUnits(currency);
        if (amountMinor < min) {
            throw new common_1.BadRequestException(`Amount too low for ${currency}. Minimum is ${min} in minor units.`);
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amountMinor,
            currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }
    async confirmPayment(paymentIntentId, paymentMethodId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
                payment_method: paymentMethodId,
            });
            return paymentIntent;
        }
        catch (error) {
            console.error('Error confirming payment:', error);
            throw new Error('Payment confirmation failed');
        }
    }
    toMinorUnits(amountMajor, currency) {
        if (amountMajor == null || Number.isNaN(amountMajor))
            return 0;
        const zeroDecimal = this.isZeroDecimalCurrency(currency);
        const factor = zeroDecimal ? 1 : 100;
        return Math.round(amountMajor * factor);
    }
    isZeroDecimalCurrency(currency) {
        const zero = new Set(['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF']);
        return zero.has((currency || '').toUpperCase());
    }
    getMinimumMinorUnits(currency) {
        const c = (currency || '').toUpperCase();
        if (c === 'AED')
            return 200;
        if (c === 'USD')
            return 50;
        if (c === 'EUR')
            return 50;
        if (c === 'GBP')
            return 30;
        return 50;
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map