const { AdminController } = require('../../controllers/admin');

module.exports = function (router) {

  router.get('/check', AdminController.apiCheckDNS);
  router.get('/check-and-update', AdminController.apiCheckAndUpdateDNS);

  return router;

};
