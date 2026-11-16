import { QuizQuestion } from '../types/sql';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Thứ tự thực thi SQL',
    difficulty: 'Cơ bản',
    question:
      'Trong câu lệnh SQL chuẩn, mệnh đề nào được hệ quản trị CSDL thực thi ĐẦU TIÊN?',
    options: ['SELECT', 'WHERE', 'FROM', 'ORDER BY'],
    correctIndex: 2,
    explanation:
      'SQL luôn xác định nguồn dữ liệu ở mệnh đề FROM (và JOIN) đầu tiên, sau đó mới lọc WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.',
  },
  {
    id: 'q2',
    topic: 'Giá trị NULL',
    difficulty: 'Cơ bản',
    question: 'Câu lệnh nào dưới đây đúng để tìm các sản phẩm chưa có đánh giá (rating bị rỗng)?',
    options: [
      'SELECT * FROM products WHERE rating = NULL;',
      'SELECT * FROM products WHERE rating == NULL;',
      'SELECT * FROM products WHERE rating IS NULL;',
      'SELECT * FROM products WHERE rating = "";',
    ],
    correctIndex: 2,
    explanation:
      'Trong SQL, NULL không bằng chính nó (NULL = NULL trả về UNKNOWN). Bạn luôn phải dùng IS NULL hoặc IS NOT NULL.',
  },
  {
    id: 'q3',
    topic: 'WHERE vs HAVING',
    difficulty: 'Trung bình',
    question: 'Đoạn SQL sau bị lỗi vì lý do gì?',
    codeSnippet: `SELECT department, COUNT(*) AS total\nFROM employees\nWHERE COUNT(*) > 2\nGROUP BY department;`,
    options: [
      'Không thể đặt alias AS total ở SELECT',
      'Không được dùng hàm tổng hợp COUNT(*) trong mệnh đề WHERE',
      'Thiếu mệnh đề ORDER BY',
      'GROUP BY phải đứng trước FROM',
    ],
    correctIndex: 1,
    explanation:
      'WHERE chạy trước GROUP BY nên chưa biết kết quả của COUNT(*). Muốn lọc theo kết quả hàm tổng hợp, phải dùng HAVING COUNT(*) > 2 sau GROUP BY.',
  },
  {
    id: 'q4',
    topic: 'LEFT JOIN & COUNT',
    difficulty: 'Trung bình',
    question:
      'Khi LEFT JOIN bảng `customers` sang `orders` để đếm số đơn của cả khách hàng chưa mua bao giờ, tại sao nên viết `COUNT(o.id)` thay vì `COUNT(*)`?',
    options: [
      'COUNT(*) chạy chậm hơn rất nhiều',
      'COUNT(*) đếm cả dòng có o.id = NULL thành 1 đơn thay vì 0',
      'COUNT(o.id) tự động lọc bỏ đơn cancelled',
      'SQL không cho phép dùng COUNT(*) khi có JOIN',
    ],
    correctIndex: 1,
    explanation:
      'LEFT JOIN giữ lại khách chưa mua và điền NULL vào các cột của bảng orders. COUNT(*) đếm số dòng (ra 1), còn COUNT(o.id) bỏ qua NULL nên trả về 0 chính xác!',
  },
  {
    id: 'q5',
    topic: 'AND vs OR',
    difficulty: 'Cơ bản',
    question: 'Nếu không có dấu ngoặc đơn, câu SQL dưới đây được hiểu như thế nào?',
    codeSnippet: `SELECT * FROM products\nWHERE category_id = 1 OR category_id = 2 AND price > 500000;`,
    options: [
      '(category_id = 1 OR category_id = 2) AND price > 500000',
      'category_id = 1 OR (category_id = 2 AND price > 500000)',
      'Báo lỗi cú pháp vì thiếu ngoặc',
      'Chỉ lọc các sản phẩm có price > 500000',
    ],
    correctIndex: 1,
    explanation:
      'AND có độ ưu tiên cao hơn OR (giống phép nhân trước phép cộng). Do đó tất cả sản phẩm category_id = 1 sẽ bị lấy hết bất kể giá!',
  },
  {
    id: 'q6',
    topic: 'Window Functions',
    difficulty: 'Nâng cao',
    question:
      'Với dãy lương [50, 40, 40, 30], hàm `DENSE_RANK() OVER (ORDER BY salary DESC)` trả về thứ hạng nào?',
    options: ['1, 2, 3, 4', '1, 2, 2, 4', '1, 2, 2, 3', '1, 1, 2, 3'],
    correctIndex: 2,
    explanation:
      'DENSE_RANK không nhảy số khi có đồng hạng: 50 (1), 40 (2), 40 (2), 30 (3). Trong khi đó RANK() sẽ trả về 1, 2, 2, 4.',
  },
  {
    id: 'q7',
    topic: 'UNION vs UNION ALL',
    difficulty: 'Trung bình',
    question: 'Sự khác biệt chính giữa UNION và UNION ALL là gì?',
    options: [
      'UNION nối ngang, UNION ALL nối dọc',
      'UNION loại bỏ dòng trùng lặp, UNION ALL giữ lại toàn bộ dòng',
      'UNION ALL tự động sắp xếp kết quả',
      'UNION không yêu cầu cùng số lượng cột',
    ],
    correctIndex: 1,
    explanation:
      'UNION thực hiện khử trùng (distinct) trên toàn bộ kết quả nên tốn thêm chi phí tính toán. UNION ALL giữ nguyên tất cả dòng và nhanh hơn.',
  },
  {
    id: 'q8',
    topic: 'Phép chia số nguyên',
    difficulty: 'Trung bình',
    question: 'Trong SQLite / PostgreSQL, biểu thức `SELECT 3 / 4;` thường trả về kết quả gì?',
    options: ['0.75', '0', '1', 'Lỗi chia cho số nguyên'],
    correctIndex: 1,
    explanation:
      'Số nguyên chia số nguyên sẽ thực hiện phép chia lấy phần nguyên (ra 0). Để ra 0.75, hãy viết 3.0 / 4 hoặc CAST(3 AS REAL) / 4.',
  },
];
