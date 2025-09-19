import { Icon } from "@iconify-icon/solid"
import { BalanceItem } from "../../components/items"
import { useUser } from "."
import { Show } from "solid-js"
import { Currency } from "../../components/currency"
export default props=>{
  const {arBalance, refetchArBalance,wormBalance, refetchWormBalance, pwrBalance } = useUser()
  return(
    // <div className="flex items-center justify-between">
    //   <div className="flex items-center gap-4">
    //     <div className="flex items-center justify-center">
    //       <img src="https://token-icons.s3.amazonaws.com/eth.png" alt="Eth" className="size-6 rounded-full" />
    //     </div>
    //     <div>
    //       <p className="text-xs uppercase text-current/60">$ETH</p>
    //       <p>0.000000001</p>
    //     </div>
    //   </div>
    //   <div className="flex items-center justify-end gap-2">
    //     <button className="btn btn-ghost btn-circle btn-sm"><Icon icon="iconoir:refresh" /></button>
    //   </div>
    // </div>
    <div className=" flex flex-col gap-4">
      <div className="bg-base-100 p-2 rounded-field border border-base-300">
        <BalanceItem 
          name = "Warpped AR"
          logo={"https://token-icons.s3.amazonaws.com/eth.png"}
          disableRefetch = {arBalance.loading}
          value={<Show when={arBalance.state == "ready"} fallback="..."><Currency value={arBalance()} precision={12} fixed={12}/></Show>}
          ticker="$WAR"
          onRefetch={refetchArBalance}
        />
      </div>
       <div className="bg-base-100 p-2 rounded-field border border-base-300">
        <BalanceItem 
        name = "Earlybird's Worm Token"
        logo={"https://token-icons.s3.amazonaws.com/eth.png"}
        value={<Show when={wormBalance.state == "ready"} fallback="..."><Currency value={wormBalance()} precision={12} fixed={12}/></Show>}
        ticker="$WORM"
        disableRefetch = {wormBalance.loading}
        onRefetch={refetchWormBalance}
      />
      </div>
       <div className="bg-base-100 p-2 rounded-field border border-base-300">
        <BalanceItem 
        name = "Warpped AR"
        logo={"https://token-icons.s3.amazonaws.com/eth.png"}
        value="0.0001"
        ticker="$PWR"
      />
      </div>
      
    </div>
    
  )
}