/* ============================================================
   THƯ CHUẨN - script.js
   1. Dữ liệu   2. Tiện ích   3. Soạn thư   4. Lịch sử
   5. Email mẫu   6. Gửi qua Gmail   7. Quản trị
   8. Giao diện sáng/tối   9. Sự kiện   10. Khởi tạo
   ============================================================ */

/* ---------- 1. DỮ LIỆU ---------- */

// Các chủ đề thư. {to} {name} {org} {date} {detail} {me} {Me} sẽ được thay bằng thông tin người dùng nhập.
const TOPICS = {
  leave: {
    label: 'Xin nghỉ',
    viSubject: 'Xin phép nghỉ ngày {date}',
    viBody: 'Kính gửi {to},\n\n{Me} là {name}, {org}. {Me} viết email này để xin phép nghỉ ngày {date} vì {detail}.\n\n{Me} sẽ chủ động hoàn thành phần việc bị lỡ. Mong {to} xem xét giúp {me}.\n\n{Me} xin chân thành cảm ơn.',
    enSubject: 'Request for leave on {date}',
    enBody: 'Dear {to},\n\nMy name is {name} from {org}. I am writing to request leave on {date} because {detail}.\n\nI will make up any missed work as soon as possible. Thank you for considering my request.'
  },
  deadline: {
    label: 'Xin gia hạn nộp bài',
    viSubject: 'Xin gia hạn thời hạn nộp bài',
    viBody: 'Kính gửi {to},\n\n{Me} là {name}, {org}. {Me} xin phép gia hạn thời hạn nộp đến ngày {date} vì {detail}.\n\n{Me} cam kết hoàn thành đúng hạn mới. Rất mong nhận được sự thông cảm của {to}.\n\n{Me} xin chân thành cảm ơn.',
    enSubject: 'Request for a deadline extension',
    enBody: 'Dear {to},\n\nI am {name} from {org}. I would like to ask for an extension until {date} because {detail}.\n\nI commit to delivering by the new date. Thank you for your understanding.'
  },
  apply: {
    label: 'Ứng tuyển / xin việc',
    viSubject: 'Ứng tuyển vị trí - {name}',
    viBody: 'Kính gửi {to},\n\n{Me} là {name} và muốn ứng tuyển vào {org}. {detail}\n\n{Me} xin gửi kèm CV và rất mong có cơ hội trao đổi thêm.\n\n{Me} xin chân thành cảm ơn.',
    enSubject: 'Job application - {name}',
    enBody: 'Dear {to},\n\nI am {name} and I would like to apply to {org}. {detail}\n\nI have attached my CV and would welcome the chance to discuss further.'
  },
  report: {
    label: 'Gửi báo cáo',
    viSubject: 'Báo cáo ngày {date}',
    viBody: 'Kính gửi {to},\n\n{Me} là {name}, {org}. {Me} xin gửi kèm báo cáo ngày {date}. Nội dung chính: {detail}.\n\nNếu cần chỉnh sửa, mong {to} phản hồi để {me} cập nhật.\n\n{Me} xin cảm ơn.',
    enSubject: 'Report submission - {date}',
    enBody: 'Dear {to},\n\nI am {name} from {org}. Please find attached my report dated {date}. Key points: {detail}.\n\nPlease let me know if any changes are needed.'
  },
  meet: {
    label: 'Hẹn gặp trao đổi',
    viSubject: 'Đề nghị hẹn gặp ngày {date}',
    viBody: 'Kính gửi {to},\n\n{Me} là {name}, {org}. {Me} muốn xin một buổi gặp ngắn vào {date} để trao đổi về {detail}.\n\nMong {to} phản hồi thời gian phù hợp.\n\n{Me} xin chân thành cảm ơn.',
    enSubject: 'Meeting request for {date}',
    enBody: 'Dear {to},\n\nI am {name} from {org}. I would like to request a short meeting on {date} to discuss {detail}.\n\nPlease let me know a time that suits you.'
  }
};

