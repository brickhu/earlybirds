import { createEffect, createMemo, createSignal, Match, onMount, Switch } from "solid-js"
import { ModalBox,ModalTitle,ModalContent } from "./modal"
import { useWallet } from "arwallet-solid-kit";
import { AO } from "../api";
import { toBalanceQuantity } from "../lib/units";
import { useGlobal,useClock,useUser } from "../context";



const modes = Object.freeze({
  CREATE : 0,
  UPDATE: 1
})

export default props =>{
  let _ref_planner

  const { offsetString } = useClock()
  const [mode,setMode] = createSignal(modes.CREATE)
  const [quantity,setQuantity] = createSignal(null)
  const [days,setDays] = createSignal(30)
  const [creating,setCreating] = createSignal(false)
  const [currentPlan,setCurrentPlan] = createSignal()
  const [updating,setUpdating] = createSignal(false)
   // const [created,setCreated] = createSignal(false)
  const {address,wallet,walletConnectionCheck} = useWallet()
  const { arProcess,env,toast } = useGlobal()
  const { profile, refetchProfile,plan } = useUser()
  const { offset } = useClock()

  const average = createMemo(()=>{
    if(quantity()<1||days()<30 || !quantity()){ return 0}
    const d = Number(days())
    const s = Number(d * quantity())
    const e = Number(quantity())
    const total = (s + e) * d / 2;
    return total / d
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
      const _offset = profile()?.offset || offset()
      const tags = {
        Action: "Transfer",
        Recipient : env?.checkin_pid,
        Quantity : String(q),
        ["X-Transfer-Type"] : "Create-Plan",
        ["X-Duration"] : String(d),
        ['X-Offset'] : String(_offset)
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

  createEffect(()=>console.log(arProcess()))
  
  return(
    <ModalBox id="eb_planner" ref={_ref_planner} closable={!creating()}>
      <ModalTitle>{mode() == modes.UPDATE? "Update your plan":"Create a plan"}</ModalTitle>
      <ModalContent>
        <Switch>
            <Match when={mode()==modes.CREATE}>
              <div>
                <label className="input">
                  <input type="text" className="grow" placeholder="" value={quantity()} disabled={creating()} onChange={(e)=>setQuantity(e.target.value)} />
                  <span className=" text-current/50">$wAR</span>
                </label>
                <select defaultValue={days()} className="select" disabled={creating()} onChange={(e)=>setDays(e.target.value)}>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>365 days</option>
                </select>
                <p>timezone: {offsetString()}</p>
              </div>
              <div >
                <span>average : {average()}</span>
                <button className="btn btn-primary" disabled={creating()} use:walletConnectionCheck={HandleCreatePlan}>{creating()?"Creating..":"Create"}</button>
              </div>

            </Match>
            <Match when={mode()==modes.UPDATE}>
              <div>
                <p>update plan : {currentPlan()?.id}, expired: {currentPlan()?.next + 57600000} / {new Date().getTime()}</p>
                <div>
                  pay 1 $war for upate,
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={()=>HandleUpdatePlan(currentPlan()?.id)}
                  disabled={updating()}
                >
                  {updating()?"updating...":"update"}
                </button>
              </div>
            </Match>
          </Switch>
       
      </ModalContent>
    </ModalBox>
  )
}