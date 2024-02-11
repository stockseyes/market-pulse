import {logEvent} from "firebase/analytics";
import {analytics, stocksEyesConfig} from "./store";
import {EventName} from "./enums/eventName";
import {getShortenedAppId} from "./config/appId";

export const sendAnalyticsEvent = (eventName: EventName) => {
    if(!stocksEyesConfig || !stocksEyesConfig.appId) {
        throw new Error("StocksEyes not initialised")
    }
    logEvent(analytics, getShortenedAppId(stocksEyesConfig.appId) + "__" + eventName);
}
