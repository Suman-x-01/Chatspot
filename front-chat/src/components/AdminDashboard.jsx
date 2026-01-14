import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await axios.get("http://localhost:8080/api/admin/stats");
    setStats(res.data);
  };

  if (!stats) return <p className="text-white p-8">Loading dashboard...</p>;

  // Convert maps to arrays for recharts
  const userData = Object.entries(stats.userPerMonth).map(([month, count]) => ({
    month,
    count,
  }));

  const roomData = Object.entries(stats.roomPerMonth).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/admin/allchat")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
      {/* Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl text-center border border-gray-700">
          <h2 className="text-xl text-blue-300">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl text-center border border-gray-700">
          <h2 className="text-xl text-blue-300">Total Rooms</h2>
          <p className="text-3xl font-bold">{stats.totalRooms}</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Users per month */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Users Per Month</h2>
          <BarChart width={450} height={300} data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#38bdf8" />
          </BarChart>
        </div>

        {/* Rooms per month */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Rooms Per Month</h2>
          <LineChart width={450} height={300} data={roomData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#f472b6"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
