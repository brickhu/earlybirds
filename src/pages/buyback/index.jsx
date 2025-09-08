
// import {Ao} from "@permaweb/aoconnect/browser"
import { useWallet } from "arwallet-solid-kit";
import { useGlobal } from "../../context";
import { HB } from "hbconnect";
import Timezonepicker from "../../components/timezonepicker";
import { AoCaptcha } from "aocaptcha-sdk";



export default (props) => {
  let _tzpicker
  const {wallet,address} = useWallet()
  const {env} = useGlobal()
  const url = "http://node.arweaveoasis.com:8734"

  const captcha = new AoCaptcha(env.captcha_pid,{})

  const testpost = async function(params) {
    const hb = new HB({
      url : url,
      wallet : wallet()
    })
    hb.send({
      target : "Xjcy3A4Pcu9XSIBqdECbQ1Y25kartyonAgJqbkphdcU",
      Action : "Transfer",
      Quantity : "1",
      Recipient : "_eQQY9UY4GLet4tL475SkPyTtVc-3u3EU8KEAGiulJk"
    }).then(res=>console.log("成功啦！",res))
  }

  const testcaptcha = async function(params) {
    
    // console.log(captcha)
    const request = await captcha.request({
      Recipient : env.checkin_pid,
      Type : "Checkin",
      ['X-Note'] : "你好啊！"
    },wallet())
    if(!request){throw("request failed")}
    console.log('request: ', request);
    const verified = await captcha.verify(request,wallet())
    if(!verified){throw("verified failed")}
    console.log('verified: ', verified);
  }
  
  return(
    <div className="container">
      <h1 className="text-4xl lg:text-7xl">Devour $WORMS. Gain Power. Earn Weekly Dividends.</h1>
      <p>buyback</p>
      <div className="flex gap-2 items-center">
        <button 
          className="btn"
          onClick={()=>_tzpicker.show()}
        >
          selcet timezone
        </button>
        <button className="btn" onClick={testpost}>post</button>
        <button className="btn" onClick={testcaptcha}>aocaptcha</button>

      </div>
      

      <Timezonepicker ref={_tzpicker}/>
    </div>
  )
}