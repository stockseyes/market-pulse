import {logEvent} from "firebase/analytics";
import {analytics, stocksEyesConfig} from "./store";

export const sendAnalyticsEvent = () => {
    logEvent(analytics, stocksEyesConfig.appId);
}
