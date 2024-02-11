export const getShortenedAppId = (appId: string) => {
    if(appId === "1:320540998409:web:8c08befa763127716831d8") {
        return "firstTrade"
    }
    throw new Error("Invalid appId")
}
