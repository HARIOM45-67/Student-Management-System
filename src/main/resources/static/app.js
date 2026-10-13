const API = "/api/students";
const $ = id => document.getElementById(id);
let students = [];
let toastTimer;

async function request(url, options = {}) {
  const response = await fetch(url, {headers: {"Content-Type":"application/json", ...(options.headers||{})}, ...options});
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const body = await response.json(); message = body.message || body.detail || message; } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}
function notify(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2800);
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
async function loadStudents() {
  const search = $("search").value.trim();
  try {
    students = await request(API + (search ? "?search=" + encodeURIComponent(search) : ""));
    render();
  } catch (e) {
    $("studentRows").innerHTML = `<tr><td colspan="5" class="empty">${esc(e.message)}. Check that MySQL and the Spring Boot app are running.</td></tr>`;
    $("count").textContent = "Could not load records";
  }
}
function render() {
  const all = students;
  $("total").textContent = all.length;
  $("active").textContent = all.filter(s => (s.status || "Active") === "Active").length;
  $("courses").textContent = new Set(all.map(s => (s.course || "").trim()).filter(Boolean)).size;
  $("count").textContent = `${all.length} student${all.length === 1 ? "" : "s"} shown`;
  if (!all.length) {
    $("studentRows").innerHTML = '<tr><td colspan="5" class="empty">No students found. Add your first student to get started.</td></tr>';
    return;
  }
  $("studentRows").innerHTML = all.map(s => {
    const initials = (s.name || "?").trim().split(/\s+/).slice(0,2).map(p=>p[0]).join("").toUpperCase();
    const status = s.status || "Active";
    return `<tr>
      <td><div class="student-name"><div class="mini-avatar">${esc(initials)}</div><div>${esc(s.name)}<small>${esc(s.email)}</small></div></div></td>
      <td>${esc(s.course || "—")}<small style="display:block;color:#9ba2b1;margin-top:4px">${esc(s.department || "—")}</small></td>
      <td>${s.yearOfStudy ? `Year ${esc(s.yearOfStudy)}` : "—"}</td>
      <td><span class="pill ${status === "Active" ? "" : "inactive"}">${esc(status)}</span></td>
      <td><div class="actions"><button class="action" data-edit="${s.id}">Edit</button><button class="action delete" data-delete="${s.id}">Delete</button></div></td>
    </tr>`;
  }).join("");
}
function openModal(student) {
  $("studentForm").reset(); $("formError").textContent = "";
  $("studentId").value = student?.id || "";
  $("modalHeading").textContent = student ? "Edit student" : "Add student";
  $("saveBtn").textContent = student ? "Update student" : "Save student";
  $("name").value = student?.name || "";
  $("email").value = student?.email || "";
  $("phone").value = student?.phone || "";
  $("course").value = student?.course || "";
  $("department").value = student?.department || "";
  $("year").value = student?.yearOfStudy || "";
  $("status").value = student?.status || "Active";
  $("modal").hidden = false;
  $("name").focus();
}
function closeModal() { $("modal").hidden = true; }
$("addBtn").addEventListener("click", () => openModal());
$("closeModal").addEventListener("click", closeModal);
$("cancelBtn").addEventListener("click", closeModal);
$("modal").addEventListener("click", e => { if (e.target === $("modal")) closeModal(); });
$("refresh").addEventListener("click", loadStudents);
let searchTimer;
$("search").addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(loadStudents, 250); });
$("studentRows").addEventListener("click", async e => {
  const edit = e.target.closest("[data-edit]");
  const del = e.target.closest("[data-delete]");
  if (edit) {
    const student = students.find(s => s.id === Number(edit.dataset.edit));
    if (student) openModal(student);
  }
  if (del) {
    const id = Number(del.dataset.delete);
    const student = students.find(s => s.id === id);
    if (!confirm(`Delete ${student?.name || "this student"}? This cannot be undone.`)) return;
    try { await request(`${API}/${id}`, {method:"DELETE"}); notify("Student deleted"); await loadStudents(); }
    catch (err) { notify(err.message); }
  }
});
$("studentForm").addEventListener("submit", async e => {
  e.preventDefault(); $("formError").textContent = "";
  const id = $("studentId").value;
  const payload = {
    name:$("name").value.trim(), email:$("email").value.trim(), phone:$("phone").value.trim(),
    course:$("course").value.trim(), department:$("department").value.trim(),
    yearOfStudy:$("year").value ? Number($("year").value) : null, status:$("status").value
  };
  try {
    await request(id ? `${API}/${id}` : API, {method:id ? "PUT" : "POST", body:JSON.stringify(payload)});
    closeModal(); notify(id ? "Student updated successfully" : "Student added successfully"); await loadStudents();
  } catch (err) { $("formError").textContent = err.message || "Could not save student."; }
});
loadStudents();
