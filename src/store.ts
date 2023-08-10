import {initializeApp} from "firebase/app";
import {arrayUnion, doc, getFirestore, updateDoc} from 'firebase/firestore';
import {getAnalytics} from "firebase/analytics";
import {sleep} from "./utils";

let stocksEyesStore: any;
let stocksEyesApp
let stocksEyesConfig: any
let analytics: any

const getStocksEyesConfig = (config: any): any => {
    if (!config || !config.apiKey) {
        throw new Error('No configuration object provided.');
    } else {
        stocksEyesConfig = config
        return config;
    }
}

export const initialiseStocksEyes = (apiKey: any) => {
    if (stocksEyesStore) return;
    const config = JSON.parse(atob(apiKey));
    stocksEyesConfig = getStocksEyesConfig(config);
    stocksEyesApp = initializeApp(stocksEyesConfig);
    stocksEyesStore = getFirestore(stocksEyesApp)
    analytics = getAnalytics(stocksEyesApp);
}

export const addSubscription = async (instrumentTokens: string[], retries = 0) => {
    if(retries > 20) {
        console.log("Can't add subscription, please contact the StocksEyes API admin")
    }
    const subscriptionRef = doc(stocksEyesStore, "marketDataConfig", "subscribedInstruments");
    try {
        await updateDoc(subscriptionRef, {
            instrument_tokens: arrayUnion(...instrumentTokens)
        });
    } catch (e) {
        console.log("Subscription addition failed, Retrying...")
        await sleep(retries * 1000);
        await addSubscription(instrumentTokens, retries + 1);
    }

}

// export const ticker = (instrumentTokens: string[] , fieldsRequired: Fields[] , callback: (data: MarketData[])=>void): Unsubscribe => {
//     addSubscription(instrumentTokens);
//     const q = query(collection(stocksEyesStore, "latestQuote"), where("instrument_token", "in", instrumentTokens));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const newData: MarketData[] = [];
//         querySnapshot.forEach((doc) => {
//             const docData: MarketData = doc.data() as MarketData;
//             const dataRequired: MarketData = {
//                 trading_symbol: docData.trading_symbol as string,
//                 instrument_token: docData.instrument_token as number
//             }
//             fieldsRequired.forEach(field => {
//                 // @ts-ignore
//                 dataRequired[field] = docData[field]
//             })
//             newData.push(dataRequired);
//         });
//         callback(newData);
//         querySnapshot.docChanges().forEach(() => {
//             logEvent(analytics, stocksEyesConfig.appId);
//         });
//         sendTimelyHeartbeat(newData, stocksEyesConfig.appId);
//     });
//
//     return unsubscribe;
// }

export {stocksEyesStore, analytics, stocksEyesConfig}
