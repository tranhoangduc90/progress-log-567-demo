"use client";

import { useState } from "react";

type View = "student" | "teacher" | "progress";
type TeacherPanel = "prepare" | "queue" | "case" | "sent";
type CaseId = "mai-anh" | "minh-chau" | "quang-minh";

const reflectionLibrary = [
  "Em làm đúng bao nhiêu câu?",
  "Em vướng nhất ở bước nào?",
  "Em đã sửa được điều gì sau khi chữa?",
  "Nếu vẫn cần hỗ trợ, em muốn hỏi gì?",
  "Bằng chứng nào khiến em chọn đáp án đó?",
];

const cases = {
  "mai-anh": {
    name: "Mai Anh",
    status: "Lỗi lặp lại",
    issue: "FALSE ≠ NOT GIVEN",
    tone: "alert",
    evidence: [
      ["Trên lớp", "7/10 · tự ghi nhận vẫn vướng FALSE/NG"],
      ["BTVN gần nhất", "6/10 · lặp lại cùng loại lỗi"],
      ["4 buổi gần đây", "Xuất hiện 3 lần"],
    ],
    action: "Nhắc lại 2 phút đầu buổi sau",
  },
  "minh-chau": {
    name: "Minh Châu",
    status: "Cần xác nhận",
    issue: "Phiếu thiếu 1 điểm dừng",
    tone: "warn",
    evidence: [
      ["Phiếu buổi 9", "Đã trả lời 1/2 điểm dừng"],
      ["Thời gian vào lớp", "Có mặt từ 18:02"],
      ["Quy tắc an toàn", "Không tự đánh vắng"],
    ],
    action: "Xác nhận tham gia sau khi kiểm tra",
  },
  "quang-minh": {
    name: "Quang Minh",
    status: "Có câu hỏi",
    issue: "Chưa biết chọn bằng chứng",
    tone: "question",
    evidence: [
      ["Mini-reflection", "Đã gửi một câu hỏi cụ thể"],
      ["Bài trên lớp", "8/10 nhưng giải thích còn mơ hồ"],
      ["Lịch sử", "Chưa phải lỗi lặp lại"],
    ],
    action: "Phản hồi bằng một ví dụ ở đầu buổi sau",
  },
} as const;

export default function Home() {
  const [view, setView] = useState<View>("student");
  const [studentStep, setStudentStep] = useState(0);
  const [studentName, setStudentName] = useState("Mai Anh");
  const [miniCount, setMiniCount] = useState(2);
  const [teacherPanel, setTeacherPanel] = useState<TeacherPanel>("prepare");
  const [activeCase, setActiveCase] = useState<CaseId>("mai-anh");
  const [teacherNote, setTeacherNote] = useState("Cô đã đọc rồi. Buổi sau mình gỡ đúng chỗ này nhé.");
  const [libraryOpen, setLibraryOpen] = useState(false);

  function openView(next: View) {
    setView(next);
    window.scrollTo({ top: 0 });
  }

  function openCase(id: CaseId) {
    setActiveCase(id);
    setTeacherPanel("case");
    window.scrollTo({ top: 0 });
  }

  function changeTeacherPanel(panel: TeacherPanel) {
    setTeacherPanel(panel);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="demo-shell">
      <header className="topbar">
        <button className="brand-mark" onClick={() => openView("student")} aria-label="Mở phần học viên">PL</button>
        <div className="brand-copy">
          <strong>Progress Log 567</strong>
          <span>Phiếu học tập & xác nhận tham gia</span>
        </div>
        <span className="fake-data">DỮ LIỆU GIẢ LẬP</span>
        <nav className="role-switch" aria-label="Chọn vai trò demo">
          <button className={view !== "teacher" ? "active" : ""} onClick={() => openView("student")}>Học viên</button>
          <button className={view === "teacher" ? "active" : ""} onClick={() => openView("teacher")}>Giảng viên</button>
        </nav>
      </header>

      {view === "student" && (
        <StudentView
          step={studentStep}
          setStep={setStudentStep}
          studentName={studentName}
          setStudentName={setStudentName}
          teacherNote={teacherNote}
          openProgress={() => openView("progress")}
        />
      )}

      {view === "teacher" && (
        <TeacherView
          panel={teacherPanel}
          setPanel={changeTeacherPanel}
          miniCount={miniCount}
          setMiniCount={setMiniCount}
          activeCase={activeCase}
          openCase={openCase}
          teacherNote={teacherNote}
          setTeacherNote={setTeacherNote}
          libraryOpen={libraryOpen}
          setLibraryOpen={setLibraryOpen}
        />
      )}

      {view === "progress" && <ProgressView back={() => openView("student")} />}
    </main>
  );
}