// Email mẫu có sẵn. Người dùng chỉ cần thay phần trong [ngoặc vuông].
const SAMPLES = [
  { id: 's1', category: 'Học tập', title: 'Xin nghỉ học vì ốm', text: 'Kính gửi Cô [Tên giảng viên],\n\nEm là [Tên bạn], lớp [Tên lớp]. Em xin phép nghỉ buổi học ngày [ngày] vì bị ốm. Em sẽ nhờ bạn ghi bài giúp.\n\nEm xin cảm ơn Cô.' },
  { id: 's2', category: 'Học tập', title: 'Xin phúc khảo điểm', text: 'Kính gửi Thầy/Cô [Tên giảng viên],\n\nEm là [Tên bạn], MSSV [mã số]. Em xin phép được xem lại bài thi môn [tên môn] vì em thấy điểm chưa phản ánh đúng phần làm bài.\n\nEm xin chân thành cảm ơn.' },
  { id: 's3', category: 'Công việc', title: 'Xin nghỉ phép năm', text: 'Kính gửi Anh/Chị [Tên quản lý],\n\nEm là [Tên bạn], phòng [tên phòng]. Em xin nghỉ phép từ ngày [ngày] đến ngày [ngày]. Em đã bàn giao công việc cho [tên đồng nghiệp].\n\nEm xin cảm ơn.' },
  { id: 's4', category: 'Công việc', title: 'Nhắc lại email chưa được phản hồi', text: 'Kính gửi Anh/Chị [Tên],\n\nEm xin nhắc lại email em đã gửi ngày [ngày] về [nội dung]. Mong Anh/Chị phản hồi giúp em khi thuận tiện.\n\nEm xin cảm ơn.' },
  { id: 's5', category: 'Xin việc', title: 'Xin thực tập', text: 'Kính gửi Anh/Chị [Tên người nhận],\n\nEm là [Tên bạn], sinh viên năm [năm] ngành [ngành]. Em muốn xin thực tập tại vị trí [vị trí]. Em xin gửi kèm CV để Anh/Chị tham khảo.\n\nEm xin chân thành cảm ơn.' }
];

const DEFAULT_SETTINGS = { title: 'Thư Chuẩn', closingVi: 'Trân trọng,', closingEn: 'Best regards,' };
const ADMIN_PIN = 'admin123';   // Chỉ để demo, không bảo mật thật

// Gửi Gmail: dán Client ID lấy từ Google Cloud Console vào đây (xem hướng dẫn ở đầu mục 6). Để trống thì chưa gửi được.
const GOOGLE_CLIENT_ID = '';
const GMAIL_SCOPES = 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email';
const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

/* ---------- 2. TIỆN ÍCH ---------- */

const $ = (selector) => document.querySelector(selector);

// Chống chèn mã HTML khi hiển thị nội dung người dùng nhập
const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const todayISO = () => new Date().toISOString().slice(0, 10);
const formatDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '[ngày]');
const findById = (list, id) => list.find((item) => String(item.id) === id);

// Lưu và đọc dữ liệu trong trình duyệt (localStorage)
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem('tc_' + key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('tc_' + key, JSON.stringify(value)); } catch { /* bỏ qua nếu bị chặn */ }
  }
};

// Trạng thái chung của ứng dụng
const state = {
  settings: { ...DEFAULT_SETTINGS, ...storage.get('settings', {}) },
  history: storage.get('history', []),
  community: storage.get('community', []),
  comments: storage.get('comments', {}),
  filter: 'Tất cả',
  isAdmin: false,
  gmail: { token: null, email: null }   // chỉ giữ trong bộ nhớ, không lưu ra ổ đĩa
};

/* ---------- 3. SOẠN THƯ ---------- */

function fillTopics() {
  $('#topic').innerHTML = Object.entries(TOPICS)
    .map(([key, topic]) => `<option value="${key}">${topic.label}</option>`).join('');
}

// Lấy thông tin người dùng nhập để thay vào mẫu thư
function getVariables() {
  const me = $('#role').value === 'sv' ? 'em' : 'tôi';
  return {
    to: $('#to').value.trim() || '[người nhận]',
    name: $('#name').value.trim() || '[họ tên]',
    org: $('#org').value.trim() || '[đơn vị]',
    date: formatDate($('#date').value),
    detail: $('#detail').value.trim() || '[nội dung]',
    me,
    Me: me[0].toUpperCase() + me.slice(1)
  };
}

function fillTemplate(template) {
  const vars = getVariables();
  return template.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match);
}

