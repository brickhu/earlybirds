import { HB } from "../index";
import { storage } from "../../lib/storage";

const formatCheckinData = (node)=>{
  const tags = {}
  for (const {name,value} of node.tags) {
    tags[name] = value
  }

  return({
    recipient : node?.recipient,
    mid : node.id,
    cid : tags?.['Checkin-Id'],
    time : tags?.['Checkin-Time']&&Number(tags?.['Checkin-Time']) || node?.block?.timestamp * 1000,
    mint : tags?.['Mint-Amount']&&Number(tags?.['Mint-Amount']),
    note : tags?.['Checkin-Note'],
    color : tags?.['Checkin-Color'],
    timezone : tags?.['Checkin-Time-Offset']&&Number(tags?.['Checkin-Time-Offset']),
    plan : tags?.['Checkin-Plan']
  })
}

export async function fetchFeeds([pid,{size,cursor}],{refetching}){
  console.log("fetching feeds",pid)

  if(!pid) return null

  
  try {
    const query_str =  `
      query{
        transactions(
          first: ${size||100},
          after: "${cursor?cursor:''}",
          tags: [{
              name: "From-Process",
              values: ["${pid}"]
            },{
              name: "Action",
              values: ["Checked-In"]
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
    let feeds
    if(res?.length > 0){
      feeds = res.map(({node,cursor})=>{
        return formatCheckinData(node)
      })
    }
    
    return feeds
  } catch (error) {
    console.error("fetch feeds faild.", error)
    throw new Error(error)
  }
}

export async function fetchFeedById(id,{refetching}){

  if(!id) return
  try {
    let key = "ebs_checkin_"+id
    let localdata = storage.get(key,"localStorage")
    let data
    if(localdata&&!refetching) {
      console.log("🔗 fetchFeedById: ",key)
      data = localdata
    }else{
      const query_str =  `
        query{
          transactions(
            first : 1,
            tags: [{
              name: "Checkin-Id",
              values: ["${id}"]
            },{
              name: "Action",
              values: ["Checked-In"]
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
                  timestamp
                }
                recipient
              }
            }
          }
        }
      `
      console.log("🔗 fetchFeedById: ",query_str)
      let hb = new HB()
      const res = await hb.query(query_str)
      console.log('res: ', res);
      if(!res&&res?.length<1) {
        throw("no result!")
      }else{
        data = await formatCheckinData(res?.[0]?.node)
        storage.set(key,data,"localStorage")
      }
    }
    console.log("✅️ fetchFeedById : ", data)
    return data
  } catch (error) {
    console.error('⛔ feftchFeedById: ', error);
    return null
  }
}