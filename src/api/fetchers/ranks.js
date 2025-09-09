import { HB,DEFAULT_HYPERBEAM_NODE_URL } from "../index";

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
