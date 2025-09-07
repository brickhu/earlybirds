import { batch, createSignal, onMount } from "solid-js"
import { ModalBox,ModalTitle,ModalContent,ModalAction } from "./modal"
import { toPng } from 'html-to-image';
import Avatar from "./avatar";
import { Icon } from "@iconify-icon/solid";
import { Currency } from "./currency";
import { QRCodeSVG } from "solid-qr-code";


function downloadDataURI(dataURI, filename) {
  const a = document.createElement('a');
  a.href = dataURI;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default props =>{
  let _share
  let _canvas
  const [id,setId] = createSignal("output")
  const [background,setBackground] = createSignal("#00ffee")
  const [textColor,setTextColor]= createSignal("#222222")
  const [downloading,setDownloading] = createSignal(false)
  const [address,setAddress]=createSignal()
  const [note,setNote] = createSignal()
  const [date,setDate] = createSignal()
  const [time,setTime] = createSignal()
  onMount(()=>{
    props?.ref({
      show:(e)=>{
        batch(()=>{
          setId(e?.id)
          setBackground(e?.background)
          setTextColor(e?.textColor)
          setNote(e?.note)
          setAddress(e?.recipient),
          setDate(e?.date),
          setTime(e?.time)
        })
        
        _share.show()
      },
      hide:(e)=>{
       _modal.close()
      }
    })
  })
  return(
    <ModalBox ref={_share} closable={!downloading()} >
      <ModalTitle>Share</ModalTitle>
      <ModalContent>
        <div 
          ref={_canvas} className=" aspect-[3/2] w-full rounded-xl p-4 flex flex-col justify-between items-start"
          style={{
            "background" : background(),
            "color" : textColor()
          }}
        >
          <div>
            <p className="flex gap-2 items-center">
              <Avatar username={address()} className="size-6"/>
              {date()}
            </p>
            <p className="text-2xl py-2">{note()}</p>
           

          </div>
          <div className="flex items-end justify-between w-full">
             <ul className="text-xs text-current/60">
              <li className="flex items-center gap-2">
                <Icon icon="iconoir:clock" />
                <span>{time()}</span>
              </li>
   
              <li className="flex items-center gap-2">
                <Icon icon="iconoir:coin" />
                <Currency value={200000} precision={12} fixed={12} ticker="$WORM"/>
              </li>
          </ul>
          <div>
            <QRCodeSVG value={"https://earlybirds.com/#/checkin/"+id()} foregroundColor={textColor()} backgroundColor={background()} width={54} height={54}/>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M3.6 2.25A1.35 1.35 0 0 0 2.25 3.6v16.8c0 .746.604 1.35 1.35 1.35h16.8a1.35 1.35 0 0 0 1.35-1.35V3.6a1.35 1.35 0 0 0-1.35-1.35zm6.102 6.391a.75.75 0 1 0-1.06 1.06l4.376 4.377h-3.14a.75.75 0 0 0 0 1.5h4.95a.747.747 0 0 0 .75-.75v-4.95a.75.75 0 0 0-1.5 0v3.14z" clip-rule="evenodd"/></svg> */}
            {/* <image src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" /> */}
            {/* <Logo className="size-10" /> */}
          </div>

          </div>
          
         
        </div>
      </ModalContent>
      <ModalAction>
        <button 
          className="btn "
          disabled={downloading()}
          onClick={()=>{
            setDownloading(true)
            toPng(_canvas)
              .then((dataUrl) => {
                downloadDataURI(dataUrl, id()+'.png');
              })
              .catch((err)=>console.error(err))
              .finally(()=>{
                setDownloading(false)
              })
          }}>
            {downloading()?"downloading":"download"}
        </button>
      </ModalAction>
    </ModalBox>
  )
}