import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"];

export default function TopUsersChart({ topUsers }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-purple-400 mb-4">👤 Top Usuarios Más Usados</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={topUsers} dataKey="_count.username" nameKey="username" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
            {topUsers.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