// Tạo thư tự động theo chủ đề, ngôn ngữ và thông tin đã nhập
function buildEmail() {
  const topic = TOPICS[$('#topic').value];
  const lang = $('#lang').value;
  const { name } = getVariables();
  const { closingVi, closingEn } = state.settings;

  const viBody = `${fillTemplate(topic.viBody)}\n\n${closingVi}\n${name}`;
  const enBody = `${fillTemplate(topic.enBody)}\n\n${closingEn}\n${name}`;
  const viSubject = fillTemplate(topic.viSubject);
  const enSubject = fillTemplate(topic.enSubject);

  if (lang === 'vi') setLetter(viSubject, viBody);
  else if (lang === 'en') setLetter(enSubject, enBody);
  else setLetter(`${viSubject} / ${enSubject}`, `${viBody}\n\n――――――――――\n\n${enBody}`);
}

function setLetter(subject, body) {
  $('#subject').value = subject;
  $('#body').value = body;
  updateMailLink();
}

function updateMailLink() {
  $('#mailLink').href = `mailto:?subject=${encodeURIComponent($('#subject').value)}&body=${encodeURIComponent($('#body').value)}`;
}

function showMessage(text) {
  $('#msg').textContent = text;
  setTimeout(() => { $('#msg').textContent = ''; }, 2500);
}

function copyLetter() {
  const text = `Tiêu đề: ${$('#subject').value}\n\n${$('#body').value}`;
  const fallback = () => { $('#body').select(); document.execCommand('copy'); showMessage('Đã sao chép.'); };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showMessage('Đã sao chép.'), fallback);
  else fallback();
}

/* ---------- 4. LỊCH SỬ ---------- */

const isDue = (item) => !item.sent && item.remind && item.remind <= todayISO();

function saveHistory(sent = false) {
  const subject = $('#subject').value;
  const body = $('#body').value;
  if (!body.trim()) return;

  // Nếu thư giống hệt đã lưu thì thay bằng bản mới, tránh trùng lặp
  state.history = state.history.filter((h) => !(h.subject === subject && h.body === body));
  state.history.unshift({
    id: Date.now(), subject, body,
    remind: $('#remind').value,
    sent,
    time: new Date().toLocaleDateString('vi-VN')
  });
  storage.set('history', state.history);
  renderHistory();
  if (!sent) showMessage('Đã lưu vào lịch sử.');
}

function renderHistory() {
  $('#historyList').innerHTML = state.history.map((h) => `
    <li class="h-item ${isDue(h) ? 'due' : ''}" data-id="${h.id}">
      <button class="open" data-act="openHistory">${esc(h.subject || '(chưa có tiêu đề)')}</button>
      <small>Tạo ngày ${h.time}</small>
      ${h.remind && !h.sent ? `<small>Nhắc ngày ${formatDate(h.remind)}${isDue(h) ? ' - đã đến hạn' : ''}</small>` : ''}
      <div class="row">
        <button data-act="toggleSent">${h.sent ? 'Đã gửi ✓' : 'Chưa gửi'}</button>
        <button data-act="deleteHistory">Xóa</button>
      </div>
    </li>`).join('') || '<li class="note">Chưa có email nào. Soạn thư rồi bấm “Lưu vào lịch sử”.</li>';
  renderAlert();
}

function renderAlert() {
  const count = state.history.filter(isDue).length;
  $('#alert').innerHTML = count ? `<div class="banner">Bạn có ${count} email cần gửi hoặc theo dõi hôm nay. Xem thanh lịch sử bên trái.</div>` : '';
}

/* ---------- 5. EMAIL MẪU ---------- */

const allSamples = () => [...SAMPLES, ...state.community];

function renderChips() {
  const categories = ['Tất cả', ...new Set(allSamples().map((s) => s.category))];
  $('#chips').innerHTML = categories.map((c) =>
    `<button class="chip ${c === state.filter ? 'active' : ''}" data-act="setFilter" data-category="${esc(c)}">${esc(c)}</button>`).join('');
}

