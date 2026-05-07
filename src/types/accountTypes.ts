interface UserInfo {
    id: string,
    fullName: string,
    phoneNumber?: string,
    gender: number,
    isVerified?: boolean,
    role?: "TENANT" | "LANDLORD",
    avatarUrl?: string
}

interface AccountService {
    getUserInfo() : Promise<UserInfo>,
    getUserInfoById(userId: string) : Promise<UserInfo>,
    changeContactpoint(newPhoneNumber: string) : Promise<void>,
    changePassword(data: {oldPassword: string, newPassword: string}) : Promise<void>,
    deleteAccount() : Promise<void>,
    updateProfile(data: {fullName?: string, gender?: number}) : Promise<void>,
    verifyContactPoint(data: {phoneNumber: string, otp: string}) : Promise<void>,
    sendContactPointVerificationCode(phoneNumber: string) : Promise<void>,
    uploadAvatar(fileUri, imageType) : Promise<string>
}

export type { 
    UserInfo, 
    AccountService
}