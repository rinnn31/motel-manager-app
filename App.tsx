import "./App.css";
import RootNavigator from "./src/navigation/RootNavigator"
import { Provider } from "react-redux";
import { store } from "./src/store";
import AppBootstrap from "./src/AppBootstrap";

export default function App() {
    return (
        <Provider store={store}>
            <AppBootstrap>
                <RootNavigator />
            </AppBootstrap>
        </Provider>
    )
}