
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

  const test = async function(){
    let captcha = new AoCaptcha(env?.captcha_pid)
    console.log('captcha: ', captcha);

    const request = await captcha.request({
          Recipient : env.checkin_pid,
          ['Request-Type'] : "Checkin",
          ['X-Note'] : "hi",
          ['X-Color']: "#dddddd"
        },wallet())

    console.log(request)
  }

  
  return(
    <div className="container">
      <h1 className="text-4xl lg:text-7xl">Devour $WORMS. Gain Power. Earn Weekly Dividends.</h1>

      <div className="py-8">Next distribution : 2025/09/10 , Estimated Dividends Available : 200.00 $wAR</div>
      <div className="flex gap-2 items-center">
         <label className="input">
            <input type="text" className="grow" placeholder="" value={1} disabled={false} onChange={(e)=>console.log(e.target.value)} />
            <span className=" text-current/50">$worm</span>
          </label>
        <button className="btn"> Devour</button>
      </div>
      
      <h2 className="text-4xl py-4">Ongoing Devouring:</h2>

      <div>none</div>

      <button onClick={test}>test</button>

      <Timezonepicker ref={_tzpicker}/>
    </div>
  )
}