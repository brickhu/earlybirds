import { A, useParams } from "@solidjs/router";
import { cacheResource } from "../../store"
import { useGlobal } from "../../context";
import { fetchUserProfile } from "../../api";
import { createEffect, createResource } from "solid-js";

export default props=>{

  const { env } = useGlobal()
  const { id } = useParams();
  const [p,{refetch}] = cacheResource("profile-"+id,()=>createResource(()=>({pid:env?.checkin_pid,address:id}) ,fetchUserProfile))
  createEffect(()=>console.log(p()))
  return <div>
    <Show when={p.state === "ready"} fallback="loading...">
      <p>{id}</p>
      <p>level : {p()?.level}</p>
      <p>mints : {p()?.mint}</p>
    </Show>
  </div>
}