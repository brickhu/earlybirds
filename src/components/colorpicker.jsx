// import { TwitterPicker } from "solid-color"
import { ModalBox, ModalTitle, ModalContent } from "./modal";
import { For, onMount } from "solid-js";
import { Icon } from "@iconify-icon/solid";


export function ColorPicker(props){
  let _color_picker
  const s = 90
  const l = 50
  onMount(()=>{
    props?.ref({
      show:(e)=>{
        _color_picker?.show()
      },
      hide:(e)=>{
       _color_picker?.hide()
      }
    })
  })
  return (<ModalBox ref={_color_picker} closable>
    <ModalTitle className="text-base-content">
      <div className="flex items-center gap-4 pb-4 text-base-content">
        <Icon icon="iconoir:fill-color" className="text-current/60" />
        <span>Pick a color that reflects your day</span>
      </div>
    </ModalTitle>
    <ModalContent>
      <ul className="grid grid-cols-6 gap-2 w-full">
        <For each={new Array(24)}>
          {(item, index)=>{
            const h = 0 + index() * 14
            const s = 70 - index() * 2
            const l = 50
            return(<li className="col-span-1 flex items-center justify-center">
            <button 
              style={{"background" : `hsl(${h} ${s}% ${l}%)`}} 
              className=" block size-9 rounded-full ring-2 ring-transparent hover:ring-base-content btn"
              onClick={()=>{
                if(props?.onChange){
                  props.onChange([{h,s,l},`hsl(${h} ${s}% ${l}%)`])
                }
                _color_picker.hide()
              }}
            >
            </button>
            </li>)
          }}
        </For>
      </ul>
      {/* <TwitterPicker/> */}
    </ModalContent>
  </ModalBox>)
}