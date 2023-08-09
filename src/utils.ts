export const sleep = (timeInMillis: number) =>{
    return new Promise((resolve)=>{
        setTimeout(resolve, timeInMillis)
    })
}
