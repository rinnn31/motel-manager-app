import AsyncStorage from "@react-native-async-storage/async-storage";

const storageService = {
    setItem: async (key: string, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error("Error saving data to storage", e);
        }
    },
    getItem: async (key: string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error("Error retrieving data from storage", e);
            return null;
        }
    },
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error("Error removing data from storage", e);
        }
    },
}

export default storageService;