export const SEED_SQL = `
PRAGMA foreign_keys = ON;

-- 1. Bảng danh mục sản phẩm MeowMart
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

INSERT INTO categories (id, name, description) VALUES
  (1, 'Thức ăn dinh dưỡng', 'Hạt khô, pate và súp thưởng cho mèo mọi lứa tuổi'),
  (2, 'Đồ chơi thông minh', 'Cần câu, bóng tự lăn, trụ cào móng tương tác'),
  (3, 'Phụ kiện & Vệ sinh', 'Nhà cây, khay cát, máy lọc nước tự động'),
  (4, 'Chăm sóc sức khỏe', 'Vitamin, gel tiêu búi lông, sữa tắm dịu nhẹ'),
  (5, 'Khóa học MeowEdu', 'Tài liệu & khóa học huấn luyện, hiểu ngôn ngữ mèo');

-- 2. Bảng sản phẩm
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  rating REAL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO products (id, name, category_id, price, stock, rating) VALUES
  (1, 'Hạt Royal Meow Indoor 2kg', 1, 380000, 45, 4.9),
  (2, 'Pate Cá Ngừ Nhật Bản (Combo 6)', 1, 145000, 120, 4.8),
  (3, 'Súp Thưởng MeowSnack Cá Hồi', 1, 65000, 200, 4.7),
  (4, 'Cần Câu Lông Vũ Chuông Bạc', 2, 55000, 80, 4.5),
  (5, 'Bóng Lăn Tự Động Laser AI', 2, 290000, 18, 4.6),
  (6, 'Trụ Cào Móng Xương Rồng', 2, 320000, 12, 4.8),
  (7, 'Máy Lọc Nước Thác Chảy 2.5L', 3, 490000, 25, 4.9),
  (8, 'Nhà Cây Cat Tree 3 Tầng', 3, 1250000, 6, 5.0),
  (9, 'Cát Đậu Nành Hương Trà Xanh', 3, 115000, 95, 4.6),
  (10, 'Gel Tiêu Búi Lông Malt Soft', 4, 175000, 34, 4.7),
  (11, 'Vitamin Dưỡng Lông Omega-3', 4, 240000, 0, NULL),
  (12, 'Khóa Học Hiểu Tiếng Mèo MeowLang', 5, 599000, 999, 4.9),
  (13, 'Sổ Tay Dinh Dưỡng Hoàng Thượng', 5, 199000, 50, NULL),
  (14, 'Balo Phi Hành Gia Trong Suốt', 3, 420000, 15, 4.4);

-- 3. Bảng khách hàng
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Standard', 'Silver', 'Gold', 'VIP')),
  joined_at TEXT NOT NULL
);

INSERT INTO customers (id, full_name, email, city, tier, joined_at) VALUES
  (1, 'Nguyễn Minh Anh', 'minhanh@meow.vn', 'TP.HCM', 'VIP', '2025-11-10'),
  (2, 'Trần Quốc Bảo', 'quocbao@meow.vn', 'Hà Nội', 'Gold', '2026-01-15'),
  (3, 'Lê Thảo Vy', 'thaovy@meow.vn', 'Đà Nẵng', 'Silver', '2026-02-20'),
  (4, 'Phạm Hoàng Nam', 'hoangnam@meow.vn', 'TP.HCM', 'Gold', '2026-03-05'),
  (5, 'Võ Ngọc Hân', 'ngochan@meow.vn', 'Hà Nội', 'VIP', '2025-12-01'),
  (6, 'Đặng Tuấn Kiệt', 'tuankiet@meow.vn', 'Cần Thơ', 'Standard', '2026-04-12'),
  (7, 'Bùi Khánh Linh', 'khanhlinh@meow.vn', 'TP.HCM', 'Silver', '2026-05-18'),
  (8, 'Hoàng Gia Huy', 'giahuy@meow.vn', 'Hải Phòng', 'Standard', '2026-06-22'),
  (9, 'Đỗ Thanh Trúc', 'thanhtruc@meow.vn', 'Đà Nẵng', 'Gold', '2026-07-03'),
  (10, 'Ngô Đức Thịnh', 'ducthinh@meow.vn', 'Hà Nội', 'Standard', '2026-09-14'),
  (11, 'Phan Bảo Ngọc', 'baongoc@meow.vn', 'TP.HCM', 'Silver', '2026-10-01'),
  (12, 'Lý Hải Đăng', 'haidang@meow.vn', 'Cần Thơ', 'Standard', '2026-11-02');

-- 4. Bảng đơn hàng
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')),
  total_amount INTEGER NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO orders (id, customer_id, order_date, status, total_amount) VALUES
  (101, 1, '2026-08-05', 'completed', 1630000),
  (102, 2, '2026-08-12', 'completed', 525000),
  (103, 3, '2026-08-19', 'completed', 345000),
  (104, 1, '2026-09-02', 'completed', 870000),
  (105, 4, '2026-09-10', 'completed', 665000),
  (106, 5, '2026-09-15', 'completed', 1425000),
  (107, 6, '2026-09-21', 'cancelled', 290000),
  (108, 2, '2026-10-04', 'completed', 780000),
  (109, 7, '2026-10-09', 'completed', 435000),
  (110, 5, '2026-10-14', 'completed', 980000),
  (111, 8, '2026-10-20', 'pending', 320000),
  (112, 9, '2026-10-25', 'completed', 1019000),
  (113, 1, '2026-11-01', 'completed', 599000),
  (114, 4, '2026-11-05', 'completed', 490000),
  (115, 10, '2026-11-08', 'pending', 200000),
  (116, 3, '2026-11-11', 'completed', 635000),
  (117, 2, '2026-11-12', 'completed', 870000),
  (118, 4, '2026-11-13', 'completed', 525000);

-- 5. Bảng chi tiết đơn hàng
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
  (1, 101, 8, 1, 1250000),
  (2, 101, 1, 1, 380000),
  (3, 102, 1, 1, 380000),
  (4, 102, 2, 1, 145000),
  (5, 103, 9, 3, 115000),
  (6, 104, 7, 1, 490000),
  (7, 104, 1, 1, 380000),
  (8, 105, 10, 1, 175000),
  (9, 105, 7, 1, 490000),
  (10, 106, 8, 1, 1250000),
  (11, 106, 10, 1, 175000),
  (12, 107, 5, 1, 290000),
  (13, 108, 14, 1, 420000),
  (14, 108, 1, 1, 360000),
  (15, 109, 2, 3, 145000),
  (16, 110, 7, 2, 490000),
  (17, 111, 6, 1, 320000),
  (18, 112, 12, 1, 599000),
  (19, 112, 14, 1, 420000),
  (20, 113, 12, 1, 599000),
  (21, 114, 7, 1, 490000),
  (22, 115, 3, 2, 65000),
  (23, 115, 4, 1, 70000),
  (24, 116, 6, 1, 320000),
  (25, 116, 2, 1, 145000),
  (26, 116, 4, 3, 56666),
  (27, 117, 1, 1, 380000),
  (28, 117, 7, 1, 490000),
  (29, 118, 1, 1, 380000),
  (30, 118, 2, 1, 145000);

-- 6. Bảng nhân sự MeowCorp (Phục vụ SELF JOIN, GROUP BY & Window Functions)
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  manager_id INTEGER,
  salary INTEGER NOT NULL,
  hire_date TEXT NOT NULL,
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

INSERT INTO employees (id, name, role, department, manager_id, salary, hire_date) VALUES
  (1, 'Trương Minh Tâm', 'CEO', 'Executive', NULL, 55000000, '2023-01-10'),
  (2, 'Lê Phương Linh', 'Head of Data', 'Data', 1, 42000000, '2023-06-15'),
  (3, 'Phạm Quang Huy', 'Head of Engineering', 'Engineering', 1, 45000000, '2023-05-01'),
  (4, 'Nguyễn Hải Yến', 'Senior Data Analyst', 'Data', 2, 30000000, '2024-02-01'),
  (5, 'Vũ Đức Mạnh', 'Data Analyst', 'Data', 2, 22000000, '2024-09-10'),
  (6, 'Trần Thu Hà', 'Data Analyst', 'Data', 2, 22000000, '2025-03-15'),
  (7, 'Đinh Tuấn Anh', 'Senior Backend Dev', 'Engineering', 3, 35000000, '2024-01-20'),
  (8, 'Hoàng Thảo Nhi', 'Frontend Dev', 'Engineering', 3, 26000000, '2024-11-01'),
  (9, 'Ngô Nhật Minh', 'Product Manager', 'Product', 1, 34000000, '2024-04-10'),
  (10, 'Bùi Mai Chi', 'Junior Analyst', 'Data', 4, 16000000, '2026-01-05');

-- 7. Bảng chỉ số tăng trưởng theo ngày (Phục vụ LAG, LEAD, Running Total)
CREATE TABLE daily_metrics (
  metric_date TEXT PRIMARY KEY,
  visitors INTEGER NOT NULL,
  orders_count INTEGER NOT NULL,
  revenue INTEGER NOT NULL
);

INSERT INTO daily_metrics (metric_date, visitors, orders_count, revenue) VALUES
  ('2026-11-01', 1240, 28, 8450000),
  ('2026-11-02', 1380, 31, 9120000),
  ('2026-11-03', 1150, 24, 7300000),
  ('2026-11-04', 1490, 36, 10850000),
  ('2026-11-05', 1620, 42, 12900000),
  ('2026-11-06', 1580, 39, 11600000),
  ('2026-11-07', 1890, 51, 15400000),
  ('2026-11-08', 2100, 58, 17850000),
  ('2026-11-09', 1940, 49, 14900000),
  ('2026-11-10', 2250, 64, 19600000);

-- 8. Bảng hành vi người dùng trên app/web (Phục vụ Product Analytics / Funnel)
CREATE TABLE app_events (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('view_product', 'add_to_cart', 'checkout', 'purchase')),
  event_date TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO app_events (id, customer_id, event_name, event_date) VALUES
  (1, 1, 'view_product', '2026-11-01'),
  (2, 1, 'add_to_cart', '2026-11-01'),
  (3, 1, 'checkout', '2026-11-01'),
  (4, 1, 'purchase', '2026-11-01'),
  (5, 2, 'view_product', '2026-11-02'),
  (6, 2, 'add_to_cart', '2026-11-02'),
  (7, 3, 'view_product', '2026-11-03'),
  (8, 3, 'add_to_cart', '2026-11-03'),
  (9, 3, 'checkout', '2026-11-03'),
  (10, 4, 'view_product', '2026-11-05'),
  (11, 4, 'add_to_cart', '2026-11-05'),
  (12, 4, 'checkout', '2026-11-05'),
  (13, 4, 'purchase', '2026-11-05'),
  (14, 5, 'view_product', '2026-11-06'),
  (15, 6, 'view_product', '2026-11-07'),
  (16, 7, 'view_product', '2026-11-08'),
  (17, 7, 'add_to_cart', '2026-11-08'),
  (18, 8, 'view_product', '2026-11-09'),
  (19, 9, 'view_product', '2026-11-10'),
  (20, 9, 'add_to_cart', '2026-11-10'),
  (21, 9, 'checkout', '2026-11-10'),
  (22, 10, 'view_product', '2026-11-11'),
  (23, 11, 'view_product', '2026-11-12'),
  (24, 12, 'view_product', '2026-11-13');

-- 9. Bảng gói hội viên MeowPlus (Phục vụ SaaS Subscription / MRR / Churn)
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('Basic', 'Pro', 'VIP')),
  monthly_fee INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO subscriptions (id, customer_id, plan, monthly_fee, start_date, status) VALUES
  (1, 1, 'VIP', 299000, '2026-06-01', 'active'),
  (2, 2, 'Pro', 149000, '2026-07-10', 'active'),
  (3, 3, 'Basic', 79000, '2026-08-01', 'cancelled'),
  (4, 4, 'Pro', 149000, '2026-08-15', 'active'),
  (5, 5, 'VIP', 299000, '2026-09-01', 'active'),
  (6, 7, 'Basic', 79000, '2026-09-20', 'active'),
  (7, 8, 'Basic', 79000, '2026-10-05', 'cancelled'),
  (8, 9, 'Pro', 149000, '2026-10-12', 'active');
`;
