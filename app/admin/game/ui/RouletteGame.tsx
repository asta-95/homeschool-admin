"use client";

import { useMemo, useRef, useState } from "react";

type Student = {
  id: string;
  full_name: string;
};

type Question = {
  id: string;
  question_text: string;
  difficulty?: string | null;
  is_active?: boolean;
};

type HistoryItem = {
  student: Student;
  question: Question;
  time: string;
};

function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function pickRandomExcept(length: number, excludeIndex: number | null) {
  if (length <= 1) return 0;

  let idx = randomIndex(length);
  while (idx === excludeIndex) {
    idx = randomIndex(length);
  }
  return idx;
}

export default function RouletteGame({
  students,
  questions,
}: {
  students: Student[];
  questions: Question[];
}) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const lastStudentIndexRef = useRef<number | null>(null);
  const lastQuestionIndexRef = useRef<number | null>(null);

  const canPlay = useMemo(() => students.length > 0 && questions.length > 0, [students, questions]);

  const startRoulette = async () => {
    if (!canPlay || isSpinning) return;

    setIsSpinning(true);

    const spinDuration = 3000;
    const tick = 90;
    const totalTicks = Math.floor(spinDuration / tick);

    let currentStudentIndex = 0;
    let currentQuestionIndex = 0;

    for (let i = 0; i < totalTicks; i++) {
      currentStudentIndex = randomIndex(students.length);
      currentQuestionIndex = randomIndex(questions.length);

      setSelectedStudent(students[currentStudentIndex]);
      setSelectedQuestion(questions[currentQuestionIndex]);

      await new Promise((resolve) => setTimeout(resolve, tick));
    }

    const finalStudentIndex = pickRandomExcept(students.length, lastStudentIndexRef.current);
    const finalQuestionIndex = pickRandomExcept(questions.length, lastQuestionIndexRef.current);

    const finalStudent = students[finalStudentIndex];
    const finalQuestion = questions[finalQuestionIndex];

    lastStudentIndexRef.current = finalStudentIndex;
    lastQuestionIndexRef.current = finalQuestionIndex;

    setSelectedStudent(finalStudent);
    setSelectedQuestion(finalQuestion);

    setHistory((prev) => [
      {
        student: finalStudent,
        question: finalQuestion,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setIsSpinning(false);
  };

  const resetHistory = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Student Roulette Game</h1>
        <p className="text-sm text-gray-500">
          Randomly pick a student and a question
        </p>
      </div>

      {!canPlay && (
        <div className="rounded-2xl border bg-white p-6 text-red-600">
          Please make sure you have students and active game questions in the database.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Roulette</div>
            <button
              onClick={startRoulette}
              disabled={!canPlay || isSpinning}
              className="px-5 py-3 rounded-2xl bg-black text-white disabled:opacity-50"
            >
              {isSpinning ? "Spinning..." : "Spin Now"}
            </button>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border p-5 min-h-[140px] flex flex-col justify-center">
              <div className="text-sm text-gray-500 mb-2">Selected Student</div>
              <div className={`text-3xl font-extrabold ${isSpinning ? "animate-pulse" : ""}`}>
                {selectedStudent?.full_name ?? "—"}
              </div>
            </div>

            <div className="rounded-2xl border p-5 min-h-[180px] flex flex-col justify-center">
              <div className="text-sm text-gray-500 mb-2">Selected Question</div>
              <div className={`text-xl font-semibold leading-relaxed ${isSpinning ? "animate-pulse" : ""}`}>
                {selectedQuestion?.question_text ?? "—"}
              </div>

              {selectedQuestion?.difficulty && (
                <div className="mt-4 inline-flex w-fit px-3 py-1 rounded-full text-xs border">
                  {selectedQuestion.difficulty}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">History</div>
            <button
              onClick={resetHistory}
              className="px-4 py-2 rounded-xl border hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-auto">
            {history.length === 0 && (
              <div className="text-sm text-gray-500">No spins yet</div>
            )}

            {history.map((item, index) => (
              <div key={`${item.student.id}-${item.question.id}-${index}`} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{item.student.full_name}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </div>
                <div className="mt-2 text-sm text-gray-700">{item.question.question_text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border bg-white shadow-sm p-6">
          <div className="text-lg font-medium mb-3">Students Loaded</div>
          <div className="text-4xl font-extrabold">{students.length}</div>
        </div>

        <div className="rounded-3xl border bg-white shadow-sm p-6">
          <div className="text-lg font-medium mb-3">Questions Loaded</div>
          <div className="text-4xl font-extrabold">{questions.length}</div>
        </div>
      </div>
    </div>
  );
}