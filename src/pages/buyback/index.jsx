
// import {Ao} from "@permaweb/aoconnect/browser"
import { useWallet } from "arwallet-solid-kit";
import { useClock, useGlobal } from "../../context";
import { useUser } from "../../context";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { Currency } from "../../components/currency";
import { cacheResource } from "../../store";
import { fetchState } from "../../api";
import { AO } from "../../api";
import Bid from "./bid";


export default (props) => {
  const { wallet,address } = useWallet()
  const { env } = useGlobal()
  const { getTheClockDatetime } = useClock()

  const [buybackState,{refetch: refetchBuybackState}] = cacheResource("state_"+env.buyback_pid, ()=>createResource(()=>env.buyback_pid,fetchState))

  return(
    <div className="container">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 container items-stretch py-12">
        <div class="col-span-1 lg:col-span-8">
          <h2 className=" text-4xl text-center lg:text-left lg:text-7xl uppercase font-black">Devour $WORMS. Earn Weekly Dividends.</h2>
        </div>
        <div class="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-end gap-2 flex-1">
          <Bid/>
        </div>
      </div>

      <div className="divider"></div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 container items-stretch py-12">
        <div class="col-span-full text-center">
         Next distribution : <Show when={buybackState.state === "ready"} fallback="...">{getTheClockDatetime(buybackState()?.ts_distributed + 604800000)?.full}</Show> , Estimated Dividends Available : 200.00 $wAR
        </div>
      </div>
      
    </div>
  )
}