import {makePostRequest} from "./requests";
import {SearchInstrumentsResponse} from "./domain";

const ApiKey = "aHR0cHM6Ly9zdG9ja3NleWVzY2xvdWRydW4tbjJlcm1vdmk2cS1lbC5hLnJ1bi5hcHA=";

// const ApiKey = "aHR0cDovL2xvY2FsaG9zdDo4MDgw";

export enum Exchange {
    NSE = "NSE",
    BSE = "BSE",
    BCD = "BCD",
    MCX = "MCX",
    CDS = "CDS",
    NFO = "NFO",
}

export enum Segment {
    BCD_OPT = "BCD-OPT",
    BCD_FUT = "BCD-FUT",
    BCD = "BCD",
    BSE = "BSE",
    INDICES = "INDICES",
    CDS_OPT = "CDS-OPT",
    CDS_FUT = "CDS-FUT",
    MCX_FUT = "MCX-FUT",
    MCX_OPT = "MCX-OPT",
    NFO_OPT = "NFO-OPT",
    NFO_FUT = "NFO-FUT",
    NSE = "NSE",
}

export enum InstrumentType {
    CE = "CE",
    PE = "PE",
    FUT = "FUT",
    EQ = "EQ",
}

export interface SearchInstrumentsRequest {
    instrument_token?: string[],
    exchange_token?: string[],
    tradingsymbol?: string[],
    name?: string[],
    last_price?: string[],
    expiry?: string[],
    strike?: string[],
    tick_size?: string[],
    lot_size?: string[],
    instrument_type?: InstrumentType[],
    segment?: Segment[],
    exchange?: Exchange[],
}

export interface SearchInstrumentsPatternRequest {
    tradingsymbol?: string,
}

export interface PaginationDetails {
    offset?: number,
    limit?: number
}

export const searchInstruments = async (searchInstrumentsRequest: SearchInstrumentsRequest, searchInstrumentsPatternRequest: SearchInstrumentsPatternRequest, paginationDetails: PaginationDetails): Promise<SearchInstrumentsResponse> => {
    // TODO: explore authenticated invocations
    const response = await makePostRequest(atob(ApiKey) + "/searchInstruments", {
        filterRequest: searchInstrumentsRequest,
        searchPatterns: searchInstrumentsPatternRequest,
        paginationDetails
    });
    return response as SearchInstrumentsResponse;
}
