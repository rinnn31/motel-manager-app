interface TokenData {
    refreshToken: string,
    accessToken: string
};

interface AuthenticationData {
    refreshToken: string,
    accessToken: string,
    userId: string
}

interface AuthService {
    login(data: { phoneNumber: string, password: string }) : Promise<AuthenticationData>,
    logout(refreshToken: string) : Promise<void>,
    register(data: { 
        phoneNumber: string,
        password: string,
        fullName: string,
        gender: number,
        role: number
    }) : Promise<AuthenticationData>,
    sendResetPasswordOtp(phoneNumber: string) : Promise<void>,
    resetPassword(data: {
        phoneNumber: string,
        code: string,
        newPassword: string
    }) : Promise<void>,
    refreshToken(refreshToken: string) : Promise<TokenData>,
    registerDeviceToken(data: {sessionToken: string, deviceToken: string}) : Promise<void>
}

export type { 
    TokenData, 
    AuthenticationData, 
    AuthService,
}