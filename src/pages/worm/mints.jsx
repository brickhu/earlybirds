import { cacheResource } from "../../store"
import { useGlobal, useClock } from "../../context"
import { createEffect, createResource, Match, Suspense, Switch } from "solid-js"
import { fetchMints } from "../../api"
import { createPagination } from "../../store"
import { Table, Body, Head, Row, Cell, Cols, Col, Caption, Actions } from "../../components/table"
import { Shorter } from "../../components/shorter"
import { Currency } from "../../components/currency"
import { A } from "@solidjs/router"
import Loadmore from "../../components/loadmore"
import { displayZoneTime } from "../../lib/units"

export default (props) => {
  const {env} = useGlobal() 
  const { getTheClockDatetime } = useClock()
  const [mints,{refetch:refetchMints, hasMore,loadingMore,loadMore}] = cacheResource("mints-"+env?.wrom_pid,()=>createPagination(()=>({from:env?.wrom_pid,to:env?.checkin_pid}),fetchMints,{size:100}))
 
  return(
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 items-stretch py-12">
      <div className="col-span-full">
        <Suspense fallback="loading...">
          <Table>
            <Head>
              <Col className="hidden lg:table-cell">Type</Col>
              <Col className="hidden lg:table-cell">Address</Col>
              <Col>Quantity</Col>
              <Col className="text-right"><span className="p-4">Date | TX</span></Col>
            </Head>
            <Body>
              <For each={mints()}>
                {item=>(
                  <Row>
                    <Cell className="hidden lg:table-cell" >
                      <Switch>
                        <Match when={item.action == "Minted"}><div className="badge badge-soft badge-info">Mint</div></Match>
                        <Match when={item.action == "Burned"}><div className="badge badge-soft badge-warning">Burn</div></Match>
                      </Switch>
                    </Cell>
                    <Cell className="hidden lg:table-cell"><Shorter value={item.address} length={6}/></Cell>
                    <Cell><Currency value={item.quantity} precision={12} fixed={10} ticker="$WORM"></Currency></Cell>
                    <Cell className="text-right">
                      {new Date(item.timestamp).toLocaleString()} <A target="_blank" href={`https://www.ao.link/#/message/${item.id}`} className="btn btn-ghost rounded-full after:content-['_↗']"> </A>
                    </Cell>
                  </Row>
                )}
              </For>
            </Body>
            <Actions className="w-full flex items-center justify-end">
              <Show when={hasMore()}>
                <Loadmore loadMore={loadMore} loading={loadingMore()} />
              </Show> 
            </Actions>
          </Table>
        </Suspense>
      </div>
    </div>
  )
}