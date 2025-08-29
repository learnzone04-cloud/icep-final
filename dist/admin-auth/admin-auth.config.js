"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthConfig = void 0;
exports.adminAuthConfig = {
    jwt: {
        secret: process.env.ADMIN_JWT_SECRET,
        expiresIn: '24h',
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_ADMIN_CALLBACK_URL,
    },
    frontend: {
        baseUrl: process.env.FRONTEND_BASE_URL,
        authSuccessPath: '/admin/auth-success',
        authErrorPath: '/admin/auth-error',
    },
    allowedEmails: [
        'learnzone04@gmail.com',
    ],
};
//# sourceMappingURL=admin-auth.config.js.map