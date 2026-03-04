"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CertificatePage() {

  const params = useParams();
  const studentId = params?.studentId as string;

  const [student, setStudent] = useState<any>(null);

  useEffect(() => {

    if (!studentId) return;

    async function loadStudent() {

      const { data } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

      setStudent(data);

    }

    loadStudent();

  }, [studentId]);

  if (!student) return <div style={{padding:40}}>Loading...</div>;

  return (

<div className="page">

<div className="certificate">

<div className="pattern"></div>

<div className="content">

<h1 className="khTitle">ប័ណ្ណសរសើរ</h1>
<p className="enTitle">Certificate of Achievement</p>

<p className="text">This certificate is proudly presented to</p>

<h2 className="student">{student.full_name}</h2>

<p className="textKh">
ដែលបានបញ្ចប់កម្មវិធីសិក្សា
</p>

<p className="program">
Homeschool Learning Program
</p>

<div className="info">

<div>
<p className="label">Date</p>
<p className="value">{student.start_date}</p>
</div>

<div>
<p className="label">Grade</p>
<p className="value">{student.grade}</p>
</div>

</div>

<div className="signatures">

<div>
<div className="line"></div>
<p>Instructor</p>
</div>

<div>
<div className="line"></div>
<p>Director</p>
</div>

</div>

</div>

</div>

<button
onClick={() => window.print()}
className="printBtn"
>
Print Certificate
</button>

<style jsx>{`

.page{
background:#f2f2f2;
min-height:100vh;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
padding:40px;
}

.certificate{

width:297mm;
height:210mm;

position:relative;

background:white;

border:8px solid #1f3c88;

box-shadow:0 10px 30px rgba(0,0,0,0.15);

overflow:hidden;

}

.pattern{

position:absolute;
inset:0;

background-image:

radial-gradient(#e5e7eb 1px, transparent 1px),
radial-gradient(#e5e7eb 1px, transparent 1px);

background-size:40px 40px;

opacity:0.35;

}

.content{

position:relative;

padding:70px;

text-align:center;

}

.khTitle{

font-size:48px;
color:#1f3c88;
margin:0;
font-weight:700;

}

.enTitle{

font-size:18px;
letter-spacing:3px;
color:#555;
margin-bottom:30px;

}

.text{

font-size:18px;
color:#555;

}

.textKh{

font-size:20px;
margin-top:10px;

}

.student{

font-size:44px;
font-weight:700;
margin:25px 0;
color:#111;

}

.program{

font-size:22px;
font-weight:600;
margin-bottom:40px;

}

.info{

display:flex;
justify-content:center;
gap:140px;

margin-top:20px;

}

.label{

color:#777;
font-size:14px;

}

.value{

font-size:20px;
font-weight:600;

}

.signatures{

display:flex;
justify-content:space-between;
margin-top:70px;

}

.line{

width:220px;
border-top:2px solid #333;
margin:auto;
margin-bottom:10px;

}

.printBtn{

margin-top:25px;
background:#1f3c88;
color:white;
padding:12px 24px;
border:none;
border-radius:6px;
cursor:pointer;

}

@media print{

@page{
size:A4 landscape;
margin:0;
}

body *{
visibility:hidden;
}

.certificate, .certificate *{
visibility:visible;
}

.certificate{
position:absolute;
left:0;
top:0;
box-shadow:none;
}

.printBtn{
display:none;
}

}

`}</style>

</div>

  );

}