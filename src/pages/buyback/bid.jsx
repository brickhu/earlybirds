import { AO } from "../../api"
import { useGlobal,useUser } from "../../context"
import { useWallet } from "arwallet-solid-kit";
import { Currency } from "../../components/currency"
import { Show,createSignal } from "solid-js"
import { toBalanceValue } from "../../lib/units";

export default (props) => {
  const { toast,env } = useGlobal()
  const { address,wallet } = useWallet()
  const { wormBalance } = useUser()
  const [ quantity, setQuantity ] = createSignal(1)
  const [ devouring,setDevouring] = createSignal(false)
  const handleDevour = async function(){
    try {
      if(quantity()<=0){
        throw new Error("the quantity need to greater than 1")
      }
      setDevouring(true)
      let ao = new AO()
      console.log(env.wrom_pid)
      const pid = env.wrom_pid
      console.log('pid: ', pid);
      console.log(quantity())
      const qty = Math.floor(quantity() * (10 ** 12))
      console.log('qty: ', qty);
      if(qty > wormBalance() && qty>=1){
        throw new Error("the quantity need to smaller than balance and 1")
      }
      const tags = {
        Action : "Transfer",
        Quantity : String(qty),
        ['X-Transfer-Type'] : "Bid",
        Recipient : env.buyback_pid
      }
      console.log('tags: ', tags);
      const transfer_msg_id = await ao.message(pid,tags,"Devour $WORMS", {wallet : wallet()})
      console.log('transfer_msg_id: ', transfer_msg_id);

      const [checked,res] = await ao.checkMessage([pid,transfer_msg_id],({Messages})=>{
        console.log("Messages",Messages)
        return Messages?.length >= 2
      })
      if(checked){
        toast.success('Devour successfully!')
        // console.log("Devoured")
        // refetchBuybackState()
      }
      
    } catch (error) {
      console.error('error: ', error);
      toast.error(error?.message || "Devour faild.")
    } finally {
      setDevouring(false)
    }
  }
  
  return(
    <div className="flex bg-base-200 p-8 rounded-2xl">
      <label className="input">
        <input type="number" className="grow" placeholder="" value={quantity()} disabled={devouring()} onChange={(e)=>setQuantity(e.target.value)} />
        <span className=" text-current/50">$worm</span>
      </label>
      <button className="btn btn-primary" classList={{"skeleton": devouring()}} disabled={!quantity() || devouring()} onClick={handleDevour}>{devouring()?"Devouring...":"Devour"}</button>
      <span>{<Show when={wormBalance?.state == "ready"} fallback="...">{<Currency value={wormBalance()} precision="12" fixed="6"/>}</Show>}</span>
    </div>
  )
}