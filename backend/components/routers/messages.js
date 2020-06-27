const router = require('express').Router();

module.exports = function (config, messageService, databaseService) {

  router.get('/alive', function (req, res) {
    res.send("alive")
  });

  router.post('/msg', function (req, res) {
    const msg = {
      message: req.body.message,
      timestamp: Date.now()
    }
    console.log("sending: " + JSON.stringify(msg))

    if (messageService != undefined && messageService != null) {
      messageService.publishToExchange(req.body.routingKey, JSON.stringify(msg));
      res.status(200).send({
        result: "success",
        message: msg
      });
    } else {
      res.status(500).send({
        result: "failure",
        message: msg
      });
    }
  });

  router.get('/all', function (req, res) {
    databaseService.getDB().collection("messages").find({}).sort({ timestamp: -1 }).toArray(function (err, result) {
      if (err) {
        res.status(501).send({
          result: "failure",
          message: "database error",
          error: err
        });
      } else {
        res.status(200).send({
          result: "success",
          data: result
        });
      }
    });
  });

  return router;
}