const express = require('express');
const router = express.Router();
const RecruitController = require('../controllers/RecruitController');

router.get('/:slug', RecruitController.getRecruitDetail);
router.get('/', RecruitController.getRecruitList);


module.exports = router;