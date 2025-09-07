import { HB } from "../index";
import { storage } from "../../lib/storage";

const formatMintData = (node)=>{
  const tags = {}
  for (const {name,value} of node.tags) {
    tags[name] = value
  }

  return({
    id : node?.id,
    address : tags?.['Mint-For'],
    quantity : tags?.Quantity,
    message_id : tags?.['Message-Id'],
    pushed_for : tags?.['Pushed-For'],
    timestamp : node?.block?.timestamp && node?.block?.timestamp * 1000
  })
}



export async function fetchMints([{from,to},{size,cursor}],{refetching}){
  console.log(`fetching mints by form : ${from} -> ${to}`)

  if(!from) return null
  if(!to) return null
  try {
   const query_str =  `
        query{
          transactions(
            first: ${size||100},
            recipients:["${to}"],
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
              values: ["Minted"]
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
      console.log('fetchMints result: ', res);


     return res.map(({node,cursor})=>formatMintData(node))
    

  } catch (error) {
    console.log('error: ', error);
    
  }
}