function renderSamples() {
  const keyword = $('#search').value.trim().toLowerCase();
  const list = allSamples().filter((s) =>
    (state.filter === 'Tất cả' || s.category === state.filter) &&
    (s.title + s.text).toLowerCase().includes(keyword));

  $('#sampleGrid').innerHTML = list.map((s) => `
    <article class="sample" data-id="${s.id}">
      <span class="tag">${esc(s.category)}</span>
      <h3>${esc(s.title)}</h3>
      <pre>${esc(s.text)}</pre>
      ${(state.comments[s.id] || []).map((c) => `<div class="cm">${esc(c)}</div>`).join('')}
      <div class="row">
        <button class="btn small" data-act="useSample">Dùng mẫu này</button>
        <button class="btn small ghost dark" data-act="addComment">Góp ý</button>
        ${state.isAdmin && s.category === 'Cộng đồng' ? '<button class="btn small ghost dark" data-act="deleteSample">Xóa</button>' : ''}
      </div>
    </article>`).join('') || '<p class="note">Không tìm thấy mẫu phù hợp.</p>';
}

function publishSample() {
  const title = $('#sTitle').value.trim();
  const text = $('#sText').value.trim();
  if (!title || !text) return;
  state.community.unshift({ id: 'c' + Date.now(), category: 'Cộng đồng', title, text });
  storage.set('community', state.community);
  $('#sTitle').value = '';
  $('#sText').value = '';
  renderChips();
  renderSamples();
}

/* ---------- 6. GỬI EMAIL QUA GMAIL ----------
   Cách hoạt động: bấm "Kết nối Gmail" -> Google hỏi quyền "gửi email" -> trang nhận một mã truy cập tạm
   (khoảng 1 giờ) -> trang gọi Gmail API để gửi thư. Không cần máy chủ riêng, không cần cơ sở dữ liệu.
   Cài đặt:
     1. Google Cloud Console: tạo dự án, bật "Gmail API".
     2. Màn hình đồng ý OAuth: thêm Gmail của bạn vào danh sách "Test users".
     3. Tạo "OAuth client ID" loại Web. Thêm địa chỉ trang (vd: http://localhost:5500) vào "Authorized JavaScript origins".
     4. Dán Client ID vào hằng số GOOGLE_CLIENT_ID ở mục 1. Mở trang qua http://, không mở bằng file://. */

let tokenClient = null;
const EMAIL_PATTERN = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/;

// Mã hóa chữ có dấu (UTF-8) sang base64 để đưa vào thư
function toBase64(text) {
  let binary = '';
  new TextEncoder().encode(text).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}
const toBase64Url = (text) => toBase64(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// Tách danh sách email ngăn cách bởi dấu phẩy hoặc chấm phẩy, và kiểm tra từng địa chỉ
function parseEmails(text) {
  const list = String(text || '').split(/[,;]/).map((e) => e.trim()).filter(Boolean);
  return { list, valid: list.every((e) => EMAIL_PATTERN.test(e)) };
}

// Gmail API nhận thư dạng văn bản chuẩn RFC 2822 đã mã hóa base64url
function buildRawMessage(to, cc, subject, body) {
  const headers = [`To: ${to.join(', ')}`];
  if (cc.length) headers.push(`Cc: ${cc.join(', ')}`);
  headers.push(`Subject: =?UTF-8?B?${toBase64(subject)}?=`, 'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"', 'Content-Transfer-Encoding: base64');
  const encodedBody = toBase64(body).match(/.{1,76}/g).join('\r\n');
  return toBase64Url(`${headers.join('\r\n')}\r\n\r\n${encodedBody}`);
}

function setSendMessage(text) { $('#sendMsg').textContent = text; }

function renderGmail() {
  const connected = Boolean(state.gmail.token);
  $('#gmailStatus').textContent = connected ? `Đã kết nối: ${state.gmail.email || 'Gmail'}` : 'Chưa kết nối Gmail';
  $('#btnConnect').hidden = connected;
  ['#btnSend', '#btnTest', '#btnDisconnect'].forEach((id) => { $(id).hidden = !connected; });
}

function connectGmail() {
  if (location.protocol === 'file:') return setSendMessage('Hãy mở trang qua http://localhost (vd: tiện ích Live Server), không mở trực tiếp bằng file://.');
  if (!GOOGLE_CLIENT_ID) return setSendMessage('Chưa có Client ID. Xem hướng dẫn ở đầu mục 6 trong script.js.');
  if (!window.google) return setSendMessage('Chưa tải được thư viện Google. Kiểm tra mạng rồi thử lại.');
  tokenClient = tokenClient || google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID, scope: GMAIL_SCOPES, callback: onGmailToken
  });
  tokenClient.requestAccessToken();
}

