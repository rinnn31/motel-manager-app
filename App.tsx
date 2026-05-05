import "./App.css";
import "react-native-gesture-handler";
import RootNavigator from "./src/navigation/RootNavigator"
import { Provider } from "react-redux";
import { store } from "./src/store";
import AppBootstrap from "./src/AppBootstrap";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
    return (
        <Provider store={store}>
            <AppBootstrap>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <RootNavigator />
                </GestureHandlerRootView>
            </AppBootstrap>
        </Provider>
    )
}