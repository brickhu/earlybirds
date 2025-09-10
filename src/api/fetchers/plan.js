import { AO, DEFAULT_HYPERBEAM_NODE_URL , HB } from "../index";
import { storage } from "../../lib/storage";


import { fetchFeedById } from "./feeds";
import { Table } from "../../components/table";

/**
 * Retrieves the state associated with the given `pid` (agent ID).
 * 
 * This function first checks for cached data in storage using a key
 * derived from the `pid`. If no valid cached data is found or if `refetching` is true,
 * it performs a dry run action to fetch the latest state data from the server.
 * The fetched data is then stored in session storage with a time-to-live (TTL) of 60 seconds.
 * 
 * @param {string} pid - The agent ID for which the state is to be retrieved.
 * @param {Object} options - Additional options for the fetch operation.
 * @param {boolean} options.refetching - Indicates whether to force fetching fresh data from the server.
 * @param {*} options.value - An optional value (not used in the current implementation).
 * 
 * @returns {Promise<Object|null>|Object|null} - Returns cached data if available and valid,
 * or a promise resolving to the fetched data. Returns `null` if no data is available.
 * 
 * @throws {Error} - Throws an error if an exception occurs during the fetch operation.
 */
export const fetchPlan = ({pid,key}, { refetching, value }) => {
  try {
    console.log("fetchPlan", pid,key)
   
    if (!pid || !key) return;
    let ao = new AO()
    return ao.dryrun(pid, { Action: "Get", Table : "Plans", Key: key })
      .then(({ Messages }) => {
        if (Messages?.[0]?.Data) {
          return JSON.parse(Messages?.[0]?.Data)
        }
      })
      .catch((error)=>{throw new Error(error)} );
  } catch (error) {
    throw new Error(error)
  }
}


export const hbFetchPlan = async({pid,id, url = import.meta.env.VITE_HYPERBEAM_URL }, { refetching, value }) => {
  try {
    if (!id || !pid) return null;
    let key = `plan-${pid}-${id}`
    
    let plan
    if(storage.get(key)!=null && !refetching){ 
      console.log('🔗 hbFetchPlan: ', key);
      plan = storage.get(key)
    }else{
      let hb = new HB({url})
      const path = `/${pid}~process@1.0/now/cache/plans/${id}/serialize~json@1.0`
      console.log('🔗 hbFetchPlan: ', path);
      plan = await hb.fetch(path)
      if(plan&&plan?.id){
        storage.set(key,plan,"sessionStorage")
      }
    }

    // if(plan?.latest_checkin&&typeof(plan?.latest_checkin)=="string"){
    //   const latest_checkin_detail = await fetchFeedById(plan?.latest_checkin,{refetching:false})
    //   plan.latest_checkin_detail = latest_checkin_detail
    // }
    console.log("✅️ hbFetchPlan :",plan)
    return plan

  } catch (error) {
    throw new Error(error)
  }
}
