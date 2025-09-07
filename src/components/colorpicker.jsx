// import { TwitterPicker } from "solid-color"
import { ModalBox, ModalTitle, ModalContent } from "./modal";
import { For, onMount } from "solid-js";
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
    <ModalTitle>Pick a color that reflects your day</ModalTitle>
    <ModalContent>
      <ul className=" flex flex-wrap gap-2">
        <For each={new Array(36)}>
          {(item, index)=>{
            const h = index()*10
            return(<li>
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