import { Module } from '../types/sql';

export const CURRICULUM: Module[] = [
  {
    id: 'module-1',
    order: 1,
    title: 'Chương 1: Nhập môn & Truy vấn cơ bản',
    description:
      'Làm quen với cơ sở dữ liệu quan hệ, đọc dữ liệu từ bảng, lọc điều kiện và sắp xếp kết quả.',
    icon: '🐾',
    color: 'amber',
    lessons: [
      {
        id: 'c1-select',
        moduleId: 'module-1',
        order: 1,
        title: 'Bảng dữ liệu & SELECT ... FROM',
        subtitle: 'Hiểu cấu trúc hàng/cột và lấy đúng dữ liệu bạn cần',
        durationMinutes: 5,
        difficulty: 'Cơ bản',
        tags: ['SELECT', 'FROM', 'AS'],
        theory: [
          {
            type: 'text',
            title: 'Cơ sở dữ liệu quan hệ là gì?',
            content:
              'Hãy tưởng tượng mỗi bảng (Table) trong SQL giống như một trang tính Excel gọn gàng: mỗi hàng (Row) là một bản ghi (ví dụ: 1 sản phẩm), mỗi cột (Column) là một thuộc tính (tên, giá, tồn kho). SQL là ngôn ngữ giúp bạn "hỏi chuyện" với các bảng đó.',
          },
          {
            type: 'syntax',
            title: 'Cú pháp nền tảng',
            code: `SELECT cot_1, cot_2 AS bi_danh\nFROM ten_bang;`,
            caption: 'Dùng SELECT * để lấy toàn bộ cột, hoặc liệt kê tên cột để tối ưu tốc độ.',
          },
          {
            type: 'example',
            title: 'Ví dụ: Xem tên và giá bán sản phẩm',
            description: 'Dùng AS để đặt tên cột tiếng Việt dễ đọc hơn khi xuất báo cáo.',
            sql: `SELECT\n  name AS ten_san_pham,\n  price AS gia_ban\nFROM products;`,
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Mẹo từ Mèo Query',
            content:
              'Trong thực tế đi làm, hạn chế dùng SELECT * trên bảng hàng triệu dòng. Hãy luôn chỉ định rõ các cột bạn thực sự cần!',
          },
        ],
        challenge: {
          title: 'Lấy danh sách danh mục MeowMart',
          prompt:
            'Hãy viết câu lệnh truy vấn từ bảng `products` để lấy 3 cột: `name` (đặt alias là `ten_san_pham`), `price` (alias `gia_ban`) và `stock` (alias `ton_kho`).',
          requirements: [
            'Truy vấn từ bảng products',
            'Chọn đúng 3 cột theo thứ tự: ten_san_pham, gia_ban, ton_kho',
          ],
          starterSql: `-- Viết câu lệnh SQL của bạn bên dưới\nSELECT \nFROM products;`,
          solutionSql: `SELECT\n  name AS ten_san_pham,\n  price AS gia_ban,\n  stock AS ton_kho\nFROM products;`,
          hints: [
            'Sử dụng từ khóa AS sau tên cột gốc để đổi tên cột kết quả.',
            'Cấu trúc: SELECT name AS ten_san_pham, price AS gia_ban, stock AS ton_kho FROM products;',
          ],
          xp: 50,
        },
      },
      {
        id: 'c1-where',
        moduleId: 'module-1',
        order: 2,
        title: 'Lọc dữ liệu với WHERE & Logic',
        subtitle: 'Giữ lại các dòng thỏa mãn điều kiện bằng =, >, <, AND, OR, NOT',
        durationMinutes: 7,
        difficulty: 'Cơ bản',
        tags: ['WHERE', 'AND', 'OR', '!= '],
        theory: [
          {
            type: 'text',
            title: 'Mệnh đề WHERE hoạt động thế nào?',
            content:
              'WHERE đóng vai trò như một "cổng kiểm soát": SQL duyệt qua từng dòng trong bảng FROM, dòng nào làm cho điều kiện sau WHERE trả về TRUE thì được giữ lại.',
          },
          {
            type: 'syntax',
            title: 'Các toán tử so sánh & logic',
            code: `SELECT *\nFROM ten_bang\nWHERE dieu_kien_1 AND (dieu_kien_2 OR dieu_kien_3);`,
            caption:
              'Toán tử: =, != (hoặc <>), >, >=, <, <=. Chuỗi văn bản luôn bọc trong nháy đơn \'...\'.',
          },
          {
            type: 'example',
            title: 'Ví dụ: Sản phẩm giá từ 300.000đ trở lên và còn hàng',
            sql: `SELECT name, price, stock\nFROM products\nWHERE price >= 300000 AND stock > 0;`,
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Bẫy ưu tiên phép toán AND vs OR',
            content:
              'AND luôn được ưu tiên chạy trước OR! Nếu bạn kết hợp cả AND và OR trong cùng một mệnh đề WHERE, hãy LUÔN bọc điều kiện OR trong dấu ngoặc đơn (...).',
          },
        ],
        challenge: {
          title: 'Tìm khách hàng VIP hoặc Gold tại TP.HCM',
          prompt:
            'Từ bảng `customers`, hãy lấy `id`, `full_name`, `city`, `tier` của những khách hàng sống ở `TP.HCM` VÀ có hạng (`tier`) là `VIP` hoặc `Gold`.',
          requirements: [
            'Lọc chính xác city = \'TP.HCM\'',
            'Hạng tier là \'VIP\' hoặc \'Gold\' (nhớ dùng ngoặc đơn!)',
            'Chọn đúng 4 cột: id, full_name, city, tier',
          ],
          starterSql: `SELECT id, full_name, city, tier\nFROM customers\nWHERE `,
          solutionSql: `SELECT id, full_name, city, tier\nFROM customers\nWHERE city = 'TP.HCM'\n  AND (tier = 'VIP' OR tier = 'Gold');`,
          hints: [
            'Nhớ dùng dấu ngoặc đơn quanh (tier = \'VIP\' OR tier = \'Gold\').',
            'Chuỗi \'TP.HCM\' phải viết chính xác cả dấu chấm và chữ hoa.',
          ],
          xp: 60,
        },
      },
      {
        id: 'c1-advanced-filter',
        moduleId: 'module-1',
        order: 3,
        title: 'Lọc nâng cao: IN, BETWEEN, LIKE, IS NULL',
        subtitle: 'Viết điều kiện lọc gọn gàng, tìm kiếm mẫu chuỗi và xử lý giá trị rỗng',
        durationMinutes: 8,
        difficulty: 'Cơ bản',
        tags: ['IN', 'BETWEEN', 'LIKE', 'IS NULL'],
        theory: [
          {
            type: 'text',
            title: '4 trợ thủ lọc dữ liệu siêu tiện lợi',
            content:
              'Thay vì viết nhiều phép OR lặp đi lặp lại hay loay hoay với giá trị bị thiếu (NULL), SQL cung cấp bộ tứ IN, BETWEEN, LIKE và IS NULL.',
          },
          {
            type: 'comparison',
            title: 'Tổng hợp nhanh 4 toán tử',
            leftTitle: 'Tập hợp & Khoảng giá trị',
            leftItems: [
              'IN (\'Hà Nội\', \'Đà Nẵng\') — khớp với 1 trong các giá trị',
              'BETWEEN 100000 AND 300000 — nằm trong khoảng (bao gồm 2 đầu mút)',
            ],
            rightTitle: 'Tìm chuỗi & Giá trị NULL',
            rightItems: [
              'LIKE \'%Cá%\' — dấu % đại diện cho 0 hoặc nhiều ký tự bất kỳ',
              'IS NULL / IS NOT NULL — kiểm tra ô bị trống (tuyệt đối KHÔNG dùng = NULL)',
            ],
          },
          {
            type: 'example',
            title: 'Ví dụ: Sản phẩm chưa có đánh giá (rating IS NULL)',
            sql: `SELECT name, price, rating\nFROM products\nWHERE rating IS NULL;`,
          },
          {
            type: 'callout',
            variant: 'interview',
            title: 'Câu hỏi phỏng vấn kinh điển',
            content:
              'Tại sao WHERE rating = NULL không trả về dòng nào? Vì trong SQL, NULL nghĩa là "chưa biết", nên bất kỳ phép so sánh = hay != với NULL đều cho kết quả UNKNOWN (không phải TRUE). Phải dùng IS NULL!',
          },
        ],
        challenge: {
          title: 'Tìm sản phẩm mức giá tầm trung có đánh giá',
          prompt:
            'Từ bảng `products`, hãy lấy `name`, `price`, `rating` của các sản phẩm có giá từ `150000` đến `500000` (tính cả 2 đầu), thuộc danh mục `category_id` là `1`, `2` hoặc `3`, VÀ đã có đánh giá (`rating` không bị NULL).',
          requirements: [
            'Dùng BETWEEN 150000 AND 500000 cho price',
            'Dùng IN (1, 2, 3) cho category_id',
            'Dùng rating IS NOT NULL',
          ],
          starterSql: `SELECT name, price, rating\nFROM products\nWHERE `,
          solutionSql: `SELECT name, price, rating\nFROM products\nWHERE price BETWEEN 150000 AND 500000\n  AND category_id IN (1, 2, 3)\n  AND rating IS NOT NULL;`,
          hints: [
            'Kết hợp 3 điều kiện bằng từ khóa AND.',
            'Kiểm tra giá trị tồn tại dùng: rating IS NOT NULL.',
          ],
          xp: 70,
        },
      },
      {
        id: 'c1-order-limit',
        moduleId: 'module-1',
        order: 4,
        title: 'Sắp xếp & Giới hạn: ORDER BY, DISTINCT, LIMIT',
        subtitle: 'Xếp hạng Top N, loại bỏ giá trị trùng lặp và phân trang kết quả',
        durationMinutes: 6,
        difficulty: 'Cơ bản',
        tags: ['ORDER BY', 'DISTINCT', 'LIMIT', 'OFFSET'],
        theory: [
          {
            type: 'text',
            title: 'Sắp xếp và lấy Top kết quả',
            content:
              'Mặc định bảng không đảm bảo thứ tự hiển thị cố định. Dùng ORDER BY để sắp xếp tăng dần (ASC - mặc định) hoặc giảm dần (DESC), kết hợp LIMIT để lấy Top N dòng đầu tiên.',
          },
          {
            type: 'syntax',
            title: 'Cú pháp sắp xếp & loại trùng',
            code: `SELECT DISTINCT city\nFROM customers\nORDER BY city ASC\nLIMIT 5 OFFSET 0;`,
            caption: 'DISTINCT loại bỏ các giá trị giống hệt nhau. OFFSET dùng để bỏ qua N dòng đầu (phân trang).',
          },
          {
            type: 'example',
            title: 'Ví dụ: Top 3 sản phẩm đắt nhất MeowMart',
            sql: `SELECT name, price\nFROM products\nORDER BY price DESC\nLIMIT 3;`,
          },
        ],
        challenge: {
          title: 'Top 5 sản phẩm giá tốt nhất còn hàng',
          prompt:
            'Lấy `name`, `price`, `stock` của **5 sản phẩm** còn hàng (`stock > 0`) có giá **từ cao xuống thấp**. Nếu giá bằng nhau thì xếp theo `name` từ A-Z.',
          requirements: [
            'Lọc stock > 0',
            'Sắp xếp theo price DESC, sau đó name ASC',
            'Giới hạn đúng 5 dòng bằng LIMIT 5',
          ],
          requireOrder: true,
          starterSql: `SELECT name, price, stock\nFROM products\n`,
          solutionSql: `SELECT name, price, stock\nFROM products\nWHERE stock > 0\nORDER BY price DESC, name ASC\nLIMIT 5;`,
          hints: [
            'Thứ tự mệnh đề: SELECT -> FROM -> WHERE -> ORDER BY -> LIMIT.',
            'Sắp xếp nhiều cột: ORDER BY price DESC, name ASC.',
          ],
          xp: 70,
        },
      },
    ],
  },
  {
    id: 'module-2',
    order: 2,
    title: 'Chương 2: Hàm tổng hợp & Gom nhóm',
    description:
      'Tóm tắt dữ liệu thành các chỉ số kinh doanh: đếm đơn, tính tổng doanh thu, gom nhóm và phân loại động.',
    icon: '📊',
    color: 'blue',
    lessons: [
      {
        id: 'c2-aggregates',
        moduleId: 'module-2',
        order: 5,
        title: 'Hàm tổng hợp: COUNT, SUM, AVG, MIN, MAX',
        subtitle: 'Biến hàng trăm dòng dữ liệu thô thành các con số KPI sắc nét',
        durationMinutes: 6,
        difficulty: 'Cơ bản',
        tags: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'],
        theory: [
          {
            type: 'text',
            title: '5 hàm tổng hợp cốt lõi của Data Analyst',
            content:
              'Hàm tổng hợp (Aggregate Functions) nhận vào nhiều dòng và gộp thành 1 giá trị duy nhất. Điểm quan trọng cần nhớ: COUNT(*) đếm tất cả các dòng (kể cả NULL), trong khi COUNT(ten_cot), SUM, AVG, MIN, MAX sẽ tự động bỏ qua giá trị NULL.',
          },
          {
            type: 'syntax',
            title: 'Cú pháp tính KPI nhanh',
            code: `SELECT\n  COUNT(*) AS tong_dong,\n  COUNT(DISTINCT customer_id) AS so_khach_mua,\n  SUM(total_amount) AS tong_doanh_thu,\n  ROUND(AVG(total_amount), 0) AS gia_tri_tb\nFROM orders\nWHERE status = 'completed';`,
          },
          {
            type: 'example',
            title: 'Ví dụ: Thống kê đơn hàng đã hoàn thành',
            sql: `SELECT\n  COUNT(*) AS so_don,\n  SUM(total_amount) AS doanh_thu,\n  MIN(total_amount) AS don_nho_nhat,\n  MAX(total_amount) AS don_lon_nhat\nFROM orders\nWHERE status = 'completed';`,
          },
        ],
        challenge: {
          title: 'Báo cáo nhanh doanh thu hoàn thành',
          prompt:
            'Từ bảng `orders`, chỉ xét các đơn có `status = \'completed\'`, hãy tính:\n- `so_don_hang`: tổng số đơn hàng\n- `so_khach_hang`: số lượng `customer_id` **khác nhau** đã mua\n- `tong_doanh_thu`: tổng `total_amount`',
          requirements: [
            'Lọc status = \'completed\'',
            'Đếm khách hàng không trùng bằng COUNT(DISTINCT customer_id)',
            'Đặt đúng alias: so_don_hang, so_khach_hang, tong_doanh_thu',
          ],
          starterSql: `SELECT\n  \nFROM orders\nWHERE status = 'completed';`,
          solutionSql: `SELECT\n  COUNT(*) AS so_don_hang,\n  COUNT(DISTINCT customer_id) AS so_khach_hang,\n  SUM(total_amount) AS tong_doanh_thu\nFROM orders\nWHERE status = 'completed';`,
          hints: [
            'Dùng COUNT(*) AS so_don_hang.',
            'Dùng COUNT(DISTINCT customer_id) AS so_khach_hang.',
          ],
          xp: 80,
        },
      },
      {
        id: 'c2-group-by',
        moduleId: 'module-2',
        order: 6,
        title: 'Gom nhóm dữ liệu với GROUP BY',
        subtitle: 'Tính toán tổng hợp cho từng phòng ban, từng thành phố, từng danh mục',
        durationMinutes: 8,
        difficulty: 'Cơ bản',
        tags: ['GROUP BY', 'COUNT', 'AVG'],
        theory: [
          {
            type: 'text',
            title: 'GROUP BY hoạt động ra sao?',
            content:
              'Thay vì gộp cả bảng thành 1 dòng duy nhất, GROUP BY chia bảng thành các "xô" (nhóm) dựa trên giá trị giống nhau của một hoặc nhiều cột, sau đó áp dụng hàm tổng hợp cho từng "xô" đó.',
          },
          {
            type: 'visualizer',
            kind: 'group-by',
            title: 'Mô phỏng trực quan: GROUP BY gom dòng như thế nào?',
            description:
              'Nhấn nút để xem các dòng nhân viên được tô màu gom thành từng phòng ban rồi tính lương trung bình.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Quy tắc vàng của GROUP BY',
            content:
              'Mọi cột xuất hiện trong SELECT mà KHÔNG nằm trong hàm tổng hợp (COUNT, SUM, AVG...) thì BẮT BUỘC phải có mặt trong mệnh đề GROUP BY!',
          },
          {
            type: 'example',
            title: 'Ví dụ: Số nhân viên và quỹ lương theo từng phòng ban',
            sql: `SELECT\n  department,\n  COUNT(*) AS so_nhan_su,\n  SUM(salary) AS tong_quy_luong,\n  ROUND(AVG(salary), 0) AS luong_tb\nFROM employees\nGROUP BY department\nORDER BY tong_quy_luong DESC;`,
          },
        ],
        challenge: {
          title: 'Phân bổ khách hàng theo thành phố',
          prompt:
            'Từ bảng `customers`, hãy thống kê số lượng khách hàng tại mỗi thành phố (`city`). Trả về 2 cột: `city` và `so_khach`, sắp xếp theo `so_khach` giảm dần, nếu bằng nhau thì xếp `city` tăng dần.',
          requirements: [
            'Gom nhóm theo city',
            'Đếm số khách đặt tên cột là so_khach',
            'Sắp xếp ORDER BY so_khach DESC, city ASC',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  city,\n  \nFROM customers\n`,
          solutionSql: `SELECT\n  city,\n  COUNT(*) AS so_khach\nFROM customers\nGROUP BY city\nORDER BY so_khach DESC, city ASC;`,
          hints: [
            'Dùng COUNT(*) AS so_khach và GROUP BY city.',
            'Thêm ORDER BY so_khach DESC, city ASC ở cuối.',
          ],
          xp: 80,
        },
      },
      {
        id: 'c2-having',
        moduleId: 'module-2',
        order: 7,
        title: 'Lọc nhóm với HAVING & Thứ tự thực thi SQL',
        subtitle: 'Hiểu sâu sự khác biệt giữa WHERE và HAVING cùng bản đồ thực thi SQL',
        durationMinutes: 9,
        difficulty: 'Trung bình',
        tags: ['HAVING', 'WHERE', 'Execution Order'],
        theory: [
          {
            type: 'text',
            title: 'Tại sao cần HAVING khi đã có WHERE?',
            content:
              'WHERE lọc từng dòng TRƯỚC khi gom nhóm, nên WHERE không thể biết tổng hay trung bình của nhóm là bao nhiêu. HAVING lọc các nhóm SAU KHI GROUP BY đã tính xong!',
          },
          {
            type: 'visualizer',
            kind: 'execution-order',
            title: 'Mô phỏng trực quan: Thứ tự thực thi thật sự của SQL',
            description:
              'Bạn viết SELECT đầu tiên, nhưng máy tính lại chạy FROM đầu tiên! Bấm từng bước để xem dữ liệu biến đổi qua 7 giai đoạn.',
          },
          {
            type: 'comparison',
            title: 'So sánh WHERE vs HAVING',
            leftTitle: 'WHERE',
            leftItems: [
              'Chạy TRƯỚC GROUP BY',
              'Lọc từng dòng dữ liệu gốc',
              'KHÔNG được dùng COUNT, SUM, AVG...',
            ],
            rightTitle: 'HAVING',
            rightItems: [
              'Chạy SAU GROUP BY',
              'Lọc từng nhóm đã tổng hợp',
              'DÙNG ĐƯỢC COUNT, SUM, AVG...',
            ],
          },
          {
            type: 'example',
            title: 'Ví dụ: Những phòng ban có từ 2 nhân sự trở lên',
            sql: `SELECT department, COUNT(*) AS so_nhan_su\nFROM employees\nGROUP BY department\nHAVING COUNT(*) >= 2;`,
          },
        ],
        challenge: {
          title: 'Tìm khách hàng mua nhiều lần',
          prompt:
            'Từ bảng `orders`, xét các đơn `status = \'completed\'`, hãy tìm những `customer_id` có **từ 2 đơn hoàn thành trở lên**. Trả về `customer_id`, `so_don` (số đơn) và `tong_chi_tieu` (tổng `total_amount`), sắp xếp theo `tong_chi_tieu` giảm dần.',
          requirements: [
            'Dùng WHERE lọc status = \'completed\' trước khi gom nhóm',
            'GROUP BY customer_id',
            'Dùng HAVING COUNT(*) >= 2',
            'Sắp xếp theo tong_chi_tieu DESC',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  customer_id,\n  COUNT(*) AS so_don,\n  SUM(total_amount) AS tong_chi_tieu\nFROM orders\n`,
          solutionSql: `SELECT\n  customer_id,\n  COUNT(*) AS so_don,\n  SUM(total_amount) AS tong_chi_tieu\nFROM orders\nWHERE status = 'completed'\nGROUP BY customer_id\nHAVING COUNT(*) >= 2\nORDER BY tong_chi_tieu DESC;`,
          hints: [
            'WHERE status = \'completed\' đặt ngay sau FROM orders.',
            'HAVING COUNT(*) >= 2 đặt ngay sau GROUP BY customer_id.',
          ],
          xp: 90,
        },
      },
      {
        id: 'c2-case-when',
        moduleId: 'module-2',
        order: 8,
        title: 'Phân loại dữ liệu động với CASE WHEN',
        subtitle: 'Tương đương câu lệnh IF / ELSE trong lập trình ngay bên trong SQL',
        durationMinutes: 8,
        difficulty: 'Trung bình',
        tags: ['CASE WHEN', 'Segmentation'],
        theory: [
          {
            type: 'text',
            title: 'Phân khúc dữ liệu (Data Segmentation)',
            content:
              'CASE WHEN cho phép bạn tạo ra cột phân loại mới dựa trên các điều kiện logic — cực kỳ hữu ích khi làm báo cáo phân khúc khách hàng, phân tầng giá sản phẩm hay tạo bảng chéo (Pivot).',
          },
          {
            type: 'syntax',
            title: 'Cú pháp CASE WHEN chuẩn',
            code: `CASE\n  WHEN dieu_kien_1 THEN ket_qua_1\n  WHEN dieu_kien_2 THEN ket_qua_2\n  ELSE ket_qua_mac_dinh\nEND AS ten_cot_moi`,
          },
          {
            type: 'example',
            title: 'Ví dụ: Phân khúc giá sản phẩm',
            sql: `SELECT\n  name,\n  price,\n  CASE\n    WHEN price >= 500000 THEN 'Cao cấp'\n    WHEN price >= 200000 THEN 'Trung cấp'\n    ELSE 'Phổ thông'\n  END AS phan_khuc\nFROM products\nORDER BY price DESC;`,
          },
        ],
        challenge: {
          title: 'Phân loại giá trị đơn hàng',
          prompt:
            'Từ bảng `orders` (lấy tất cả đơn), hãy hiển thị `id`, `total_amount`, và cột `nhom_don` theo quy tắc:\n- `total_amount >= 1000000` → `\'Đơn lớn\'`\n- `total_amount >= 500000` → `\'Đơn vừa\'`\n- Còn lại → `\'Đơn nhỏ\'`\nSắp xếp theo `id` tăng dần.',
          requirements: [
            'Chọn đúng 3 cột: id, total_amount, nhom_don',
            'Dùng CASE WHEN ... END AS nhom_don',
            'Sắp xếp ORDER BY id ASC',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  id,\n  total_amount,\n  CASE\n    \n  END AS nhom_don\nFROM orders\nORDER BY id ASC;`,
          solutionSql: `SELECT\n  id,\n  total_amount,\n  CASE\n    WHEN total_amount >= 1000000 THEN 'Đơn lớn'\n    WHEN total_amount >= 500000 THEN 'Đơn vừa'\n    ELSE 'Đơn nhỏ'\n  END AS nhom_don\nFROM orders\nORDER BY id ASC;`,
          hints: [
            'Nhớ kiểm tra điều kiện >= 1000000 trước, rồi mới tới >= 500000.',
            'Đừng quên từ khóa END trước AS nhom_don.',
          ],
          xp: 90,
        },
      },
    ],
  },
  {
    id: 'module-3',
    order: 3,
    title: 'Chương 3: Kết nối nhiều bảng (JOIN & UNION)',
    description:
      'Làm chủ kỹ năng quan trọng nhất của SQL: nối các bảng liên kết qua Khóa chính (PK) và Khóa ngoại (FK).',
    icon: '🔗',
    color: 'emerald',
    lessons: [
      {
        id: 'c3-inner-join',
        moduleId: 'module-3',
        order: 9,
        title: 'Khóa chính, Khóa ngoại & INNER JOIN',
        subtitle: 'Ghép thông tin từ 2 bảng có liên kết chặt chẽ với nhau',
        durationMinutes: 9,
        difficulty: 'Trung bình',
        tags: ['INNER JOIN', 'PK', 'FK', 'ON'],
        theory: [
          {
            type: 'text',
            title: 'Tại sao phải tách thành nhiều bảng?',
            content:
              'Trong CSDL chuẩn hóa, bảng `products` chỉ lưu `category_id` (Khóa ngoại - FK) trỏ tới `id` (Khóa chính - PK) của bảng `categories` để tránh lặp lại tên danh mục hàng nghìn lần. Khi cần hiển thị cả tên sản phẩm lẫn tên danh mục, ta dùng JOIN!',
          },
          {
            type: 'visualizer',
            kind: 'join-diagram',
            title: 'Mô phỏng trực quan: Cơ chế hoạt động của các loại JOIN',
            description:
              'Chuyển qua lại giữa INNER JOIN và LEFT JOIN để quan sát cách từng dòng giữa bảng customers và orders bắt cặp với nhau!',
          },
          {
            type: 'example',
            title: 'Ví dụ: Lấy tên sản phẩm kèm tên danh mục',
            sql: `SELECT\n  p.name AS ten_san_pham,\n  c.name AS ten_danh_muc,\n  p.price\nFROM products p\nINNER JOIN categories c\n  ON p.category_id = c.id;`,
          },
        ],
        challenge: {
          title: 'Doanh thu theo từng danh mục sản phẩm',
          prompt:
            'Kết hợp bảng `order_items` (alias `oi`), `products` (alias `p`) và `categories` (alias `c`) để tính tổng doanh thu (`SUM(oi.quantity * oi.unit_price)`) theo từng danh mục. Trả về `ten_danh_muc` (`c.name`) và `doanh_thu`, sắp xếp theo `doanh_thu` giảm dần.',
          requirements: [
            'JOIN order_items với products qua oi.product_id = p.id',
            'JOIN tiếp với categories qua p.category_id = c.id',
            'Gom nhóm theo c.id, c.name và sắp xếp doanh_thu DESC',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  c.name AS ten_danh_muc,\n  SUM(oi.quantity * oi.unit_price) AS doanh_thu\nFROM order_items oi\n`,
          solutionSql: `SELECT\n  c.name AS ten_danh_muc,\n  SUM(oi.quantity * oi.unit_price) AS doanh_thu\nFROM order_items oi\nINNER JOIN products p ON oi.product_id = p.id\nINNER JOIN categories c ON p.category_id = c.id\nGROUP BY c.id, c.name\nORDER BY doanh_thu DESC;`,
          hints: [
            'Viết nối tiếp hai INNER JOIN liên hoàn: FROM order_items oi INNER JOIN products p ON ... INNER JOIN categories c ON ...',
            'GROUP BY c.id, c.name để đảm bảo gom đúng từng danh mục.',
          ],
          xp: 110,
        },
      },
      {
        id: 'c3-left-join',
        moduleId: 'module-3',
        order: 10,
        title: 'LEFT JOIN & Tìm bản ghi chưa từng phát sinh',
        subtitle: 'Giữ lại toàn bộ bảng bên trái, kể cả những đối tượng chưa có dữ liệu khớp',
        durationMinutes: 9,
        difficulty: 'Trung bình',
        tags: ['LEFT JOIN', 'IS NULL', 'Anti-Join'],
        theory: [
          {
            type: 'text',
            title: 'Khi INNER JOIN bỏ sót dữ liệu...',
            content:
              'Nếu một khách hàng mới đăng ký nhưng CHƯA mua đơn nào, INNER JOIN sẽ loại bỏ họ khỏi kết quả! LEFT JOIN giữ lại TOÀN BỘ dòng ở bảng bên trái (bảng đứng sau FROM), và điền NULL vào các cột của bảng bên phải nếu không tìm thấy bản ghi khớp.',
          },
          {
            type: 'syntax',
            title: 'Mẫu tìm dữ liệu "chưa từng..." (Anti-Join Pattern)',
            code: `SELECT c.*\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;`,
            caption: 'Đây là mẫu câu hỏi phỏng vấn SQL xuất hiện nhiều nhất ở các công ty công nghệ!',
          },
          {
            type: 'example',
            title: 'Ví dụ: Đếm số đơn của TẤT CẢ khách hàng (kể cả 0 đơn)',
            sql: `SELECT\n  c.full_name,\n  COUNT(o.id) AS so_don\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.full_name\nORDER BY so_don ASC;`,
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Cẩn thận COUNT(*) vs COUNT(o.id) trong LEFT JOIN!',
            content:
              'Khi dùng LEFT JOIN, khách hàng chưa mua hàng vẫn có 1 dòng (với o.id là NULL). Nếu viết COUNT(*) sẽ ra 1 thay vì 0! Phải viết COUNT(o.id) để đếm đúng số đơn thực tế (vì COUNT(cot) bỏ qua NULL).',
          },
        ],
        challenge: {
          title: 'Truy tìm khách hàng chưa từng đặt hàng & Sản phẩm chưa ai mua',
          prompt:
            'Hãy tìm những khách hàng trong bảng `customers` **chưa từng có bất kỳ đơn hàng nào** trong bảng `orders`. Trả về `id`, `full_name`, `city`, `joined_at`, sắp xếp theo `id` tăng dần.',
          requirements: [
            'Dùng LEFT JOIN từ customers sang orders',
            'Lọc các dòng có o.id IS NULL',
            'Chọn đúng 4 cột: id, full_name, city, joined_at',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  c.id,\n  c.full_name,\n  c.city,\n  c.joined_at\nFROM customers c\n`,
          solutionSql: `SELECT\n  c.id,\n  c.full_name,\n  c.city,\n  c.joined_at\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL\nORDER BY c.id ASC;`,
          hints: [
            'LEFT JOIN orders o ON c.id = o.customer_id',
            'Thêm điều kiện WHERE o.id IS NULL để chỉ giữ những khách hàng không có đơn khớp.',
          ],
          xp: 110,
        },
      },
      {
        id: 'c3-self-multi-join',
        moduleId: 'module-3',
        order: 11,
        title: 'SELF JOIN: Tự nối một bảng với chính nó',
        subtitle: 'Xử lý dữ liệu phân cấp (Nhân viên - Quản lý, Danh mục cha - con)',
        durationMinutes: 8,
        difficulty: 'Trung bình',
        tags: ['SELF JOIN', 'Hierarchy'],
        theory: [
          {
            type: 'text',
            title: 'SELF JOIN là gì?',
            content:
              'Trong bảng `employees`, mỗi nhân viên có cột `manager_id` trỏ tới `id` của sếp trực tiếp — mà sếp cũng là một nhân viên nằm trong chính bảng `employees`! Ta nối bảng `employees` với chính nó bằng cách đặt 2 alias khác nhau: `e` (nhân viên) và `m` (manager).',
          },
          {
            type: 'example',
            title: 'Ví dụ: Hiển thị tên nhân viên và tên quản lý trực tiếp',
            sql: `SELECT\n  e.name AS nhan_vien,\n  e.role AS chuc_vu,\n  COALESCE(m.name, 'Không có (Cấp cao nhất)') AS quan_ly\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;`,
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Hàm COALESCE(a, b)',
            content:
              'COALESCE trả về giá trị đầu tiên KHÔNG PHẢI NULL trong danh sách tham số. Rất hay dùng để thay thế chữ NULL bằng giá trị mặc định dễ hiểu như 0 hoặc "Chưa có".',
          },
        ],
        challenge: {
          title: 'Danh sách nhân sự báo cáo cho Lê Phương Linh',
          prompt:
            'Dùng SELF JOIN trên bảng `employees` để liệt kê tất cả nhân viên báo cáo trực tiếp cho quản lý tên `Lê Phương Linh`. Trả về `nhan_vien` (`e.name`), `chuc_vu` (`e.role`), `luong` (`e.salary`), sắp xếp theo `e.salary` giảm dần.',
          requirements: [
            'Tự nối employees e với employees m qua e.manager_id = m.id',
            'Lọc m.name = \'Lê Phương Linh\'',
            'Sắp xếp theo luong DESC',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  e.name AS nhan_vien,\n  e.role AS chuc_vu,\n  e.salary AS luong\nFROM employees e\n`,
          solutionSql: `SELECT\n  e.name AS nhan_vien,\n  e.role AS chuc_vu,\n  e.salary AS luong\nFROM employees e\nINNER JOIN employees m ON e.manager_id = m.id\nWHERE m.name = 'Lê Phương Linh'\nORDER BY e.salary DESC;`,
          hints: [
            'INNER JOIN employees m ON e.manager_id = m.id',
            'Lọc tên quản lý: WHERE m.name = \'Lê Phương Linh\'',
          ],
          xp: 100,
        },
      },
      {
        id: 'c3-union',
        moduleId: 'module-3',
        order: 12,
        title: 'Gộp tập kết quả: UNION & UNION ALL',
        subtitle: 'Nối kết quả của nhiều câu SELECT theo chiều dọc',
        durationMinutes: 6,
        difficulty: 'Trung bình',
        tags: ['UNION', 'UNION ALL'],
        theory: [
          {
            type: 'text',
            title: 'JOIN nối ngang, UNION nối dọc!',
            content:
              'Nếu JOIN ghép thêm CỘT từ các bảng khác nhau, thì UNION xếp chồng các DÒNG từ hai hay nhiều câu SELECT có cùng số lượng cột và kiểu dữ liệu tương thích.',
          },
          {
            type: 'comparison',
            title: 'UNION vs UNION ALL',
            leftTitle: 'UNION',
            leftItems: [
              'Tự động loại bỏ các dòng trùng lặp',
              'Chậm hơn một chút vì phải sắp xếp & khử trùng',
            ],
            rightTitle: 'UNION ALL',
            rightItems: [
              'Giữ lại TẤT CẢ các dòng (kể cả trùng)',
              'Nhanh hơn nhiều — nên ưu tiên dùng khi biết chắc không trùng',
            ],
          },
          {
            type: 'example',
            title: 'Ví dụ: Danh bạ tổng hợp Khách hàng VIP và Nhân viên phòng Data',
            sql: `SELECT full_name AS ho_ten, 'Khách VIP' AS vai_tro\nFROM customers WHERE tier = 'VIP'\nUNION ALL\nSELECT name AS ho_ten, 'Nhân sự Data' AS vai_tro\nFROM employees WHERE department = 'Data';`,
          },
        ],
        challenge: {
          title: 'Danh sách cảnh báo cần xử lý',
          prompt:
            'Gộp 2 danh sách sau thành 1 bảng có 2 cột `loai_canh_bao` và `ten_doi_tuong`:\n1. Các sản phẩm hết hàng (`stock = 0`) từ bảng `products` với `loai_canh_bao = \'Hết hàng\'` và `ten_doi_tuong = name`\n2. Các đơn hàng đang chờ (`status = \'pending\'`) từ bảng `orders` với `loai_canh_bao = \'Đơn chờ xử lý\'` và `ten_doi_tuong = \'Đơn #\' || id` (nối chuỗi bằng `||` trong SQLite).\nSắp xếp kết quả cuối cùng theo `loai_canh_bao` ASC, `ten_doi_tuong` ASC.',
          requirements: [
            'Dùng UNION ALL nối 2 câu SELECT cùng 2 cột',
            'Câu 1 lấy sản phẩm stock = 0',
            'Câu 2 lấy đơn status = \'pending\' với \'Đơn #\' || id',
            'ORDER BY đặt ở cuối cùng của toàn bộ câu UNION',
          ],
          requireOrder: true,
          starterSql: `SELECT 'Hết hàng' AS loai_canh_bao, name AS ten_doi_tuong\nFROM products\nWHERE stock = 0\n\nUNION ALL\n\n`,
          solutionSql: `SELECT 'Hết hàng' AS loai_canh_bao, name AS ten_doi_tuong\nFROM products\nWHERE stock = 0\nUNION ALL\nSELECT 'Đơn chờ xử lý' AS loai_canh_bao, 'Đơn #' || id AS ten_doi_tuong\nFROM orders\nWHERE status = 'pending'\nORDER BY loai_canh_bao ASC, ten_doi_tuong ASC;`,
          hints: [
            'Ở câu SELECT thứ hai, viết: SELECT \'Đơn chờ xử lý\' AS loai_canh_bao, \'Đơn #\' || id AS ten_doi_tuong FROM orders WHERE status = \'pending\'',
            'ORDER BY phải đặt sau câu SELECT cuối cùng.',
          ],
          xp: 100,
        },
      },
    ],
  },
  {
    id: 'module-4',
    order: 4,
    title: 'Chương 4: Subquery & CTE (WITH)',
    description:
      'Viết truy vấn đa tầng thông minh và cấu trúc code SQL sạch sẽ, dễ bảo trì với Common Table Expressions.',
    icon: '🧩',
    color: 'violet',
    lessons: [
      {
        id: 'c4-subquery-where',
        moduleId: 'module-4',
        order: 13,
        title: 'Truy vấn lồng (Subquery) trong WHERE & SELECT',
        subtitle: 'Dùng kết quả của một truy vấn làm điều kiện cho truy vấn bên ngoài',
        durationMinutes: 8,
        difficulty: 'Trung bình',
        tags: ['Subquery', 'WHERE', 'Scalar'],
        theory: [
          {
            type: 'text',
            title: 'Khi một câu hỏi cần 2 bước suy nghĩ',
            content:
              'Ví dụ: "Tìm các nhân viên có lương cao hơn mức lương trung bình toàn công ty". Bạn không thể viết WHERE salary > AVG(salary) vì WHERE không nhận hàm tổng hợp. Giải pháp: nhúng (SELECT AVG(salary) FROM employees) vào trong cặp ngoặc đơn!',
          },
          {
            type: 'syntax',
            title: 'Subquery trả về 1 giá trị (Scalar) hoặc 1 danh sách (IN)',
            code: `SELECT name, salary\nFROM employees\nWHERE salary > (\n  SELECT AVG(salary) FROM employees\n);`,
          },
          {
            type: 'example',
            title: 'Ví dụ: Sản phẩm đắt hơn giá trung bình của toàn MeowMart',
            sql: `SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products)\nORDER BY price DESC;`,
          },
        ],
        challenge: {
          title: 'Nhân sự hưởng lương trên mức trung bình',
          prompt:
            'Tìm tất cả nhân viên có mức `salary` **cao hơn lương trung bình** của toàn bộ bảng `employees`. Trả về `name`, `department`, `salary`, sắp xếp theo `salary` giảm dần.',
          requirements: [
            'Dùng Subquery (SELECT AVG(salary) FROM employees) trong WHERE',
            'Chọn đúng 3 cột: name, department, salary',
            'Sắp xếp theo salary DESC',
          ],
          requireOrder: true,
          starterSql: `SELECT name, department, salary\nFROM employees\nWHERE salary > (\n  \n)\nORDER BY salary DESC;`,
          solutionSql: `SELECT name, department, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees)\nORDER BY salary DESC;`,
          hints: [
            'Bên trong ngoặc đơn là câu truy vấn: SELECT AVG(salary) FROM employees.',
          ],
          xp: 100,
        },
      },
      {
        id: 'c4-subquery-from-exists',
        moduleId: 'module-4',
        order: 14,
        title: 'Subquery trong FROM & Toán tử EXISTS',
        subtitle: 'Tạo bảng tạm giữa đường và kiểm tra sự tồn tại tối ưu',
        durationMinutes: 9,
        difficulty: 'Trung bình',
        tags: ['Derived Table', 'EXISTS'],
        theory: [
          {
            type: 'text',
            title: 'Bảng dẫn xuất (Derived Table) & EXISTS',
            content:
              'Bạn có thể coi kết quả của một câu SELECT như một bảng ảo đặt sau FROM (nhớ đặt alias cho bảng ảo đó!). Ngoài ra, EXISTS kiểm tra xem truy vấn con có trả về ít nhất 1 dòng hay không — thường nhanh hơn IN trên dữ liệu lớn.',
          },
          {
            type: 'example',
            title: 'Ví dụ: Dùng EXISTS tìm khách hàng từng có đơn bị hủy',
            sql: `SELECT c.id, c.full_name, c.city\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.id AND o.status = 'cancelled'\n);`,
          },
        ],
        challenge: {
          title: 'Sản phẩm đã từng được bán (EXISTS)',
          prompt:
            'Sử dụng toán tử `EXISTS` (hoặc `NOT EXISTS`), hãy tìm những **sản phẩm chưa từng xuất hiện** trong bất kỳ đơn hàng nào (`order_items`). Trả về `id`, `name`, `price`, `stock`, sắp xếp theo `id` tăng dần.',
          requirements: [
            'Dùng NOT EXISTS với bảng order_items',
            'Chọn đúng 4 cột: id, name, price, stock',
            'Sắp xếp theo id ASC',
          ],
          requireOrder: true,
          starterSql: `SELECT p.id, p.name, p.price, p.stock\nFROM products p\nWHERE NOT EXISTS (\n  SELECT 1 FROM order_items oi\n  WHERE \n)\nORDER BY p.id ASC;`,
          solutionSql: `SELECT p.id, p.name, p.price, p.stock\nFROM products p\nWHERE NOT EXISTS (\n  SELECT 1 FROM order_items oi\n  WHERE oi.product_id = p.id\n)\nORDER BY p.id ASC;`,
          hints: [
            'Điều kiện liên kết bên trong NOT EXISTS là: oi.product_id = p.id.',
          ],
          xp: 110,
        },
      },
      {
        id: 'c4-cte',
        moduleId: 'module-4',
        order: 15,
        title: 'CTE (WITH ... AS) — Viết SQL chuẩn Senior',
        subtitle: 'Chia nhỏ bài toán phức tạp thành các bước logic rõ ràng, dễ đọc',
        durationMinutes: 10,
        difficulty: 'Nâng cao',
        tags: ['CTE', 'WITH'],
        theory: [
          {
            type: 'text',
            title: 'Tại sao Data Engineer & Analyst cực thích CTE?',
            content:
              'Thay vì lồng 3-4 lớp ngoặc đơn trong FROM rất rối mắt, CTE (Common Table Expression) cho phép bạn định nghĩa các bảng tạm có tên rõ ràng ở đầu câu truy vấn bằng từ khóa WITH, đọc từ trên xuống dưới như một câu chuyện!',
          },
          {
            type: 'syntax',
            title: 'Cú pháp CTE đơn và đa CTE',
            code: `WITH buoc_1 AS (\n  SELECT ... FROM ...\n),\nbuoc_2 AS (\n  SELECT ... FROM buoc_1 ...\n)\nSELECT * FROM buoc_2;`,
          },
          {
            type: 'example',
            title: 'Ví dụ: Tìm các khách hàng chi tiêu cao hơn mức chi tiêu TB của khách hàng',
            sql: `WITH customer_spend AS (\n  SELECT\n    c.id,\n    c.full_name,\n    SUM(o.total_amount) AS total_spent\n  FROM customers c\n  INNER JOIN orders o ON c.id = o.customer_id\n  WHERE o.status = 'completed'\n  GROUP BY c.id, c.full_name\n)\nSELECT full_name, total_spent\nFROM customer_spend\nWHERE total_spent > (SELECT AVG(total_spent) FROM customer_spend)\nORDER BY total_spent DESC;`,
          },
        ],
        challenge: {
          title: 'Phân tích doanh thu theo tháng bằng CTE',
          prompt:
            'Dùng CTE đặt tên `monthly_revenue` để tính tổng doanh thu các đơn `completed` theo từng tháng (`strftime(\'%Y-%m\', order_date)` đặt alias `thang`), tổng doanh thu đặt alias `doanh_thu`, số đơn là `so_don`.\nSau đó ở câu SELECT chính bên ngoài, chỉ lấy những tháng có `doanh_thu >= 2500000`, sắp xếp theo `thang` tăng dần.',
          requirements: [
            'Định nghĩa CTE WITH monthly_revenue AS (...)',
            'Dùng strftime(\'%Y-%m\', order_date) AS thang để tách năm-tháng trong SQLite',
            'Lọc status = \'completed\' trong CTE và doanh_thu >= 2500000 ở ngoài CTE',
          ],
          requireOrder: true,
          starterSql: `WITH monthly_revenue AS (\n  SELECT\n    strftime('%Y-%m', order_date) AS thang,\n    COUNT(*) AS so_don,\n    SUM(total_amount) AS doanh_thu\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY strftime('%Y-%m', order_date)\n)\nSELECT thang, so_don, doanh_thu\nFROM monthly_revenue\n`,
          solutionSql: `WITH monthly_revenue AS (\n  SELECT\n    strftime('%Y-%m', order_date) AS thang,\n    COUNT(*) AS so_don,\n    SUM(total_amount) AS doanh_thu\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY strftime('%Y-%m', order_date)\n)\nSELECT thang, so_don, doanh_thu\nFROM monthly_revenue\nWHERE doanh_thu >= 2500000\nORDER BY thang ASC;`,
          hints: [
            'Ở câu SELECT cuối cùng chỉ cần thêm: WHERE doanh_thu >= 2500000 ORDER BY thang ASC;',
          ],
          xp: 120,
        },
      },
    ],
  },
  {
    id: 'module-5',
    order: 5,
    title: 'Chương 5: Window Functions (Phân tích chuyên sâu)',
    description:
      'Vũ khí tối thượng trong phân tích dữ liệu: xếp hạng, tính lũy kế, so sánh tăng trưởng theo ngày mà không làm gộp dòng.',
    icon: '🚀',
    color: 'rose',
    lessons: [
      {
        id: 'c5-over-partition',
        moduleId: 'module-5',
        order: 16,
        title: 'Tư duy OVER() & PARTITION BY',
        subtitle: 'Tính toán trên từng nhóm nhưng vẫn giữ nguyên chi tiết từng dòng!',
        durationMinutes: 9,
        difficulty: 'Nâng cao',
        tags: ['Window Function', 'OVER', 'PARTITION BY'],
        theory: [
          {
            type: 'text',
            title: 'Sự kỳ diệu của Window Functions',
            content:
              'GROUP BY sẽ ép nhiều dòng gộp thành 1 dòng. Ngược lại, Window Function tính toán trên một "cửa sổ" các dòng liên quan (qua mệnh đề OVER) nhưng VẪN GIỮ NGUYÊN số dòng ban đầu! Nhờ đó bạn dễ dàng so sánh lương của mỗi nhân viên với lương trung bình phòng ban trên cùng 1 dòng.',
          },
          {
            type: 'visualizer',
            kind: 'window-vs-group',
            title: 'Mô phỏng trực quan: GROUP BY vs WINDOW FUNCTION',
            description:
              'So sánh trực tiếp kết quả đầu ra giữa GROUP BY và SUM/AVG() OVER(PARTITION BY ...) trên cùng dữ liệu.',
          },
          {
            type: 'example',
            title: 'Ví dụ: So sánh lương nhân viên với trung bình phòng ban',
            sql: `SELECT\n  name,\n  department,\n  salary,\n  ROUND(AVG(salary) OVER (PARTITION BY department), 0) AS avg_dept_salary\nFROM employees\nORDER BY department, salary DESC;`,
          },
        ],
        challenge: {
          title: 'Tỷ trọng giá sản phẩm trong từng danh mục',
          prompt:
            'Từ bảng `products`, hãy lấy `id`, `name`, `category_id`, `price`, và tính `gia_tb_danh_muc` là giá trung bình (`ROUND(AVG(price) OVER (PARTITION BY category_id), 0)`) của danh mục chứa sản phẩm đó. Sắp xếp theo `id` tăng dần.',
          requirements: [
            'Dùng AVG(price) OVER (PARTITION BY category_id) bọc trong ROUND(..., 0)',
            'Giữ nguyên tất cả 14 sản phẩm',
            'Sắp xếp ORDER BY id ASC',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  id,\n  name,\n  category_id,\n  price,\n  \nFROM products\nORDER BY id ASC;`,
          solutionSql: `SELECT\n  id,\n  name,\n  category_id,\n  price,\n  ROUND(AVG(price) OVER (PARTITION BY category_id), 0) AS gia_tb_danh_muc\nFROM products\nORDER BY id ASC;`,
          hints: [
            'Viết: ROUND(AVG(price) OVER (PARTITION BY category_id), 0) AS gia_tb_danh_muc',
          ],
          xp: 120,
        },
      },
      {
        id: 'c5-ranking',
        moduleId: 'module-5',
        order: 17,
        title: 'Xếp hạng: ROW_NUMBER, RANK, DENSE_RANK',
        subtitle: 'Hiểu rõ cách xử lý khi có đồng hạng (Tie) và bài toán Top N mỗi nhóm',
        durationMinutes: 10,
        difficulty: 'Nâng cao',
        tags: ['ROW_NUMBER', 'RANK', 'DENSE_RANK'],
        theory: [
          {
            type: 'text',
            title: 'Phân biệt 3 hàm xếp hạng khi 2 người bằng điểm/lương nhau',
            content:
              'Giả sử Vũ Đức Mạnh và Trần Thu Hà cùng lương 22.000.000đ (xếp sau Nguyễn Hải Yến 30tr - hạng 2). 3 hàm sẽ đánh số tiếp theo cho người hạng kế tiếp khác nhau:',
          },
          {
            type: 'comparison',
            title: 'Khi có 2 người đồng hạng 2 (22tr, 22tr)',
            leftTitle: 'ROW_NUMBER() & RANK()',
            leftItems: [
              'ROW_NUMBER(): 1, 2, 3, 4 (đánh số liên tiếp không bao giờ trùng)',
              'RANK(): 1, 2, 2, 4 (nhảy cóc hạng 3 vì đã có 2 người đứng ở hạng 2)',
            ],
            rightTitle: 'DENSE_RANK()',
            rightItems: [
              'DENSE_RANK(): 1, 2, 2, 3 (KHÔNG nhảy cóc — luôn liên tục)',
              'Dùng kết hợp CTE để giải bài toán "Top 2 lương cao nhất MỖI phòng ban"!',
            ],
          },
          {
            type: 'example',
            title: 'Ví dụ: So sánh cả 3 hàm xếp hạng trong phòng Data',
            sql: `SELECT\n  name,\n  salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,\n  RANK() OVER (ORDER BY salary DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk\nFROM employees\nWHERE department = 'Data';`,
          },
        ],
        challenge: {
          title: 'Top 2 nhân sự lương cao nhất mỗi phòng ban',
          prompt:
            'Sử dụng CTE + `ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)` để tìm **tối đa 2 nhân viên có lương cao nhất trong mỗi phòng ban** (`department`). Trả về `department`, `name`, `salary`, `hang` (số thứ hạng 1 hoặc 2), sắp xếp theo `department` ASC, `hang` ASC.',
          requirements: [
            'Đặt ROW_NUMBER() trong CTE với PARTITION BY department ORDER BY salary DESC',
            'Lọc WHERE hang <= 2 ở câu SELECT bên ngoài',
            'Sắp xếp ORDER BY department ASC, hang ASC',
          ],
          requireOrder: true,
          starterSql: `WITH ranked_emp AS (\n  SELECT\n    department,\n    name,\n    salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS hang\n  FROM employees\n)\nSELECT department, name, salary, hang\nFROM ranked_emp\n`,
          solutionSql: `WITH ranked_emp AS (\n  SELECT\n    department,\n    name,\n    salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS hang\n  FROM employees\n)\nSELECT department, name, salary, hang\nFROM ranked_emp\nWHERE hang <= 2\nORDER BY department ASC, hang ASC;`,
          hints: [
            'Bạn không thể lọc WHERE ROW_NUMBER()... trực tiếp, vì vậy phải bọc trong CTE rồi mới lọc WHERE hang <= 2 ở ngoài!',
          ],
          xp: 140,
        },
      },
      {
        id: 'c5-lag-lead',
        moduleId: 'module-5',
        order: 18,
        title: 'Phân tích chuỗi thời gian: LAG, LEAD & Running Total',
        subtitle: 'Tính tăng trưởng so với ngày hôm trước và doanh thu cộng dồn (Lũy kế)',
        durationMinutes: 10,
        difficulty: 'Nâng cao',
        tags: ['LAG', 'LEAD', 'Running Total'],
        theory: [
          {
            type: 'text',
            title: 'Nhìn về quá khứ (LAG) & tương lai (LEAD)',
            content:
              'Khi phân tích doanh thu theo ngày/tháng, sếp luôn hỏi: "Hôm nay tăng bao nhiêu so với hôm qua?". LAG(cot, 1) lấy giá trị của dòng trước đó; LEAD(cot, 1) lấy giá trị dòng kế tiếp; còn SUM(cot) OVER (ORDER BY ngay) tính tổng cộng dồn tới ngày hiện tại!',
          },
          {
            type: 'example',
            title: 'Ví dụ: Doanh thu ngày hôm trước và doanh thu lũy kế',
            sql: `SELECT\n  metric_date,\n  revenue,\n  LAG(revenue, 1) OVER (ORDER BY metric_date) AS prev_revenue,\n  SUM(revenue) OVER (ORDER BY metric_date) AS running_total\nFROM daily_metrics\nORDER BY metric_date ASC;`,
          },
        ],
        challenge: {
          title: 'Tính chênh lệch doanh thu so với ngày hôm trước',
          prompt:
            'Từ bảng `daily_metrics`, hãy trả về:\n- `metric_date`\n- `revenue`\n- `prev_revenue`: doanh thu ngày trước đó bằng `LAG(revenue, 1) OVER (ORDER BY metric_date)`\n- `chenh_lech`: hiệu số `revenue - LAG(revenue, 1) OVER (ORDER BY metric_date)`\nSắp xếp theo `metric_date` ASC.',
          requirements: [
            'Dùng LAG(revenue, 1) OVER (ORDER BY metric_date)',
            'Chọn đúng 4 cột: metric_date, revenue, prev_revenue, chenh_lech',
            'Sắp xếp ORDER BY metric_date ASC',
          ],
          requireOrder: true,
          starterSql: `SELECT\n  metric_date,\n  revenue,\n  LAG(revenue, 1) OVER (ORDER BY metric_date) AS prev_revenue,\n  \nFROM daily_metrics\nORDER BY metric_date ASC;`,
          solutionSql: `SELECT\n  metric_date,\n  revenue,\n  LAG(revenue, 1) OVER (ORDER BY metric_date) AS prev_revenue,\n  revenue - LAG(revenue, 1) OVER (ORDER BY metric_date) AS chenh_lech\nFROM daily_metrics\nORDER BY metric_date ASC;`,
          hints: [
            'Cột thứ 4 viết: revenue - LAG(revenue, 1) OVER (ORDER BY metric_date) AS chenh_lech.',
          ],
          xp: 140,
        },
      },
    ],
  },
  {
    id: 'module-6',
    order: 6,
    title: 'Chương 6: Thao tác dữ liệu (DML) & Dự án thực chiến',
    description:
      'Thêm, sửa, xóa dữ liệu an toàn và hoàn thành thử thách phân tích tổng hợp cấp độ Senior.',
    icon: '🏆',
    color: 'cyan',
    lessons: [
      {
        id: 'c6-dml',
        moduleId: 'module-6',
        order: 19,
        title: 'Thêm & Cập nhật dữ liệu: INSERT, UPDATE, DELETE',
        subtitle: 'Thao tác làm thay đổi dữ liệu trong bảng một cách an toàn',
        durationMinutes: 8,
        difficulty: 'Trung bình',
        tags: ['INSERT', 'UPDATE', 'DELETE'],
        theory: [
          {
            type: 'text',
            title: '3 lệnh DML thay đổi dữ liệu',
            content:
              'Khác với SELECT chỉ đọc, các lệnh DML (Data Manipulation Language) sẽ ghi, sửa hoặc xóa dữ liệu thật trong bảng. Trên MeowSQL bạn có thể thực hành thoải mái vì luôn có nút "Reset DB" để khôi phục dữ liệu gốc!',
          },
          {
            type: 'syntax',
            title: 'Cú pháp INSERT / UPDATE / DELETE',
            code: `-- Thêm mới\nINSERT INTO categories (id, name, description)\nVALUES (6, 'Thời trang mèo', 'Áo, nơ, mũ');\n\n-- Cập nhật (LUÔN nhớ WHERE!)\nUPDATE products SET price = price * 1.1 WHERE category_id = 1;\n\n-- Xóa dòng (LUÔN nhớ WHERE!)\nDELETE FROM orders WHERE status = 'cancelled';`,
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Kinh nghiệm xương máu khi chạy UPDATE / DELETE',
            content:
              'Không bao giờ quên mệnh đề WHERE trong UPDATE hoặc DELETE! Quên WHERE đồng nghĩa với việc sửa hoặc xóa SẠCH toàn bộ bảng. Hãy tập thói quen chạy SELECT với đúng điều kiện WHERE đó trước để kiểm tra!',
          },
        ],
        challenge: {
          title: 'Nhập hàng bổ sung cho sản phẩm hết kho',
          prompt:
            'Sản phẩm id = `11` (`Vitamin Dưỡng Lông Omega-3`) hiện đang hết hàng (`stock = 0`). Hãy viết câu lệnh `UPDATE` để cập nhật `stock = 50` và `rating = 4.8` cho riêng sản phẩm có `id = 11`.\n*(Hệ thống chấm điểm sẽ tự động kiểm tra lại dòng `id = 11` trong bảng `products` sau khi bạn chạy!)*',
          requirements: [
            'Cập nhật bảng products',
            'Đặt stock = 50 và rating = 4.8',
            'Chỉ định đúng WHERE id = 11',
          ],
          starterSql: `UPDATE products\nSET \nWHERE id = 11;`,
          solutionSql: `UPDATE products\nSET stock = 50, rating = 4.8\nWHERE id = 11;`,
          verifySql: `SELECT id, name, stock, rating FROM products WHERE id = 11;`,
          hints: [
            'Cú pháp gán nhiều cột: SET stock = 50, rating = 4.8.',
          ],
          xp: 100,
        },
      },
      {
        id: 'c6-capstone',
        moduleId: 'module-6',
        order: 20,
        title: 'Đồ án thực chiến: Báo cáo Khách Hàng VIP MeowMart',
        subtitle: 'Kết hợp JOIN + GROUP BY + CTE + Window Function giải bài toán doanh nghiệp',
        durationMinutes: 15,
        difficulty: 'Nâng cao',
        tags: ['Capstone', 'CTE', 'JOIN', 'RANK'],
        theory: [
          {
            type: 'text',
            title: 'Bối cảnh bài toán thực tế',
            content:
              'Giám đốc MeowMart muốn xem bảng xếp hạng các khách hàng đã có đơn hàng hoàn thành (`status = \'completed\'`) cùng với tổng số đơn, tổng chi tiêu, và tỷ lệ đóng góp (%) của họ vào tổng doanh thu toàn hệ thống.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Gợi ý kiến trúc truy vấn 2 tầng',
            content:
              'Bước 1 (CTE): Nối `customers` và `orders` (chỉ lấy `status = \'completed\'`), gom nhóm theo khách hàng để ra `so_don` và `tong_chi_tieu`.\nBước 2 (Query chính): Dùng `RANK() OVER (ORDER BY tong_chi_tieu DESC)` để xếp hạng và `SUM(tong_chi_tieu) OVER ()` làm mẫu số tính phần trăm!',
          },
        ],
        challenge: {
          title: 'Bảng vàng Khách hàng MeowMart',
          prompt:
            'Hãy viết truy vấn thống kê các khách hàng đã có ít nhất 1 đơn `completed` với các cột:\n- `full_name`\n- `city`\n- `so_don`: số đơn hoàn thành\n- `tong_chi_tieu`: tổng `total_amount`\n- `xep_hang`: xếp hạng bằng `RANK() OVER (ORDER BY tong_chi_tieu DESC)`\n- `ty_le_pct`: tỷ lệ phần trăm đóng góp doanh thu làm tròn 1 chữ số thập phân: `ROUND(tong_chi_tieu * 100.0 / SUM(tong_chi_tieu) OVER (), 1)`\nSắp xếp theo `xep_hang` ASC, `full_name` ASC.',
          requirements: [
            'Chỉ tính đơn hàng status = \'completed\'',
            'Dùng CTE + INNER JOIN + GROUP BY',
            'Dùng RANK() và SUM(...) OVER ()',
            'Đặt đúng 6 tên cột và sắp xếp xep_hang ASC, full_name ASC',
          ],
          requireOrder: true,
          starterSql: `WITH customer_summary AS (\n  SELECT\n    c.id,\n    c.full_name,\n    c.city,\n    COUNT(o.id) AS so_don,\n    SUM(o.total_amount) AS tong_chi_tieu\n  FROM customers c\n  INNER JOIN orders o ON c.id = o.customer_id\n  WHERE o.status = 'completed'\n  GROUP BY c.id, c.full_name, c.city\n)\nSELECT\n  full_name,\n  city,\n  so_don,\n  tong_chi_tieu,\n  \nFROM customer_summary\nORDER BY xep_hang ASC, full_name ASC;`,
          solutionSql: `WITH customer_summary AS (\n  SELECT\n    c.id,\n    c.full_name,\n    c.city,\n    COUNT(o.id) AS so_don,\n    SUM(o.total_amount) AS tong_chi_tieu\n  FROM customers c\n  INNER JOIN orders o ON c.id = o.customer_id\n  WHERE o.status = 'completed'\n  GROUP BY c.id, c.full_name, c.city\n)\nSELECT\n  full_name,\n  city,\n  so_don,\n  tong_chi_tieu,\n  RANK() OVER (ORDER BY tong_chi_tieu DESC) AS xep_hang,\n  ROUND(tong_chi_tieu * 100.0 / SUM(tong_chi_tieu) OVER (), 1) AS ty_le_pct\nFROM customer_summary\nORDER BY xep_hang ASC, full_name ASC;`,
          hints: [
            'Chú ý nhân 100.0 (có .0) để SQLite thực hiện phép chia số thực thay vì chia lấy phần nguyên!',
            'SUM(tong_chi_tieu) OVER () với cặp ngoặc trống sẽ tính tổng của toàn bộ kết quả CTE.',
          ],
          xp: 200,
        },
      },
    ],
  },
];

export const ALL_LESSONS = CURRICULUM.flatMap((m) => m.lessons);
