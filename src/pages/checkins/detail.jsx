import { MetaProvider, Style, Title } from "@solidjs/meta";
import { createEffect, createMemo, createResource, createSignal, For, onCleanup, Suspense } from "solid-js"
import { fetchFeedById } from "../../api"
import { useGlobal, useClock } from "../../context"
import { Currency } from "../../components/currency"
import { A, useParams } from "@solidjs/router";
import Avatar from "../../components/avatar"
import { Icon } from "@iconify-icon/solid"
import { Shorter } from "../../components/shorter"
import { getContrastYIQ,displayZoneTime } from "../../lib/units"
import Share from "../../components/share";
import Info from "../../components/info";
import worm from "../worm";
export default props => {
  let _share
  let _info
  const {env} = useGlobal()
  const {id} = useParams();
  const [detail,{refetch}] = createResource(()=>id,fetchFeedById)
  const [style,setStyle] = createSignal({
    "--color-bg" : "var(--color-base-200)",
    "--color-fg" : "var(--color-base-content)"
  })

  createEffect(()=>{
    if(detail()?.color && detail()?.color?.length === 7){
      const color = detail()?.color 
      const constras_color = getContrastYIQ(color)
      setStyle({
        "--color-bg" : color,
        "--color-fg" : constras_color
      })
    }
  })
  
  return(
    <>
    <MetaProvider>
      <Style>
      </Style>
    </MetaProvider>
    
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 h-full w-full p-4">
      <div 
        className="col-span-full flex flex-col justify-between w-full h-full p-8 rounded-2xl bg-[var(--color-bg)] text-[var(--color-fg)] transition-all border border-[var(--color-fg)]/5"
        style={style()}
      >
        <Suspense fallback= {`loading ${id}...`}>
          <div>
            <div className=" flex items-center gap-4">
              <A href={"/profile/"+detail()?.recipient}><Avatar username={detail()?.recipient} className="size-8"/></A>
            <span className="lg:text-lg">{detail()?.time && displayZoneTime(detail()?.time,detail()?.timezone || 0).date}</span>
          </div>
          <p className="card-text py-4"> {detail()?.note}</p>
         

          </div>
          
          <div className="flex items-center justify-between">
             <ul className="text-current/60">
            <li className="flex items-center gap-2">
              <Icon icon="iconoir:clock" />
              <span>{detail()?.time && displayZoneTime(detail()?.time, detail()?.timezone).time}</span>
            </li>
            {/* <li className="flex items-center gap-2">
              <Icon icon="iconoir:time-zone" />
              <span>{detail()?.timezone && formatUTCOffsetString(detail()?.timezone)}</span>
            </li> */}
            <li className="flex items-center gap-2">
              <Icon icon="iconoir:coin" />
              <Currency value={detail()?.mint} precision={12} fixed={12} ticker="$WORM"/>
            </li>

            
          </ul>
            {/* <A className="flex items-center gap-1 text-current/60 after:content-['_↗']" href={env.ao_browser + "#/message/" + detail()?.mid + "?tab=linked"} target="_blank">
              <Shorter value={detail()?.mid} length="4"/>
            </A> */}
            <div className="flex gap-2 items-center">
              <button 
                className="btn btn-circle bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]"
                onClick={()=>{
                  _info.show()
                }}
              >
                <Icon icon="clarity:help-info-line" />
              </button>
              
              <button 
                className="btn btn-circle bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]"
                onClick={()=>{
                  const {date, time} = displayZoneTime(detail()?.time,detail()?.timezone || 0)
                  _share.show({
                    id : id,
                    background : detail()?.color || "#fefefe" ,
                    textColor : detail()?.color ? getContrastYIQ(detail()?.color) : "#ccc",
                    date : date,
                    time : time,
                    note : detail()?.note,
                    mint : detail()?.mint,
                    ...detail()
                  })

                }}
              >
                <Icon icon="iconoir:share-android" />
              </button>
            </div>
          </div>
        </Suspense>
      </div>
      <Share ref={_share}/>
      <Info ref={_info}/>
    </div>
    </>
  )
}