const WikiService = require("../../Services/WikiService");

class WikiController {
  static async index(req, res) {
    try {
      const pages = await WikiService.listPages();
      return res.render("wiki_list", { pages });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trang:", error);
      return res.status(500).send("Lỗi server");
    }
  }

  static async show(req, res) {
    const { category, slug } = req.params;
    try {
      const page = await WikiService.getPageByCategoryAndSlug(category, slug);
      if (!page) {
        return res.status(404).send("Trang không tồn tại");
      }
      return res.render("wiki_page", { page });
    } catch (error) {
      console.error("Lỗi khi truy vấn Pages:", error);
      return res.status(500).send("Lỗi server");
    }
  }

  static async editForm(req, res) {
    const { id } = req.params;
    try {
      const page = await WikiService.getPageById(id);
      if (!page) {
        return res.status(404).send("Không tìm thấy trang!");
      }
      return res.render("edit_page", { page });
    } catch (error) {
      console.error("Lỗi khi lấy trang:", error);
      return res.status(500).send("Lỗi server");
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { content, summary } = req.body;

    try {
      const page = await WikiService.getPageById(id);
      if (!page) {
        return res.status(404).send("Không tìm thấy trang!");
      }

      await WikiService.createRevision({
        page_id: page.page_id,
        author: req.session.user.username,
        summary: summary || "Cập nhật nội dung",
        content,
      });

      await WikiService.updatePageContent(page.page_id, content);
      return res.redirect(`/wiki/${page.category}/${page.slug}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trang:", error);
      return res.status(500).send("Lỗi server");
    }
  }
}

module.exports = WikiController;

