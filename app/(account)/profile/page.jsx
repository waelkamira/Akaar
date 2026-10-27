'use client';

import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  FolderKanban, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Settings,
  Search,
  Bell,
  Mail,
  TrendingUp,
  Users,
  Award,
  Clock,
  ShoppingCart,
  Package,
  MessageCircle,
  LogOut,
  User,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FaStore, FaChartLine, FaBox, FaComments, FaCog, FaHome } from 'react-icons/fa';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const navItems = [
    { name: 'الرئيسية', icon: FaHome, path: '/dashboard', id: 'overview' },
    { name: 'متجري', icon: FaStore, path: '/my-store', id: 'mystore' },
    { name: 'الإعلانات', icon: Package, path: '/posts', id: 'ads' },
    { name: 'الرسائل', icon: FaComments, path: '/messages', id: 'messages' },
    { name: 'الإحصائيات', icon: FaChartLine, path: '/analytics', id: 'analytics' },
    { name: 'الإعدادات', icon: FaCog, path: '/settings', id: 'settings' },
  ];

  const stats = [
    { 
      title: 'إجمالي الإعلانات', 
      value: '24', 
      change: '+12%', 
      icon: FolderKanban,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    { 
      title: 'المهام المكتملة', 
      value: '86', 
      change: '+18%', 
      icon: Award,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    { 
      title: 'المتابعين', 
      value: '1.2K', 
      change: '+8%', 
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
  ];

  const tasks = [
    { 
      title: 'مراجعة تصميم الواجهة', 
      time: 'اليوم، 10:00 ص', 
      status: 'قيد التنفيذ',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      color: 'from-pink-500 to-rose-500',
      icon: FolderKanban
    },
    { 
      title: 'تطوير الصفحة الرئيسية', 
      time: 'اليوم، 01:00 م', 
      status: 'قيد التنفيذ',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      color: 'from-amber-500 to-orange-500',
      icon: Clock
    },
    { 
      title: 'إصلاح الأخطاء', 
      time: 'غداً، 11:00 ص', 
      status: 'معلق',
      statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      color: 'from-emerald-500 to-teal-500',
      icon: CheckSquare
    },
    { 
      title: 'اجتماع مع العميل', 
      time: 'غداً، 03:00 م', 
      status: 'قادم',
      statusColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      color: 'from-purple-500 to-violet-500',
      icon: Users
    },
  ];

  const projectStats = [
    { label: 'التصميم', value: '68%', color: 'bg-orange-500' },
    { label: 'التطوير', value: '52%', color: 'bg-blue-500' },
    { label: 'الاختبار', value: '40%', color: 'bg-amber-400' },
    { label: 'التسويق', value: '30%', color: 'bg-emerald-500' },
  ];

  const handleNavigation = (path, id) => {
    setActiveTab(id);
    router.push(path);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen mt-60 bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden" dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          DASHBOARD
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex gap-6">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-72 bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 text-white hidden lg:block border border-neutral-800 shadow-2xl sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto"
          >
            {/* Logo & Profile */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <FaHome className="text-xl" />
              </div>
              <div>
                <span className="font-bold text-xl block">لوحة التحكم</span>
                <span className="text-xs text-neutral-400">مرحباً بك</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`text-lg ${activeTab === item.id ? 'text-white' : 'group-hover:text-orange-500'} transition-colors`} />
                  <span className="font-medium">{item.name}</span>
                  {activeTab === item.id && <ChevronLeft className="mr-auto text-white" size={18} />}
                </button>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="pt-6 border-t border-neutral-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="text-lg" />
                <span className="font-medium">تسجيل الخروج</span>
              </button>
            </div>

            {/* User Profile Card */}
            <div className="mt-6 bg-neutral-800/50 backdrop-blur rounded-2xl p-4 border border-neutral-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">المستخدم</p>
                  <p className="text-xs text-neutral-400 truncate">user@example.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h1 className="text-3xl font-black text-white mb-1">
                  لوحة التحكم
                </h1>
                <p className="text-neutral-400">نتمنى لك يوماً موفقاً! ✨</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="ابحث عن شيء..."
                    className="pr-10 pl-4 py-2.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 w-64 text-white placeholder-neutral-500 backdrop-blur-xl"
                  />
                </div>
                <button className="relative p-2.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:bg-neutral-800/60 transition-all backdrop-blur-xl group">
                  <Bell size={20} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <button className="p-2.5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:bg-neutral-800/60 transition-all backdrop-blur-xl group">
                  <Mail size={20} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </button>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-0.5 cursor-pointer">
                  <div className="w-full h-full rounded-2xl bg-neutral-800 p-0.5">
                    <img 
                      src="https://i.pravatar.cc/150?img=5" 
                      alt="Profile" 
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Welcome Card & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Welcome Card */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/30">
                    <img 
                      src="https://i.pravatar.cc/150?img=5" 
                      alt="Welcome" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      صباح الخير! 
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      لنجعل اليوم رائعاً! 💜
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`${stat.bgColor} backdrop-blur-xl rounded-3xl p-6 border ${stat.borderColor} hover:border-opacity-40 transition-all group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-neutral-400 text-sm font-medium mb-2">{stat.title}</p>
                      <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon size={22} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                    <TrendingUp size={16} />
                    <span>{stat.change}</span>
                    <span className="text-neutral-500 font-normal text-xs">من الشهر الماضي</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activity & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Activity Overview */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">نظرة عامة على النشاط</h3>
                  <select className="bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <option>هذا الأسبوع</option>
                    <option>الأسبوع الماضي</option>
                    <option>هذا الشهر</option>
                  </select>
                </div>
                
                {/* Simple Line Chart Visualization */}
                <div className="relative h-48">
                  <svg className="w-full h-full" viewBox="0 0 800 200">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 150 Q 100 120, 200 100 T 400 80 T 600 100 T 800 60"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 150 Q 100 120, 200 100 T 400 80 T 600 100 T 800 60 V 200 H 0 Z"
                      fill="url(#gradient)"
                    />
                    {[0, 100, 200, 300, 400, 500, 600, 700].map((x, i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={[150, 130, 110, 90, 80, 95, 100, 60][i]}
                        r="6"
                        fill="#F97316"
                        className="hover:r-8 transition-all"
                      />
                    ))}
                  </svg>
                  <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    <span>الاثنين</span>
                    <span>الثلاثاء</span>
                    <span>الأربعاء</span>
                    <span>الخميس</span>
                    <span>الجمعة</span>
                    <span>السبت</span>
                    <span>الأحد</span>
                  </div>
                </div>
              </motion.div>

              {/* My Tasks */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">مهامي</h3>
                  <button className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors">
                    عرض الكل
                  </button>
                </div>
                
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-800/50 transition-all group cursor-pointer border border-transparent hover:border-neutral-700"
                    >
                      <div className={`bg-gradient-to-br ${task.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                        <task.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{task.title}</h4>
                        <p className="text-xs text-neutral-500">{task.time}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${task.statusColor}`}>
                        {task.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Progress */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">تقدم المشاريع</h3>
                  <button className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors">
                    عرض الكل
                  </button>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#262626"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#F97316"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray="351.86"
                        strokeDashoffset="112.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-black text-white">68%</span>
                        <p className="text-xs text-neutral-500">مكتمل</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats List */}
                  <div className="flex-1 space-y-3">
                    {projectStats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                        <span className="text-sm text-neutral-400 flex-1">{stat.label}</span>
                        <span className="text-sm font-bold text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Reminder */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl"></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">لا تنسَ!</h3>
                    <p className="text-sm text-neutral-400 mb-3">لديك 3 مهام مستحقة اليوم.</p>
                    <button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg shadow-orange-600/20">
                      عرض المهام
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Motivational Message */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">☁️</div>
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      أنت تبلي بلاءً حسناً! 💜
                    </h3>
                    <p className="text-sm text-neutral-400">
                      استمر في التقدم وحقق المزيد.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}