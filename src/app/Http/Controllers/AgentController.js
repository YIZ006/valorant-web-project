const AgentService = require("../../Services/AgentService");

class AgentController {
  static async index(req, res) {
    try {
      const agents = await AgentService.listAgents();
      return res.json(agents);
    } catch (error) {
      console.error("❌ Lỗi khi truy vấn Agents:", error);
      return res.status(500).send("Lỗi khi truy vấn database");
    }
  }

  static async store(req, res) {
    const { agent_name, role_id, description, portrait_image_url } = req.body;
    if (!agent_name || !role_id || !description || !portrait_image_url) {
      return res.status(400).send("Vui lòng nhập đầy đủ thông tin Agent.");
    }

    try {
      await AgentService.createAgent({ agent_name, role_id, description, portrait_image_url });
      return res.send("✅ Thêm Agent thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi thêm Agent:", error);
      return res.status(500).send("Lỗi khi thêm Agent.");
    }
  }

  static async update(req, res) {
    const { agent_id } = req.params;
    const { agent_name, role_id, description, portrait_image_url } = req.body;

    try {
      await AgentService.updateAgent(agent_id, { agent_name, role_id, description, portrait_image_url });
      return res.send("✅ Cập nhật Agent thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật Agent:", error);
      return res.status(500).send("Lỗi khi cập nhật Agent.");
    }
  }

  static async destroy(req, res) {
    const { agent_id } = req.params;
    try {
      await AgentService.deleteAgent(agent_id);
      return res.send("🗑️ Đã xóa Agent thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa Agent:", error);
      return res.status(500).send("Lỗi khi xóa Agent.");
    }
  }
}

module.exports = AgentController;

