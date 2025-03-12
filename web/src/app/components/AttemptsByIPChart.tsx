import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AttemptsByIPChart({ attemptsByIP }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">🌍 Intentos por IP</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={attemptsByIP}>
          <XAxis dataKey="ip" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="_count.ip" fill="#36A2EB" name="N. Intentos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