// Google trả về mã truy cập sau khi người dùng đồng ý
async function onGmailToken(response) {
  if (response.error) return setSendMessage('Không kết nối được Gmail: ' + response.error);
  state.gmail.token = response.access_token;
  try {
    const res = await fetch(USERINFO_URL, { headers: { Authorization: `Bearer ${state.gmail.token}` } });
    state.gmail.email = (await res.json()).email;
  } catch { /* vẫn dùng được dù không lấy được địa chỉ email */ }
  renderGmail();
  setSendMessage('Đã kết nối. Nhập địa chỉ người nhận rồi bấm "Gửi thư".');
}

function disconnectGmail() {
  const token = state.gmail.token;
  state.gmail = { token: null, email: null };
  if (token && window.google) google.accounts.oauth2.revoke(token, () => {});
  renderGmail();
  setSendMessage('Đã ngắt kết nối Gmail.');
}

async function sendEmail(toText, ccText) {
  const to = parseEmails(toText);
  const cc = parseEmails(ccText);
  const subject = $('#subject').value.trim();
  const body = $('#body').value;
  if (!to.list.length || !to.valid || !cc.valid) return setSendMessage('Địa chỉ email người nhận chưa hợp lệ.');
  if (!subject || !body.trim()) return setSendMessage('Thư cần có tiêu đề và nội dung.');
  if (!confirm(`Gửi email "${subject}" tới ${to.list.join(', ')}?`)) return;

  setSendMessage('Đang gửi...');
  try {
    const res = await fetch(GMAIL_SEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.gmail.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildRawMessage(to.list, cc.list, subject, body) })
    });
    if (res.status === 401) {   // mã truy cập hết hạn
      state.gmail = { token: null, email: null };
      renderGmail();
      return setSendMessage('Phiên kết nối đã hết hạn. Hãy bấm "Kết nối Gmail" lại.');
    }
    if (!res.ok) throw new Error('mã lỗi ' + res.status);
    saveHistory(true);   // ghi vào lịch sử với trạng thái "Đã gửi"
    setSendMessage(`Đã gửi tới ${to.list.join(', ')}.`);
  } catch (error) {
    setSendMessage('Gửi không thành công: ' + error.message);
  }
}

/* ---------- 7. QUẢN TRỊ ---------- */

function renderAdmin() {
  const s = state.settings;
  $('#adminBox').innerHTML = state.isAdmin ? `
    <label>Tên trang <input id="setTitle" value="${esc(s.title)}"></label>
    <label>Lời chào kết (tiếng Việt) <input id="setVi" value="${esc(s.closingVi)}"></label>
    <label>Lời chào kết (English) <input id="setEn" value="${esc(s.closingEn)}"></label>
    <div class="actions">
      <button class="btn small" data-act="saveAdmin">Lưu</button>
      <button class="btn small ghost" data-act="logout">Đăng xuất</button>
    </div>
    <p class="note">Quản trị viên có thể xóa mẫu cộng đồng ngay trong mục Email mẫu.</p>` : `
    <label>Mã quản trị <input id="pin" type="password"></label>
    <div class="actions"><button class="btn small" data-act="login">Đăng nhập</button><span id="adminMsg"></span></div>
    <p class="note">Mã demo: admin123</p>`;
}

/* ---------- 8. GIAO DIỆN SÁNG / TỐI ---------- */

// Giao diện được lưu trong thuộc tính data-theme của thẻ <html>; style.css đổi màu theo thuộc tính này
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('#themeBtn').textContent = theme === 'dark' ? '☀' : '☾';
  $('#themeBtn').setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
}

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.classList.add('theme-fade');   // bật hiệu ứng chuyển màu mượt (xem mục 10 trong style.css)
  applyTheme(next);
  storage.set('theme', next);
  clearTimeout(toggleTheme.timer);
  toggleTheme.timer = setTimeout(() => root.classList.remove('theme-fade'), 700);
}

/* ---------- 9. SỰ KIỆN ---------- */

