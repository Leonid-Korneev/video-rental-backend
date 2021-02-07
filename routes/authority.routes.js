const Router = require('express');
const router = new Router();
const authorityController = require('../controller/authority.controller');

router.post('/authority', authorityController.createAuthority);
router.put('/authority', authorityController.updateAuthority);
router.get('/authority', authorityController.getAuthoritiesList);
router.delete('/authority/:id', authorityController.deleteAuthority);

module.exports = router;