const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/claimController');

router.post('/', protect, c.createClaim);
router.get('/', protect, c.getClaims);

router.put('/:id/review', protect, adminOnly, c.reviewClaim);

module.exports = router;
