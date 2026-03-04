"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Subject = { id: string; name: string };
type Assessment = {
  id: string;
  title: string;
  assessment_date: string;
  max_score: number;
  weight: number;
  subject_id: string | null;
  subjects?: { name: string } | null;
};

export default function AssessmentsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rows, setRows] = useState<Assessment[]>([]);

  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [weight, setWeight] = useState(1);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data: subs, error: sErr } = await supabase.from("subjects").select("id,name").order("name");
    if (sErr) toast.error(sErr.message);
    setSubjects((subs as Subject[]) ?? []);

    const { data: a, error: aErr } = await supabase
      .from("assessments")
      .select("id,title,assessment_date,max_score,weight,subject_id,subjects(name)")
      .order("assessment_date", { ascending: false });

    if (aErr) toast.error(aErr.message);
    setRows((a as any) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return toast.error("Title and date required.");

    setSaving(true);
    const { error } = await supabase.from("assessments").insert({
      subject_id: subjectId || null,
      title: title.trim(),
      assessment_date: date,
      max_score: Number(maxScore) || 100,
      weight: Number(weight) || 1,
    });
    setSaving(false);

    if (error) return toast.error(error.message);

    toast.success("Assessment added");
    setTitle("");
    setDate("");
    setMaxScore(100);
    setWeight(1);
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this assessment?")) return;
    const { error } = await supabase.from("assessments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assessments</h1>
        <p className="text-sm text-muted-foreground">Create tests/quizzes that students will be scored on.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Subject</Label>
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">(No subject)</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Week 1 Quiz" />
            </div>

            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Max Score</Label>
              <Input type="number" value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value))} />
            </div>

            <div className="grid gap-2">
              <Label>Weight</Label>
              <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            </div>

            <div className="md:col-span-2">
              <Button disabled={saving}>{saving ? "Saving..." : "Add assessment"}</Button>
              <Button type="button" variant="outline" className="ml-2" onClick={load}>Refresh</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.assessment_date}</TableCell>
                    <TableCell>{a.subjects?.name ?? "-"}</TableCell>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell>{a.max_score}</TableCell>
                    <TableCell>{a.weight ?? 1}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => del(a.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No assessments yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}