
import { Switch, Match, createSignal, createEffect, batch, createResource } from "solid-js"
import { useGlobal, useUser, useClock } from "../context"
import { Icon } from "@iconify-icon/solid"
import { useWallet } from "arwallet-solid-kit"
import { AoCaptcha } from 'aocaptcha'
import Editable from "./editable"
import { ColorPicker } from "./colorpicker"
import { hexToHsl,hslToHex } from "../lib/color"
import { getContrastYIQ, displayZoneTime } from "../lib/units"
import { A } from "@solidjs/router"



const views = Object.freeze({
  DEFAULT: 0,
  PREVIEW: 1,
  EDITING: 2,
  CHECKED: 3
});

export default props => {
  let _color_picker
  const {wallet, walletConnectionCheck,address} = useWallet()
  const {time,date,getTheUserTimeByTimestamp} = useClock()
  const {env,toast,checkinProcess,getARandomGreeting,refetchCheckinState} = useGlobal()
  const {profile , refetchProfile , plan , latest, openPlanner, refetchArBalance, refetchWormBalance} = useUser()
  
  const [greeting, setGreeting ] = createSignal()
  const [color,setColor] = createSignal()
  const [view,setView] = createSignal(views.DEFAULT)
  const [posting,setPosting] = createSignal(false)
  const [checked,setChecked] = createSignal(false)
  const [available,setAvailable] = createSignal(false)
  const [style,setStyle] = createSignal()
  const [checkin,setCheckin] = createSignal()

  const captcha = new AoCaptcha(env.captcha_pid,{})

  const HandleSubmitCheckin = async()=>{
    try{
      setPosting(true)
      let now = new Date().getTime()
      console.log('now: ', now);
      if(!address()) return
      if(!plan()) {
        console.log("Missed plan")
        return
      }
      if(!plan()?.next) {
        console.log("the plan is expired")
        return
      }
      let start = plan()?.next
      console.log('start: ', start);
      let end = plan()?.next + 2*60*60*1000
      console.log('end: ', end);
      if(now>=start&&now<=end){
        // const request = await captcha.request("Checkin",wallet(),{['X-Note']:greeting()||getARandomGreeting(),['X-Color']:color()})
        // if(!request){throw("request failed")}
        // console.log('request: ', request);
        // const verified = await captcha.verify(request,wallet())
        // if(!verified){throw("verified failed")}
        // console.log('verified: ', verified);

        const request = await captcha.request({
          Recipient : env.checkin_pid,
          Type : "Checkin",
          ['X-Note'] : greeting()||getARandomGreeting(),
          ['X-Color']:color()
        },wallet())
        if(!request){throw("request failed")}
        console.log('request: ', request);
        
        const verified = await captcha.verify(request,wallet())
        if(!verified){throw("verified failed")}
        console.log('verified: ', verified);

        await refetchProfile()
        
        let { latest_checkin } = await profile()
        console.log('checkin: ', latest_checkin);
        if(latest_checkin && typeof latest_checkin == "object" && latest_checkin?.id === request?.id){
          let {color} = latest_checkin
          batch(()=>{
            setCheckin(latest_checkin)
            setView(views.EDITING)
            setChecked(true)
            setColor(color?.length === 7?color:null)
          })
        }
        
        toast.success(`Successfully checked in and earned ${latest_checkin?.mint || 0} $WROM.`)
        
        if(props?.onCheckedSuccessful){
          props?.onCheckedSuccessful(latest_checkin)
        }
      }else{
        throw("Outside check-in time.")
      } 
    }catch(err){
      console.error(err)
      toast.error("Checked in Failed!")
    }finally{
      setPosting(false)
    }
  }

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
      if(now>=start&&now<=end){
        setAvailable(true)
      }else{
        setAvailable(false)
      }
      if(!greeting()){
        const g = getARandomGreeting()
        console.log("Greeting:",g)
        setGreeting(g?.content || "Earlybirds catch the 🐛$worm")
      }
      
      setView(views.EDITING)
    }
  }

  createEffect(async()=>{
    
    if(address() && profile?.state === "ready" && profile()){
      let {latest_checkin} = profile()
      if(!latest_checkin || typeof latest_checkin !== "object") return
      let {timestamp,offset,color} = latest_checkin
      if(date() == displayZoneTime(timestamp,offset)?.date){
        batch(()=>{
          setCheckin(latest_checkin)
          setColor(color?.length === 7?color:null)
          setView(views.EDITING)
          setChecked(true)
        })
      }else{
        batch(()=>{
          setCheckin(null)
          setColor(null)
          setView(views.DEFAULT)
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
        "--color-bg" : _color,
        "--color-fg" : _constras_color
      })
    }
  }))


  
  return(
    <div 
      style={style()}
      class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 container mx-auto py-12  border-current/10 transition-all"
      classList = {{
        " bg-[var(--color-bg)] text-[var(--color-fg)] rounded-2xl border" : view()==views.EDITING,
        "shadow-none border-y" : view()==views.DEFAULT || view()==views.CHECKED
      }}
    >
      <Switch>
        <Match when={view()==views.DEFAULT}>
          <div class="col-span-1 lg:col-span-8 flex flex-col items-center justify-center lg:items-start">
            <div class="text-xl text-current/60">{date()}</div>
            <div class="text-4xl font-bold proportional-nums lining-nums slashed-zero">{time()}</div>
          </div>
          <div class="col-span-1 lg:col-span-4 flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-start gap-4">
            <button 
              class="btn btn-xl btn-primary w-[80%] lg:w-fit btn-neutral rounded-full" 
              use:walletConnectionCheck={HandleEarlyCheckin} 
              disabled={profile.loading}
              classList={{"skeleton":profile.loading}}
            >
                Early Checkin <Icon icon="iconoir:arrow-right" />
              </button>
            <div class="text-xs text-current/60 ">From {checkinProcess()?.['Checkin-Time-Range']?.[0]} to {checkinProcess()?.['Checkin-Time-Range']?.[2]} AM</div>
          </div>
        </Match>
        <Match when={view()==views.EDITING}>
          <div class="col-span-1 lg:col-span-8 flex flex-col items-center justify-center lg:items-start relative">
            <div class="text-xl text-current/60">
            <Switch>
              <Match when={checked()&&checkin()}>
                {displayZoneTime(checkin()?.timestamp,checkin()?.offset || 0).date}
              </Match>
              <Match when={!checked()}>{date()}</Match>
            </Switch>
              
            </div>
            <Switch>
              <Match when={checked()&&checkin()}>
                <div className="text-3xl lg:text-4xl slashed-zero  max-w-full">
                  {checkin()?.note}
                </div>
              </Match>
              <Match when={!checked()}>
                <Editable maxLength={120} onChange={(val) => setGreeting(val)} className="text-3xl lg:text-4xl slashed-zero  max-w-full" placeholder="input" disabled={checked()} >{greeting()}</Editable>
              </Match>
            </Switch>
            
          </div>
            
          <div class="col-span-1 lg:col-span-4 flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-start gap-4">
            <Switch>
              <Match when={checked()}>
                <A href={"/checkin/"+latest()?.id} class="flex items-center gap-2">
                  <Icon icon="iconoir:check-circle-solid" />
                  <span className="text-sm">Checked in at {displayZoneTime(checkin()?.timestamp,checkin()?.offset|| 0).time}</span>
                  <Icon icon="iconoir:arrow-right" />
                </A>
              </Match>
              <Match when={!checked()}> 
                <div class="flex items-center gap-2">
                  <Show when={!available()}>
                    <p className="text-xs">Not within check-in hours (From 6 to 8 AM)</p>
                  </Show>
                  <button class="btn btn-xl btn-circle  btn-neutral" disabled={posting()} onClick={()=>setView(views.DEFAULT)}> <Icon icon="iconoir:xmark" /></button>
                  <Show when={available()}>
                     <button class="btn btn-xl btn-circle btn-primary" disabled={posting()} use:walletConnectionCheck={HandleSubmitCheckin}> 
                        {posting()?<Icon icon="line-md:loading-twotone-loop" />:<Icon icon="iconoir:check" /> }
                      </button>
                  </Show>
                </div>

                 <button className="btn btn-ghost btn-circle float right-0 top-2" onClick={()=>_color_picker.show()} disabled={posting()} ><Icon icon="iconoir:fill-color" /></button>
              </Match>
            </Switch>
          </div>
        </Match>
        {/* <Match when={view()==views.CHECKED}>
          checked-in today!
        </Match> */}
      </Switch>
      <ColorPicker 
        ref={_color_picker} onChange={e=>{
          if(e?.[0]){
            setColor(hslToHex(e?.[0]))
          }
        }} 
        defaultValue={color()}
      />
    </div>
  )
}