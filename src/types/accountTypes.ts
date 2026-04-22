interface UserInfo {
    id: string,
    fullName: string,
    phoneNumber?: string,
    gender: number,
    isVerified?: boolean,
    role?: string,
    avatarUrl?: string
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
    otp: string
}

interface AccountService {
    getUserInfo() : Promise<UserInfo>,
    getUserInfoById(userId: string) : Promise<UserInfo>,
    changeContactpoint(newPhoneNumber: string) : Promise<void>,
    changePassword(data: ChangePasswordRequest) : Promise<void>,
    deleteAccount() : Promise<void>,
    updateProfile(data: UpdateProfileRequest) : Promise<void>,
    verifyContactPoint(data: VerifyContactPointRequest) : Promise<void>,
    sendContactPointVerificationCode(phoneNumber: string) : Promise<void>,
    uploadAvatar(fileUri, imageType) : Promise<string>
}

export type { 
    UserInfo, 
    AccountService,
    ChangePasswordRequest,
    UpdateProfileRequest,
    VerifyContactPointRequest
}