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

        debug('starting meetup plugin.');
        if (payload.type === 'proposal') {
          debug('proposal. do nothing for now.');
          // do nothing for now
          resolve();
        }

        if (payload.type === 'event') {
          var eventDescription = '';
          payload.talks.forEach(function(talk) {
            eventDescription += '<h2>' + talk.title + '</h2>';
            eventDescription += '<span><em>by ' + talk.speaker.name + '</em></span><br />';
            eventDescription += talk.description;

            eventDescription += '<p>';
            if (talk.language) {
              eventDescription += '<br /><span><em>Language: ' + talk.language + '</em>';
            }

            if (talk.level) {
              eventDescription += '<br /<span><em>Level: ' + talk.level + '</em></span>';
            }

            if (config.url) {
              eventDescription += '<br /><span><em><a href="' +
                config.url + '/talks/' + talk.id +
                '">View this talk on our website</span></em>';
            }
            eventDescription += '</p>';
          });

          if (payload.meetup_id) {
            debug('Updating meetup event.');
            meetup.editEvent({});
          } else {
            debug('Creating meetup event.');
            meetup.postEvent({
              group_id: config.meetup.group_id,
              name: payload.name,
              description: eventDescription,
              time: new Date(payload.date).getTime(),
              duration: config.meetup.duration,
              publish_status: 'draft',
              venue_id: config.meetup.default_venue_id
            }, function(error, response) {
              console.log(error);
              if (!error) {
                console.log(error, response);
                console.log(response.results);
              }
              resolve(payload);
            });
          }
        }
      }
    );
  };
};
