"use client";

import { useMemo, useState } from "react";

type View = "student" | "teacher" | "progress";
type TeacherPanel = "class" | "builder";

const STEP_LABELS = ["Vào phiếu", "Entry", "Mini 1", "Mini 2", "Exit", "Tóm tắt"];

const reflectionLibrary = [
  { id: "result", stage: "Sau khi làm bài", format: "Số", question: "Em làm đúng bao nhiêu câu?" },
  { id: "difficulty", stage: "Sau khi làm bài", format: "Chọn nhanh", question: "Em vướng nhất ở bước nào?" },
  { id: "evidence", stage: "Sau khi làm bài", format: "Một câu", question: "Dấu hiệu nào khiến em chọn heading đó?" },
  { id: "repair", stage: "Sau khi chữa bài", format: "Checklist", question: "Em đã sửa được bước nào khi làm lại?" },
  { id: "question", stage: "Sau khi chữa bài", format: "Không bắt buộc", question: "Nếu vẫn cần hỗ trợ, em muốn hỏi gì?" },
];

const students = [
  { name: "Mai Anh", progress: "5/5", status: "Cần hỗ trợ", tone: "alert", detail: "FALSE ≠ NOT GIVEN" },
  { name: "Gia Huy", progress: "5/5", status: "Đã hoàn thành", tone: "good", detail: "Ổn định" },
  { name: "Minh Châu", progress: "4/5", status: "Nộp thiếu", tone: "warn", detail: "Chờ GV xác nhận" },
  { name: "Quang Minh", progress: "5/5", status: "Cần hỗ trợ", tone: "alert", detail: "Thiếu bằng chứng" },
  { name: "Khánh Linh", progress: "5/5", status: "Đã hoàn thành", tone: "good", detail: "Tiến bộ rõ" },
  { name: "Đức Anh", progress: "3/5", status: "Đang làm", tone: "neutral", detail: "Tự lưu 2 phút trước" },
];

const sessionCards = Array.from({ length: 30 }, (_, index) => {
  const session = index + 1;
  const state = session <= 8 ? "done" : session === 9 ? "current" : "future";
  return { session, state };
});

