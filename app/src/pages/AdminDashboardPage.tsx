import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "../lib/supabase";
import { downloadCsv } from "../lib/csv";

interface ResponseRow {
  id: string;
  created_at: string;
  age: string;
  education: string;
  occupation: string;
  district: string;
  pregnancy_months: string;
  anc_attended: string;
  anc_visits: string | null;
  distance_health_center: string;
  owns_phone: string;
  heard_wearable: string;
  willing_to_use: string;
  barriers: string[];
  barrier_other: string | null;
  prevent_complications: string;
  allow_chw_alerts: string;
  additional_comments: string | null;
}

function countBy(rows: ResponseRow[], key: keyof ResponseRow) {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const value = row[key];
    if (Array.isArray(value)) {
      for (const v of value) counts[v] = (counts[v] ?? 0) + 1;
    } else if (value) {
      counts[value as string] = (counts[value as string] ?? 0) + 1;
    }
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

const CHART_COLOR = "#e11d48";

function MiniBarChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill={CHART_COLOR} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setRows((data as ResponseRow[]) ?? []);
      }
      setLoading(false);
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const pct = (count: number) =>
      total === 0 ? "0%" : `${Math.round((count / total) * 100)}%`;

    return {
      total,
      ancAttended: pct(rows.filter((r) => r.anc_attended === "Yes").length),
      ownsPhone: pct(rows.filter((r) => r.owns_phone === "Yes").length),
      willing: pct(rows.filter((r) => r.willing_to_use === "Yes").length),
    };
  }, [rows]);

  const comments = rows.filter(
    (r) => r.additional_comments && r.additional_comments.trim().length > 0
  );

  const handleExport = () => {
    const exportRows = rows.map((r) => ({
      ...r,
      barriers: r.barriers?.join("; "),
    }));
    downloadCsv(exportRows, `responses-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading responses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Response Dashboard
            </h1>
            <p className="text-gray-500">
              Awareness &amp; Preparedness for Maternal Health Monitoring
              Devices
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={rows.length === 0}
              className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-50"
            >
              Export CSV
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-xl border-2 border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Responses" value={stats.total.toString()} />
          <StatCard label="Attended ANC" value={stats.ancAttended} />
          <StatCard label="Own a Phone" value={stats.ownsPhone} />
          <StatCard label="Willing to Use Device" value={stats.willing} />
        </div>

        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
            No responses collected yet.
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Age Distribution" data={countBy(rows, "age")} />
              <ChartCard title="District" data={countBy(rows, "district")} />
              <ChartCard
                title="Willingness to Use Device"
                data={countBy(rows, "willing_to_use")}
              />
              <ChartCard
                title="Barriers to Adoption"
                data={countBy(rows, "barriers")}
              />
              <ChartCard
                title="Heard of Wearable Devices"
                data={countBy(rows, "heard_wearable")}
              />
              <ChartCard
                title="Could Prevent Complications"
                data={countBy(rows, "prevent_complications")}
              />
            </div>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Additional Comments ({comments.length})
                </h3>
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {comments.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700"
                    >
                      {r.additional_comments}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  data,
}: {
  title: string;
  data: { name: string; count: number }[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-400">No data</p>
      ) : (
        <MiniBarChart data={data} />
      )}
    </div>
  );
}
