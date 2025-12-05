const { pool } = require("../../config/database");

const AgentService = {
  async listAgents() {
    const [rows] = await pool.query("SELECT * FROM agents");
    return rows;
  },

  async createAgent(agent) {
    const { agent_name, role_id, description, portrait_image_url } = agent;
    return pool.query(
      "INSERT INTO agents (agent_name, role_id, description, portrait_image_url) VALUES (?, ?, ?, ?)",
      [agent_name, role_id, description, portrait_image_url]
    );
  },

  async updateAgent(agentId, agent) {
    const { agent_name, role_id, description, portrait_image_url } = agent;
    return pool.query(
      "UPDATE agents SET agent_name = ?, role_id = ?, description = ?, portrait_image_url = ? WHERE agent_id = ?",
      [agent_name, role_id, description, portrait_image_url, agentId]
    );
  },

  async deleteAgent(agentId) {
    return pool.query("DELETE FROM agents WHERE agent_id = ?", [agentId]);
  },
};

module.exports = AgentService;

