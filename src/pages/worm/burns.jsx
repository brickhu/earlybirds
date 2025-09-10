import { cacheResource } from "../../store"
import { useGlobal, useClock } from "../../context"
import { createEffect, createResource, Suspense } from "solid-js"
import { fetchBurns } from "../../api"
import { createPagination } from "../../store"
import { Table, Body, Head, Row, Cell, Cols, Col, Caption, Actions } from "../../components/table"
import { Shorter } from "../../components/shorter"
import { Currency } from "../../components/currency"
import { A } from "@solidjs/router"
import Loadmore from "../../components/loadmore"

export default (props) => {
  const {env} = useGlobal() 
  const { getTheClockDatetime } = useClock()
  const [mints,{refetch:refetchMints, hasMore,loadingMore,loadMore}] = cacheResource("burns-"+env?.wrom_pid,()=>createPagination(()=>({from:env?.wrom_pid,to:env?.checkin_pid}),fetchBurns,{size:100}))
  createEffect(()=>console.log(mints()))
  return(
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 items-stretch py-12">
      <div className="col-span-full">
        <Suspense fallback="loading...">
          <Table>
            <Head>
              <Col className="hidden lg:table-cell">Time</Col>
              <Col>Address</Col>
              <Col>Quantity</Col>
              <Col className="text-right"><span className="p-4">TX</span></Col>
            </Head>
            <Body>
              <For each={mints()}>
                {item=>(
                  <Row>
                    <Cell className="hidden lg:table-cell">{getTheClockDatetime(item.timestamp).full}</Cell>
                    <Cell><Shorter value={item.address} length={6}/></Cell>
                    <Cell><Currency value={item.quantity} precision={12} fixed={12} ticker="$WORM"></Currency></Cell>
                    <Cell className="text-right">
                      <Shorter value={item.id} length={6} className="text-current/60 hidden lg:block"/> <A target="_blank" href={`https://www.ao.link/#/message/${item.id}`} className="btn btn-ghost rounded-full after:content-['_↗']"> </A>
                    </Cell>
                  </Row>
                )}
              </For>
            </Body>
            <Actions className=" ">
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