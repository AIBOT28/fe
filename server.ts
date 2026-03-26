import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  let books = [
    { id: 1, title: "Đắc Nhân Tâm", author: "Dale Carnegie", price: 85000, category: "Kỹ năng sống", image: "https://picsum.photos/seed/book1/300/400" },
    { id: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", price: 79000, category: "Tiểu thuyết", image: "https://picsum.photos/seed/book2/300/400" },
    { id: 3, title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", author: "Nguyễn Nhật Ánh", price: 95000, category: "Văn học Việt Nam", image: "https://picsum.photos/seed/book3/300/400" },
    { id: 4, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", price: 150000, category: "Lịch sử", image: "https://picsum.photos/seed/book4/300/400" },
    { id: 5, title: "Chiến Binh Cầu Vồng", author: "Andrea Hirata", price: 110000, category: "Tiểu thuyết", image: "https://picsum.photos/seed/book5/300/400" },
    { id: 6, title: "Suối Nguồn", author: "Ayn Rand", price: 185000, category: "Kinh điển", image: "https://picsum.photos/seed/book6/300/400" },
  ];

  let users = [
    { id: 1, email: "admin@bookhaven.com", password: "admin", role: "admin", name: "Quản trị viên" }
  ];

  // API Routes
  app.get("/api/books", (req, res) => {
    res.json(books);
  });

  app.post("/api/books", (req, res) => {
    const newBook = { id: Date.now(), ...req.body };
    books.push(newBook);
    res.status(201).json(newBook);
  });

  app.delete("/api/books/:id", (req, res) => {
    const id = parseInt(req.params.id);
    books = books.filter(b => b.id !== id);
    res.status(204).send();
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    const newUser = { id: Date.now(), email, password, name, role: "user" };
    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
