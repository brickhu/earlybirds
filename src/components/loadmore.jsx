import { Icon } from "@iconify-icon/solid"
import Spinner from "./spinner"
import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
export default props => {
  return(
    <div className="tooltip tooltip-top md:tooltip-left w-full md:w-fit" data-tip="Load more">
      <button 
        className={mergeClasses("btn w-full md:w-fit rounded-full", props?.className || props?.class)} 
        disabled = {props?.loading || props?.disabled}
        onClick={()=>{
          if(props?.loadMore){
            props?.loadMore()
          }
        }}
      >
        {props?.loading?<Spinner size="sm"/>:<Icon icon="weui:more-filled" />}
      </button>
    </div>
  )
  
}