// Mỗi nút trên trang có thuộc tính data-act, tên khớp với một hàm trong đối tượng này
const actions = {
  openHistory(id) {
    const item = findById(state.history, id);
    setLetter(item.subject, item.body);
    $('#remind').value = item.remind || '';
    $('#soan-thu').scrollIntoView();
  },
  toggleSent(id) {
    const item = findById(state.history, id);
    item.sent = !item.sent;
    storage.set('history', state.history);
    renderHistory();
  },
  deleteHistory(id) {
    state.history = state.history.filter((h) => String(h.id) !== id);
    storage.set('history', state.history);
    renderHistory();
  },
  setFilter(id, button) {
    state.filter = button.dataset.category;
    renderChips();
    renderSamples();
  },
  useSample(id) {
    const sample = findById(allSamples(), id);
    setLetter(sample.title, sample.text);
    $('#soan-thu').scrollIntoView();
  },
  addComment(id) {
    const text = prompt('Nhập góp ý của bạn cho mẫu này:');
    if (!text || !text.trim()) return;
    state.comments[id] = [...(state.comments[id] || []), text.trim()];
    storage.set('comments', state.comments);
    renderSamples();
  },
  deleteSample(id) {
    state.community = state.community.filter((s) => s.id !== id);
    storage.set('community', state.community);
    renderChips();
    renderSamples();
  },
  login() {
    if ($('#pin').value === ADMIN_PIN) { state.isAdmin = true; renderAdmin(); renderSamples(); }
    else $('#adminMsg').textContent = 'Mã chưa đúng.';
  },
  logout() {
    state.isAdmin = false;
    renderAdmin();
    renderSamples();
  },
  saveAdmin() {
    state.settings = { title: $('#setTitle').value || DEFAULT_SETTINGS.title, closingVi: $('#setVi').value, closingEn: $('#setEn').value };
    storage.set('settings', state.settings);
    applyTitle();
    buildEmail();
  }
};

function bindEvents() {
  // Một trình lắng nghe chung cho mọi nút có data-act
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const row = el.closest('[data-id]');
    actions[el.dataset.act](row ? row.dataset.id : null, el);
  });

  // Thay đổi thông tin thì thư tự cập nhật
  ['topic', 'role', 'lang', 'to', 'name', 'org', 'date', 'detail']
    .forEach((id) => $('#' + id).addEventListener('input', buildEmail));
  ['subject', 'body'].forEach((id) => $(`#${id}`).addEventListener('input', updateMailLink));

  $('#btnCopy').addEventListener('click', copyLetter);
  $('#btnSave').addEventListener('click', () => saveHistory());
  $('#btnPublish').addEventListener('click', publishSample);
  $('#search').addEventListener('input', renderSamples);
  $('#historyBtn').addEventListener('click', () => $('#history').classList.toggle('open'));
  $('#themeBtn').addEventListener('click', toggleTheme);
  $('#btnConnect').addEventListener('click', connectGmail);
  $('#btnDisconnect').addEventListener('click', disconnectGmail);
  $('#btnSend').addEventListener('click', () => sendEmail($('#sendTo').value, $('#sendCc').value));
  $('#btnTest').addEventListener('click', () => sendEmail(state.gmail.email, ''));
}

// Thanh lịch sử trượt ra khi phần Viết email chạm vào dải phía trên màn hình, trượt vào khi phần này đi khỏi
function watchComposeSection() {
  const observer = new IntersectionObserver(([entry]) => {
    $('#history').classList.toggle('show', entry.isIntersecting);
    $('#historyBtn').classList.toggle('show', entry.isIntersecting);
    if (!entry.isIntersecting) $('#history').classList.remove('open');
  }, { rootMargin: '-60px 0px -70% 0px' });   // chỉ xét dải từ 60px đến 30% chiều cao màn hình (tính từ trên)
  observer.observe($('#soan-thu'));
}

/* ---------- 10. KHỞI TẠO ---------- */

function applyTitle() {
  $('#siteTitle').textContent = state.settings.title;
  document.title = `${state.settings.title} - Viết email hoàn chỉnh`;
}

function init() {
  applyTheme(document.documentElement.dataset.theme);
  applyTitle();
  fillTopics();
  $('#date').value = todayISO();
  buildEmail();
  renderHistory();
  renderChips();
  renderSamples();
  renderAdmin();
  renderGmail();
  bindEvents();
  watchComposeSection();
}

init();