export default function Home() {
  const [view, setView] = useState<View>("student");
  const [studentStep, setStudentStep] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState("Mai Anh");
  const [incompleteDemo, setIncompleteDemo] = useState(false);
  const [teacherPanel, setTeacherPanel] = useState<TeacherPanel>("class");
  const [teacherAction, setTeacherAction] = useState<string | null>(null);
  const [teacherPersonalNote, setTeacherPersonalNote] = useState("Cô đã đọc rồi nhé. Buổi sau mình gỡ đúng chỗ này cùng nhau.");
  const [miniCount, setMiniCount] = useState(2);
  const [selectedQuestions, setSelectedQuestions] = useState(["result", "difficulty", "evidence", "repair"]);
  const [showSourceNote, setShowSourceNote] = useState(false);

  const attendanceStatus = incompleteDemo ? "Cần giảng viên xác nhận" : "Đã xác nhận tham gia";
  const progressPercent = useMemo(
    () => Math.min(100, Math.round((studentStep / (STEP_LABELS.length - 1)) * 100)),
    [studentStep],
  );

  function moveStep(next: number) {
    setStudentStep(Math.max(0, Math.min(STEP_LABELS.length - 1, next)));
  }

  function openView(nextView: View) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleQuestion(questionId: string) {
    setSelectedQuestions((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  }

  return (
    <main className="demo-shell">
      <header className="topbar">
        <button className="brand-mark" type="button" onClick={() => openView("student")} aria-label="Về màn hình học viên">PL</button>
        <div className="brand-copy">
          <p className="eyebrow">PROGRESS LOG · TEAM 567</p>
          <h1>Phiếu học tập & xác nhận tham gia</h1>
        </div>
        <nav className="view-switcher" aria-label="Chọn màn hình demo">
          <button className={view === "student" ? "active" : ""} onClick={() => openView("student")}>Học viên</button>
          <button className={view === "teacher" ? "active" : ""} onClick={() => openView("teacher")}>Giảng viên</button>
          <button className={view === "progress" ? "active" : ""} onClick={() => openView("progress")}>Toàn khóa</button>
        </nav>
      </header>

      <div className="demo-ribbon">
        <span>DỮ LIỆU GIẢ LẬP</span>
        <p>Bản minh họa ý tưởng — không điểm danh thật, không gửi dữ liệu ra ngoài.</p>
      </div>

      {view === "student" && (
        <StudentView
          step={studentStep}
          progressPercent={progressPercent}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          moveStep={moveStep}
          incompleteDemo={incompleteDemo}
          setIncompleteDemo={setIncompleteDemo}
          attendanceStatus={attendanceStatus}
          teacherPersonalNote={teacherPersonalNote}
          openView={openView}
        />
      )}

      {view === "teacher" && (
        <TeacherView
          panel={teacherPanel}
          setPanel={setTeacherPanel}
          teacherAction={teacherAction}
          setTeacherAction={setTeacherAction}
          teacherPersonalNote={teacherPersonalNote}
          setTeacherPersonalNote={setTeacherPersonalNote}
          miniCount={miniCount}
          setMiniCount={setMiniCount}
          selectedQuestions={selectedQuestions}
          toggleQuestion={toggleQuestion}
          openView={openView}
        />
      )}

      {view === "progress" && <ProgressView openView={openView} />}

      <footer className="demo-footer">
        <div>
          <strong>Team 567 · Bản demo thuyết trình</strong>
          <span>Thiết kế cho khóa 5–6 và 6–7 · 30 buổi/khóa</span>
        </div>
        <button className="text-button" onClick={() => setShowSourceNote(!showSourceNote)}>
          {showSourceNote ? "Ẩn ghi chú thiết kế" : "Nguồn cảm hứng từ template hiện có"}
        </button>
      </footer>

      {showSourceNote && (
        <section className="source-note">
          <strong>Những gì được kế thừa:</strong> bản đồ 30 buổi, tỷ lệ tham gia, điểm kỹ năng, mức tự đánh giá, bài tập về nhà, bài test và sổ lỗi sai. Phần được thay đổi là trải nghiệm nhập liệu: học viên chỉ thấy đúng buổi hiện tại; dữ liệu bài tập/test được hệ thống đưa vào tự động; giảng viên xem cả lớp trong một màn hình.
        </section>
      )}
    </main>
  );
}

function StudentView({
  step,
  progressPercent,
  selectedStudent,
  setSelectedStudent,
  moveStep,
  incompleteDemo,
  setIncompleteDemo,
  attendanceStatus,
  teacherPersonalNote,
  openView,
}: {
  step: number;
  progressPercent: number;
  selectedStudent: string;
  setSelectedStudent: (name: string) => void;
  moveStep: (step: number) => void;
  incompleteDemo: boolean;
  setIncompleteDemo: (value: boolean) => void;
  attendanceStatus: string;
  teacherPersonalNote: string;
  openView: (view: View) => void;
}) {
  return (
    <>
      <section className="lesson-hero">
        <div>
          <div className="hero-pills"><span>IC2252 · Buổi 9/30</span><span>Thứ Sáu · 18:00</span></div>
          <h2>Reading: True / False / Not Given</h2>
          <p>Một link đầu giờ. Hai lần ghi nhanh ngay sau hoạt động chính. Một lần nộp cuối giờ.</p>
        </div>
        <div className="time-card">
          <strong>≤ 3 phút</strong>
          <span>Tổng thời gian nhập</span>
        </div>
      </section>

      {step < 5 && (
        <section className="progress-strip" aria-label="Tiến độ phiếu học tập">
          <div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
          <div className="step-labels">
            {STEP_LABELS.slice(0, 5).map((label, index) => (
              <button key={label} className={step === index ? "active" : step > index ? "done" : ""} onClick={() => moveStep(index)}>
                <span>{step > index ? "✓" : index + 1}</span>{label}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 0 && (
        <section className="activity-card start-card">
          <div className="card-heading">
            <div><p className="eyebrow red">MỞ MỘT LẦN · DÙNG CẢ BUỔI</p><h3>Chào em, đây là phiếu học tập hôm nay</h3></div>
            <span className="save-state">● Sẵn sàng</span>
          </div>
          <div className="two-column-form">
            <div>
              <label htmlFor="student-name">Chọn tên của em</label>
              <select id="student-name" value={selectedStudent} onChange={(event) => setSelectedStudent(event.target.value)}>
                <option>Mai Anh</option><option>Gia Huy</option><option>Minh Châu</option><option>Quang Minh</option>
              </select>
              <p className="field-note">Bản thật sẽ xác thực bằng mã lớp hoặc tài khoản; demo chỉ dùng tên giả.</p>
            </div>
            <div className="rights-card">
              <span className="mini-icon">✓</span>
              <div><strong>Hoàn thành đủ để tự xác nhận tham gia</strong><p>Câu trả lời không cần “đúng ý thầy cô”. Chỉ cần em điền đủ và nhấn nộp.</p></div>
            </div>
          </div>
          <div className="why-row">
            <div><strong>Ghi đúng lúc</strong><span>Không phải nhớ lại cả buổi vào 7 phút cuối.</span></div>
            <div><strong>Có ích cho em</strong><span>Ghi chép được biến thành một hành động tiếp theo.</span></div>
            <div><strong>Giảng viên nhìn thấy</strong><span>Vấn đề của em vào đúng bảng theo dõi của lớp.</span></div>
          </div>
          <div className="actions end"><button className="primary" onClick={() => moveStep(1)}>Bắt đầu Entry Ticket →</button></div>
        </section>
      )}

      {step === 1 && (
        <section className="activity-card">
          <CardHeading eyebrow="ENTRY TICKET · 20–30 GIÂY" title="Em bước vào buổi học với trạng thái nào?" />
          <p className="field-label">Mức sẵn sàng của em</p>
          <div className="scale-row">
            {[1, 2, 3, 4, 5].map((score) => <button key={score} className={score === 4 ? "selected" : ""}>{score}<small>{score === 1 ? "Đuối" : score === 5 ? "Rất sẵn sàng" : ""}</small></button>)}
          </div>
          <p className="field-label">Điều em muốn làm rõ nhất hôm nay</p>
          <div className="chip-row"><button className="choice selected">FALSE khác NOT GIVEN thế nào?</button><button className="choice">Tốc độ tìm bằng chứng</button><button className="choice">Chưa rõ</button></div>
          <NavActions back={() => moveStep(0)} next={() => moveStep(2)} nextLabel="Lưu và vào bài học →" />
        </section>
      )}

      {step === 2 && (
        <section className="activity-card">
          <CardHeading eyebrow="MINI-REFLECTION 1 · 30–45 GIÂY" title="Ngay sau bài True / False / Not Given" />
          <label htmlFor="result">Em làm đúng bao nhiêu câu?</label>
          <div className="score-row"><input id="result" defaultValue="7" aria-label="Số câu đúng" /><span>/ 10 câu</span></div>
          <p className="field-label">Điểm em còn vướng nhất</p>
          <div className="chip-row"><button className="choice selected">Phân biệt FALSE và NOT GIVEN</button><button className="choice">Tìm vị trí bằng chứng</button><button className="choice">Không có vướng mắc</button></div>
          <label htmlFor="evidence">Ghi lại một dấu hiệu em vừa nhận ra</label>
          <textarea id="evidence" defaultValue="FALSE có bằng chứng ngược lại; NOT GIVEN là bài không cho đủ thông tin để kết luận." />
          <NavActions back={() => moveStep(1)} next={() => moveStep(3)} />
        </section>
      )}

      {step === 3 && (
        <section className="activity-card">
          <CardHeading eyebrow="MINI-REFLECTION 2 · 30–45 GIÂY" title="Ngay sau phần chữa và làm lại" />
          <p className="field-label">Khi làm lại 3 câu sai, em đã làm được gì?</p>
          <div className="check-list">
            <button className="checked"><span>✓</span>Tìm được câu chứa bằng chứng</button>
            <button className="checked"><span>✓</span>Gạch chân từ khóa phủ định</button>
            <button><span />Giải thích được cho bạn bên cạnh</button>
          </div>
          <label htmlFor="question">Nếu vẫn cần giảng viên hỗ trợ, em hỏi gì?</label>
          <textarea id="question" defaultValue="Khi bài chỉ đổi chủ thể nhưng ý gần giống, em nên xếp là FALSE hay NOT GIVEN?" />
          <NavActions back={() => moveStep(2)} next={() => moveStep(4)} />
        </section>
      )}

      {step === 4 && (
        <section className="activity-card">
          <CardHeading eyebrow="EXIT TICKET · 30–45 GIÂY" title="Chốt một điều để buổi học tạo ra hành động" />
          <div className="exit-grid">
            <div><label htmlFor="takeaway">Điều quan trọng nhất em mang đi</label><textarea id="takeaway" defaultValue="Muốn chọn FALSE phải chỉ ra thông tin ngược lại trong bài." /></div>
            <div><label htmlFor="next-action">Việc em sẽ làm tiếp theo</label><textarea id="next-action" defaultValue="Làm lại 3 câu sai và ghi bằng chứng cho từng câu." /></div>
          </div>
          <div className="submission-rule">
            <div><strong>{incompleteDemo ? "Mô phỏng trường hợp nộp thiếu" : "Phiếu đã đủ các phần bắt buộc"}</strong><p>{incompleteDemo ? "Hệ thống không tự đánh vắng; phiếu được chuyển cho giảng viên xác nhận." : "Kết quả đúng/sai không ảnh hưởng điểm danh. Việc hoàn thành mới là điều kiện."}</p></div>
            <button className="secondary compact" onClick={() => setIncompleteDemo(!incompleteDemo)}>{incompleteDemo ? "Trở lại bản đầy đủ" : "Thử tình huống nộp thiếu"}</button>
          </div>
          <NavActions back={() => moveStep(3)} next={() => moveStep(5)} nextLabel="Nộp phiếu & xem tóm tắt →" />
        </section>
      )}

      {step === 5 && (
        <section className="summary-layout">
          <div className="summary-card">
            <div className={`attendance-seal ${incompleteDemo ? "pending" : ""}`}><span>{incompleteDemo ? "!" : "✓"}</span><div><small>TRẠNG THÁI BUỔI 9</small><strong>{attendanceStatus}</strong></div></div>
            <p className="eyebrow red">PHÂN TÍCH TỪ HỆ THỐNG · {selectedStudent.toUpperCase()}</p>
            <h3>Một ưu tiên, một việc tiếp theo — không giả giọng giảng viên</h3>
            <blockquote>Em hoàn thành <strong>7/10 câu</strong> True / False / Not Given và xác định điểm vướng là phân biệt FALSE với NOT GIVEN. Dữ liệu sau phần chữa cho thấy em đã nêu được: FALSE có bằng chứng ngược lại, còn NOT GIVEN là thiếu thông tin để kết luận. Ưu tiên tiếp theo là kiểm tra bài phủ định thông tin hay chỉ không nhắc tới. <strong>Việc cần làm: làm lại 3 câu sai và ghi một dòng bằng chứng cho mỗi câu.</strong></blockquote>
            <div className={`teacher-touch ${teacherPersonalNote.trim() ? "" : "empty"}`}><span>GV</span><div><small>TIN NHẮN CỦA CÔ LAN · VIẾT TRỰC TIẾP</small><p>{teacherPersonalNote.trim() || "Giảng viên chưa thêm lời nhắn cá nhân."}</p></div></div>
            <div className="summary-actions"><button className="primary" onClick={() => openView("progress")}>Xem tiến bộ toàn khóa</button><button className="secondary" onClick={() => moveStep(0)}>Chạy lại demo</button></div>
          </div>
          <aside className="summary-logic">
            <p className="eyebrow">MÔ HÌNH HAI LỚP</p>
            <ol><li><span>1</span>Hệ thống: dữ liệu và bằng chứng</li><li><span>2</span>Hệ thống: một ưu tiên</li><li><span>3</span>Hệ thống: một việc tiếp theo</li><li><span>4</span>Giảng viên: một câu thật, 5–20 từ</li></ol>
            <p className="guardrail">Gắn nhãn rõ nguồn. Không biến phần phân tích của AI thành lời của giảng viên.</p>
          </aside>
        </section>
      )}
    </>
  );
}

function TeacherView({ panel, setPanel, teacherAction, setTeacherAction, teacherPersonalNote, setTeacherPersonalNote, miniCount, setMiniCount, selectedQuestions, toggleQuestion, openView }: {
  panel: TeacherPanel;
  setPanel: (panel: TeacherPanel) => void;
  teacherAction: string | null;
  setTeacherAction: (action: string) => void;
  teacherPersonalNote: string;
  setTeacherPersonalNote: (note: string) => void;
  miniCount: number;
  setMiniCount: (count: number) => void;
  selectedQuestions: string[];
  toggleQuestion: (questionId: string) => void;
  openView: (view: View) => void;
}) {
  return (
    <>
      <section className="teacher-hero">
        <div><p className="eyebrow light">CỔNG GIẢNG VIÊN · IC2252</p><h2>Tự do thiết kế, ít thao tác, kiểm soát sâu hơn</h2><p>Hệ thống gom tín hiệu để giảng viên tập trung vào trường hợp cần quyết định — không đọc lại từng dòng của cả lớp.</p></div>
        <div className="hero-actions"><button onClick={() => setPanel("class")} className={panel === "class" ? "active" : ""}>Theo dõi lớp</button><button onClick={() => setPanel("builder")} className={panel === "builder" ? "active" : ""}>Chọn câu hỏi buổi 10</button></div>
      </section>

      {panel === "class" && (
        <>
          <section className="metric-grid teacher-metrics">
            <Metric value="12/14" label="Đã nộp đủ" note="Tự xác nhận tham gia" tone="good" />
            <Metric value="2" label="Cần GV xác nhận" note="Không tự đánh vắng" tone="warn" />
            <Metric value="3" label="Cần chú ý" note="Lỗi lặp lại hoặc câu hỏi" tone="alert" />
            <Metric value="~ 6 phút" label="Thời gian xử lý" note="Theo ngoại lệ, không đọc toàn bộ" />
          </section>
          <section className="teacher-dashboard">
            <div className="student-table-card">
              <div className="section-heading"><div><p className="eyebrow">TÍN HIỆU BUỔI 9</p><h3>Ai cần giảng viên quyết định?</h3></div><button className="filter-button">Ưu tiên trước</button></div>
              <div className="student-table">
                <div className="table-row header"><span>Học viên</span><span>Phiếu</span><span>Trạng thái</span><span>Tín hiệu chính</span></div>
                {students.map((student, index) => (
                  <div className={`table-row ${index === 0 ? "selected" : ""}`} key={student.name}>
                    <span><b>{student.name}</b></span><span>{student.progress}</span><span><em className={`tag ${student.tone}`}>{student.status}</em></span><span>{student.detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <aside className="intervention-card">
              <p className="eyebrow red">MAI ANH · BẰNG CHỨNG ĐƯỢC GOM SẴN</p>
              <h3>Một vấn đề, ba nguồn khớp nhau</h3>
              <ul><li><span>Trên lớp</span><strong>7/10 · vướng FALSE/NG</strong></li><li><span>BTVN gần nhất</span><strong>6/10 · cùng loại lỗi</strong></li><li><span>Lịch sử</span><strong>Lặp 3 lần / 4 buổi</strong></li></ul>
              <p className="field-label">Chọn việc giảng viên sẽ làm</p>
              <div className="quick-actions">
                {["Đã xem", "Nhắc lại đầu buổi sau", "Gửi 3 câu bổ trợ", "Trao đổi riêng 2 phút"].map((action) => <button className={teacherAction === action ? "selected" : ""} key={action} onClick={() => setTeacherAction(action)}>{teacherAction === action ? "✓ " : ""}{action}</button>)}
              </div>
              {teacherAction && <div className="action-confirmed">Quyết định đã được lưu vào hồ sơ. Hệ thống không biến quyết định này thành lời nói của giảng viên.</div>}
              <label htmlFor="teacher-personal-note">Câu chung của lớp hoặc sửa riêng cho Mai Anh <span className="optional-label">5–20 từ</span></label>
              <textarea id="teacher-personal-note" className="human-note-input" value={teacherPersonalNote} onChange={(event) => setTeacherPersonalNote(event.target.value)} maxLength={140} />
              <div className="human-note-status"><span>{teacherPersonalNote.trim() ? teacherPersonalNote.trim().split(/\s+/).length : 0} từ</span><small>Gõ một câu chung cho lớp; chỉ sửa riêng các trường hợp cần chú ý. AI không viết lại.</small></div>
            </aside>
          </section>
          <section className="source-flow">
            <div><p className="eyebrow">CHÂN DUNG 360°</p><h3>Ba nguồn vào, một nơi ra quyết định</h3></div>
            <div className="flow-items"><span>Phiếu học viên<small>tự đánh giá + câu hỏi</small></span><i>+</i><span>Phiếu giảng viên<small>quan sát trên lớp</small></span><i>+</i><span>Bài tập & bài test<small>kết quả chấm tự động</small></span><i>→</i><span className="result">Bảng ưu tiên<small>ai cần làm gì tiếp theo</small></span></div>
          </section>
        </>
      )}

      {panel === "builder" && (
        <section className="builder-layout">
          <div className="builder-card">
            <div className="section-heading"><div><p className="eyebrow red">CHỌN CÂU HỎI TRONG ≤ 2 PHÚT</p><h3>Buổi 10 · Reading Matching Headings</h3></div><span className="draft-pill">Lấy sẵn từ lịch lớp</span></div>
            <div className="locked-core"><span>BASELINE CHỈ GỒM REFLECTION</span><p>Không nhúng bài tập hoặc handout chuyên môn. Phiếu chỉ hỏi điều máy chưa biết: kết quả tự ghi nhận, khó khăn, bằng chứng và câu hỏi của học viên.</p></div>
            <p className="field-label">Số điểm dừng mini-reflection</p>
            <div className="count-selector">{[1, 2, 3].map((count) => <button key={count} onClick={() => setMiniCount(count)} className={miniCount === count ? "selected" : ""}>{count}<small>{count === 2 ? "Khuyên dùng" : count === 1 ? "Buổi ngắn" : "Buổi nhiều phần"}</small></button>)}</div>
            <div className="library-heading">
              <div><p className="field-label">Thư viện câu hỏi reflection phù hợp</p><p>Chọn câu cần dùng; không phải tự xây phiếu từ đầu.</p></div>
              <strong>{selectedQuestions.length} câu đã chọn</strong>
            </div>
            <div className="question-library">
              {reflectionLibrary.map((item) => {
                const selected = selectedQuestions.includes(item.id);
                return (
                  <button key={item.id} className={selected ? "selected" : ""} onClick={() => toggleQuestion(item.id)} aria-pressed={selected}>
                    <span className="question-check">{selected ? "✓" : "+"}</span>
                    <span className="question-copy"><small>{item.stage} · {item.format}</small><strong>{item.question}</strong></span>
                  </button>
                );
              })}
            </div>
            <label htmlFor="custom-reflection">Một câu reflection riêng, nếu thư viện chưa đủ <span className="optional-label">Không bắt buộc</span></label>
            <textarea id="custom-reflection" placeholder="Ví dụ: Chiến lược nào em muốn thử lại ở bài tiếp theo?" />
            <div className="actions"><button className="secondary">Xem trước như học viên</button><button className="primary">Tạo link buổi 10 →</button></div>
          </div>
          <aside className="freedom-card">
            <p className="eyebrow">TỰ DO CÓ HƯỚNG DẪN</p><h3>Giảng viên được đổi</h3>
            <ul className="yes-list"><li>Có 1–3 điểm dừng reflection</li><li>Bật/tắt câu hỏi trong thư viện</li><li>Thêm tối đa một câu riêng</li><li>Chọn thời điểm học viên điền</li></ul>
            <h3>Hệ thống giữ cố định</h3>
            <ul className="lock-list"><li>Chỉ thu nội dung reflection</li><li>Trường dữ liệu tối thiểu</li><li>Điều kiện xác nhận tham gia</li><li>Quy tắc riêng tư và bằng chứng</li></ul>
            <p className="effort-note"><strong>Phục vụ 90% trước:</strong> dùng mẫu và thư viện làm mặc định; yêu cầu mới được ghi nhận để team bổ sung có chọn lọc sau pilot. Một link dùng cả buổi, học viên chỉ nộp một lần cuối giờ.</p>
          </aside>
        </section>
      )}
      <div className="teacher-bottom-link"><button className="text-button" onClick={() => openView("progress")}>Mở hồ sơ tiến bộ toàn khóa của Mai Anh →</button></div>
    </>
  );
}

function ProgressView({ openView }: { openView: (view: View) => void }) {
  return (
    <>
      <section className="profile-hero">
        <div className="avatar">MA</div><div><p className="eyebrow light">HỒ SƠ TOÀN KHÓA · DỮ LIỆU GIẢ</p><h2>Mai Anh</h2><p>IC2252 · Mục tiêu 6.5 · Đã học 9/30 buổi</p></div>
        <button className="light-button" onClick={() => openView("student")}>Quay lại tóm tắt buổi 9</button>
      </section>
      <section className="metric-grid progress-metrics">
        <Metric value="93%" label="Tham gia" note="Ngưỡng an toàn ≥ 85%" tone="good" />
        <Metric value="72/100" label="Reading" note="+8 điểm sau 4 buổi" tone="good" />
        <Metric value="88%" label="BTVN đầy đủ" note="1 bài nộp muộn" tone="warn" />
        <Metric value="2" label="Lỗi cần chú ý" note="4 lỗi đã ổn định" tone="alert" />
      </section>
      <section className="progress-dashboard">
        <div className="course-map-card">
          <div className="section-heading"><div><p className="eyebrow">BẢN ĐỒ 30 BUỔI</p><h3>Đủ chi tiết khi cần nhìn bức tranh lớn</h3></div><div className="legend"><span className="done" />Đã học<span className="current" />Hiện tại<span />Sắp tới</div></div>
          <div className="session-map">{sessionCards.map(({ session, state }) => <div key={session} className={state}><small>Buổi</small><strong>{session}</strong></div>)}</div>
        </div>
        <div className="skill-card">
          <p className="eyebrow red">KỸ NĂNG & BÀI TEST</p><h3>Không bắt học viên nhập lại</h3>
          {[{label:"Reading",value:72,target:75},{label:"Listening",value:81,target:80},{label:"Writing",value:67,target:72},{label:"Speaking",value:70,target:72}].map((skill) => <div className="skill-bar" key={skill.label}><div><span>{skill.label}</span><strong>{skill.value}</strong></div><div className="bar"><span style={{width:`${skill.value}%`}} /><i style={{left:`${skill.target}%`}} /></div></div>)}
          <p className="chart-note">Dữ liệu được lấy từ bài trên lớp, BTVN và bài test đã chấm — học viên chỉ bổ sung điều máy không biết: mức hiểu, khó khăn và câu hỏi.</p>
        </div>
      </section>
      <section className="periodic-summary">
        <div><p className="eyebrow light">TỔNG KẾT ĐỊNH KỲ · SAU 4 BUỔI</p><h3>Ngắn để đọc ngay, đủ rõ để hành động</h3></div>
        <blockquote>Trong 4 buổi gần nhất, em tăng độ chính xác Reading từ 64% lên 72% và đã sửa ổn lỗi tìm sai đoạn chứa bằng chứng. Lỗi cần chú ý hiện tại là nhầm FALSE với NOT GIVEN, xuất hiện ở 3 nguồn dữ liệu. Em vẫn hoàn thành BTVN đều, chỉ có 1 bài nộp muộn. <strong>Ưu tiên kỳ tới: luôn ghi một câu bằng chứng trước khi chọn FALSE.</strong></blockquote>
        <button className="light-button">Xem bằng chứng chi tiết</button>
      </section>
      <section className="error-card">
        <div className="section-heading"><div><p className="eyebrow">SỔ LỖI SAI THEO THỜI GIAN</p><h3>“Đã sửa” phải có bằng chứng lặp lại</h3></div><span className="evidence-pill">3 nguồn: trên lớp · BTVN · test</span></div>
        <div className="error-table"><div className="error-row header"><span>Vấn đề</span><span>Nguyên nhân</span><span>Lặp lại</span><span>Trạng thái</span><span>Hành động</span></div><div className="error-row"><span><b>FALSE ≠ NOT GIVEN</b></span><span>Chưa kiểm tra bằng chứng ngược</span><span>3 lần</span><span><em className="tag alert">Cần chú ý</em></span><span>Làm lại 3 câu</span></div><div className="error-row"><span><b>Tìm sai đoạn</b></span><span>Dò từ khóa đơn lẻ</span><span>0/3 bài gần nhất</span><span><em className="tag good">Đã ổn định</em></span><span>Duy trì</span></div></div>
      </section>
    </>
  );
}

function CardHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="card-heading"><div><p className="eyebrow red">{eyebrow}</p><h3>{title}</h3></div><span className="save-state">● Đã tự lưu</span></div>;
}

function NavActions({ back, next, nextLabel = "Lưu và tiếp tục →" }: { back: () => void; next: () => void; nextLabel?: string }) {
  return <div className="actions"><button className="secondary" onClick={back}>← Quay lại</button><button className="primary" onClick={next}>{nextLabel}</button></div>;
}

function Metric({ value, label, note, tone = "neutral" }: { value: string; label: string; note: string; tone?: string }) {
  return <div className={`metric-card ${tone}`}><strong>{value}</strong><span>{label}</span><small>{note}</small></div>;
}
