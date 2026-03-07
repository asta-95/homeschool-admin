import RouletteGame from "./ui/RouletteGame";

// Change this import path to match your project
import { createClient } from "@/lib/supabase/server";

export default async function GamePage() {
  const supabase = await createClient();

  const [{ data: students, error: studentsError }, { data: questions, error: questionsError }] =
    await Promise.all([
      supabase.from("students").select("id, full_name").order("full_name"),
      supabase
        .from("game_questions")
        .select("id, question_text, difficulty, is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
    ]);

  if (studentsError) {
    return <div className="p-6 text-red-600">Students error: {studentsError.message}</div>;
  }

  if (questionsError) {
    return <div className="p-6 text-red-600">Questions error: {questionsError.message}</div>;
  }

  return (
    <div className="p-6">
      <RouletteGame
        students={students ?? []}
        questions={questions ?? []}
      />
    </div>
  );
}