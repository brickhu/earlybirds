import { ModalBox,ModalTitle,ModalContent,ModalAction } from "./modal"
import { createSignal, onMount } from "solid-js"

export default props => {
  let _info
  const [info,setInfo] = createSignal()
  onMount(()=>{
      props?.ref({
        show:(i)=>{
          setInfo(i)
          _info.show()
        },
        hide:()=>{
         _info.close()
        }
      })
    })
  return( <ModalBox ref={_info} closable={true} >
    <ModalTitle>Meta</ModalTitle>
  </ModalBox>)
}