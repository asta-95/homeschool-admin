"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Student = { id: string; full_name: string; grade: string | null };
type Assessment = {
  id: string;
  title: string;
  assessment_date: string;
  max_score: number;
  subjects?: { name: string } | null;
};

export default function ScoreEntryPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [studentId, setStudentId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [score, setScore] = useState<number>(0);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedAssessment = useMemo(
    () => assessments.find((a) => a.id === assessmentId),
    [assessments, assessmentId]
  );

  async function load() {
    const { data: s, error: sErr } = await supabase
      .from("students")
      .select("id,full_name,grade")
      .order("created_at", { ascending: false });
    if (sErr) toast.error(sErr.message);
    setStudents((s as Student[]) ?? []);

    const { data: a, error: aErr } = await supabase
      .from("assessments")
      .select("id,title,assessment_date,max_score,subjects(name)")
      .order("assessment_date", { ascending: false });
    if (aErr) toast.error(aErr.message);
    setAssessments((a as any) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId || !assessmentId) return toast.error("Select student and assessment.");

    const max = selectedAssessment?.max_score ?? 100;
    if (score < 0 || score > max) return toast.error(`Score must be 0 - ${max}`);

    setSaving(true);
    const { error } = await supabase.from("scores").upsert(
      {
        student_id: studentId,
        assessment_id: assessmentId,
        score,
        note: note || null,
      },
      { onConflict: "student_id,assessment_id" }
    );
    setSaving(false);

    if (error) return toast.error(error.message);

    toast.success("Saved score");
    setNote("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Enter Scores</h1>
        <p className="text-sm text-muted-foreground">Choose student + assessment and save the score.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Student</Label>
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} {s.grade ? `(${s.grade})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Assessment</Label>
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={assessmentId}
                onChange={(e) => setAssessmentId(e.target.value)}
              >
                <option value="">Select assessment</option>
                {assessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.assessment_date} — {a.subjects?.name ?? "-"} — {a.title} (max {a.max_score})
                  </option>
                ))}
              </select>

              {selectedAssessment && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">{selectedAssessment.subjects?.name ?? "No subject"}</Badge>
                  <Badge variant="secondary">Max {selectedAssessment.max_score}</Badge>
                  <Badge variant="secondary">{selectedAssessment.assessment_date}</Badge>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid gap-2 max-w-xs">
              <Label>Score</Label>
              <Input type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} />
              <p className="text-xs text-muted-foreground">Range: 0 - {selectedAssessment?.max_score ?? 100}</p>
            </div>

            <div className="grid gap-2">
              <Label>Note (optional)</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. late submission" />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save score"}</Button>
              <Button type="button" variant="outline" onClick={load}>Refresh</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}