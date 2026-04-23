import { UserInfo } from "./accountTypes";

/* Motel API related data types*/
interface MotelInfo {
    id: string;
    name: string;
    memberCount: number;
}

interface MemberInfo {
    userInfo: UserInfo
    roomNumber: string;
    joinDate: string;
}

interface RoomInfo {
    id: string,
    roomNumber: string,
    price: number,
    memberCount: number,
}

interface FeeInfo {
    id: string,
    type: string,
    description: string,
    calculationType: string,
    unitPrice: number,
}

interface InvoiceDetail {
    name: string, 
    amount: number,
    unitPrice: number,
    calculationType: string
}

interface InvoiceInfo {
    id: string,
    createdAt: number,
    paidAt?: number,
    isPaid: boolean,
    details: InvoiceDetail[]
}

interface MessageInfo {
    id: string,
    title: string,
    content?: string,
    createdAt: string,
    sender: {
        id: string,
        name: string,
        type: string
    },
    recipients: {
        id: string,
        name: string,
        type: string
    }[],
    attachments?: string[]
}

/* Motel API related service types */
interface MotelService {
    getAllMotels(): Promise<MotelInfo[]>;
    getMotelById(motelId: string): Promise<MotelInfo>;
    getJoinedMotel(): Promise<MotelInfo | null>;
    createMotel(data: {displayName: string}): Promise<void>;
    deleteMotel(motelId: string): Promise<void>;
    updateMotelName(motelId: string, data: {newName: string}): Promise<void>;
    getMotelOwner(motelId: string): Promise<UserInfo>;
}

interface FeeService {
    getAllFees(motelId: string) : Promise<FeeInfo[]>,
    addFee(motelId: string, data: {feeType: string, unitPrice: number, calculationType: string, description?: string }) : Promise<void>,
    updateFee(feeId: string, data: {unitPrice?: number, calculationType?: string}) : Promise<void>,
    deleteFee(feeId: string) : Promise<void>
}

interface MemberService {
    getMembersByMotelId(motelId: string) : Promise<MemberInfo[]>,
    getMembersByRoomId(roomId: string) : Promise<MemberInfo[]>,
    removeMember(userId: string) : Promise<void>,
    leaveMotel() : Promise<void>,
}

interface RoomService {
    getRooms(motelId: string) : Promise<RoomInfo[]>,
    getRoomById(roomId: string) : Promise<RoomInfo>,
    getJoinedRoom(): Promise<RoomInfo>,
    createRoom(data: {roomNumber: string, roomPrice: number}) : Promise<void>,
    deleteRoom(roomId: string) : Promise<void>,
    updateRoom(roomId: string, data: {roomNumber?: string, roomPrice?: number}) : Promise<void>,
}

interface MessageService {
    getSentMessagesForMotel(motelId: string, from: number, page: number, size: number) : Promise<MessageInfo[]>,
    getReceivedMessagesForMotel(motelId: string, from: number, page: number, size: number) : Promise<MessageInfo[]>,
    getSentMessagesForRoom(roomId: string, from: number, page: number, size: number) : Promise<MessageInfo[]>,
    getReceivedMessagesForRoom(roomId: string, from: number, page: number, size: number) : Promise<MessageInfo[]>,
    sendMessageToMotel(motelId: string, roomId: string, data: {
        title: string,
        content: string,
        attachments?: {path: string, type: string}[]
    }): Promise<void>,
    sendMessageToRoom(motelId: string, roomIds: string[], data: {
        title: string,
        content: string,
        attachments?: {path: string, type: string}[]
    }): Promise<void>
}

interface InvoiceService {
    getInvoices(roomId: string, fromDate: string, toDate: string) : Promise<InvoiceInfo[]>,
    createInvoice(roomId: string, data: {
        details: InvoiceDetail[]
    }) : Promise<void>,
    payInvoice(invoiceId: string) : Promise<void>,
    deleteInvoice(invoiceId: string) : Promise<void>
}

export type {
    MotelInfo,
    MemberInfo,
    RoomInfo,
    FeeInfo,
    InvoiceDetail,
    InvoiceInfo,
    InvoiceService,
    MotelService,
    FeeService,
    MemberService,
    RoomService,
    MessageService,
    MessageInfo
}