"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Subject = { id: string; name: string };

export default function SubjectsPage() {
  const [name, setName] = useState("");
  const [rows, setRows] = useState<Subject[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase.from("subjects").select("id,name").order("name");
    if (error) toast.error(error.message);
    setRows((data as Subject[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const { error } = await supabase.from("subjects").insert({ name: name.trim() });
    setSaving(false);

    if (error) return toast.error(error.message);
    toast.success("Subject added");
    setName("");
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this subject?")) return;
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subjects</h1>
        <p className="text-sm text-muted-foreground">Create subjects like Math, English, Science.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Subject</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <form onSubmit={add} className="flex w-full gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Math" />
            <Button disabled={saving}>{saving ? "Adding..." : "Add"}</Button>
            <Button type="button" variant="outline" onClick={load}>Refresh</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => del(s.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No subjects yet.
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