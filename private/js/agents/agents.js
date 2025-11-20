async function loadAgents() {
    const res = await fetch("/api/agents");
    const agents = await res.json();
    const tbody = document.querySelector("#agentsTable tbody");
    tbody.innerHTML = agents.map(a => `
      <tr>
        <td>${a.agent_id}</td>
        <td>${a.agent_name}</td>
        <td>${a.role_id}</td>
        <td>${a.description}</td>
        <td>${a.portrait_image_url}</td>
        <td>
          <button onclick="editAgents(${a.agent_id}, '${a.agent_name}', '${a.role_id}', '${a.description}', '${a.portrait_image_url}')">✏️ Sửa</button>
          <button onclick="deleteAgents(${a.agent_id})">🗑️ Xóa</button>
        </td>
      </tr>
    `).join("");
  }
  
  // Hiện form sửa
  function editAgents(agent_id, agent_name, role_id, description, portrait_image_url) {
    document.querySelector("#edit_id").value = agent_id;
    document.querySelector("#edit_agent_name").value = agent_name;
    document.querySelector("#edit_role_id").value = role_id;
    document.querySelector("#edit_description").value = description;
    document.querySelector("#edit_portrait_image_url").value = portrait_image_url;
    document.querySelector("#editForm").style.display = "block";
  }
  
  // Ẩn form sửa
  function closeEditForm() {
    document.querySelector("#editForm").style.display = "none";
  }
  
  // ----------------- 🆕 Nút mở/đóng form thêm -----------------
  document.getElementById("btnShowAdd").addEventListener("click", () => {
    document.getElementById("addForm").style.display = "block";
  });
  document.getElementById("btnCancelAdd").addEventListener("click", () => {
    document.getElementById("addForm").style.display = "none";
  });
  
  // ----------------- 🧩 Submit thêm Agent -----------------
  document.querySelector("#formAddAgents").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const data = {
      agent_name: document.querySelector("#add_agent_name").value.trim(),
      role_id: document.querySelector("#add_role_id").value.trim(),
      description: document.querySelector("#add_description").value.trim(),
      portrait_image_url: document.querySelector("#add_portrait_image_url").value.trim()
    };
  
    if (!data.agent_name || !data.role_id || !data.description || !data.portrait_image_url) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  
    if (res.ok) {
      alert("✅ Thêm Agent thành công!");
      e.target.reset();
      document.getElementById("addForm").style.display = "none";
      loadAgents();
    } else {
      const errText = await res.text();
      alert("❌ Lỗi khi thêm Agent: " + errText);
    }
  });
  // ================== SỬA AGENTS ==================
document.addEventListener("submit", async (e) => {
    // Đảm bảo chỉ xử lý form sửa
    if (e.target.id === "formEditAgents") {
      e.preventDefault();
  
      const agent_id = document.querySelector("#edit_id").value;
      const data = {
        agent_name: document.querySelector("#edit_agent_name").value.trim(),
        role_id: document.querySelector("#edit_role_id").value.trim(),
        description: document.querySelector("#edit_description").value.trim(),
        portrait_image_url: document.querySelector("#edit_portrait_image_url").value.trim()
      };
  
      // Kiểm tra rỗng
      if (!data.agent_name || !data.role_id || !data.description || !data.portrait_image_url) {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
        return;
      }
  
      try {
        const res = await fetch(`/api/agent/${agent_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        const msg = await res.text();
        if (res.ok) {
          alert("✅ " + msg);
          document.querySelector("#editForm").style.display = "none";
          loadAgents();
        } else {
          alert("❌ Lỗi khi cập nhật: " + msg);
        }
      } catch (err) {
        console.error("❌ Lỗi kết nối API:", err);
        alert("Không thể kết nối đến server!");
      }
    }
  });
  
  
  // ----------------- Xóa Agent -----------------
  async function deleteAgents(agent_id) {
    if (confirm("Bạn có chắc muốn xóa Agent này không?")) {
      const res = await fetch(`/api/agent/${agent_id}`, { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ Đã xóa thành công!");
        loadAgents();
      } else {
        alert("❌ Lỗi khi xóa Agent!");
      }
    }
  }
  
  loadAgents();