const express = require('express');
const router = express.Router();
const teamMemberController = require('../controllers/teamMemberController');

router.post('/create', teamMemberController.createTeamMember);
router.get('/fetchAll', teamMemberController.getAllTeamMembers);
router.get('/:id', teamMemberController.getTeamMemberById);
router.put('/:id', teamMemberController.updateTeamMember);
router.delete('/:id', teamMemberController.deleteTeamMember);

module.exports = router;
