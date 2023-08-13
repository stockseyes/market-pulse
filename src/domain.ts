export enum Fields {
    TRADABLE = "tradable",
    MODE = "mode",
    INSTRUMENT_TOKEN = "instrument_token",
    LAST_PRICE = "last_price",
    LAST_QUANTITY = "last_quantity",
    AVERAGE_PRICE = "average_price",
    VOLUME = "volume",
    BUY_QUANTITY = "buy_quantity",
    SELL_QUANTITY = "sell_quantity",
    OHLC = "ohlc",
    CHANGE = "change",
    LAST_TRADE_TIME = "last_trade_time",
    TIMESTAMP = "timestamp",
    OI = "oi",
    OI_DAY_HIGH = "oi_day_high",
    OI_DAY_LOW = "oi_day_low",
    DEPTH = "depth",
    TRADING_SYMBOL = "trading_symbol"
}

interface OHLCData {
    open?: number;
    high?: number;
    low?: number;
    close?: number;
}

interface Depth {
    quantity: number;
    price: number;
    orders: number;
}

interface DepthData {
    buy?: Depth[];
    sell?: Depth[];
}


export interface Instrument {
    instrument_token: string;
    exchange_token: string;
    tradingsymbol: string;
    name: string;
    last_price: string;
    expiry: string;
    strike: string;
    tick_size: string;
    lot_size: string;
    instrument_type: string;
    segment: string;
    exchange: string;
}


export interface MarketData {
    tradable?: boolean;
    mode?: string;
    instrument_token: number;
    last_price?: number;
    last_quantity?: number;
    average_price?: number;
    volume?: number;
    buy_quantity?: number;
    sell_quantity?: number;
    ohlc?: OHLCData;
    change?: number;
    last_trade_time?: number;
    timestamp?: number;
    oi?: number;
    oi_day_high?: number;
    oi_day_low?: number;
    depth?: DepthData;
    trading_symbol: string
}

export interface Unsubscribe {
    /** Removes the listener when invoked. */
    (): void;
}
