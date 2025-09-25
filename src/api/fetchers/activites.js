import { HB } from "../index";
import { storage } from "../../lib/storage";
import { action } from "wao/utils";

const formatActivites = (node,cursor)=>{
  const tags = {}
  for (const {name,value} of node.tags) {
    tags[name] = value
  }

  return({
    recipient : node?.recipient,
    id : node.id,
    action : tags?.Action,
    timestamp : node?.block?.timestamp * 1000,
    tags,
    cursor
  })
}

export async function fetchUserActivites([{address,checkin_pid},{size,cursor}],{refetching}){

  if(!checkin_pid || !address) return null
  console.log("fetching feeds",checkin_pid,address)
  
  try {
    const query_str =  `
      query{
        transactions(
          first: ${size||100},
          after: "${cursor?cursor:''}",
          recipients: ["${address}"]
          tags: [{
              name: "From-Process",
              values: ["${checkin_pid}"]
            },{
              name: "Action",
              values: ["Checked-In","Plan-Created","Plan-Updated"]
            },{
              name: "Data-Protocol",
              values: ["ao"]
            },{
              name: "Variant",
              values: ["ao.TN.1"]
            },{
              name: "Type", 
              values: ["Message"]
            }]
        ) {
          edges {
            cursor
            node {
              id
              tags {
                name,
                value
              }
              block {
                timestamp,
                height
              }
              recipient
            }
          }
        }
      }
    `
    let hb = new HB()
    const res = await hb.query(query_str)
    let activites
    if(res?.length > 0){
      activites = res.map(({node,cursor})=>{
        return formatActivites(node,cursor)
      }).sort((a,b)=>{
        const ts_a = a.timestamp === 0 ? new Date().getTime() : a.timestamp
        const ts_b = b.timestamp === 0 ? new Date().getTime() : b.timestamp
        return ts_b - ts_a
      })
    }
    
    return activites
  } catch (error) {
    console.error("fetch feeds faild.", error)
    throw new Error(error)
  }
}

