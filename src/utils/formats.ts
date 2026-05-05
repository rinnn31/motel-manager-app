export function hidePhoneNumber(phoneNumber: string): string {
    if (phoneNumber.length < 4) {
        return "****";
    }
    const last4Digits = phoneNumber.slice(-4);
    return "**** **** " + last4Digits;
}

export function formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatDateString(date: Date): string {
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}