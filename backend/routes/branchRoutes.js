// backend\routes\branchRoutes.js
const express = require('express');
const router = express.Router();
const { auth, restrictToBranch } = require('../middleware/auth');
const { getBranches, createBranch, updateBranch, deleteBranch } = require('../controllers/branchController');

router.use(auth);
router.use(restrictToBranch);
router.get('/', getBranches);
router.post('/', createBranch);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

module.exports = router;