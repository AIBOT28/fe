import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, BookOpen, Plus, Trash2, LayoutDashboard, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jwtDecode } from "jwt-decode";
import { cn, formatPrice } from "./lib/utils";

// --- Types ---
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  image: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "Admin" | "User";
  token?: string;
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: UserData | null; onLogout: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">BookHaven</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">Trang chủ</Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium flex items-center gap-1 hover:text-accent transition-colors">
                <LayoutDashboard size={16} /> Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold uppercase">
                    {user.name[0]}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-full transition-colors">Đăng nhập</Link>
                <Link to="/register" className="text-sm font-medium px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors shadow-sm">Đăng ký</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md">Trang chủ</Link>
              {user?.role === "admin" && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md">Admin Dashboard</Link>
              )}
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500">Đang đăng nhập: {user.name}</div>
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Đăng xuất</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center py-2 text-sm font-medium border border-gray-200 rounded-md">Đăng nhập</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-center py-2 text-sm font-medium bg-primary text-white rounded-md">Đăng ký</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold mb-4"
        >
          Khám phá thế giới qua từng trang sách
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-lg max-w-2xl mx-auto"
        >
          Tìm kiếm những cuốn sách hay nhất, từ kinh điển đến hiện đại, tất cả đều có tại BookHaven.
        </motion.p>
        
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-accent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book, index) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                    {book.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-accent transition-colors">{book.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{book.author}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-xl">{formatPrice(book.price)}</span>
                  <button className="p-3 bg-gray-100 hover:bg-primary hover:text-white rounded-2xl transition-all">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && filteredBooks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg italic">Không tìm thấy cuốn sách nào phù hợp...</p>
        </div>
      )}
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (data: UserData) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("https://localhost:7079/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const responseData = await res.json();
      
      if (res.ok && responseData.success) {
        const token = responseData.data.token;
        const decodedToken: any = jwtDecode(token);
        
        onLogin({
          id: decodedToken.nameid || decodedToken.sub || "",
          email: decodedToken.email || "",
          name: decodedToken.given_name || decodedToken.name || username,
          role: decodedToken.role || "user",
          token: token
        });
        navigate("/");
      } else {
        setError(responseData.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-2">Chào mừng trở lại</h2>
          <p className="text-gray-500">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Tên đăng nhập (Username)</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </motion.div>
    </div>
  );
};

const RegisterPage = ({ onLogin }: { onLogin: (data: UserData) => void }) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("https://localhost:7079/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          fullName, 
          passwordHash: password 
        }),
      });
      
      const responseData = await res.json();
      
      if (res.ok && responseData.success) {
        // Nếu API register trả về token luôn
        if (responseData.data && responseData.data.token) {
          const token = responseData.data.token;
          const decodedToken: any = jwtDecode(token);
          
          onLogin({
            id: decodedToken.nameid || decodedToken.sub || "",
            email: decodedToken.email || email,
            name: decodedToken.given_name || decodedToken.name || fullName,
            role: decodedToken.role || "user",
            token: token
          });
          navigate("/");
        } else {
          // Nếu chỉ trả về success, chuyển hướng đến trang đăng nhập
          navigate("/login");
        }
      } else {
        setError(responseData.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-2">Tạo tài khoản</h2>
          <p className="text-gray-500">Bắt đầu hành trình đọc sách của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Tên đăng nhập (Username)</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Họ và tên (Full Name)</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập</Link>
        </p>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", price: 0, category: "", image: "" });

  const fetchBooks = () => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => setBooks(data));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newBook, image: newBook.image || `https://picsum.photos/seed/${Date.now()}/300/400` }),
    });
    if (res.ok) {
      fetchBooks();
      setShowAddModal(false);
      setNewBook({ title: "", author: "", price: 0, category: "", image: "" });
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Quản lý kho sách</h1>
          <p className="text-gray-500">Thêm, sửa hoặc xóa sách trong hệ thống</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-md"
        >
          <Plus size={20} /> Thêm sách mới
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Sách</th>
              <th className="px-6 py-4">Tác giả</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Thể loại</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {books.map(book => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded-md" referrerPolicy="no-referrer" />
                    <span className="font-bold text-sm">{book.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{book.author}</td>
                <td className="px-6 py-4 text-sm font-bold">{formatPrice(book.price)}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 rounded-md">{book.category}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDeleteBook(book.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8"
            >
              <h2 className="text-2xl font-display font-bold mb-6">Thêm sách mới</h2>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Tên sách</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
                      value={newBook.title}
                      onChange={e => setNewBook({...newBook, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Tác giả</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
                      value={newBook.author}
                      onChange={e => setNewBook({...newBook, author: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Giá (VND)</label>
                    <input 
                      type="number" required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
                      value={newBook.price}
                      onChange={e => setNewBook({...newBook, price: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Thể loại</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
                      value={newBook.category}
                      onChange={e => setNewBook({...newBook, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">URL Ảnh (Tùy chọn)</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="https://..."
                      value={newBook.image}
                      onChange={e => setNewBook({...newBook, image: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 text-sm font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-xl hover:bg-opacity-90 transition-all"
                  >
                    Lưu sách
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />
            <Route 
              path="/admin" 
              element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="flex items-center gap-2 mb-6">
                  <div className="bg-primary text-white p-1.5 rounded-lg">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-display text-xl font-bold tracking-tight">BookHaven</span>
                </Link>
                <p className="text-gray-500 max-w-sm">
                  BookHaven là nơi kết nối những tâm hồn yêu sách. Chúng tôi cung cấp những tác phẩm chất lượng nhất với trải nghiệm mua sắm tuyệt vời.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6">Liên kết</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li><Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
                  <li><Link to="/login" className="hover:text-primary transition-colors">Đăng nhập</Link></li>
                  <li><Link to="/register" className="hover:text-primary transition-colors">Đăng ký</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6">Liên hệ</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li>Email: contact@bookhaven.com</li>
                  <li>Hotline: 1900 1234</li>
                  <li>Địa chỉ: 123 Đường Sách, TP. Hồ Chí Minh</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
              © 2026 BookHaven. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
