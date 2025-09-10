
import { createEffect, createResource } from "solid-js"
import Mints from "./mints"

export default (props) => {
  return(
    <div className="container min-h-full">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 items-stretch py-12">
        <div class="col-span-1 lg:col-span-8">
          <h2 className=" text-4xl text-center lg:text-left lg:text-7xl uppercase font-black">$WORM — Turning economy into discipline.</h2>
        </div>
        <div class="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-end gap-2 flex-1">
          <p className=" text-center lg:text-right lg:text-xl text-lg">d</p>
        </div>
      </div>
      
      <Mints/>
    </div>
  )
}