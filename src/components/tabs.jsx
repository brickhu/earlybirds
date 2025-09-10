import { createSignal, Index, onMount } from "solid-js"

export default props => {
  const [selectedItem,setSelectedItem] = createSignal(0)
  
  const handleClick = (item,index,e) => {
    if(item === selectedItem()){
      return
    }
    setSelectedItem(item)
    if (props?.onSelected) {
      props.onSelected({index:index,item:item});
    }
  };

  onMount(()=>{
    if(props?.current){
      setSelectedItem(props.current)
    }else{
      setSelectedItem(props?.items[0])
    }
  })
  return(
    <div 
      role="tablist" 
      className="tabs" 
      classList={{
        "tabs-xs" : props?.size == "xs",
        "tabs-sm" : props?.size == "sm",
        "tabs-md" : props?.size == "md",
        "tabs-lg" : props?.size == "lg",
        "tabs-xl" : props?.size == "xl",
        "tabs-box" : props?.variant == "box",
        "tabs-lift" : props?.variant == "lift",
        "tabs-border" : props?.variant == "border"
      }}>
      <Index each={props?.items}>
        {(item , index)=><a 
          role="tab" 
          className="tab" 
          onClick={(e) => handleClick(item(),index,e)}
          classList={{ "tab-active" : item()?.key == selectedItem().key}}>
            {item().label || item().name}
        </a>}
      </Index>
      
      {/* <a role="tab" className="tab tab-active">Tab 2</a> */}
      {/* <a role="tab" className="tab">Tab 3</a> */}
    </div>
  )
}