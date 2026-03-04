"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase.from("students").select("*").eq("id", id).single();
    if (error) toast.error(error.message);
    setStudent(data);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("students")
      .update({
        full_name: student.full_name,
        grade: student.grade || null,
        phone: student.phone || null,
        start_date: student.start_date,
        status: student.status || "active",
      })
      .eq("id", id);
    setSaving(false);

    if (error) return toast.error(error.message);
    toast.success("Saved");
  }

  async function remove() {
    if (!confirm("Delete this student?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    router.push("/admin/students");
  }

  if (!student) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Student</h1>
        <p className="text-sm text-muted-foreground">Update student info.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Full name</Label>
            <Input value={student.full_name} onChange={(e) => setStudent({ ...student, full_name: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label>Grade</Label>
            <Input value={student.grade ?? ""} onChange={(e) => setStudent({ ...student, grade: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input value={student.phone ?? ""} onChange={(e) => setStudent({ ...student, phone: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label>Start date</Label>
            <Input type="date" value={student.start_date} onChange={(e) => setStudent({ ...student, start_date: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={student.status ?? "active"}
              onChange={(e) => setStudent({ ...student, status: e.target.value })}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <Button disabled={saving} onClick={save}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/admin/certificate/${id}`)}>
              Certificate
            </Button>
            <Button variant="destructive" onClick={remove}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}