"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {

const [students,setStudents] = useState<any[]>([])
const [totalStudents,setTotalStudents] = useState(0)
const [totalSubjects,setTotalSubjects] = useState(0)
const [totalAssessments,setTotalAssessments] = useState(0)

useEffect(()=>{

async function loadDashboard(){

/* TOTAL COUNTS */

const {count:studentsCount} = await supabase
.from("students")
.select("*",{count:"exact",head:true})

const {count:subjectsCount} = await supabase
.from("subjects")
.select("*",{count:"exact",head:true})

const {count:assessmentsCount} = await supabase
.from("assessments")
.select("*",{count:"exact",head:true})

setTotalStudents(studentsCount || 0)
setTotalSubjects(subjectsCount || 0)
setTotalAssessments(assessmentsCount || 0)


/* LOAD SCORES */

const {data} = await supabase
.from("scores")
.select(`
score,
students(full_name)
`)

if(!data) return

const map:any = {}

data.forEach((row:any)=>{

const name = row.students?.full_name || "Unknown"

if(!map[name]) map[name] = {name,total:0}

map[name].total += row.score

})

const ranking = Object.values(map).sort(
(a:any,b:any)=>b.total-a.total
)

setStudents(ranking)

}

loadDashboard()

},[])

return (

<div style={{padding:"40px"}}>

<h1 style={{fontSize:"32px",marginBottom:"25px"}}>
Dashboard
</h1>


{/* STAT CARDS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"20px",
marginBottom:"40px"
}}>

<div className="card">
<h3>Students</h3>
<p>{totalStudents}</p>
</div>

<div className="card">
<h3>Subjects</h3>
<p>{totalSubjects}</p>
</div>

<div className="card">
<h3>Assessments</h3>
<p>{totalAssessments}</p>
</div>

<div className="card">
<h3>Certificates</h3>
<p>Auto</p>
</div>

</div>


{/* LEADERBOARD */}

<h2 style={{marginBottom:"15px"}}>
🏆 Leaderboard
</h2>

<div className="leaderboard">

<table style={{width:"100%"}}>

<thead>

<tr>

<th>Rank</th>
<th>Student</th>
<th>Total Score</th>

</tr>

</thead>

<tbody>

{students.map((s,i)=>{

let medal = ""

if(i===0) medal="🥇"
if(i===1) medal="🥈"
if(i===2) medal="🥉"

return(

<tr key={i}>

<td>{medal || `#${i+1}`}</td>

<td>{s.name}</td>

<td>{s.total}</td>

</tr>

)

})}

</tbody>

</table>

</div>


<style jsx>{`

.card{
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 6px 20px rgba(0,0,0,0.1);
text-align:center;
}

.card h3{
margin-bottom:10px;
font-size:16px;
color:#555;
}

.card p{
font-size:28px;
font-weight:700;
color:#1e40af;
}

.leaderboard{
background:white;
padding:25px;
border-radius:10px;
box-shadow:0 6px 20px rgba(0,0,0,0.1);
}

table{
border-collapse:collapse;
}

th{
text-align:left;
padding:12px;
background:#1e293b;
color:white;
}

td{
padding:12px;
border-bottom:1px solid #eee;
font-weight:500;
}

`}</style>

</div>

)

}