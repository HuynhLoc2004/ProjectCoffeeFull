import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../AxiosClient";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// const dataRevenue = [
//     { name: 'Tháng 1', revenue: 4000 },
//     { name: 'Tháng 2', revenue: 3000 },
//     { name: 'Tháng 3', revenue: 2000 },
//     { name: 'Tháng 4', revenue: 2780 },
//     { name: 'Tháng 5', revenue: 1890 },
//     { name: 'Tháng 6', revenue: 2390 },
//     { name: 'Tháng 7', revenue: 3490 },
// ];

const dataCategories = [
  { name: "Cà phê hạt", value: 400, color: "#FF8042" },
  { name: "Cà phê bột", value: 300, color: "#00C49F" },
  { name: "Máy pha cà phê", value: 300, color: "#FFBB28" },
  { name: "Phụ kiện", value: 200, color: "#0088FE" },
];

const stats = [
  {
    label: "Tổng doanh thu",
    value: "$128,430",
    change: "+12.5%",
    isUp: true,
    icon: DollarSign,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    label: "Đơn hàng mới",
    value: "1,240",
    change: "+18.2%",
    isUp: true,
    icon: ShoppingCart,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Khách hàng mới",
    value: "342",
    change: "-4.1%",
    isUp: false,
    icon: UserPlus,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    label: "Tỷ lệ chuyển đổi",
    value: "3.24%",
    change: "+2.4%",
    isUp: true,
    icon: TrendingUp,
    color: "bg-orange-500/10 text-orange-500",
  },
];

const DashboardView = () => {
  const [profits, setProfits] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [ordernewyear, setOrdernewyear] = useState(0);
  const [accountNewOfYear, setAccountNewOfYear] = useState(0);
  const [productBestOfYear, setProductBestOfYear] = useState([]);
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const dataRevenue = monthNames.map((name, index) => {
    const monthNumber = index + 1;
    const profitData = profits.find((p) => parseInt(p.month) === monthNumber);
    return {
      name: name,
      revenue: profitData ? profitData.profit : 0,
    };  
  });

  const totalYearlyRevenue = profits.reduce(
    (sum, item) => sum + (Number(item.profit) || 0),
    0,
  );

  const dynamicStats = [
    {
      label: "Tổng lợi nhuận (" + selectedYear + ")",
      value: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(totalYearlyRevenue),
      change: "+12.5%", // Bạn có thể cập nhật logic này nếu có dữ liệu so sánh
      isUp: true,
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Đơn hàng mới",
      value: ordernewyear || 0,
      change: "+18.2%",
      isUp: true,
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Người dùng mới",
      value: accountNewOfYear || 0,
      change: "+5.4%",
      isUp: true,
      icon: UserPlus,
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  useEffect(() => {
    if (!selectedYear) return;
    axiosClient
      .get(`/order/get-profit/by-month?year=${selectedYear}`, {
        withCredentials: true,
      })
      .then((res) => {
        setProfits(res.data.result || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear) return;
    axiosClient
      .get(`/order/getCountOrderByYear?year=${selectedYear}`, {
        withCredentials: true,
      })
      .then((res) => {
        setOrdernewyear(
          res.data.result !== undefined ? res.data.result : res.data,
        );
      })
      .catch((err) => {
        console.error("Lỗi lấy số lượng đơn hàng:", err);
      });
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear) return;
    axiosClient
      .get(`/order/getTopBestSel?top=4&year=${selectedYear}`, {
        withCredentials: true,
      })
      .then((res) => {
        setProductBestOfYear(res.data.result);
      })
      .catch((err) => {
        console.error("Lỗi :", err);
      });
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedYear) return;
    axiosClient
      .get(`/user/get-countUser?year=${selectedYear}`, {
        withCredentials: true,
      })
      .then((res) => {
        setAccountNewOfYear(
          res.data.result !== undefined ? res.data.result : res.data,
        );
      })
      .catch((err) => {
        console.error("Lỗi lấy số lượng user:", err);
      });
  }, [selectedYear]);
  useEffect(() => {
    axiosClient
      .get(`/order/getFullyearOrder`, {
        withCredentials: true,
      })
      .then((res) => {
        const listYears = res.data.result || [];
        setYears(listYears);

        if (listYears.length > 0) {
          setSelectedYear(listYears[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const chartColors = ["#f97316", "#00C49F", "#FFBB28", "#0088FE"];
  const bestSellingData = productBestOfYear.map((item, index) => ({
    name: item.productname,
    value: item.count,
    color: chartColors[index % chartColors.length],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Chào mừng trở lại, Admin! 👋</h1>
          <div className="flex gap-2 mt-4 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition
        ${
          selectedYear === year
            ? "bg-orange-600 text-white"
            : "bg-neutral-900 border border-neutral-800 hover:bg-neutral-800"
        }`}
              >
                {year}
              </button>
            ))}
          </div>
          <p className="text-neutral-500 mt-1">
            Hôm nay có vẻ là một ngày bận rộn với các đơn hàng mới.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-medium hover:bg-neutral-800 transition-all">
            Tải báo cáo
          </button>
          <button className="px-4 py-2 rounded-xl bg-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-600/20 hover:bg-orange-500 transition-all">
            Quản lý kho
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden group transition-all"
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`p-3 rounded-2xl w-fit ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-neutral-500 text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {stat.isUp ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-xl font-bold mb-8">Doanh thu hệ thống</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#262626"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#737373", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#737373", fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value),
                    "Lợi nhuận",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-8">Sản phẩm bán chạy</h3>
          <div className="flex-1 w-full relative h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bestSellingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {bestSellingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 w-full mt-4">
            {bestSellingData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-neutral-400 font-medium truncate max-w-[150px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold whitespace-nowrap">
                  {item.value} đơn
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
