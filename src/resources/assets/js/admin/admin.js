async function loadAdmins() {
  const res = await fetch("/api/admin");
  const admins = await res.json();
  const tbody = document.querySelector("#adminTable tbody");
  tbody.innerHTML = admins.map(a => `
    <tr>
      <td>${a.admin_id}</td>
      <td>${a.username}</td>
      <td>${a.email}</td>
      <td>${a.phone}</td>
      <td>${a.quyen}</td>
      <td>${new Date(a.date).toLocaleDateString()}</td>
      <td>
        <button onclick="editAdmin(${a.admin_id}, '${a.username}', '${a.email}', '${a.phone}', '${a.quyen}')">Sửa</button>
        <button onclick="deleteAdmin(${a.admin_id})">Xóa</button>
      </td>
    </tr>
  `).join("");
}

function editAdmin(id, username, email, phone, quyen) {
  document.querySelector("#edit_id").value = id;
  document.querySelector("#edit_username").value = username;
  document.querySelector("#edit_email").value = email;
  document.querySelector("#edit_phone").value = phone;
  document.querySelector("#edit_quyen").value = quyen;
  document.querySelector("#editForm").style.display = "block";
}

function closeEditForm() {
  document.querySelector("#editForm").style.display = "none";
}

// Lưu thay đổi
document.addEventListener("submit", async (e) => {
  if (e.target.id === "formEditAdmin") {
    e.preventDefault();
    const id = document.querySelector("#edit_id").value;
    const data = {
      username: document.querySelector("#edit_username").value,
      email: document.querySelector("#edit_email").value,
      phone: document.querySelector("#edit_phone").value,
      quyen: document.querySelector("#edit_quyen").value
    };
    const res = await fetch(`/api/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert("Cập nhật thành công!");
      document.querySelector("#editForm").style.display = "none";
      loadAdmins();
    } else {
      alert("Lỗi khi cập nhật!");
    }
  }
});

// Xóa admin
async function deleteAdmin(id) {
  if (confirm("Bạn có chắc muốn xóa admin này không?")) {
    const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Đã xóa thành công!");
      loadAdmins();
    } else {
      alert("Lỗi khi xóa admin!");
    }
  }
}

loadAdmins();
