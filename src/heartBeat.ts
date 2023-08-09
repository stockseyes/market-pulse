import {doc, getDoc, setDoc} from "firebase/firestore";
import {stocksEyesConfig, stocksEyesStore} from "./store";
import {MarketData} from "./domain";
import {sleep} from "./utils";

interface heartBeatConfigInterface {timeInterval: number}
let heartBeatConfig: heartBeatConfigInterface;
let lastHeartBeat: {[key: string]: number} = {};

const setHeartBeatTime = async (appId: string) => {
    const heartBeatRef = doc(stocksEyesStore, "apps", appId, "heartBeats", "config");
    const heartBeatDoc = await getDoc(heartBeatRef);

    if (heartBeatDoc.exists()) {
        heartBeatConfig = heartBeatDoc.data() as heartBeatConfigInterface;
    } else {
        throw new Error("Heart Beat config not found");
    }
}

const sendHeartBeat = async (instrumentTokes: number[], appId: string, retries=0) => {
    if(retries > 20) return
    const heartBeatUpdateRef = doc(stocksEyesStore, 'apps', appId, "heartBeats", "beats");
    const patchObject: {[key: number]: number} = {};
    const currentTime = Date.now() as number;
    instrumentTokes.forEach(instrumentToken => {
        patchObject[instrumentToken] = currentTime;
    })
    try {
        await setDoc(heartBeatUpdateRef, patchObject, {merge: true});
        console.log("Send heartbeat successful")
    } catch (e) {
        console.log("Error while sending heartbeat");
        await sleep(retries * 1000);
        await sendHeartBeat(instrumentTokes, appId, retries + 1);
    }

}

export const sendTimelyHeartbeat = async (data: MarketData[]) => {
    let appId = stocksEyesConfig.appId
    if(!heartBeatConfig) await setHeartBeatTime(appId);
    let currentTime = Date.now();
    let instrumentTokensForHeartBeat: number[] = [];
    for (const row of data) {
        let instrumentToken: number = row.instrument_token
        // check last hearBeatTime and current time diff
        if(!lastHeartBeat[instrumentToken] || (currentTime - lastHeartBeat[instrumentToken]) > heartBeatConfig.timeInterval) {
            // add for heartbeat to be sent
            instrumentTokensForHeartBeat.push(instrumentToken);
        }
    }
    if(instrumentTokensForHeartBeat.length != 0) {
        await sendHeartBeat(instrumentTokensForHeartBeat, appId);
    }
}
