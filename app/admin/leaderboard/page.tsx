"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LeaderboardPage() {

const [students,setStudents] = useState<any[]>([])

useEffect(()=>{

async function load(){

const {data} = await supabase
.from("scores")
.select(`
score,
students(full_name)
`)

if(!data) return

const map:any = {}

data.forEach((r:any)=>{

const name = r.students?.full_name || "Unknown"

if(!map[name]) map[name] = {name,total:0,count:0}

map[name].total += r.score
map[name].count += 1

})

const avg = Object.values(map).map((s:any)=>({

name:s.name,
avg:Math.round(s.total/s.count)

}))

avg.sort((a:any,b:any)=>b.avg-a.avg)

setStudents(avg)

}

load()

},[])

return (

<div style={{padding:"40px"}}>

<h1 style={{fontSize:"32px",marginBottom:"20px"}}>
🏆 Student Leaderboard
</h1>

<div style={{
background:"white",
borderRadius:"12px",
padding:"30px",
boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
}}>

<table style={{width:"100%",borderCollapse:"collapse"}}>

<thead>

<tr style={{
background:"#1e293b",
color:"white"
}}>

<th style={{padding:"12px"}}>Rank</th>
<th>Student</th>
<th>Average Score</th>

</tr>

</thead>

<tbody>

{students.map((s,i)=>{

let medal = ""

if(i===0) medal="🥇"
if(i===1) medal="🥈"
if(i===2) medal="🥉"

return(

<tr key={i} style={{
borderBottom:"1px solid #eee",
textAlign:"center"
}}>

<td style={{padding:"14px",fontSize:"20px"}}>
{medal || `#${i+1}`}
</td>

<td style={{fontWeight:"600"}}>
{s.name}
</td>

<td style={{
fontSize:"20px",
color:"#1e40af",
fontWeight:"700"
}}>
{s.avg}
</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>

)

}