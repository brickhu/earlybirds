import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()
export const fetchProcessInfo = (pid,{refetching,value}) => {
   try {
    console.log("fetchProcessInfo",pid)
      if (!pid) return;
      const key = `process_info_${pid}`;
      let data = storage.get(key);
      if (data && !refetching) return data;
      return ao.dryrun(pid,{Action: "Info"})
      .then(({ Messages }) => {
        if (Messages?.[0]?.Tags) {
          const tags = { Id : pid}
          for (const e of Messages?.[0]?.Tags) {
            tags[e.name] = e.value
          }
          storage.set(key, tags, { ttl: 86400000, type: 'localStorage' });
          return tags;
        }
      });
    } catch (error) {
      console.error(error)
      throw error;
    }
}