import {makePostRequest} from "./requests";
import {
    PaginationDetails,
    SearchInstrumentsPatternRequest,
    SearchInstrumentsRequest,
    SearchInstrumentsResponse
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
