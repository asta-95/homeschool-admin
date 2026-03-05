type Row = {
  student_id: string;
  full_name: string;
  total_score: number;
};

function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "🏅";
}

export default function LeaderboardPodium({ rows }: { rows: Row[] }) {
  const top = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="space-y-4">
      {/* Podium */}
      <div className="grid md:grid-cols-3 gap-4">
        {top.map((r, i) => {
          const rank = i + 1;
          return (
            <div
              key={r.student_id}
              className={[
                "rounded-2xl border bg-white shadow-sm p-4",
                rank === 1 ? "md:scale-[1.03] border-black" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-2xl">{medal(rank)}</div>
                <div className="text-sm text-gray-500 font-medium">#{rank}</div>
              </div>

              <div className="mt-3">
                <div className="text-lg font-semibold">{r.full_name}</div>
                <div className="text-sm text-gray-500">ID: {r.student_id.slice(0, 8)}...</div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div className="text-sm text-gray-500">Total Score</div>
                <div className="text-3xl font-extrabold">{Number(r.total_score).toFixed(0)}</div>
              </div>

              {rank === 1 && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs">
                  👑 Champion
                </div>
              )}
            </div>
          );
        })}

        {top.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 md:col-span-3">
            No scores yet
          </div>
        )}
      </div>

      {/* Full list */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-medium">All Rankings</div>
          <div className="text-sm text-gray-500">{rows.length} students</div>
        </div>

        <div className="divide-y">
          {rest.map((r, idx) => {
            const rank = idx + 4;
            return (
              <div key={r.student_id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 font-semibold">
                    <span className="mr-2">{medal(rank)}</span>#{rank}
                  </div>
                  <div className="font-medium">{r.full_name}</div>
                </div>
                <div className="font-semibold">{Number(r.total_score).toFixed(0)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}