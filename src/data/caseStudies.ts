import { CaseStudy } from '../types/sql';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-01',
    order: 1,
    title: 'Giá trị đơn trung bình (AOV) theo hạng khách hàng',
    company: 'MeowMart E-commerce',
    domain: 'E-commerce',
    difficulty: 'Easy',
    skills: ['INNER JOIN', 'GROUP BY', 'ROUND'],
    scenario:
      'Trưởng nhóm CRM muốn biết khách hàng hạng VIP, Gold, Silver hay Standard chi tiêu trung bình mỗi đơn (AOV) cao hơn để thiết kế ưu đãi sinh nhật.',
    challenge: {
      title: 'Tính AOV theo tier khách hàng',
      prompt:
        'Kết hợp `customers` và `orders`, chỉ xét đơn `status = \'completed\'`. Thống kê theo `c.tier`: `so_don`, `tong_doanh_thu` và `aov` (giá trị đơn trung bình làm tròn số nguyên `ROUND(AVG(o.total_amount), 0)`). Sắp xếp theo `aov` giảm dần.',
      requirements: [
        'JOIN customers c với orders o',
        'Lọc o.status = \'completed\'',
        'Cột: tier, so_don, tong_doanh_thu, aov',
        'Sắp xếp aov DESC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  c.tier,\n  COUNT(o.id) AS so_don,\n  SUM(o.total_amount) AS tong_doanh_thu,\n  ROUND(AVG(o.total_amount), 0) AS aov\nFROM customers c\n`,
      solutionSql: `SELECT\n  c.tier,\n  COUNT(o.id) AS so_don,\n  SUM(o.total_amount) AS tong_doanh_thu,\n  ROUND(AVG(o.total_amount), 0) AS aov\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'completed'\nGROUP BY c.tier\nORDER BY aov DESC;`,
      hints: [
        'Nối bảng: INNER JOIN orders o ON c.id = o.customer_id.',
        'Đừng quên GROUP BY c.tier trước ORDER BY aov DESC.',
      ],
      xp: 80,
    },
  },
  {
    id: 'case-02',
    order: 2,
    title: 'Cảnh báo sản phẩm bán chạy nhưng tồn kho thấp',
    company: 'MeowMart Supply Chain',
    domain: 'E-commerce',
    difficulty: 'Easy',
    skills: ['INNER JOIN', 'GROUP BY', 'HAVING'],
    scenario:
      'Bộ phận kho cần danh sách các sản phẩm đã bán được tổng số lượng từ 2 chiếc trở lên nhưng tồn kho hiện tại (`stock`) đang dưới 30 để nhập hàng gấp.',
    challenge: {
      title: 'Truy tìm sản phẩm sắp cháy hàng',
      prompt:
        'Từ `products p` và `order_items oi`, tìm các sản phẩm có `p.stock < 30` và tổng số lượng đã bán (`SUM(oi.quantity)`) >= 2. Trả về `p.id`, `p.name`, `p.stock`, `da_ban`, sắp xếp theo `p.stock` tăng dần.',
      requirements: [
        'Lọc tồn kho p.stock < 30',
        'Gom nhóm theo sản phẩm và lọc HAVING SUM(oi.quantity) >= 2',
        'Sắp xếp p.stock ASC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  p.id,\n  p.name,\n  p.stock,\n  SUM(oi.quantity) AS da_ban\nFROM products p\nINNER JOIN order_items oi ON p.id = oi.product_id\n`,
      solutionSql: `SELECT\n  p.id,\n  p.name,\n  p.stock,\n  SUM(oi.quantity) AS da_ban\nFROM products p\nINNER JOIN order_items oi ON p.id = oi.product_id\nWHERE p.stock < 30\nGROUP BY p.id, p.name, p.stock\nHAVING SUM(oi.quantity) >= 2\nORDER BY p.stock ASC;`,
      hints: [
        'Đặt WHERE p.stock < 30 trước GROUP BY, và HAVING SUM(oi.quantity) >= 2 sau GROUP BY.',
      ],
      xp: 90,
    },
  },
  {
    id: 'case-03',
    order: 3,
    title: 'Tỷ lệ hủy đơn & hoàn thành theo thành phố',
    company: 'MeowMart Operations',
    domain: 'E-commerce',
    difficulty: 'Medium',
    skills: ['JOIN', 'CASE WHEN', 'Conditional Aggregation'],
    scenario:
      'Team Vận hành muốn đánh giá chất lượng giao nhận ở từng thành phố bằng cách đếm số đơn thành công vs đơn chưa hoàn thành (`pending`/`cancelled`).',
    challenge: {
      title: 'Pivot trạng thái đơn hàng theo thành phố',
      prompt:
        'Nối `customers c` và `orders o` để tính cho mỗi `c.city`: `tong_don` (`COUNT(*)`), `don_thanh_cong` (`SUM(CASE WHEN o.status = \'completed\' THEN 1 ELSE 0 END)`), và `ty_le_thanh_cong` (`ROUND(SUM(CASE WHEN o.status = \'completed\' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)`). Sắp xếp theo `tong_don` DESC, `c.city` ASC.',
      requirements: [
        'Dùng Conditional Aggregation với SUM(CASE WHEN ...)',
        'Nhân 100.0 để chia ra số thực phần trăm',
        'Sắp xếp tong_don DESC, c.city ASC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  c.city,\n  COUNT(*) AS tong_don,\n  SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) AS don_thanh_cong,\n  \nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nGROUP BY c.city\nORDER BY tong_don DESC, c.city ASC;`,
      solutionSql: `SELECT\n  c.city,\n  COUNT(*) AS tong_don,\n  SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) AS don_thanh_cong,\n  ROUND(SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS ty_le_thanh_cong\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nGROUP BY c.city\nORDER BY tong_don DESC, c.city ASC;`,
      hints: [
        'Cột thứ 4 là ROUND(SUM(CASE WHEN o.status = \'completed\' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS ty_le_thanh_cong.',
      ],
      xp: 110,
    },
  },
  {
    id: 'case-04',
    order: 4,
    title: 'Phân tích Giỏ hàng: Cặp sản phẩm hay mua kèm (Cross-sell)',
    company: 'Shopee / MeowMart Growth',
    domain: 'E-commerce',
    difficulty: 'Interview',
    skills: ['SELF JOIN', 'GROUP BY', 'Market Basket'],
    scenario:
      'Tính năng "Khách mua sản phẩm A thường mua kèm sản phẩm B" dựa trên việc tìm các cặp sản phẩm xuất hiện trong CÙNG MỘT ĐƠN HÀNG (`order_id`).',
    challenge: {
      title: 'Tìm các cặp sản phẩm xuất hiện chung đơn hàng',
      prompt:
        'Tự nối `order_items a` với `order_items b` sao cho `a.order_id = b.order_id` VÀ `a.product_id < b.product_id` (để tránh tự ghép với chính nó và tránh trùng cặp A-B / B-A). Nối thêm `products p1`, `products p2` để lấy `sp_1` (`p1.name`), `sp_2` (`p2.name`), và `so_lan_mua_cung` (`COUNT(*)`). Chỉ lấy cặp mua cùng >= 2 lần, sắp xếp `so_lan_mua_cung` DESC, `sp_1` ASC.',
      requirements: [
        'Dùng SELF JOIN trên order_items với a.order_id = b.order_id AND a.product_id < b.product_id',
        'HAVING COUNT(*) >= 2',
        'Trả về sp_1, sp_2, so_lan_mua_cung',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  p1.name AS sp_1,\n  p2.name AS sp_2,\n  COUNT(*) AS so_lan_mua_cung\nFROM order_items a\nINNER JOIN order_items b\n  ON a.order_id = b.order_id AND a.product_id < b.product_id\n`,
      solutionSql: `SELECT\n  p1.name AS sp_1,\n  p2.name AS sp_2,\n  COUNT(*) AS so_lan_mua_cung\nFROM order_items a\nINNER JOIN order_items b\n  ON a.order_id = b.order_id AND a.product_id < b.product_id\nINNER JOIN products p1 ON a.product_id = p1.id\nINNER JOIN products p2 ON b.product_id = p2.id\nGROUP BY p1.id, p1.name, p2.id, p2.name\nHAVING COUNT(*) >= 2\nORDER BY so_lan_mua_cung DESC, sp_1 ASC;`,
      hints: [
        'Nối tiếp INNER JOIN products p1 ON a.product_id = p1.id và INNER JOIN products p2 ON b.product_id = p2.id.',
        'Gom nhóm theo cả p1.id, p1.name, p2.id, p2.name.',
      ],
      xp: 160,
    },
  },
  {
    id: 'case-05',
    order: 5,
    title: 'Top 2 sản phẩm doanh thu cao nhất MỖI danh mục',
    company: 'MeowMart Merchandising',
    domain: 'E-commerce',
    difficulty: 'Hard',
    skills: ['CTE', 'JOIN', 'DENSE_RANK'],
    scenario:
      'Giám đốc ngành hàng cần chọn ra tối đa 2 sản phẩm mang lại nhiều doanh thu nhất trong từng danh mục để đưa lên banner trang chủ.',
    challenge: {
      title: 'Top 2 sản phẩm theo danh mục',
      prompt:
        'Bước 1 (CTE): Tính doanh thu mỗi sản phẩm (`SUM(oi.quantity * oi.unit_price)`) kèm tên danh mục (`c.name AS danh_muc`) và tên sản phẩm (`p.name AS san_pham`).\nBước 2: Dùng `DENSE_RANK() OVER (PARTITION BY danh_muc ORDER BY doanh_thu DESC) AS hang` rồi lọc `hang <= 2`. Sắp xếp `danh_muc` ASC, `hang` ASC, `san_pham` ASC.',
      requirements: [
        'Dùng 2 CTE (tính doanh thu rồi xếp hạng)',
        'Dùng DENSE_RANK() OVER (PARTITION BY danh_muc ORDER BY doanh_thu DESC)',
        'Trả về: danh_muc, san_pham, doanh_thu, hang',
      ],
      requireOrder: true,
      starterSql: `WITH product_rev AS (\n  SELECT\n    c.name AS danh_muc,\n    p.name AS san_pham,\n    SUM(oi.quantity * oi.unit_price) AS doanh_thu\n  FROM order_items oi\n  INNER JOIN products p ON oi.product_id = p.id\n  INNER JOIN categories c ON p.category_id = c.id\n  GROUP BY c.name, p.name\n),\nranked AS (\n  SELECT\n    *,\n    DENSE_RANK() OVER (PARTITION BY danh_muc ORDER BY doanh_thu DESC) AS hang\n  FROM product_rev\n)\n`,
      solutionSql: `WITH product_rev AS (\n  SELECT\n    c.name AS danh_muc,\n    p.name AS san_pham,\n    SUM(oi.quantity * oi.unit_price) AS doanh_thu\n  FROM order_items oi\n  INNER JOIN products p ON oi.product_id = p.id\n  INNER JOIN categories c ON p.category_id = c.id\n  GROUP BY c.name, p.name\n),\nranked AS (\n  SELECT\n    *,\n    DENSE_RANK() OVER (PARTITION BY danh_muc ORDER BY doanh_thu DESC) AS hang\n  FROM product_rev\n)\nSELECT danh_muc, san_pham, doanh_thu, hang\nFROM ranked\nWHERE hang <= 2\nORDER BY danh_muc ASC, hang ASC, san_pham ASC;`,
      hints: [
        'Chỉ cần hoàn thiện câu SELECT cuối cùng: SELECT danh_muc, san_pham, doanh_thu, hang FROM ranked WHERE hang <= 2 ORDER BY danh_muc ASC, hang ASC, san_pham ASC;',
      ],
      xp: 150,
    },
  },
  {
    id: 'case-06',
    order: 6,
    title: 'Phân tích Pareto 80/20: Doanh thu tích lũy sản phẩm',
    company: 'MeowMart Strategy',
    domain: 'E-commerce',
    difficulty: 'Hard',
    skills: ['CTE', 'Window Running Sum', 'Percentage'],
    scenario:
      'Áp dụng quy luật Pareto 80/20 để xem những sản phẩm chủ lực nào đang đóng góp 80% doanh thu tích lũy cho cửa hàng.',
    challenge: {
      title: 'Tính tỷ lệ đóng góp tích lũy (Cumulative %)',
      prompt:
        'Tính doanh thu từng sản phẩm (`SUM(oi.quantity * oi.unit_price) AS doanh_thu`), sau đó dùng Window Function tính `pct_tich_luy` = `ROUND(SUM(doanh_thu) OVER (ORDER BY doanh_thu DESC, ten_sp ASC) * 100.0 / SUM(doanh_thu) OVER (), 1)`. Trả về `ten_sp`, `doanh_thu`, `pct_tich_luy`, sắp xếp `doanh_thu` DESC, `ten_sp` ASC.',
      requirements: [
        'Tính doanh thu mỗi sản phẩm có bán',
        'Dùng SUM(doanh_thu) OVER (ORDER BY doanh_thu DESC, ten_sp ASC)',
        'Chia cho tổng toàn bộ bằng SUM(doanh_thu) OVER ()',
      ],
      requireOrder: true,
      starterSql: `WITH sp_rev AS (\n  SELECT\n    p.name AS ten_sp,\n    SUM(oi.quantity * oi.unit_price) AS doanh_thu\n  FROM order_items oi\n  INNER JOIN products p ON oi.product_id = p.id\n  GROUP BY p.id, p.name\n)\nSELECT\n  ten_sp,\n  doanh_thu,\n  \nFROM sp_rev\nORDER BY doanh_thu DESC, ten_sp ASC;`,
      solutionSql: `WITH sp_rev AS (\n  SELECT\n    p.name AS ten_sp,\n    SUM(oi.quantity * oi.unit_price) AS doanh_thu\n  FROM order_items oi\n  INNER JOIN products p ON oi.product_id = p.id\n  GROUP BY p.id, p.name\n)\nSELECT\n  ten_sp,\n  doanh_thu,\n  ROUND(SUM(doanh_thu) OVER (ORDER BY doanh_thu DESC, ten_sp ASC) * 100.0 / SUM(doanh_thu) OVER (), 1) AS pct_tich_luy\nFROM sp_rev\nORDER BY doanh_thu DESC, ten_sp ASC;`,
      hints: [
        'Dùng thêm , ten_sp ASC trong OVER (ORDER BY doanh_thu DESC, ten_sp ASC) để đảm bảo cộng dồn ổn định khi 2 sản phẩm bằng doanh thu.',
      ],
      xp: 160,
    },
  },
  {
    id: 'case-07',
    order: 7,
    title: 'Khách hàng "Ngủ đông" (Dormant Customers > 30 ngày)',
    company: 'MeowMart Retention',
    domain: 'E-commerce',
    difficulty: 'Medium',
    skills: ['JOIN', 'MAX', 'Date Calculation'],
    scenario:
      'Marketing muốn gửi mã giảm giá "Nhớ bạn quá Meow ơi" cho những khách hàng đã từng mua hàng hoàn thành nhưng đã lâu chưa quay lại (lần mua gần nhất trước ngày `2026-10-15`).',
    challenge: {
      title: 'Tìm khách hàng có đơn completed gần nhất trước 2026-10-15',
      prompt:
        'Từ `customers c` và `orders o` (chỉ tính `o.status = \'completed\'`), tìm các khách hàng có ngày đặt hàng gần nhất (`MAX(o.order_date)`) nhỏ hơn `\'2026-10-15\'`. Trả về `c.id`, `c.full_name`, `c.email`, `lan_mua_cuoi`, sắp xếp theo `lan_mua_cuoi` ASC.',
      requirements: [
        'Lọc o.status = \'completed\' trước khi gom nhóm',
        'Dùng HAVING MAX(o.order_date) < \'2026-10-15\'',
        'Sắp xếp lan_mua_cuoi ASC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  c.id,\n  c.full_name,\n  c.email,\n  MAX(o.order_date) AS lan_mua_cuoi\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\n`,
      solutionSql: `SELECT\n  c.id,\n  c.full_name,\n  c.email,\n  MAX(o.order_date) AS lan_mua_cuoi\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'completed'\nGROUP BY c.id, c.full_name, c.email\nHAVING MAX(o.order_date) < '2026-10-15'\nORDER BY lan_mua_cuoi ASC;`,
      hints: [
        'Chú ý không dùng WHERE o.order_date < \'2026-10-15\' vì làm vậy sẽ bỏ sót đơn mới và chọn nhầm khách vừa mua hôm qua! Phải lọc MAX(o.order_date) trong HAVING.',
      ],
      xp: 120,
    },
  },
  {
    id: 'case-08',
    order: 8,
    title: 'Phân tích Phễu chuyển đổi (Conversion Funnel)',
    company: 'MeowApp Product Team',
    domain: 'Product Analytics',
    difficulty: 'Medium',
    skills: ['COUNT DISTINCT', 'CASE WHEN', 'Product Funnel'],
    scenario:
      'Product Manager muốn xem phễu hành vi người dùng trên app từ bảng `app_events`: có bao nhiêu người dùng duy nhất đã `view_product` → `add_to_cart` → `checkout` → `purchase`.',
    challenge: {
      title: 'Đo lường 4 bước phễu người dùng',
      prompt:
        'Từ bảng `app_events`, đếm số `customer_id` duy nhất (`COUNT(DISTINCT customer_id)`) ở mỗi `event_name` đặt tên là `so_nguoi_dung`. Hiển thị 2 cột `event_name` và `so_nguoi_dung`, sắp xếp theo `so_nguoi_dung` giảm dần.',
      requirements: [
        'Truy vấn từ bảng app_events',
        'GROUP BY event_name',
        'Đếm COUNT(DISTINCT customer_id) AS so_nguoi_dung',
        'Sắp xếp so_nguoi_dung DESC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  event_name,\n  COUNT(DISTINCT customer_id) AS so_nguoi_dung\nFROM app_events\n`,
      solutionSql: `SELECT\n  event_name,\n  COUNT(DISTINCT customer_id) AS so_nguoi_dung\nFROM app_events\nGROUP BY event_name\nORDER BY so_nguoi_dung DESC;`,
      hints: [
        'Chỉ cần thêm GROUP BY event_name ORDER BY so_nguoi_dung DESC;',
      ],
      xp: 90,
    },
  },
  {
    id: 'case-09',
    order: 9,
    title: 'Tỷ lệ chuyển đổi (CVR %) & Giá trị giỏ hàng theo ngày',
    company: 'MeowApp Growth',
    domain: 'Product Analytics',
    difficulty: 'Easy',
    skills: ['Arithmetic', 'ROUND', 'ORDER BY'],
    scenario:
      'Team Ads cần kiểm tra ngày nào website chuyển đổi khách truy cập thành đơn hàng tốt nhất (`orders_count / visitors`) để tối ưu ngân sách quảng cáo.',
    challenge: {
      title: 'Tìm ngày có Conversion Rate cao nhất',
      prompt:
        'Từ bảng `daily_metrics`, hãy tính `cvr_pct` = `ROUND(orders_count * 100.0 / visitors, 2)` và `rev_per_order` = `ROUND(revenue * 1.0 / orders_count, 0)`. Trả về `metric_date`, `visitors`, `orders_count`, `cvr_pct`, `rev_per_order`, sắp xếp theo `cvr_pct` giảm dần.',
      requirements: [
        'Tính cvr_pct làm tròn 2 chữ số thập phân',
        'Tính rev_per_order làm tròn 0 chữ số thập phân',
        'Sắp xếp cvr_pct DESC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  metric_date,\n  visitors,\n  orders_count,\n  \nFROM daily_metrics\nORDER BY cvr_pct DESC;`,
      solutionSql: `SELECT\n  metric_date,\n  visitors,\n  orders_count,\n  ROUND(orders_count * 100.0 / visitors, 2) AS cvr_pct,\n  ROUND(revenue * 1.0 / orders_count, 0) AS rev_per_order\nFROM daily_metrics\nORDER BY cvr_pct DESC;`,
      hints: [
        'Luôn nhân với 100.0 hoặc 1.0 trước khi chia để tránh phép chia số nguyên bị mất phần thập phân!',
      ],
      xp: 90,
    },
  },
  {
    id: 'case-10',
    order: 10,
    title: 'Tính MRR & Tỷ lệ hủy gói hội viên (Churn Rate)',
    company: 'MeowPlus SaaS',
    domain: 'Product Analytics',
    difficulty: 'Medium',
    skills: ['Conditional Aggregation', 'SaaS Metrics'],
    scenario:
      'Bảng `subscriptions` lưu thông tin gói hội viên trả phí hàng tháng. CFO muốn biết doanh thu định kỳ đang hoạt động (Active MRR) và tỷ lệ hủy theo từng gói `Basic`, `Pro`, `VIP`.',
    challenge: {
      title: 'Báo cáo SaaS MRR & Churn theo Plan',
      prompt:
        'Từ bảng `subscriptions`, gom nhóm theo `plan`, tính:\n- `tong_dang_ky`: tổng số subscription\n- `dang_hoat_dong`: số gói có `status = \'active\'`\n- `active_mrr`: tổng `monthly_fee` của các gói `status = \'active\'`\n- `churn_rate_pct`: tỷ lệ phần trăm gói `cancelled` làm tròn 1 chữ số (`ROUND(SUM(CASE WHEN status = \'cancelled\' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)`)\nSắp xếp theo `active_mrr` giảm dần.',
      requirements: [
        'Truy vấn từ bảng subscriptions',
        'Dùng CASE WHEN cho dang_hoat_dong, active_mrr, churn_rate_pct',
        'Sắp xếp active_mrr DESC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  plan,\n  COUNT(*) AS tong_dang_ky,\n  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS dang_hoat_dong,\n  SUM(CASE WHEN status = 'active' THEN monthly_fee ELSE 0 END) AS active_mrr,\n  \nFROM subscriptions\nGROUP BY plan\nORDER BY active_mrr DESC;`,
      solutionSql: `SELECT\n  plan,\n  COUNT(*) AS tong_dang_ky,\n  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS dang_hoat_dong,\n  SUM(CASE WHEN status = 'active' THEN monthly_fee ELSE 0 END) AS active_mrr,\n  ROUND(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS churn_rate_pct\nFROM subscriptions\nGROUP BY plan\nORDER BY active_mrr DESC;`,
      hints: [
        'Cột cuối viết ROUND(SUM(CASE WHEN status = \'cancelled\' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS churn_rate_pct.',
      ],
      xp: 120,
    },
  },
  {
    id: 'case-11',
    order: 11,
    title: 'Tăng trưởng doanh thu theo tháng (MoM Growth %)',
    company: 'MeowMart Finance',
    domain: 'Product Analytics',
    difficulty: 'Hard',
    skills: ['CTE', 'LAG', 'strftime', 'MoM %'],
    scenario:
      'Ban giám đốc cần báo cáo tốc độ tăng trưởng doanh thu tháng sau so với tháng trước (Month-over-Month Growth %) từ các đơn `completed`.',
    challenge: {
      title: 'Tính MoM Growth % theo tháng',
      prompt:
        'Dùng CTE tính `doanh_thu` theo `thang` (`strftime(\'%Y-%m\', order_date)`) cho các đơn `status = \'completed\'`. Sau đó dùng `LAG(doanh_thu, 1) OVER (ORDER BY thang)` để tính `thang_truoc` và `mom_growth_pct` = `ROUND((doanh_thu - LAG(doanh_thu, 1) OVER (ORDER BY thang)) * 100.0 / LAG(doanh_thu, 1) OVER (ORDER BY thang), 1)`. Sắp xếp `thang` ASC.',
      requirements: [
        'Dùng CTE gom nhóm theo tháng',
        'Dùng LAG() tính thang_truoc và mom_growth_pct',
        'Sắp xếp thang ASC',
      ],
      requireOrder: true,
      starterSql: `WITH monthly AS (\n  SELECT\n    strftime('%Y-%m', order_date) AS thang,\n    SUM(total_amount) AS doanh_thu\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY strftime('%Y-%m', order_date)\n)\nSELECT\n  thang,\n  doanh_thu,\n  LAG(doanh_thu, 1) OVER (ORDER BY thang) AS thang_truoc,\n  \nFROM monthly\nORDER BY thang ASC;`,
      solutionSql: `WITH monthly AS (\n  SELECT\n    strftime('%Y-%m', order_date) AS thang,\n    SUM(total_amount) AS doanh_thu\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY strftime('%Y-%m', order_date)\n)\nSELECT\n  thang,\n  doanh_thu,\n  LAG(doanh_thu, 1) OVER (ORDER BY thang) AS thang_truoc,\n  ROUND((doanh_thu - LAG(doanh_thu, 1) OVER (ORDER BY thang)) * 100.0 / LAG(doanh_thu, 1) OVER (ORDER BY thang), 1) AS mom_growth_pct\nFROM monthly\nORDER BY thang ASC;`,
      hints: [
        'Công thức MoM %: (Tháng này - Tháng trước) * 100.0 / Tháng trước.',
      ],
      xp: 150,
    },
  },
  {
    id: 'case-12',
    order: 12,
    title: 'Khoảng cách lương so với người cao nhất phòng ban',
    company: 'MeowCorp HR',
    domain: 'HR & Ops',
    difficulty: 'Medium',
    skills: ['Window Function', 'MAX OVER', 'PARTITION BY'],
    scenario:
      'Phòng Nhân sự (HR) muốn rà soát công bằng thu nhập bằng cách so sánh lương của từng nhân viên với mức lương cao nhất trong cùng phòng ban.',
    challenge: {
      title: 'Tính chênh lệch với mức lương trần phòng ban',
      prompt:
        'Từ bảng `employees`, lấy `name`, `department`, `salary`, `luong_cao_nhat_phong` (`MAX(salary) OVER (PARTITION BY department)`), và `chenh_lech` (`MAX(salary) OVER (PARTITION BY department) - salary`). Sắp xếp theo `department` ASC, `salary` DESC.',
      requirements: [
        'Dùng MAX(salary) OVER (PARTITION BY department)',
        'Giữ nguyên tất cả 10 nhân viên',
        'Sắp xếp department ASC, salary DESC',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  name,\n  department,\n  salary,\n  \nFROM employees\nORDER BY department ASC, salary DESC;`,
      solutionSql: `SELECT\n  name,\n  department,\n  salary,\n  MAX(salary) OVER (PARTITION BY department) AS luong_cao_nhat_phong,\n  MAX(salary) OVER (PARTITION BY department) - salary AS chenh_lech\nFROM employees\nORDER BY department ASC, salary DESC;`,
      hints: [
        'Viết MAX(salary) OVER (PARTITION BY department) cho cả 2 cột mới.',
      ],
      xp: 110,
    },
  },
  {
    id: 'case-13',
    order: 13,
    title: 'Câu phỏng vấn kinh điển: Nhân viên lương cao hơn trung bình phòng ban',
    company: 'Tech Interview Prep',
    domain: 'HR & Ops',
    difficulty: 'Interview',
    skills: ['CTE', 'AVG OVER', 'Subquery'],
    scenario:
      'Một câu hỏi phỏng vấn SQL rất phổ biến ở các công ty công nghệ: tìm những nhân sự có lương vượt trội hơn mức trung bình của chính phòng ban họ đang làm.',
    challenge: {
      title: 'Lọc nhân viên lương > trung bình phòng ban',
      prompt:
        'Dùng CTE tính `avg_dept` (`ROUND(AVG(salary) OVER (PARTITION BY department), 0)`) cho từng nhân viên, sau đó lọc ở bên ngoài để chỉ giữ nhân viên có `salary > avg_dept`. Trả về `name`, `department`, `salary`, `avg_dept`, sắp xếp theo `salary` DESC.',
      requirements: [
        'Tính lương trung bình theo department',
        'Lọc salary > avg_dept',
        'Sắp xếp salary DESC',
      ],
      requireOrder: true,
      starterSql: `WITH dept_avg AS (\n  SELECT\n    name,\n    department,\n    salary,\n    ROUND(AVG(salary) OVER (PARTITION BY department), 0) AS avg_dept\n  FROM employees\n)\n`,
      solutionSql: `WITH dept_avg AS (\n  SELECT\n    name,\n    department,\n    salary,\n    ROUND(AVG(salary) OVER (PARTITION BY department), 0) AS avg_dept\n  FROM employees\n)\nSELECT name, department, salary, avg_dept\nFROM dept_avg\nWHERE salary > avg_dept\nORDER BY salary DESC;`,
      hints: [
        'Ở bên ngoài CTE chỉ cần: SELECT name, department, salary, avg_dept FROM dept_avg WHERE salary > avg_dept ORDER BY salary DESC;',
      ],
      xp: 130,
    },
  },
  {
    id: 'case-14',
    order: 14,
    title: 'Kiểm toán dữ liệu (Data Audit): Phát hiện đơn lệch tiền!',
    company: 'MeowMart Data Engineering',
    domain: 'Data Audit',
    difficulty: 'Hard',
    skills: ['JOIN', 'GROUP BY', 'HAVING', 'Data Quality'],
    scenario:
      'Khi đồng bộ dữ liệu từ hệ thống thanh toán, đôi khi `orders.total_amount` bị lệch so với tổng tiền thực tế `SUM(quantity * unit_price)` trong `order_items`. Hãy viết câu SQL kiểm toán để tìm ra các đơn bị lệch!',
    challenge: {
      title: 'Đối soát orders vs order_items',
      prompt:
        'Nối `orders o` với `order_items oi`, tính `tong_chi_tiet` = `SUM(oi.quantity * oi.unit_price)` và `chenh_lech` = `o.total_amount - SUM(oi.quantity * oi.unit_price)`. Dùng `HAVING` để chỉ lọc ra các đơn hàng có `o.total_amount != SUM(oi.quantity * oi.unit_price)`. Trả về `o.id AS order_id`, `o.total_amount`, `tong_chi_tiet`, `chenh_lech`, sắp xếp `o.id` ASC.',
      requirements: [
        'JOIN orders o và order_items oi qua o.id = oi.order_id',
        'GROUP BY o.id, o.total_amount',
        'HAVING o.total_amount != SUM(oi.quantity * oi.unit_price)',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  o.id AS order_id,\n  o.total_amount,\n  SUM(oi.quantity * oi.unit_price) AS tong_chi_tiet,\n  o.total_amount - SUM(oi.quantity * oi.unit_price) AS chenh_lech\nFROM orders o\nINNER JOIN order_items oi ON o.id = oi.order_id\n`,
      solutionSql: `SELECT\n  o.id AS order_id,\n  o.total_amount,\n  SUM(oi.quantity * oi.unit_price) AS tong_chi_tiet,\n  o.total_amount - SUM(oi.quantity * oi.unit_price) AS chenh_lech\nFROM orders o\nINNER JOIN order_items oi ON o.id = oi.order_id\nGROUP BY o.id, o.total_amount\nHAVING o.total_amount != SUM(oi.quantity * oi.unit_price)\nORDER BY o.id ASC;`,
      hints: [
        'Thử chạy xem có đơn hàng nào bị làm tròn lẻ 2đ ở order_items không nhé!',
      ],
      xp: 140,
    },
  },
  {
    id: 'case-15',
    order: 15,
    title: 'Độ phủ toàn diện: Khách hàng mua ĐỦ cả Đồ ăn lẫn Phụ kiện?',
    company: 'Shopee / Grab Interview',
    domain: 'Data Audit',
    difficulty: 'Interview',
    skills: ['Multi-JOIN', 'COUNT DISTINCT', 'HAVING'],
    scenario:
      'Một câu hỏi lọc tập hợp kinh điển trong phỏng vấn: tìm những khách hàng đã từng mua sản phẩm thuộc CẢ 2 danh mục `Thức ăn dinh dưỡng` (id=1) VÀ `Phụ kiện & Vệ sinh` (id=3).',
    challenge: {
      title: 'Khách hàng đa danh mục (Cross-Category Buyers)',
      prompt:
        'Kết nối `customers c` → `orders o` → `order_items oi` → `products p`. Lọc các sản phẩm thuộc `p.category_id IN (1, 3)` (trên đơn `o.status = \'completed\'`), gom nhóm theo khách hàng và dùng `HAVING COUNT(DISTINCT p.category_id) = 2` để đảm bảo khách đã mua ĐỦ cả 2 danh mục! Trả về `c.id`, `c.full_name`, `c.city`, sắp xếp `c.id` ASC.',
      requirements: [
        'JOIN 4 bảng: customers, orders, order_items, products',
        'Lọc o.status = \'completed\' AND p.category_id IN (1, 3)',
        'Dùng HAVING COUNT(DISTINCT p.category_id) = 2',
      ],
      requireOrder: true,
      starterSql: `SELECT\n  c.id,\n  c.full_name,\n  c.city\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nINNER JOIN order_items oi ON o.id = oi.order_id\nINNER JOIN products p ON oi.product_id = p.id\n`,
      solutionSql: `SELECT\n  c.id,\n  c.full_name,\n  c.city\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nINNER JOIN order_items oi ON o.id = oi.order_id\nINNER JOIN products p ON oi.product_id = p.id\nWHERE o.status = 'completed'\n  AND p.category_id IN (1, 3)\nGROUP BY c.id, c.full_name, c.city\nHAVING COUNT(DISTINCT p.category_id) = 2\nORDER BY c.id ASC;`,
      hints: [
        'Bí quyết của dạng bài "mua đủ cả A và B": lọc IN (A, B) ở WHERE, rồi dùng HAVING COUNT(DISTINCT col) = 2!',
      ],
      xp: 170,
    },
  },
];
