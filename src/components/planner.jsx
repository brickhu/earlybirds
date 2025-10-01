import { createEffect, createMemo, createSignal, Match, onMount, Switch } from "solid-js"
import { ModalBox,ModalTitle,ModalContent,ModalAction } from "./modal"
import { useWallet } from "arwallet-solid-kit";
import { AO } from "../api";
import { displayZoneTime, toBalanceQuantity } from "../lib/units";
import { useGlobal,useClock,useUser } from "../context";
import { Shorter } from "./shorter";
import { Currency } from "./currency";
import Spinner from "./spinner";



const modes = Object.freeze({
  CREATE : 0,
  UPDATE: 1
})

export default props =>{
  let _ref_planner

  const { offset,offsetInHour, zones, offsetHours,setOffset } = useClock()
  const [mode,setMode] = createSignal(modes.CREATE)
  const [quantity,setQuantity] = createSignal(null)
  const [days,setDays] = createSignal(30)
  const [creating,setCreating] = createSignal(false)
  const [currentPlan,setCurrentPlan] = createSignal()
  const [updating,setUpdating] = createSignal(false)
   // const [created,setCreated] = createSignal(false)
  const { wallet,walletConnectionCheck} = useWallet()
  const { arProcess,env,toast } = useGlobal()
  const { profile, refetchProfile,plan,arBalance } = useUser()

  const totalEarn = createMemo(()=>{
    if(quantity()<1||days()<30 || !quantity()){ return 0}
    const d = Number(days())
    const s = Number(d * quantity())
    const e = Number(quantity())
    const total = (s + e) * d / 2;
    return total
  })


  const HandleCreatePlan = async()=>{
    try {
      let ao = new AO({wallet: wallet()})
      setCreating(true)
      if(!quantity()){ throw("missed quantity.")}
      if(Number(quantity())<1) { throw("Quantity must great than 1.")}
      const q = await toBalanceQuantity(quantity(),Number(arProcess()?.Denomination) || 12)
      console.log('q: ', q);
      const d = days()
      const _offset = offset() || profile()?.offset
      // console.log('_offset: ', _offset);
      const tags = {
        Action: "Transfer",
        Recipient : env?.checkin_pid,
        Quantity : String(q),
        ["X-Transfer-Type"] : "Create-Plan",
        ["X-Duration"] : String(d),
        ['X-Offset'] : String(_offset)
      }
      // console.log('tags: ', tags);
      const data = ""
      const mid = await ao.message(env?.artoken_pid,tags,data)
      if(!mid) {throw("Transfer faild.") }
      console.log('mid: ', mid);
      const { Messages , Error } = await ao.result({process : env?.artoken_pid, message : mid})
      console.log('Messages: ', Messages);
      if(Error){throw Error}
      if(Messages && Messages?.length == 2){
        await refetchProfile()
        console.log("plan",plan())
        _ref_planner.hide()
        toast.success("The check-in plan has been successfully created.")
      }else{
        throw("Transfer faild.")
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error((typeof error == "string")?error : "Create faild")
    } finally {
      setCreating(false)
    }
  }

  const HandleUpdatePlan = async(pid) => {
    try{
      let ao = new AO({wallet: wallet()})
      setUpdating(true)
      const tags = {
        Action: "Transfer",
        Recipient : env?.checkin_pid,
        Quantity : "1000000000000",
        ["X-Transfer-Type"] : "Update-Plan",
        ["X-Plan-Id"] : pid,
      }
      console.log('tags: ', tags);
      const data = ""
      const mid = await ao.message(env?.artoken_pid,tags,data)
      if(!mid) {throw("Transfer faild.") }
      console.log('mid: ', mid);
      const { Messages , Error } = await ao.result({process : env?.artoken_pid, message : mid})
      if(Error){throw Error}
      if(Messages && Messages?.length == 2){
        await refetchProfile()
        console.log("plan",plan())
        _ref_planner.hide()
      }else{
        throw("Transfer faild.")
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error((typeof error == "string")?error : "Create faild")
    } finally {
      setUpdating(false)
    }
  }

  onMount(()=>{
    props?.ref({
      show:(plan)=>{
        if(plan){
          console.log("plan",plan)
          setCurrentPlan(plan)
          setMode(modes.UPDATE)
        }else{
          setMode(modes.CREATE)
        }
        
        _ref_planner.show()
      },
      hide:(e)=>{
       _ref_planner.close()
      }
    })
  })

  createEffect(()=>{
    console.log(zones())
  })

  // const tzs = createMemo(()=>Object.groupBy(timezones, ({ offset }) => offset))
  
  return(
    <ModalBox id="eb_planner" ref={_ref_planner} closable={!creating()} className="w-[360px]">
      <ModalTitle>{mode() == modes.UPDATE? "Update your challenge":"Start a Check-in Challenge"}</ModalTitle>
      <ModalContent>
        <Switch>
            <Match when={mode()==modes.CREATE}>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Deposit</legend>
                  <label className="input">
                    <input type="text" className="grow" placeholder="" value={quantity()} disabled={creating()} onChange={(e)=>setQuantity(e.target.value)} />
                    <span className=" text-current/50">$AO</span>
                  </label>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Duration</legend>
                  <select defaultValue={days()} className="select" disabled={creating()} onChange={(e)=>setDays(e.target.value)}>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>365 days</option>
                  </select>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Timezone</legend>
                  <select className="select" disabled={creating()} onChange={(e)=>{
                    setOffset(e.target.value*60)
                  }}>
                    <For each={offsetHours}>
                      {item=><option value={item} selected={item == offsetInHour()}>{zones()?.[item]?.text}</option>}
                    </For>
             
                  </select>
                </fieldset>
                
                {/* <p>timezone: {offsetString()}</p> */}
                <div className="text-sm pt-4">Commit longer & deposit higher to earn more $WORM per check-in. Finish the plan to reclaim your deposit and unlock {totalEarn()} $WORM rewards.</div>
              </div>
             

            </Match>
            <Match when={mode()==modes.UPDATE}>
              <div>
                <p>You missed today’s check-in time, and your deposit is at risk of being forfeited! Add more deposit before 24:00 to reset the next check-in of your current plan to 6–8 AM tomorrow and avoid forfeiture.</p>
                <div className="divider"></div>
                <div>
                  <dl className="dl text-sm"><dt>Plan Id : </dt><dd><Shorter value={plan()?.id} length={6}/></dd></dl>
                  <dl className="dl text-sm"><dt>Start at : </dt><dd>{displayZoneTime(plan()?.start,plan()?.offset)?.full}</dd></dl>
                  <dl className="dl text-sm"><dt>Deposit : </dt><dd><Currency value={plan()?.deposit} precision={12} ticker="$WAR"/></dd></dl>
                  <dl className="dl text-sm"><dt>Duration : </dt><dd>{plan()?.duration} days</dd></dl>
                </div>
              </div>
            </Match>
          </Switch>
       
      </ModalContent>
      <ModalAction>
        <Switch>
          <Match when={mode()==modes.CREATE}>
            <div className="w-full flex items-center justify-between">
              <div>
                <p className="text-xs text-current/60 uppercase">Balance</p>
                <p><Show when={arBalance?.state== "ready"} fallback={<Spinner/>}><Currency value={arBalance()} precision={12} fixed={2} ticker="$AO"/></Show></p>
              </div>
              <button className="btn btn-primary" disabled={creating() || !quantity() || arBalance.loading || arBalance()<=0} use:walletConnectionCheck={HandleCreatePlan}>{creating()?"Creating..":"Create"}</button>
            </div>
          </Match>
          <Match when={mode()==modes.UPDATE}>
            <button 
              className="btn btn-primary" 
              onClick={()=>HandleUpdatePlan(currentPlan()?.id)}
              disabled={updating()}
              classList={{
                "skeleton" : updating()
              }}
            >
                {updating()?"Updating...":"Update"}
            </button>

          </Match>
        </Switch>
        

        
      </ModalAction>
    </ModalBox>
  )
}