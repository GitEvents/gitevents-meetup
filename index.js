var
  debug = require('debug')('gitevents-meetup');

module.exports = function(config) {
  if (!config) {
    return new Error('No configuration found');
  }

  return function process(payload) {
    return new Promise(
      function(resolve, reject) {
        if (!config.meetup) {
          debug('GitEvents meetup.com plugin is not activated. Please provide an API key.');
          reject(new Error('no api key'));
        }

        var meetup = require('meetup-api')({
          key: config.meetup.token
        });

        debug('starting meetup process.');
        if (payload.type === 'proposal') {
          debug('proposal. do nothing for now.');
          // do nothing for now
          resolve();
        }

        if (payload.type === 'event') {
          debug('do something');
          meetup.getEvents({
            'group_urlname': config.meetup.groupname
          }, function(error, response) {
            if (!error) {
              console.log(response);
            }
            resolve(payload);
          });
        }
      }
    );
  };
};
