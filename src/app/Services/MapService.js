const { pool } = require("../../config/database");

const MapService = {
  async listMaps() {
    const [rows] = await pool.query("SELECT * FROM maps");
    return rows;
  },

  async createMap(map) {
    const { map_name, description, layout_image_url } = map;
    return pool.query(
      "INSERT INTO maps (map_name, description, layout_image_url) VALUES (?, ?, ?)",
      [map_name, description, layout_image_url]
    );
  },

  async updateMap(mapId, map) {
    const { map_name, description, layout_image_url } = map;
    return pool.query(
      "UPDATE maps SET map_name = ?, description = ?, layout_image_url = ? WHERE map_id = ?",
      [map_name, description, layout_image_url, mapId]
    );
  },

  async deleteMap(mapId) {
    return pool.query("DELETE FROM maps WHERE map_id = ?", [mapId]);
  },
};

module.exports = MapService;

