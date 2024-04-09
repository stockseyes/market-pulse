import { makeGetRequest, makePostRequest } from "./requests";
import {
    PaginationDetails,
    SearchInstrumentsPatternRequest,
    SearchInstrumentsRequest,
    SearchInstrumentsResponse,
    futureListResponse,
    optionListResponse,
    SearchInstrumentsRequestV2,
    Instrument
} from "@stockseyes/market-domain";
import { sendAnalyticsEvent } from "./analytics";
import { EventName } from "./enums/eventName";
import { URLKey } from "./config/keys";

export const searchInstruments = async (searchInstrumentsRequest?: SearchInstrumentsRequest, searchInstrumentsPatternRequest?: SearchInstrumentsPatternRequest, paginationDetails?: PaginationDetails): Promise<SearchInstrumentsResponse> => {
    // TODO: explore authenticated invocations
    const response = await makePostRequest(atob(URLKey) + "/searchInstruments", {
        filterRequest: searchInstrumentsRequest,
        searchPatterns: searchInstrumentsPatternRequest,
        paginationDetails
    });
    sendAnalyticsEvent(EventName.SEARCH_INSTRUMENT);
    return response as SearchInstrumentsResponse;
}

export const searchInstrumentsV2 = async (searchInstrumentsRequestV2: SearchInstrumentsRequestV2): Promise<SearchInstrumentsResponse> => {
    const searchInstrumentsResponse: SearchInstrumentsResponse = await searchInstruments(
        searchInstrumentsRequestV2.filterInstrumentRequest as SearchInstrumentsRequest,
        searchInstrumentsRequestV2.searchInstrumentsPatternRequest,
        searchInstrumentsRequestV2.paginationDetails);
    // do the field projection
    if (searchInstrumentsRequestV2.fieldsRequired && Array.isArray(searchInstrumentsRequestV2.fieldsRequired)) {
        const isPresentMap: any = {}
        let projectedInstruments: Instrument[] = []
        searchInstrumentsResponse.instruments?.forEach((instrument: Instrument) => {
            const projectedInstrument: any = {}
            searchInstrumentsRequestV2.fieldsRequired?.forEach(field => {
                projectedInstrument[field] = instrument[field]
            });
            if(searchInstrumentsRequestV2.distinct) {
                const stringifiedInstrumentData: string = JSON.stringify(projectedInstrument)
                if (!isPresentMap[stringifiedInstrumentData]) {
                    projectedInstruments.push(projectedInstrument)
                    isPresentMap[stringifiedInstrumentData] = true
                }
            }
            else {
                projectedInstruments.push(projectedInstrument)
            }
        })
        searchInstrumentsResponse.instruments = projectedInstruments
    }
    return searchInstrumentsResponse
}

export const getOptions = async (tradingSymbol: string): Promise<optionListResponse> => {
    sendAnalyticsEvent(EventName.OPTION_LIST)
    return await makeGetRequest(atob(URLKey) + "/getOptionListByTradingSymbol", { tradingSymbol })
}

export const getFutures = async (tradingSymbol: string): Promise<futureListResponse> => {
    sendAnalyticsEvent(EventName.FUTURE_LIST)
    return await makeGetRequest(atob(URLKey) + "/getFutureListByTradingSymbol", { tradingSymbol })
}
