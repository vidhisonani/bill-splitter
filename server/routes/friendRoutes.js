const express = require("express");
const friendRouter = express.Router();
const friendController = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

friendRouter.post("/request", protect, friendController.sendRequest);
friendRouter.get("/requests", protect, friendController.getRequests);
friendRouter.get("/requests/sent", protect, friendController.getSentRequests);
friendRouter.put("/requests/:id", protect, friendController.respondToRequest);
friendRouter.delete("/requests/:id", protect, friendController.cancelRequest);
friendRouter.get("/balances", protect, friendController.getFriendBalances);
friendRouter.get("/", protect, friendController.getFriends);

module.exports = friendRouter;