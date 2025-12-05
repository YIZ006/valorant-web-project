const MapService = require("../../Services/MapService");

class MapController {
  static async index(req, res) {
    try {
      const maps = await MapService.listMaps();
      return res.json(maps);
    } catch (error) {
      console.error("❌ Lỗi khi truy vấn Maps:", error);
      return res.status(500).send("Lỗi khi truy vấn database");
    }
  }

  static async store(req, res) {
    const { map_name, description, layout_image_url } = req.body;
    if (!map_name || !description || !layout_image_url) {
      return res.status(400).send("Vui lòng nhập đầy đủ thông tin Map.");
    }

    try {
      await MapService.createMap({ map_name, description, layout_image_url });
      return res.send("✅ Thêm Map thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi thêm Map:", error);
      return res.status(500).send("Lỗi khi thêm Map.");
    }
  }

  static async update(req, res) {
    const { map_id } = req.params;
    const { map_name, description, layout_image_url } = req.body;

    try {
      await MapService.updateMap(map_id, { map_name, description, layout_image_url });
      return res.send("✅ Cập nhật Map thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật Map:", error);
      return res.status(500).send("Lỗi khi cập nhật Map.");
    }
  }

  static async destroy(req, res) {
    const { map_id } = req.params;
    try {
      await MapService.deleteMap(map_id);
      return res.send("🗑️ Đã xóa Map thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa Map:", error);
      return res.status(500).send("Lỗi khi xóa Map.");
    }
  }
}

module.exports = MapController;

