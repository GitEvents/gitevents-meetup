var
  debug = require('debug')('gitevents-meetup');

module.exports = function(config) {
  if (!config) {
    return new Error('No configuration found');
  }

  if (!config.meetup) {
    return {
      process: function(payload) {
        debug('GitEvents meetup.com plugin is not activated. Please provide an API key.');
        return new Error('no api key');
      }
    };
  } else {
    var meetup = require('meetup-api')({
      key: config.meetup.token
    });

    return {
      process: function(payload) {
        debug('starting meetup process.');

        if (payload.type === 'proposal') {
          debug('proposal. do nothing for now.');
          // do nothing for now
          return null;
        }

        if (payload.type === 'event') {

        }
      }
    };
  }
};
