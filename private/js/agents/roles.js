async function loadRoles() {
    const res = await fetch("/api/roles");
    const roles = await res.json();
    const tbody = document.querySelector("#roleTable tbody");
    tbody.innerHTML = roles.map(a => `
      <tr>
        <td>${a.role_id}</td>
        <td>${a.role_name}</td>
        <td>${a.role_description}</td>
        <td>${a.role_icon_url}</td>
        <td>
          <button onclick="editRole(${a.role_id}, '${a.role_name}', '${a.role_description}', '${a.role_icon_url}')">Sửa</button>
          <button onclick="deleteRole(${a.role_id})">Xóa</button>
        </td>
      </tr>
    `).join("");
  }
  
  function editRole(role_id, role_name, role_description, role_icon_url) {
    document.querySelector("#edit_role_id").value = role_id;
    document.querySelector("#edit_role_name").value = role_name;
    document.querySelector("#edit_role_description").value = role_description;
    document.querySelector("#edit_role_icon_url").value = role_icon_url;
    document.querySelector("#editForm").style.display = "block";
  }
  
  function closeEditForm() {
    document.querySelector("#editForm").style.display = "none";
  }
  
  // Lưu thay đổi
  document.addEventListener("submit", async (e) => {
    if (e.target.id === "formEditRole") {
      e.preventDefault();
      const role_id = document.querySelector("#edit_role_id").value;
      const data = {
        role_name: document.querySelector("#edit_role_name").value.trim(),
        role_description: document.querySelector("#edit_role_description").value.trim(),
        role_icon_url: document.querySelector("#edit_role_icon_url").value.trim()
      };
      
      // Kiểm tra rỗng
      if (!data.role_name || !data.role_description || !data.role_icon_url) {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      try {
        const res = await fetch(`/api/role/${role_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        const msg = await res.text();
        if (res.ok) {
          alert("✅ " + msg);
          document.querySelector("#editForm").style.display = "none";
          loadRoles();
        } else {
          alert("❌ Lỗi khi cập nhật: " + msg);
        }
      } catch (err) {
        console.error("❌ Lỗi kết nối API:", err);
        alert("Không thể kết nối đến server!");
      }
    }
  });
  
  // Xóa role
  async function deleteRole(role_id) {
    if (confirm("Bạn có chắc muốn xóa role này không?")) {
      const res = await fetch(`/api/role/${role_id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Đã xóa thành công!");
        loadRoles();
      } else {
        alert("Lỗi khi xóa role!");
      }
    }
  }
  
  loadRoles();
  