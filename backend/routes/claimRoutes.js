const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/claimController');

router.post('/', protect, c.createClaim);
router.get('/', protect, c.getClaims);
router.put('/:id/review', protect, authorize('admin', 'staff'), c.reviewClaim);

module.exports = router;

const Router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/claimController');

router.post('/', protect, c.createClaim);
router.get('/', protect, c.getClaims);
router.put('/:id/review', protect, authorize('admin', 'staff'), c.reviewClaim);

module.exports = router;

