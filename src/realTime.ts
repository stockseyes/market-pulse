import {addSubscription, initialiseStocksEyes, stocksEyesStore} from "./store";
import {Fields, MarketData, Unsubscribe} from "./domain";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {sendTimelyHeartbeat} from "./heartBeat";
import {sendAnalyticsEvent} from "./analytics";

export const subscribeRealTimeData = async (instrumentTokens: string[], fieldsRequired:Fields[] , callback: (data: MarketData[])=>void): Promise<Unsubscribe> => {
    addSubscription(instrumentTokens);
    const q = query(collection(stocksEyesStore, "latestQuoteByIT"), where("instrument_token", "in", instrumentTokens));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newData: MarketData[] = [];
        querySnapshot.forEach((doc) => {
            const docData: MarketData = doc.data() as MarketData;
            let dataRequired: MarketData = {
                trading_symbol: docData.trading_symbol as string,
                instrument_token: docData.instrument_token as number
            }
            if(fieldsRequired && fieldsRequired.length!=0) {
                fieldsRequired.forEach(field => {
                    // @ts-ignore
                    dataRequired[field] = docData[field]
                })
            } else {
                dataRequired = docData
            }
            newData.push(dataRequired);
        });
        callback(newData);
        querySnapshot.docChanges().forEach(() => {
            sendAnalyticsEvent()
        });
        sendTimelyHeartbeat(newData);
    });

    return unsubscribe;
}

export const initialiseAndSubscribeRealTimeData = async (apiKey:any, instrumentTokens: string[], fieldsRequired:Fields[] , callback: (data: MarketData[])=>void): Promise<Unsubscribe> => {
    await initialiseStocksEyes(apiKey)
    return subscribeRealTimeData(instrumentTokens, fieldsRequired, callback)
}


