export declare const adminAuthConfig: {
    jwt: {
        secret: string;
        expiresIn: string;
    };
    google: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    };
    frontend: {
        baseUrl: string;
        authSuccessPath: string;
        authErrorPath: string;
    };
    allowedEmails: string[];
};
