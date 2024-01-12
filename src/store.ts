import {initializeApp} from "firebase/app";
import {arrayUnion, doc, getDoc, getFirestore, updateDoc} from 'firebase/firestore';
import {getAnalytics} from "firebase/analytics";
import {sleep} from "./utils";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";
import {StocksEyesEnvironment} from "@stockseyes/market-domain";

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


const signIn = (userName: string, password: string) => {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, userName, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                resolve(user)
                // ...
            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                reject(errorMessage);
            });
    })

}

const getDocument = async (documentPath: string) => {
    const docRef = doc(stocksEyesStore, documentPath);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document! " + documentPath);
        throw new Error("Document not found for path : " + documentPath)
    }
}

export const initialiseStocksEyes = async (apiKey: any, env: StocksEyesEnvironment = StocksEyesEnvironment.PRODUCTION) => {
    if (stocksEyesStore) return;
    if(env == StocksEyesEnvironment.DEV) {
        // @ts-ignore
        window.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    const config = JSON.parse(atob(apiKey));
    stocksEyesConfig = getStocksEyesConfig(config);
    stocksEyesApp = initializeApp(stocksEyesConfig);
    stocksEyesStore = getFirestore(stocksEyesApp)
    analytics = getAnalytics(stocksEyesApp);
    initializeAppCheck(stocksEyesApp, {
        provider: new ReCaptchaV3Provider(stocksEyesConfig.recaptchaClientKey),
        isTokenAutoRefreshEnabled: true
    });
    const authData = await getDocument(`apps/${stocksEyesConfig.appId}/config/auth`)
    await signIn(authData.email as string, authData.password as string);
}

export const addSubscription = async (instrumentTokens: string[], retries = 0) => {
    if (retries > 20) {
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
