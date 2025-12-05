const express = require("express");
const AuthController = require("../app/Http/Controllers/AuthController");
const WikiController = require("../app/Http/Controllers/WikiController");
const AdminPageController = require("../app/Http/Controllers/AdminPageController");
const LandingController = require("../app/Http/Controllers/LandingController");
const { ensureAuthenticated } = require("../app/Http/Middlewares/auth");

const router = express.Router();

// Admin pages
router.get("/login", AdminPageController.loginForm);
router.get("/login.html", AdminPageController.loginForm);

router.get("/register", AdminPageController.registerForm);
router.get("/register.html", AdminPageController.registerForm);

router.get("/dashboard", ensureAuthenticated, AdminPageController.dashboard);
router.get("/dashboard.html", ensureAuthenticated, AdminPageController.dashboard);

router.get("/pages/:name", ensureAuthenticated, AdminPageController.pageFragment);

// Auth routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/logout", AuthController.logout);

// Wiki routes
router.get("/wiki", WikiController.index);
router.get("/wiki/edit/:id", ensureAuthenticated, WikiController.editForm);
router.post("/wiki/edit/:id", ensureAuthenticated, WikiController.update);
router.get("/wiki/:category/:slug", WikiController.show);

// Home
router.get("/", LandingController.home);
router.get("/index.html", LandingController.home);

module.exports = router;

