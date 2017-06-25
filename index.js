const dotenv = require('dotenv').config();

const logger = require('./_lib/logger');
const api = require('./_lib/api');

const WELL_KNOWN_FLAG = '--wk';

// Retrieve current project
const project = require(`./${process.env.PROJECT}`);

// Login
api.login(process.env.token, process.env.email, process.env.password)
  .then(({ token: userToken }) => {
    // List nodes
    return api.listNodes(userToken);
  })
  .then(({ nodes }) => {
    // Get first node
    return nodes.length > 0 ? nodes[0] : Promise.reject('node not found');
  })
  .then((node) => {
    // Check if node is online
    if (!node.online) return Promise.reject('node offline');
    return nodeReady(node, project, process.argv[2] === WELL_KNOWN_FLAG);
  })
  .catch(api.error);

/**
 * Node is ready.
 * Start project, pr print well-known.
 * @param {Object} node
 * @param {Module} project
 * @param {Boolean} printWellKnown - whether to print the well-known of the node
 */
function nodeReady(node, project, printWellKnown) {
  logger.verbose('node ready');

  // If requested, print well-known and return
  if (printWellKnown) {
    // Print well-known
    return api.getWellKnown(node.node_key)
      .then(({ well_known }) => {
        logger.info('well-known');
        for (let line of well_known) console.log(line);
      });
  }
  
  // Start project
  logger.info(`starting ${process.env.PROJECT}`);
  project.start(node);
}
