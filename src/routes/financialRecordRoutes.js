const express = require("express");
const financialRecordController = require("../controllers/financialRecordController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { recordValidators } = require("../middleware/validate");

const router = express.Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("viewer", "analyst", "admin"), financialRecordController.listRecords);
router.get("/:id", authorizeRoles("viewer", "analyst", "admin"), financialRecordController.getRecordById);

router.post(
  "/",
  authorizeRoles("analyst", "admin"),
  recordValidators.createOrUpdate,
  financialRecordController.createRecord
);
router.patch(
  "/:id",
  authorizeRoles("analyst", "admin"),
  recordValidators.createOrUpdate,
  financialRecordController.updateRecord
);
router.delete("/:id", authorizeRoles("admin"), financialRecordController.deleteRecord);

module.exports = router;