function StudentView({ step, setStep, studentName, setStudentName, teacherNote, openProgress }: {
  step: number;
  setStep: (step: number) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  teacherNote: string;
  openProgress: () => void;
}) {
  return (
    <section className="student-canvas">
      <div className="student-phone">
        <div className="session-line">
          <span>IC2252 · BUỔI 9/30</span>
          {step > 0 && step < 3 ? <small>● Đã tự lưu</small> : null}
        </div>

        {step === 0 && (
          <div className="single-task start-task">
            <p className="kicker">PHIẾU ĐIỂM DANH HÔM NAY</p>
            <h1>Reading: True / False / Not Given</h1>
            <label htmlFor="student-name">Chọn tên của em</label>
            <select id="student-name" value={studentName} onChange={(event) => setStudentName(event.target.value)}>
              <option>Mai Anh</option>
              <option>Gia Huy</option>
              <option>Minh Châu</option>
              <option>Quang Minh</option>
            </select>
            <div className="benefit">
              <span>✓</span>
              <div><strong>Điền đủ + Nộp = xác nhận tham gia</strong><small>Không chấm đúng sai câu reflection.</small></div>
            </div>
            <button className="primary full" onClick={() => setStep(1)}>Bắt đầu</button>
            <p className="microcopy">Một link dùng cả buổi. Giảng viên sẽ mở điểm dừng khi phù hợp.</p>
          </div>
        )}

        {step === 1 && (
          <div className="single-task">
            <div className="step-dots"><span className="active" /><span /></div>
            <p className="kicker">ĐIỂM DỪNG 1/2 · GIẢNG VIÊN VỪA MỞ</p>
            <h1>Em vừa làm bài thế nào?</h1>
            <label htmlFor="score">Số câu đúng</label>
            <div className="score-input"><input id="score" defaultValue="7" inputMode="numeric" /><span>/ 10</span></div>
            <p className="field-label">Em vướng nhất ở đâu?</p>
            <div className="choice-stack">
              <button className="choice selected">Phân biệt FALSE và NOT GIVEN</button>
              <button className="choice">Tìm vị trí bằng chứng</button>
              <button className="choice">Em chưa có vướng mắc</button>
            </div>
            <button className="primary full" onClick={() => setStep(2)}>Lưu & quay lại bài học</button>
          </div>
        )}

        {step === 2 && (
          <div className="single-task">
            <div className="step-dots"><span className="done" /><span className="active" /></div>
            <p className="kicker">ĐIỂM DỪNG 2/2 · GIẢNG VIÊN VỪA MỞ</p>
            <h1>Em đã sửa được điều gì?</h1>
            <div className="choice-stack">
              <button className="choice selected">Tìm được câu chứa bằng chứng</button>
              <button className="choice selected">Nhận ra bằng chứng ngược</button>
              <button className="choice">Giải thích được cho bạn</button>
            </div>
            <label htmlFor="student-question">Còn điều muốn hỏi? <span>Không bắt buộc</span></label>
            <textarea id="student-question" defaultValue="Khi bài chỉ đổi chủ thể, em nên kiểm tra gì trước?" />
            <button className="primary full" onClick={() => setStep(3)}>Nộp phiếu</button>
          </div>
        )}

        {step === 3 && (
          <div className="single-task result-task">
            <div className="attendance-ok"><span>✓</span><div><small>BUỔI 9</small><strong>Đã xác nhận tham gia</strong></div></div>
            <p className="kicker">PHÂN TÍCH TỪ HỆ THỐNG</p>
            <h1>Việc tiếp theo của {studentName}</h1>
            <div className="insight-list">
              <div><b>Đã sửa</b><span>Phân biệt được thiếu thông tin và thông tin ngược.</span></div>
              <div><b>Cần chú ý</b><span>Vẫn chưa chắc khi đề bài đổi chủ thể.</span></div>
              <div className="next"><b>Làm tiếp</b><span>Làm lại 3 câu sai và ghi một dòng bằng chứng cho mỗi câu.</span></div>
            </div>
            <div className="teacher-message"><span>GV</span><div><small>LỜI NHẮN CÔ LAN · VIẾT TRỰC TIẾP</small><p>{teacherNote}</p></div></div>
            <button className="primary full" onClick={openProgress}>Xem tiến bộ 30 buổi</button>
            <button className="text-action" onClick={() => setStep(0)}>Chạy lại demo học viên</button>
          </div>
        )}
      </div>
    </section>
  );
}

