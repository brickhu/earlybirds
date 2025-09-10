
// import {Ao} from "@permaweb/aoconnect/browser"
import { useWallet } from "arwallet-solid-kit";
import { useGlobal } from "../../context";
import { useUser } from "../../context";
import Timezonepicker from "../../components/timezonepicker";
import { createSignal, Show } from "solid-js";
import { Currency } from "../../components/currency";



export default (props) => {
  let _tzpicker
  const { wallet,address } = useWallet()
  const { env } = useGlobal()
  const { wormBalance } = useUser()
  const [quantity,setQuantity] = createSignal()
  
  return(
    <div className="container">
      <h1 className="text-4xl lg:text-7xl">Devour $WORMS. Gain Power. Earn Weekly Dividends.</h1>

      <div className="py-8">Next distribution : 2025/09/10 , Estimated Dividends Available : 200.00 $wAR</div>
      <div className="flex gap-2 items-center">
         <label className="input">
            <input type="text" className="grow" placeholder="" value={1} disabled={false} onChange={(e)=>setQuantity(e.target.value)} />
            <span className=" text-current/50">$worm</span>
          </label>
        <button className="btn"> Devour</button>
        <span>{<Show when={wormBalance?.state == "ready"} fallback="...">{<Currency value={wormBalance()} precision="12" fixed="6"/>}</Show>}</span>
      </div>
      
      <h2 className="text-4xl py-4">Ongoing Devouring:</h2>

      <div>{quantity()}</div>

      <Timezonepicker ref={_tzpicker}/>
    </div>
  )
}