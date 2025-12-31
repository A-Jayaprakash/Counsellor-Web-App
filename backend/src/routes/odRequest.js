const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const {
  createODRequest,
  getODRequests,
  getODRequestById,
  updateODRequest,
  deleteODRequest,
  approveODRequest,
  rejectODRequest,
  getODStats,
} = require("../controllers/odRequestController");

// All routes require authentication
router.use(authMiddleware);

// GET /api/od-requests/stats - Get OD statistics
router.get("/stats", getODStats);

// POST /api/od-requests - Create new OD request (Student only)
router.post("/", rbacMiddleware("student"), createODRequest);

// GET /api/od-requests - Get all OD requests (filtered by role)
router.get("/", getODRequests);

// GET /api/od-requests/:id - Get single OD request
router.get("/:id", getODRequestById);

// PUT /api/od-requests/:id - Update OD request (Student, pending only)
router.put("/:id", rbacMiddleware("student"), updateODRequest);

// DELETE /api/od-requests/:id - Delete OD request (Student, pending only)
router.delete("/:id", rbacMiddleware("student"), deleteODRequest);

// POST /api/od-requests/:id/approve - Approve OD request (Counsellor only)
router.post(
  "/:id/approve",
  rbacMiddleware("counsellor", "admin"),
  approveODRequest
);

// POST /api/od-requests/:id/reject - Reject OD request (Counsellor only)
router.post(
  "/:id/reject",
  rbacMiddleware("counsellor", "admin"),
  rejectODRequest
);

module.exports = router;