function TeacherView({ panel, setPanel, miniCount, setMiniCount, activeCase, openCase, teacherNote, setTeacherNote, libraryOpen, setLibraryOpen }: {
  panel: TeacherPanel;
  setPanel: (panel: TeacherPanel) => void;
  miniCount: number;
  setMiniCount: (count: number) => void;
  activeCase: CaseId;
  openCase: (id: CaseId) => void;
  teacherNote: string;
  setTeacherNote: (note: string) => void;
  libraryOpen: boolean;
  setLibraryOpen: (value: boolean) => void;
}) {
  const item = cases[activeCase];

  return (
    <section className="teacher-canvas">
      {panel === "prepare" && (
        <div className="teacher-sheet narrow-sheet">
          <div className="sheet-heading"><div><p className="kicker">TRƯỚC BUỔI HỌC · ≤ 2 PHÚT</p><h1>Buổi 10: chọn cách hỏi</h1></div><span className="quiet-badge">Nội dung buổi đã có sẵn</span></div>
          <p className="lead">Giảng viên quyết định có bao nhiêu điểm dừng và mở chúng lúc nào.</p>
          <div className="teacher-field">
            <p className="field-label">Số điểm dừng reflection</p>
            <div className="count-switch">
              {[1, 2, 3].map((count) => <button key={count} className={miniCount === count ? "active" : ""} onClick={() => setMiniCount(count)}>{count}<small>{count === 2 ? "Khuyên dùng" : count === 1 ? "Buổi ngắn" : "Nhiều phần"}</small></button>)}
            </div>
          </div>
          <div className="timing-grid">
            <label>Điểm dừng 1<select defaultValue="Sau bài T/F/NG"><option>Sau bài T/F/NG</option><option>Sau phần hướng dẫn</option><option>Cuối buổi</option></select></label>
            <label>Điểm dừng 2<select defaultValue="Sau phần chữa"><option>Sau phần chữa</option><option>Sau bài làm lại</option><option>Cuối buổi</option></select></label>
          </div>
          <div className="recommended-set">
            <div><p className="kicker">BỘ CÂU HỎI READING KHUYÊN DÙNG</p><strong>3 câu đã chọn từ thư viện</strong></div>
            <button className="text-action" onClick={() => setLibraryOpen(!libraryOpen)}>{libraryOpen ? "Ẩn thư viện" : "Đổi từ thư viện"}</button>
          </div>
          {libraryOpen && <div className="library-list">{reflectionLibrary.map((question, index) => <button key={question} className={index < 3 ? "selected" : ""}><span>{index < 3 ? "✓" : "+"}</span>{question}</button>)}</div>}
          {!libraryOpen && <div className="question-preview"><span>✓ Làm đúng mấy câu?</span><span>✓ Vướng nhất ở đâu?</span><span>✓ Đã sửa được gì?</span></div>}
          <button className="primary wide" onClick={() => setPanel("queue")}>Tạo link buổi 10</button>
        </div>
      )}

      {panel === "queue" && (
        <div className="teacher-sheet queue-sheet">
          <div className="created-note">✓ Link buổi 10 đã sẵn sàng · Bây giờ xem tình hình sau buổi 9</div>
          <div className="sheet-heading"><div><p className="kicker">SAU BUỔI HỌC</p><h1>3 việc cần bạn quyết định</h1></div><button className="secondary" onClick={() => setPanel("prepare")}>Sửa phiếu buổi tới</button></div>
          <div className="quiet-class"><strong>11 học viên còn lại</strong><span>Đã hoàn thành, chưa có tín hiệu bất thường.</span></div>
          <div className="case-list">
            {(Object.keys(cases) as CaseId[]).map((id) => {
              const current = cases[id];
              return <button key={id} onClick={() => openCase(id)}><span className={`case-dot ${current.tone}`} /><div><strong>{current.name}</strong><small>{current.issue}</small></div><em className={current.tone}>{current.status}</em><b>→</b></button>;
            })}
          </div>
          <button className="text-action teacher-log">+ Thêm ghi chú nhanh của giảng viên cho buổi 9</button>
        </div>
      )}

      {panel === "case" && (
        <div className="teacher-sheet case-sheet">
          <button className="back-link" onClick={() => setPanel("queue")}>← 3 việc cần quyết định</button>
          <div className="case-title"><div><p className="kicker">{item.name.toUpperCase()} · BẰNG CHỨNG ĐÃ GOM SẴN</p><h1>{item.issue}</h1></div><span className={`case-status ${item.tone}`}>{item.status}</span></div>
          <div className="case-columns">
            <div>
              <h2>Một vấn đề, ba nguồn khớp nhau</h2>
              <div className="evidence-list">{item.evidence.map(([source, evidence]) => <div key={source}><span>{source}</span><strong>{evidence}</strong></div>)}</div>
              <label>Việc giảng viên chọn làm<select defaultValue={item.action}><option>{item.action}</option><option>Trao đổi riêng 2 phút</option><option>Gửi 3 câu bổ trợ</option></select></label>
            </div>
            <div className="message-editor">
              <p className="kicker">PHÂN TÍCH TỪ HỆ THỐNG</p>
              <p className="system-copy">Hệ thống sẽ gửi phần tổng kết dựa trên dữ liệu và ghi rõ nguồn. Giảng viên không phải nhận đó là lời của mình.</p>
              <label htmlFor="teacher-note">Một câu thật của giảng viên <span>5–20 từ</span></label>
              <textarea id="teacher-note" value={teacherNote} onChange={(event) => setTeacherNote(event.target.value)} />
              <small>AI không viết lại câu này.</small>
              <button className="primary wide" onClick={() => setPanel("sent")}>Gửi tổng kết cho {item.name}</button>
            </div>
          </div>
        </div>
      )}

      {panel === "sent" && (
        <div className="teacher-sheet sent-sheet">
          <div className="sent-icon">✓</div>
          <p className="kicker">ĐÃ GỬI CHO {item.name.toUpperCase()}</p>
          <h1>Hai nguồn, không giả giọng</h1>
          <div className="sent-preview"><div><small>PHÂN TÍCH TỪ HỆ THỐNG</small><p>Dữ liệu, vấn đề chính và một việc tiếp theo.</p></div><div><small>LỜI NHẮN GIẢNG VIÊN</small><p>{teacherNote}</p></div></div>
          <button className="primary" onClick={() => setPanel("queue")}>Về danh sách ngoại lệ</button>
        </div>
      )}
    </section>
  );
}

function ProgressView({ back }: { back: () => void }) {
  return (
    <section className="teacher-canvas">
      <div className="teacher-sheet progress-sheet">
        <button className="back-link" onClick={back}>← Tóm tắt buổi 9</button>
        <div className="sheet-heading"><div><p className="kicker">HỒ SƠ TOÀN KHÓA · MAI ANH</p><h1>Khi cần, bức tranh 30 buổi vẫn ở đây</h1></div><span className="quiet-badge">9/30 buổi</span></div>
        <p className="lead">Màn hình hằng ngày chỉ hiện đúng buổi đang học; dữ liệu dài hạn không biến mất.</p>
        <div className="session-map">{Array.from({ length: 30 }, (_, index) => <div key={index} className={index < 8 ? "done" : index === 8 ? "current" : ""}>{index + 1}</div>)}</div>
        <div className="big-picture"><div><span>Reading</span><strong>72/100 · +8</strong></div><div><span>BTVN</span><strong>88% đầy đủ</strong></div><div><span>Lỗi đã ổn định</span><strong>4</strong></div><div><span>Cần chú ý</span><strong>2</strong></div></div>
      </div>
    </section>
  );
}
