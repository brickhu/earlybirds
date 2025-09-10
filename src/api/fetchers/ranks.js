import { HB,DEFAULT_HYPERBEAM_NODE_URL,AO } from "../index";

export const hbFetchRanks = async(pid, { refetching, value }) => {
  try {
    if (!pid) return;
    let hb = new HB({url:import.meta.env.VITE_HYPERBEAM_URL || DEFAULT_HYPERBEAM_NODE_URL})
    const path = `/${pid}~process@1.0/now/cache/ranks/serialize~json@1.0`
    console.log('🔗 hbFetchRanks: ', path);
    const ranks = await hb.fetch(path)
    console.log('✅️ hbFetchRanks: ', ranks);
    return ranks
  } catch (error) {
    throw new Error(error)
  }
}


export const fetchRanks = (pid, { refetching, value }) => {
  try {
    console.log("fetchRanks", pid)
    if (!pid) return;
    let ao = new AO()
    return ao.dryrun(pid, { Action: "Ranks" })
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
