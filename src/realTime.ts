import {addSubscription, initialiseStocksEyes, stocksEyesStore} from "./store";
import {Fields, MarketData, StocksEyesEnvironment, Unsubscribe} from "@stockseyes/market-domain";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {sendTimelyHeartbeat} from "./heartBeat";
import {sendAnalyticsEvent} from "./analytics";
import {EventName} from "./enums/eventName";
const batchSize: number = 30;

const previousMarketData: {
    [key: string]: MarketData
} = {};

const getNearValue = (num: number, percent: number) => {
    num = Math.floor(num);
    let maxChange = num;
    while (maxChange > 2) {
        maxChange = maxChange / 10;
    }
    let change = Math.min(percent * num / 100, maxChange);
    return +((num + (num%2 == 0 ? 1: -1) * change).toFixed(2));
}


const subscribeRealTimeDataHelper = async (instrumentTokens: string[], fieldsRequired:Fields[] , callback: (data: MarketData[])=>void): Promise<Unsubscribe> => {
    addSubscription(instrumentTokens);
    const q = query(collection(stocksEyesStore, "latestQuoteByIT"), where("instrument_token", "in", instrumentTokens));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newData: MarketData[] = [];
        querySnapshot.forEach((doc) => {
            const docData: MarketData = doc.data() as MarketData;
            docData.previous_price = previousMarketData[docData.instrument_token]?.last_price
            if(!docData.previous_price) docData.previous_price = getNearValue(docData.last_price as number, 0.1);
            docData.previous_depth = previousMarketData[docData.instrument_token]?.depth
            if(docData.depth && !docData.previous_depth && fieldsRequired.includes(Fields.PREVIOUS_DEPTH)) {
                docData.previous_depth = JSON.parse(JSON.stringify(docData.depth));
                docData.previous_depth?.buy?.sort(() => Math.random()-0.5);
                docData.previous_depth?.sell?.sort(() => Math.random()-0.5);
            }
            previousMarketData[docData.instrument_token] = docData
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
            sendAnalyticsEvent(EventName.PULSE)
        });
        sendTimelyHeartbeat(newData);
    });

    return unsubscribe;
}

export const subscribeRealTimeData = async (instrumentTokens: string[], fieldsRequired:Fields[] , callback: (data: MarketData[])=>void): Promise<Unsubscribe> => {
    if(!instrumentTokens || !Array.isArray(instrumentTokens)) throw new Error("Invalid input for instrument tokens");
    const unsubscribePromises: Promise<Unsubscribe>[] = []
    for(let i=0;i<instrumentTokens.length;i+=batchSize) {
        unsubscribePromises.push(subscribeRealTimeDataHelper(instrumentTokens.slice(i,i+batchSize), fieldsRequired, callback))
    }
    const unsubscribeFunctions: Unsubscribe[] = await Promise.all(unsubscribePromises);
    return ()=>{
        unsubscribeFunctions.forEach(unsubscribeFunction => {unsubscribeFunction()})
    };
}

export const initialiseAndSubscribeRealTimeData = async (environment: StocksEyesEnvironment, apiKey:any, instrumentTokens: string[], fieldsRequired:Fields[] , callback: (data: MarketData[])=>void): Promise<Unsubscribe> => {
    await initialiseStocksEyes(apiKey, environment)
    return subscribeRealTimeData(instrumentTokens, fieldsRequired, callback)
}


