"use client";

import { useEffect, useState } from "react";
import LeaderboardPodium from "./LeaderboardPodium";

type Row = {
  student_id: string;
  full_name: string;
  total_score: number;
};

type Period = "week" | "month" | "total";

export default function LeaderboardTabs({ initialRows }: { initialRows: Row[] }) {
  const [period, setPeriod] = useState<Period>("total");
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [loading, setLoading] = useState(false);

  async function load(periodValue: Period) {
    setLoading(true);

    const res = await fetch(`/api/leaderboard?period=${periodValue}`, {
      cache: "no-store",
    });

    const json = await res.json();
    setRows(json.rows || []);
    setLoading(false);
  }

  useEffect(() => {
    load(period);
  }, [period]);

  return (
    <div className="space-y-4">

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriod("week")}
          className="px-4 py-2 border rounded-lg"
        >
          Weekly
        </button>

        <button
          onClick={() => setPeriod("month")}
          className="px-4 py-2 border rounded-lg"
        >
          Monthly
        </button>

        <button
          onClick={() => setPeriod("total")}
          className="px-4 py-2 border rounded-lg"
        >
          Total
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
          Loading...
        </div>
      ) : (
        <LeaderboardPodium rows={rows} />
      )}
    </div>
  );
}