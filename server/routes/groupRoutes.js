const express = require('express');
const groupRouter = express.Router();
const groupController = require('../controllers/groupController.js')
const { protect } = require('../middleware/authMiddleware.js')
const settlementController = require('../controllers/settlementController');

groupRouter.post('/', protect, groupController.createGroup)
groupRouter.get('/', protect, groupController.getMyGroups)

groupRouter.post('/:id/settle', protect, settlementController.settleUp);
groupRouter.get('/:id/settlements', protect, settlementController.getGroupSettlements);
groupRouter.post('/:id/members', protect, groupController.addMember)

groupRouter.get('/:id', protect, groupController.getGroupById)
groupRouter.delete("/:id", protect, groupController.deleteGroup);

module.exports = groupRouter;