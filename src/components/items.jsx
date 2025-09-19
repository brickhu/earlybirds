import { Icon } from "@iconify-icon/solid"
import Spinner from "./spinner"

export const BalanceItem = props => {
  return(
    <div className="flex items-center w-full justify-between">
      <div className="flex items-center gap-2">
        <img src={props?.logo} className=" rounded-full size-5 ml-1" alt={props?.name} />
        <p className="text-current/60">{props?.ticker}</p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <p><Show when={!props?.disableRefetch} fallback={<Spinner size="sm"/>}>{props?.value}</Show></p>
        <button 
          disabled={props?.disableRefetch}
          className="btn btn-ghost btn-circle btn-sm"
          onClick={()=>{
            if(props?.onRefetch){
              props?.onRefetch()
            }
          }}
        >
          <Icon icon="iconoir:refresh" />
        </button>
      </div>
    </div>
  )
}