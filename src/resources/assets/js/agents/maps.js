async function loadMaps() {
    const res = await fetch("/api/maps");
    const maps = await res.json();
    const tbody = document.querySelector("#MapsTable tbody");
    tbody.innerHTML = maps.map(a => `
      <tr>
        <td>${a.map_id}</td>
        <td>${a.map_name}</td>
        <td>${a.description}</td>
        <td>${a.layout_image_url}</td>
        <td>
          <button onclick="editmap(${a.map_id}, '${a.map_name}', '${a.description}', '${a.layout_image_url}')">Sửa</button>
          <button onclick="deletemap(${a.map_id})">Xóa</button>
        </td>
      </tr>
    `).join("");
  }
  
  function editMap(map_id, map_name, description, layout_image_url) {
    document.querySelector("#edit_map_id").value = map_id;
    document.querySelector("#edit_map_name").value = map_name;
    document.querySelector("#edit_description").value = description;
    document.querySelector("#edit_layout_image_url").value = layout_image_url;
    document.querySelector("#editForm").style.display = "block";
  }
  
  function closeEditForm() {
    document.querySelector("#editForm").style.display = "none";
  }
  
  // Lưu thay đổi
  document.addEventListener("submit", async (e) => {
    if (e.target.id === "formEditMap") {
      e.preventDefault();
      const map_id = document.querySelector("#edit_map_id").value;
      const data = {
        map_name: document.querySelector("#edit_map_name").value.trim(),
        description: document.querySelector("#edit_description").value.trim(),
        map_icon_url: document.querySelector("#edit_map_icon_url").value.trim()
      };
      
      // Kiểm tra rỗng
      if (!data.map_name || !data.description || !data.layout_image_url) {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      try {
        const res = await fetch(`/api/map/${map_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        const msg = await res.text();
        if (res.ok) {
          alert("✅ " + msg);
          document.querySelector("#editForm").style.display = "none";
          loadMaps();
        } else {
          alert("❌ Lỗi khi cập nhật: " + msg);
        }
      } catch (err) {
        console.error("❌ Lỗi kết nối API:", err);
        alert("Không thể kết nối đến server!");
      }
    }
  });
  
  // Xóa map
  async function deletemap(map_id) {
    if (confirm("Bạn có chắc muốn xóa map này không?")) {
      const res = await fetch(`/api/map/${map_id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Đã xóa thành công!");
        loadMaps();
      } else {
        alert("Lỗi khi xóa map!");
      }
    }
  }
  // ----------------- 🆕 Nút mở/đóng form thêm -----------------
  document.getElementById("btnShowAdd").addEventListener("click", () => {
    document.getElementById("addForm").style.display = "block";
  });
  document.getElementById("btnCancelAdd").addEventListener("click", () => {
    document.getElementById("addForm").style.display = "none";
  });
  // ----------------- 🧩 Submit thêm Agent -----------------
  document.querySelector("#formAddMaps").addEventListener("submit", async (e) => {
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
  loadMaps();
  