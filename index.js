const dotenv = require('dotenv').config();
const logger = require('./_lib/logger');
const api = require('./_lib/api');

// Retrieve current project
const project = require(`./${process.env.PROJECT}`);

// Login
api.login(process.env.email, process.env.password)
  .then(({ token: userToken }) => {
    // List nodes
    return api.listNodes(userToken);
  })
  .then(({ nodes }) => {
    // Get first node
    return nodes.length > 0 ? nodes[0] : Promise.reject('node not found');
  })
  .then(node => {
    // Start current project
    if (node.online) {
      logger.info('node ready');
      logger.info(`starting ${process.env.PROJECT}`);
      project.start(node);
    } else {
      return Promise.reject('node offline');
    }
  })
  .catch(error => {
    // Catch all errors
    logger.error(error);
  });


