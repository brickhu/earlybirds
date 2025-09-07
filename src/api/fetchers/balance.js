import { HB, AO, DEFAULT_HYPERBEAM_NODE_URL } from "../index";
import { storage } from "../../lib/storage";
let ao = new AO()
export const fetchBalance = ({pid,address},{refetching,value}) => {
   try {
    if (!pid||!address) return;
    console.log("fetchBalance",pid,address)
    return ao.dryrun(pid,{Action: "Balance", Recipient:address})
      .then(({ Messages }) => {
        if (Messages?.[0]?.Data) {
          return Messages?.[0]?.Data
        }else{
          return 0
        }
      });
    } catch (error) {
      throw error;
    }
}

export const hbFetchBalance = async({pid,address,node = DEFAULT_HYPERBEAM_NODE_URL},{refetching,value}) => {
   try {
    if (!pid||!address||!node) return;
    let hb = new HB({url: import.meta.env.VITE_HYPERBEAM_URL || node})
    const path = `/${pid}~process@1.0/now/cache/balances/${address}/serialize~json@1.0`
    console.log("🔗 hbFetchBalance",path)
    const res = await hb.fetch(path).then(res=>res?.body || 0).catch(()=>0)
    console.log("✅️ hbFetchBalance",res)
    return res || 0
  } catch (error) {
    throw error;
  }
}