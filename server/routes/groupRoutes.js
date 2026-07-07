const express = require('express');
const groupRouter = express.Router();
const groupController = require('../controllers/groupController.js')
const { protect } = require('../middleware/authMiddleware.js')

groupRouter.post('/', protect, groupController.createGroup)
groupRouter.get('/', protect, groupController.getMyGroups)
groupRouter.get('/:id', protect, groupController.getGroupById)
groupRouter.post('/:id/members', protect, groupController.addMember)
groupRouter.delete("/:id", protect, groupController.deleteGroup);

module.exports = groupRouter;