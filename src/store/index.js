import { createResource, createRoot} from "solid-js";
import { createStore } from "solid-js/store";
// import { hbFetchState } from "../api"
import  * as statics from "./static"
import { createPagination } from "./pagenation";


export const [store,setStore] = createStore({})
export const { env } = statics
// export const [ checkinState,{refetch:refetchCheckinState} ] = createRoot(()=>createResource(()=>env?.checkin_pid ,hbFetchState))
export const [ greetings,setGreetings ] = createRoot(()=>createResource(()=>{},()=>(["ffffffff","56778888"])))

/**
 * Create and manage a global resource.
 * @param {string} key Unique identifier for the resource
 * @param {Function} fetcher Function to fetch the resource
 */
export function cacheResource(key, fn) {
  if(store[key]){
    return store[key]
  }else{
    setStore(key, fn);
    return fn()
  }
}

export { createPagination } from "./pagenation"


// export function createSharedResource(type,signal,fetcher,key) {
//   if(store[key]){
//     return resourcesStore[key]
//   }else{
//     setStore(key, fn);
//     return fn()
//   }
// }