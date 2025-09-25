import { batch, createSignal, onMount } from "solid-js"
import { ModalBox,ModalTitle,ModalContent,ModalAction } from "./modal"
import { toPng } from 'html-to-image';
import Avatar from "./avatar";
import { Icon } from "@iconify-icon/solid";
import { Currency } from "./currency";
import { QRCodeSVG } from "solid-qr-code";
import Logo from "./logo";


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
  const [mint,setMint] = createSignal()
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
          setMint(e?.mint)
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
          ref={_canvas} className=" aspect-[3/2] w-full rounded-xl p-4 flex flex-col justify-between items-start border"
          style={{
            "background" : background(),
            "color" : textColor(),
            "--color-primary" : textColor()
          }}
        >
          <div className="w-full">
            <div className="flex gap-2 items-center w-full justify-between">
              <p className="flex gap-2 items-center">
                <Avatar username={address()} className="size-6"/>
                {date()}
              </p>
              
              
              <Logo className="size-6"/>
            </div>
            <p className="text-2xl py-2">{note()}</p>
           

          </div>
          <div className="flex items-end justify-between w-full">
             <ul className="text-xs text-current/60 flex flex-col gap-1">
              <li className="flex items-center gap-2">
                <Icon icon="iconoir:clock" />
                <span>{time()}</span>
              </li>
   
              <li className="flex items-center gap-2">
                <Icon icon="iconoir:coin" />
                <Currency value={mint()} precision={12} fixed={12} ticker="$WORM"/>
              </li>
          </ul>
          <div>
            <QRCodeSVG 
              value={"https://earlybirds.day/#/checkin/"+id()} 
              foregroundColor={textColor()} 
              backgroundColor={background()} 
              width={40} 
              height={40}
              imageSettings = {{
                src : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png",
                height : 10,
                width : 10
              }}
            />
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