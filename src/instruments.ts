import {makeGetRequest, makePostRequest} from "./requests";
import {
    PaginationDetails,
    SearchInstrumentsPatternRequest,
    SearchInstrumentsRequest,
    SearchInstrumentsResponse,
    futureListResponse,
    optionListResponse
} from "@stockseyes/market-domain";
import {sendAnalyticsEvent} from "./analytics";
import {EventName} from "./enums/eventName";
import {URLKey} from "./config/keys";

export const searchInstruments = async (searchInstrumentsRequest: SearchInstrumentsRequest, searchInstrumentsPatternRequest: SearchInstrumentsPatternRequest, paginationDetails: PaginationDetails): Promise<SearchInstrumentsResponse> => {
    // TODO: explore authenticated invocations
    const response = await makePostRequest(atob(URLKey) + "/searchInstruments", {
        filterRequest: searchInstrumentsRequest,
        searchPatterns: searchInstrumentsPatternRequest,
        paginationDetails
    });
    sendAnalyticsEvent(EventName.SEARCH_INSTRUMENT);
    return response as SearchInstrumentsResponse;
}

export const getOptions = async(tradingSymbol: string): Promise<optionListResponse> => {
    sendAnalyticsEvent(EventName.OPTION_LIST)
    return await makeGetRequest(atob(URLKey) + "/getOptionListByTradingSymbol", {tradingSymbol})
}

export const getFutures = async(tradingSymbol: string): Promise<futureListResponse> => {
    sendAnalyticsEvent(EventName.FUTURE_LIST)
    return await makeGetRequest(atob(URLKey) + "/getFutureListByTradingSymbol", {tradingSymbol})
}
