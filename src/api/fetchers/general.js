import { AO, HB , DEFAULT_HYPERBEAM_NODE_URL } from "../index";
import { storage } from "../../lib/storage";


/**
 * Fetches the state for a given `pid` (agent ID).
 *
 * This function checks session storage for cached state data using a key based on `pid`.
 * If valid cached data exists and `refetching` is not true, it returns the cached data.
 * Otherwise, it fetches the latest state from the server using a dry run action,
 * then caches the result in session storage with a 60-second TTL.
 *
 * @param {string} pid - The agent ID whose state should be fetched.
 * @param {Object} options - Options for the fetch operation.
 * @param {boolean} options.refetching - If true, forces a fresh fetch from the server.
 * @param {*} options.value - Optional value (currently unused).
 *
 * @returns {Promise<Object|null>|Object|null} - Returns cached data if available,
 * or a promise that resolves to the fetched data. Returns `null` if no data is found.
 *
 * @throws {Error} - Throws if an error occurs during fetching.
 */
export const fetchDataByAction = ({pid,action}, { refetching, value }) => {
  try {
    console.log("fetchDataByAction", pid)
    if (!pid||!action) return;
    let ao = new AO()
    return ao.dryrun(pid, { Action: action})
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


export const hbFetchDataByAction = ({pid,action,url = DEFAULT_HYPERBEAM_NODE_URL}, { refetching, value }) => {
  try {
    console.log("hbFetchDataByAction", pid)
    if (!pid||!action) return;

    let hb = new HB({url})
    return hb.dryrun(pid, { Action: action})
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