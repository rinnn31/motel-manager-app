interface UserInfo {
    fullName: string,
    phoneNumber?: string,
    gender: number,
    isVerified?: boolean,
    role?: string
}

interface ChangePasswordRequest {
    oldPassword: string,
    newPassword: string
}

interface UpdateProfileRequest {
    fullName?: string,
    gender?: number
}

interface VerifyContactPointRequest {
    phoneNumber: string,
    code: string
}

interface AccountService {
    getUserInfo() : Promise<UserInfo>,
    getUserInfoById(userId: string) : Promise<UserInfo>,
    changeContactpoint(newPhoneNumber: string) : Promise<void>,
    changePassword(data: ChangePasswordRequest) : Promise<void>,
    deleteAccount() : Promise<void>,
    updateProfile(data: UpdateProfileRequest) : Promise<void>,
    verifyContactPoint(data: VerifyContactPointRequest) : Promise<void>,
    sendContactPointVerificationCode(phoneNumber: string) : Promise<void>
}

export type { 
    UserInfo, 
    AccountService,
    ChangePasswordRequest,
    UpdateProfileRequest,
    VerifyContactPointRequest
}