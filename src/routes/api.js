const express = require("express");

const AdminController = require("../app/Http/Controllers/AdminController");
const AgentController = require("../app/Http/Controllers/AgentController");
const RoleController = require("../app/Http/Controllers/RoleController");
const MapController = require("../app/Http/Controllers/MapController");
const { ensureApiAuthenticated } = require("../app/Http/Middlewares/auth");

const router = express.Router();

// Admin
router.get("/admin/me", ensureApiAuthenticated, AdminController.me);
router.get("/admin", ensureApiAuthenticated, AdminController.index);
router.put("/admin/:admin_id", ensureApiAuthenticated, AdminController.update);
router.delete("/admin/:admin_id", ensureApiAuthenticated, AdminController.destroy);

// Agents
router.get("/agents", ensureApiAuthenticated, AgentController.index);
router.post("/agents", ensureApiAuthenticated, AgentController.store);
router.put("/agents/:agent_id", ensureApiAuthenticated, AgentController.update);
router.delete("/agents/:agent_id", ensureApiAuthenticated, AgentController.destroy);

// Roles
router.get("/roles", ensureApiAuthenticated, RoleController.index);
router.post("/roles", ensureApiAuthenticated, RoleController.store);
router.put("/roles/:role_id", ensureApiAuthenticated, RoleController.update);
router.delete("/roles/:role_id", ensureApiAuthenticated, RoleController.destroy);

// Maps
router.get("/maps", ensureApiAuthenticated, MapController.index);
router.post("/maps", ensureApiAuthenticated, MapController.store);
router.put("/maps/:map_id", ensureApiAuthenticated, MapController.update);
router.delete("/maps/:map_id", ensureApiAuthenticated, MapController.destroy);

module.exports = router;

