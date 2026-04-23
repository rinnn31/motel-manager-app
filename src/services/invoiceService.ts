import apiClient from "./apiClient";
import { InvoiceDetail, InvoiceService } from "../types/motelTypes";

const invoiceService: InvoiceService = {
    async getInvoices(roomId: string, fromDate: string, toDate: string) {
        const response = await apiClient.get("/invoices", { 
            params: { 
                roomId: roomId,
                fromDate: fromDate,
                toDate: toDate
            } 
        });
        return response.data.data;
    },
    async createInvoice(roomId: string, data: { details: InvoiceDetail[] }) {
        await apiClient.post("/invoices", { ...data, roomId: roomId });
    },
    async deleteInvoice(invoiceId: string) {
        await apiClient.delete(`/invoices/${invoiceId}`);
    },
    async payInvoice(invoiceId: string) {
        await apiClient.post(`/invoices/${invoiceId}/pay`);
    }
}

export default invoiceService;