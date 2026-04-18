import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAppDispatch } from "./store/hooks";
import storageService from "./services/storageService";
import { setHydrate } from "./features/auth/store/auth.slice";
import { AUTH_DATA_KEY } from "./constants/storage.constants";
export default function AppBootstrap({ children }) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const authData = await storageService.getItem(AUTH_DATA_KEY);

            dispatch(
                setHydrate({
                    refreshToken: authData?.refreshToken || null,
                    accessToken: authData?.accessToken || null,
                    userId: authData?.userId || null,
                })
            );

            setLoading(false);
        };

        init();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return children;
}