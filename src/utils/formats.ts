export function hidePhoneNumber(phoneNumber: string): string {
    if (phoneNumber.length < 4) {
        return "****";
    }
    const last4Digits = phoneNumber.slice(-4);
    return "**** **** " + last4Digits;
}