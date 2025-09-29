
import { Switch, Match, createSignal, createEffect, batch, createResource } from "solid-js"
import { useGlobal, useUser, useClock } from "../context"
import { Icon } from "@iconify-icon/solid"
import { useWallet } from "arwallet-solid-kit"
import { AoCaptcha } from "aocaptcha-sdk"
import Editable from "./editable"
import { ColorPicker } from "./colorpicker"
import { hexToHsl,hslToHex } from "../lib/color"
import { getContrastYIQ, displayZoneTime, toBalanceValue } from "../lib/units"
import { A } from "@solidjs/router"
import Checkineditor from "./checkineditor";


export default props => {
  let _color_picker
  let _checkineditor
  const { walletConnectionCheck,address} = useWallet()
  const {time,date} = useClock()
  const {toast,checkinProcess,setStyle} = useGlobal()
  const {profile , refetchProfile , plan , latest, openPlanner, refetchArBalance, refetchWormBalance} = useUser()
  
  const [color,setColor] = createSignal()
  const [checked,setChecked] = createSignal(false)
  const [checkin,setCheckin] = createSignal()

  
  const HandleEarlyCheckin = ()=>{
    if(!plan()) {
      console.log("missed plan")
      openPlanner()
      return
    }else{
      console.log("plan:",plan())
      let now = new Date().getTime()
      console.log('now: ', now);
      let start = plan()?.next
      console.log('start: ', start);
      let end = plan()?.next + 2*60*60*1000
      console.log('end: ', end);
      if(now>=end){
        openPlanner(plan())
        return
      }
      _checkineditor.show()
    }
  }

  createEffect(async()=>{
    if(address() && profile?.state === "ready" && profile()){
      let {latest_checkin} = profile()
      if(!latest_checkin || typeof latest_checkin !== "object"){
        batch(()=>{
          setCheckin(null)
          setColor(null)
          setChecked(false)
        })
      }
      let {timestamp,offset,color} = latest_checkin
      if(date() == displayZoneTime(timestamp,offset)?.date){
        console.log("checked!")
        batch(()=>{
          setCheckin(latest_checkin)
          setColor(color?.length === 7?color:null)
          setChecked(true)
        })
      }else{
        batch(()=>{
          setCheckin(null)
          setColor(null)
          setChecked(false)
        })
      }
    }    
  })
  createEffect((()=>{
    if(color()){
      const _color = color()
      const _constras_color = getContrastYIQ(_color)
      setStyle({
        "--color-primary" : _color,
        "--color-primary-content" : _constras_color
      })
    }else{
      setStyle({
        "--color-primary" : "",
        "--color-primary-content" : ""
      })
    }
  }))

  return(
    <>
    <div 
      // style={style()}
      class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 container mx-auto py-10  transition-all rounded-box  "
      classList = {{
        "bg-base-300 text-base-content" : !checked(),
        "bg-primary/10 text-primary-content" : checked()
      }}
    >
      <div class="col-span-1 lg:col-span-8 flex flex-col items-center justify-center lg:items-start">
        <div class="text-xl text-current/60">{date()}</div>
        <div class="text-4xl font-bold proportional-nums lining-nums slashed-zero">
          <Show when={checked()} fallback={time()}>
            <span className="text-primary">{displayZoneTime(checkin()?.timestamp,checkin()?.offset)?.clock}</span>
          </Show>
        </div>
      </div>
      
      <Switch>
        <Match when={!checked()}>
          <div class="col-span-1 lg:col-span-4 flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-start gap-4">
            <button 
              class="btn btn-xl btn-primary w-[80%] lg:w-fit rounded-full" 
              use:walletConnectionCheck={HandleEarlyCheckin} 
              disabled={profile.loading}
              classList={{"skeleton":profile.loading}}
            >
                Early Checkin <Icon icon="iconoir:arrow-right" />
              </button>
            <div class="text-xs text-current/60 ">From {checkinProcess()?.['Checkin-Time-Range']?.[0]} to {checkinProcess()?.['Checkin-Time-Range']?.[2]} AM</div>
          </div>
        </Match>
        <Match when={profile?.state === "ready" && checked() && checkin()}>
          <div class="col-span-1 lg:col-span-4 flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-start gap-4">
            <A href={`/checkin/${checkin()?.id}`} className="btn btn-xl btn-primary btn-circle">
              <Icon icon="iconoir:check" />
            </A>
            <div className="text-xs text-current/60">Checked in</div>
          </div>
        </Match>
      </Switch>


    
    </div>
    <ColorPicker 
        ref={_color_picker} onChange={e=>{
          if(e?.[0]){
            setColor(hslToHex(e?.[0]))
          }
        }} 
        defaultValue={color()}
      />
      <Checkineditor 
        ref={_checkineditor}
        address={address()}
        date={date()}
        onCheckedSuccessful={(checked)=>{
          batch(()=>{
            setChecked(true)
            setCheckin(checked)
          })
          toast.success(`You’ve checked in and got ${toBalanceValue(checkin()?.mint,12)} $WORM!`)
          if(props?.onCheckedSuccessful){
            props.onCheckedSuccessful(checked)
          }
        }}
      />
    </>
  )
}