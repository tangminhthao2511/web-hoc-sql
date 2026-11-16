import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Database,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Sparkles,
  User,
} from 'lucide-react';
import { MeowMascot } from './MeowMascot';

interface LoginViewProps {
  onLoginSuccess: (username: string, remember: boolean) => void;
}

export const DEFAULT_USERNAME = 'Thảo';
export const DEFAULT_PASSWORD = '12345679';
const USERS_STORAGE_KEY = 'meowsql_accounts_v1';

interface LocalAccount {
  username: string;
  password: string;
}

function loadAccounts(): LocalAccount[] {
  const base: LocalAccount[] = [
    { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD },
  ];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return base;
    const extras = parsed.filter(
      (a): a is LocalAccount =>
        a &&
        typeof a.username === 'string' &&
        typeof a.password === 'string' &&
        a.username !== DEFAULT_USERNAME
    );
    return [...base, ...extras];
  } catch {
    return base;
  }
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleModeSwitch = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError(null);
    setSuccessMsg(null);
    if (nextMode === 'login') {
      setUsername(DEFAULT_USERNAME);
      setPassword(DEFAULT_PASSWORD);
    } else {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }

    const accounts = loadAccounts();

    if (mode === 'login') {
      const matched = accounts.find(
        (a) => a.username === trimmedUser && a.password === password
      );
      if (matched) {
        onLoginSuccess(matched.username, remember);
        return;
      }
      setError('Tên đăng nhập hoặc mật khẩu chưa đúng. (Mặc định: Thảo / 12345679)');
      return;
    }

    // Register mode
    if (password.length < 4) {
      setError('Mật khẩu cần tối thiểu 4 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp.');
      return;
    }
    if (accounts.some((a) => a.username.toLowerCase() === trimmedUser.toLowerCase())) {
      setError('Tên tài khoản này đã tồn tại.');
      return;
    }

    const updated = [...accounts, { username: trimmedUser, password }];
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
    onLoginSuccess(trimmedUser, remember);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-3 sm:p-6">
      <div className="max-w-5xl w-full bg-[#F7F7F5] rounded-[28px] p-2.5 sm:p-3.5 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 items-stretch">
          {/* Left Dark Feature Card */}
          <div className="lg:col-span-5 bg-[#121418] text-white rounded-[22px] p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <MeowMascot mood="happy" size={42} />
                <div>
                  <div className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white">
                    MeowSQL
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Học SQL Cơ bản → Thực chiến Doanh nghiệp
                  </p>
                </div>
              </div>

              {/* Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-slate-300">
                <Sparkles className="w-3 h-3 text-slate-300" />
                Lộ trình học & thực hành SQL thông minh
              </div>

              {/* Hero Copy */}
              <div className="space-y-2.5">
                <h1 className="text-2xl sm:text-[28px] font-display font-extrabold leading-[1.2] tracking-tight text-white">
                  Chinh phục SQL mỗi ngày với lộ trình trực quan.
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed">
                  Lưu tiến độ học tập, mô phỏng trực quan JOIN & Thứ tự thực thi, 20 bài học bài bản và 15 Case thực chiến chạy trực tiếp trên trình duyệt.
                </p>
              </div>

              {/* 3 Feature Rows */}
              <div className="space-y-2.5 pt-1">
                <div className="rounded-2xl bg-[#191C22] border border-white/[0.07] p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">
                      20 Bài Học Lộ Trình Chuẩn
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Từ SELECT, JOIN, CTE đến Window Functions
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#191C22] border border-white/[0.07] p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">
                      15 Case Thực Chiến & SQLite Thật
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Funnel, Churn, Pareto 80/20 & chấm điểm tự động
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#191C22] border border-white/[0.07] p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">
                      Mở khóa linh hoạt & Lưu % tiến độ
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Tự do luyện DataLab SQL, Sơ đồ bảng & Trắc nghiệm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info Box */}
            <div className="rounded-2xl bg-[#171A20] border border-white/[0.07] p-3.5 space-y-1">
              <p className="text-xs font-bold text-white">Học đều mỗi ngày cùng MeowSQL</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tiến độ bài học, Case thực chiến và điểm XP được lưu tự động ngay trên trình duyệt của bạn.
              </p>
            </div>
          </div>

          {/* Right White Auth Card */}
          <div className="lg:col-span-7 bg-white rounded-[22px] p-6 sm:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              {/* Segmented Pill Toggle */}
              <div className="inline-flex items-center bg-[#F3F4F6] p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    mode === 'login'
                      ? 'bg-[#121418] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-[#121418] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tạo tài khoản
                </button>
              </div>

              {/* Heading */}
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                  {mode === 'login'
                    ? 'Chào mừng quay lại MeowSQL!'
                    : 'Tạo tài khoản MeowSQL'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {mode === 'login'
                    ? 'Đăng nhập để tiếp tục chuỗi ngày học, kiểm tra XP và tiến độ thực hành.'
                    : 'Đăng ký nhanh tài khoản cục bộ để lưu lộ trình học SQL của riêng bạn.'}
                </p>
              </div>

              {/* Error / Info Alert */}
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-800">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-medium text-emerald-800">
                  {successMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-username"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Email hoặc tên đăng nhập
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Nhập email hoặc tên đăng nhập"
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F6F7F9] border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Nhập mật khẩu"
                      autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                      }
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F6F7F9] border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="register-confirm"
                      className="block text-xs font-bold text-slate-800"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="register-confirm"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Nhập lại mật khẩu"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F6F7F9] border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setRemember((r) => !r)}
                    className="inline-flex items-center gap-2 text-xs text-slate-700 font-medium select-none"
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        remember
                          ? 'bg-[#121418] text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {remember && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    Ghi nhớ đăng nhập trên trình duyệt này
                  </button>

                  {mode === 'login' && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Mặc định: Thảo / 12345679
                    </span>
                  )}
                </div>

                {/* Submit Pill Button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#121418] hover:bg-black text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99]"
                >
                  <span>
                    {mode === 'login'
                      ? 'Đăng nhập vào học ngay'
                      : 'Tạo tài khoản & bắt đầu học'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <BookOpen className="w-3.5 h-3.5" />
                Dữ liệu học tập được lưu cục bộ an toàn.
              </span>
              <button
                type="button"
                onClick={() => onLoginSuccess('Khách', false)}
                className="font-bold text-slate-900 underline underline-offset-4 hover:text-edu-600 transition-colors"
              >
                Vào học thử không cần tài khoản →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
