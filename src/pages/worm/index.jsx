
import { createEffect, createSignal, Match, Switch } from "solid-js"
import Mints from "./mints"
import Burns from "./burns"
import Tabs from "../../components/tabs"
import { Icon } from "@iconify-icon/solid"

export default (props) => {
  const menus = [{
    name : "Mints",
    key : "mints"
  },{
    name : "Burns",
    key : "burns"
  }]
  const [tab,setTab] = createSignal(menus[0])
  return(
    <div className="container min-h-full">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 items-stretch py-12">
        <div class="col-span-1 lg:col-span-8">
          <p class="text-lg text-center lg:text-left">$WORM</p>
          <h2 className=" text-4xl text-center lg:text-left lg:text-7xl uppercase font-black">Turning economy into discipline.</h2>
        </div>
        <div class="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-rignt justify-between gap-2 flex-1">
          <div className="flex flex-col items-center lg:items-start">
             <p className="text-lg pb-2">Circulating supply : <span className="font-bold">2.969</span> 🐛</p>
             <p>100% community-minted through daily check-ins. Holding $WORM unlocks profit-sharing rights.</p>
          </div>
         <div className="text-center lg:text-right w-full">
          <a className="btn btn-ghost btn-link">
            Learn more <Icon icon="iconoir:arrow-up-right" />
          </a>
         </div>
        </div>
      </div>
      <div className="border-b border-current/20 flex justify-center-safe lg:justify-start">
        <Tabs items={menus} current={tab()} size="lg" variant = "border" onSelected={({item})=>setTab(item)} />
      </div>
      <Switch>
        <Match when={tab()?.key == menus[0].key}><Mints/></Match>
        <Match when={tab()?.key == menus[1].key}> <Burns/></Match>
      </Switch>
      
    </div>
  )
}