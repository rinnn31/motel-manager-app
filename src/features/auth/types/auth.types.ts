import { UserInfo } from "../../account/types/account.types";

interface TokenData {
    refreshToken: string,
    accessToken: string
};

interface AuthenticationData {
    refreshToken: string,
    accessToken: string,
    userId: string
    userInfo: UserInfo
}

interface RegisterRequest {
    phoneNumber: string,
    password: string,
    fullName: string,
    gender: number,
    role: number
}

interface LoginRequest {
    phoneNumber: string,
    password: string
}

interface ResetPasswordRequest {
    phoneNumber: string,
    code: string,
    newPassword?: string
}

interface AuthService {
    login(data: LoginRequest) : Promise<AuthenticationData>,
    logout(refreshToken: string) : Promise<void>,
    register(data: RegisterRequest) : Promise<AuthenticationData>,
    sendResetPasswordOtp(phoneNumber: string) : Promise<void>,
    resetPassword(data: ResetPasswordRequest) : Promise<void>,
    refreshToken(refreshToken: string) : Promise<TokenData>,
}

export type { 
    TokenData, 
    AuthenticationData, 
    AuthService,
    RegisterRequest,
    LoginRequest,
    ResetPasswordRequest
}