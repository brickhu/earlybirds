
import { createResource, For } from "solid-js"
import { useGlobal } from "../../context"
import { cacheResource } from "../../store"
import { hbFetchRanks } from "../../api"
import { Table,Caption,Body,Row,Cell } from "../../components/table"
import Avatar from "../../components/avatar"
import { Currency } from "../../components/currency"
export default (props) => {
  const { env } = useGlobal()
  const [ranks,{refetch}] = cacheResource("ranks-"+env?.checkin_pid,()=>createResource(()=>env?.checkin_pid,hbFetchRanks))

  return(
    <div className="min-h-full container">
      <Show when={ranks.state === "ready"} fallback="loading...">
        <For each={[{
          emoji : "✅",
          title : "Top Check-ins",
          data : ranks()?.top_checkins,
          format : (v)=> v
        },{
          emoji : "🐛",
          title : "Top Mintings",
          data : ranks()?.top_mints,
          format : (v)=> <Currency value={v} precision={12} fixed={12} ticker="$WORM" />
        }]}>
          {rank=><section>
            <Table>
              <Caption className="text-left px-1">
                <div className="flex items-center gap-2">
                  <span className=" inline-block w-[2em]">{rank.emoji}</span>
                  <span className="text-current/50 uppercase">{rank.title}</span>
                </div>
              </Caption>
              <Body>
                <For each={rank.data}>
                  {(item,index)=>{
                    const [i] = Object.entries(item)
                    return(
                      <Row>
                        <Cell className="w-[2em]">{index()+1}</Cell>
                        <Cell>
                          <div className=" truncate flex items-center gap-2 max-w-[40vw]">
                          <Avatar username={i[0]} className=" size-6"/>
                          <span>{i[0]}</span>
                          </div>
                        </Cell>
                        <Cell className="text-right">{rank.format(i[1])}</Cell>
                      </Row>
                    )
                  }}
                </For>
              </Body>
            </Table>
            </section>}
        </For>
      </Show>
    </div>
  )
}