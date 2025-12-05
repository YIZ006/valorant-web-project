const { pool } = require("../../config/database");

const WikiService = {
  async listPages() {
    const [rows] = await pool.query("SELECT * FROM Pages ORDER BY category, title");
    return rows;
  },

  async getPageById(pageId) {
    const [rows] = await pool.query("SELECT * FROM Pages WHERE page_id = ?", [pageId]);
    return rows[0];
  },

  async getPageByCategoryAndSlug(category, slug) {
    const [rows] = await pool.query("SELECT * FROM Pages WHERE category = ? AND slug = ?", [
      category,
      slug,
    ]);
    return rows[0];
  },

  async createRevision({ page_id, author, summary, content }) {
    return pool.query(
      "INSERT INTO Revisions (page_id, author, summary, content) VALUES (?, ?, ?, ?)",
      [page_id, author, summary, content]
    );
  },

  async updatePageContent(pageId, content) {
    return pool.query("UPDATE Pages SET content = ?, updated_at = NOW() WHERE page_id = ?", [
      content,
      pageId,
    ]);
  },
};

module.exports = WikiService;

