import {makePostRequest} from "./requests";
import {Instrument} from "./domain";

const ApiKey = "aHR0cHM6Ly9zdG9ja3NleWVzY2xvdWRydW4tbjJlcm1vdmk2cS1lbC5hLnJ1bi5hcHA=";
// const ApiKey = "aHR0cDovL2xvY2FsaG9zdDo4MDgw";

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
    instrument_type?: string[],
    segment?: string[],
    exchange?: string[],
}

export const searchInstruments = async (searchInstrumentsRequest: SearchInstrumentsRequest): Promise<Instrument[]> => {
    // TODO: explore authenticated invocations
    const response = await makePostRequest(atob(ApiKey) + "/searchInstruments", {filterRequest :searchInstrumentsRequest});
    return response as Instrument[];
}
