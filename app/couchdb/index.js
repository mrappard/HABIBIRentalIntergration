'use strict';

const logger = require('../config/').logger;

const agentkeepalive = require('agentkeepalive');
const myagent = new agentkeepalive({
  maxSockets: 50,
  maxKeepAliveRequests: 0,
  maxKeepAliveTime: 30000
});

const couch = require('nano')({
    url: 'http://localhost:5984/',
    requestDefaults : { 'agent' : myagent },
    db: 'testa'
  });

exports.createDatabase = (name) => {
    couch.createDatabase(name)
        .then((done) => {
            logger.info(done);
        })
        .catch((err) => {
            logger.error(err);
        });    
};

module.exports = couch;