import {makeGetRequest} from "./requests";
import {sendAnalyticsEvent} from "./analytics";
import {EventName} from "./enums/eventName";
import {URLKey} from "./config/keys";
import {Exchange} from "@stockseyes/market-domain";

export const getLatestQuoteByInstrumentId = async (instrumentId: string) => {
    sendAnalyticsEvent(EventName.LATEST_QUOTE)
    return await makeGetRequest(atob(URLKey) + "/latestQuoteByInstrumentId", {instrumentId})
}

export const getLatestQuoteByExchangeAndTradingSymbol = async (exchange: Exchange, tradingSymbol: string) => {
    sendAnalyticsEvent(EventName.LATEST_QUOTE)
    return await makeGetRequest(atob(URLKey) + "/latestQuoteByExchangeAndTradingSymbol", {exchange, tradingSymbol})
}
