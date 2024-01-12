import {makePostRequest} from "./requests";
import {
    PaginationDetails,
    SearchInstrumentsPatternRequest,
    SearchInstrumentsRequest,
    SearchInstrumentsResponse
} from "@stockseyes/market-domain";

const ApiKey = "aHR0cHM6Ly9zdG9ja3NleWVzY2xvdWRydW4tbjJlcm1vdmk2cS1lbC5hLnJ1bi5hcHA=";

export const searchInstruments = async (searchInstrumentsRequest: SearchInstrumentsRequest, searchInstrumentsPatternRequest: SearchInstrumentsPatternRequest, paginationDetails: PaginationDetails): Promise<SearchInstrumentsResponse> => {
    // TODO: explore authenticated invocations
    const response = await makePostRequest(atob(ApiKey) + "/searchInstruments", {
        filterRequest: searchInstrumentsRequest,
        searchPatterns: searchInstrumentsPatternRequest,
        paginationDetails
    });
    return response as SearchInstrumentsResponse;
}
