"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

type Student = {
  id: string;
  full_name: string;
  grade: string | null;
  phone: string | null;
  start_date: string;
  status: string | null;
};

export default function StudentsPage() {
  const [rows, setRows] = useState<Student[]>([]);
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("students")
      .select("id,full_name,grade,phone,start_date,status")
      .order("created_at", { ascending: false });

    if (error) toast.error(error.message);
    setRows((data as Student[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !startDate) return;

    setSaving(true);
    const { error } = await supabase.from("students").insert({
      full_name: fullName.trim(),
      grade: grade || null,
      phone: phone || null,
      start_date: startDate,
      status: "active",
    });
    setSaving(false);

    if (error) return toast.error(error.message);

    toast.success("Student added");
    setFullName("");
    setGrade("");
    setPhone("");
    setStartDate("");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">Add and manage students. Print certificates from each student row.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addStudent} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Full name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Student name" />
            </div>
            <div className="grid gap-2">
              <Label>Grade</Label>
              <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. Grade 4" />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="optional" />
            </div>
            <div className="grid gap-2">
              <Label>Start date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <Button disabled={saving}>{saving ? "Saving..." : "Add student"}</Button>
              <Button type="button" variant="outline" className="ml-2" onClick={load}>
                Refresh
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.full_name}</TableCell>
                    <TableCell>{s.grade ?? "-"}</TableCell>
                    <TableCell>{s.start_date}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "default" : "secondary"}>
                        {s.status ?? "active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/admin/students/${s.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Link href={`/admin/certificate/${s.id}`}>
                        <Button size="sm">Certificate</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No students yet.
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