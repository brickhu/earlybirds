/* @refresh reload */
import './index.css'

import { render } from 'solid-js/web'
import { HashRouter, Route } from "@solidjs/router"
import { Suspense, ErrorBoundary } from "solid-js"
import { WalletProvider } from "arwallet-solid-kit"
import { ClockProvider,GlobalProvider,UserProvider } from "./context"
import AoSyncStrategy from "@vela-ventures/aosync-strategy";
// import WebWalletStrategy from "@arweave-wallet-kit/webwallet-strategy";
// import WanderStrategy from "@arweave-wallet-kit/wander-strategy"
import WanderStrategy from "@arweave-wallet-kit/wander-strategy"


import Header from './components/header'
import Footer from './components/footer'
import { ErrorFallback } from './components/fallback'

import Home from './pages/home'
import Checkins from './pages/checkins'
import CheckinDetail from "./pages/checkins/detail"
import Worm from './pages/worm'
import Buyback from './pages/buyback'
import Ranks from './pages/ranks'
import Profile from './pages/profile'

function App(props) {

  return (
    <>
      <Header />
      <main className='grow' id='app'>
        <ErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={<div className='w-full h-full skeleton p-4 bg-base-200'>Loading...</div>}>
          {props.children}
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}



render(() => (
  <Suspense fallback={<div className='w-full h-full skeleton p-4 bg-base-200'>Loading...</div>}>
    <WalletProvider config={{
      permissions: [
        "ACCESS_ADDRESS","SIGN_TRANSACTION","DISPATCH","ACCESS_PUBLIC_KEY",
      ],
      appInfo :{
        name : "EarlyBirds"
      },
      ensurePermissions: true,
      strategies: [
        new AoSyncStrategy(),
        new WanderStrategy()
      ]
    }}>
    
      <GlobalProvider>
        <ClockProvider>
          <UserProvider>
            <HashRouter root={App}>
              <Route path={["/", "/home/*"]} component={Home} />
              <Route path={["/feeds/*","/checkins/*"]} component={Checkins} />
              <Route path="/worm/*" component={Worm}/>
              <Route path="/buyback/*" component={Buyback}/>
              <Route path="/ranks/*" component={Ranks}/>
              <Route 
                path="/checkin/:id" 
                component={CheckinDetail} 
                matchFilters={{
                  id: /^.{43}$/
                }}
              />
              <Route 
                path="/profile/:id" 
                component={Profile} 
                matchFilters={{
                  id: /^.{43}$/
                }}
              />
              <Route path="*404" component={()=><div>404</div>} />
            </HashRouter>
          </UserProvider>
        </ClockProvider>
      </GlobalProvider>
      
    </WalletProvider>
  </Suspense>
), document.getElementById('root'))
