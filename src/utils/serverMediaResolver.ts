import { SERVER_URL } from "@env"

export const resolveMedia = (mediaKey: string): string => {
    return SERVER_URL + "/media/" + mediaKey;
}