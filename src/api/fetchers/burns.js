import { HB } from "../index";
import { storage } from "../../lib/storage";

const formatMintData = (node)=>{
  const tags = {}
  for (const {name,value} of node.tags) {
    tags[name] = value
  }

  return({
    id : node?.id,
    address : tags?.['X-Burn-For'],
    quantity : tags?.Quantity,
    message_id : tags?.['X-Bid-Id'],
    pushed_for : tags?.['Pushed-For'],
    timestamp : node?.block?.timestamp && node?.block?.timestamp * 1000
  })
}



export async function fetchBurns([{from,to},{size,cursor}],{refetching}){
  console.log(`fetching mints by form : ${from} -> ${to}`)

  if(!from) return null
  if(!to) return null
  try {
   const query_str =  `
        query{
          transactions(
            first: ${size||100},
            after: "${cursor?cursor:''}",
            tags: [{
              name: "Data-Protocol",
              values: ["ao"]
            },{
              name: "Variant",
              values: ["ao.TN.1"]
            },{
              name: "Type", 
              values: ["Message"]
            },{
              name: "From-Process",
              values: ["${from}"]
            },{
              name: "Action",
              values: ["Burned"]
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

      console.log(query_str)
      
      const res = await new HB().query(query_str)
      console.log('fetchBurns result: ', res);


     return res.map(({node,cursor})=>formatMintData(node))
    

  } catch (error) {
    console.log('error: ', error);
    throw(error)
  }
}