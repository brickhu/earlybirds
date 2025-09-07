import { AO, HB , DEFAULT_HYPERBEAM_NODE_URL } from "../index";

import { storage } from "../../lib/storage";
import { hbFetchPlan } from "./plan";
import { fetchFeedById } from "./feeds"


/**
 * Fetches the user profile data from the "Players" table using the provided pid and address.
 *
 * @param {Object} params - The parameters for fetching the user profile.
 * @param {string} params.pid - The player ID.
 * @param {string} params.address - The address key for the user profile.
 * @param {Object} options - Additional options for the fetch operation.
 * @param {boolean} options.refetching - Indicates if the profile is being refetched.
 * @param {*} options.value - Additional value for the fetch operation.
 * @returns {Promise<Object|undefined>} Resolves with the parsed user profile data if available, otherwise undefined.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const fetchUserProfile = ({pid,address}, { refetching, value }) => {
  try {
    console.log("fetchUserProfile", pid,address)
   
    if (!pid || !address) return;
    let ao = new AO()
    return ao.dryrun(pid, { Action: "Get", Table : "Players", Key: address })
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

export const hbFetchUserProfile = async({ pid,address,node = DEFAULT_HYPERBEAM_NODE_URL }, { refetching, value }) => {
  try {
    if (!pid || !address || !node) return;
    let key = `profile-${pid}-${address}`
    let localData = await storage.get(key)
    let profile
    
    if(localData!=null && !refetching){
      console.log('🔗 hbFetchUserProfile: ', key);
      profile = localData
      console.log('profile: ', profile);
    }else{
      let hb = new HB({url:import.meta.env.VITE_HYPERBEAM_URL || node})
      const path = `/${pid}~process@1.0/now/cache/players/${address}/serialize~json@1.0`
      console.log('🔗 hbFetchUserProfile: ', path);
      profile = await hb.fetch(path)
      if(profile){
        storage.set(key,profile,{type:"sessionStorage"})
      }
    }
    
    
    if(profile?.plan && typeof(profile?.plan) == "string"){
      const plan_detail = await hbFetchPlan({pid,id:profile?.plan},{refetching:true})
      profile.plan_detail = plan_detail
    }

    if(profile?.latest_checkin && typeof(profile?.latest_checkin) == "string"){
      const latest_checkin_detail = await fetchFeedById(profile?.latest_checkin,{refetching:false})
      profile.latest_checkin_detail = latest_checkin_detail
    }
    console.log('✅️ hbFetchUserProfile: ', profile);
    
    return profile

  } catch (error) {
    throw new Error(error)
  }
}


export const hbFetchLatestCheckinByAddress = async({ pid,address,node = DEFAULT_HYPERBEAM_NODE_URL }, { refetching, value }) => {
  try {
    if (!pid || !address) return;
    let key = `latest-${pid}-${address}`
    let localData = await storage.get(key)
    
    let profile
    

    if(localData!=null && !refetching){
      console.log('🔗 hbFetchUserProfile: ', key);
      profile = localData
      console.log('profile: ', profile);
    }else{
      let hb = new HB({url:node})
      const path = `/${pid}~process@1.0/now/cache/players/${address}/serialize~json@1.0`
      console.log('🔗 hbFetchUserProfile: ', path);
      profile = await hb.fetch(path)
      if(profile){
        storage.set(key,profile,{type:"sessionStorage"})
      }
    }
    
    
    if(profile?.plan && typeof(profile?.plan) == "string"){
      const plan_detail = await hbFetchPlan({pid,id:profile?.plan},{refetching:true})
      profile.plan_detail = plan_detail
    }

    // if(profile?.latest_checkin && typeof(profile?.latest_checkin) == "string"){
    //   const latest_checkin_detail = await fetchFeedById(profile?.latest_checkin,{refetching:false})
    //   profile.latest_checkin_detail = latest_checkin_detail
    // }
    console.log('✅️ hbFetchUserProfile: ', profile);
    
    return profile

  } catch (error) {
    throw new Error(error)
  }
}