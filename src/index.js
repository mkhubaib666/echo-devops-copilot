require('dotenv').config();
const pullRequestHandler = require('./handlers/pullRequestHandler');

/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // ^^^ THE FIX IS HERE: "module.exports" instead of "module.eports"

  app.log.info('Echo DevOps Co-pilot is running!');

  // Register the handler for pull request events
  app.on(['pull_request.opened', 'pull_request.synchronize'], (context) =>
    pullRequestHandler(context)
  );
};