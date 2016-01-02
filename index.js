var debug = require('debug')('gitevents-meetup');
var moment = require('moment');
var meetup = {};
var config;

meetup.init = function(cfg) {
  if (!cfg) {
    return new Error('No configuration found');
  } else {
    config = cfg;
  }
};

meetup.create = function create(event) {
  return new Promise(function(resolve, reject) {
    if (!config.plugins.meetup) {
      debug('GitEvents meetup.com plugin is not activated. Please provide an API key.');
      reject(new Error('no api key'));
    }

    var meetup = require('meetup-api')({
      key: config.plugins.meetup.apikey
    });

    if (config.plugins.meetup.enabled === true) {
      debug('create');

      var doorTime = moment(event.startDate, 'YYYY-MM-DDTHH:mm:ss');
      var startTime = moment(event.startDate, 'YYYY-MM-DDTHH:mm:ss');
      doorTime.hour(event.doorTime.split(':')[0]);
      doorTime.minute(event.doorTime.split(':')[1]);
      var differenceDoorStartTime = startTime.diff(doorTime);

      var duration = moment.duration(event.duration);
      duration.add(differenceDoorStartTime);
      var meetupVenueId;

      if (event.meetupVenueId) {
        meetupVenueId = event.meetupVenueId;
      } else {
        meetupVenueId = config.plugins.meetup.default_venue_id;
      }

      meetup.postEvent({
        group_id: config.plugins.meetup.group_id,
        name: event.name,
        venue_visibility: 'public',
        hosts: config.plugins.meetup.hosts.join(','),
        group_urlname: event.organizer.url,
        simple_html_description: config.plugins.meetup.simple_html_description,
        time: doorTime.valueOf(),
        duration: duration.asMilliseconds(),
        publish_status: 'published',
        venue_id: meetupVenueId
      }, function(error, response) {
        if (error) {
          return reject(error);
        }
        return resolve(response.id);
      });
    } else {
      return resolve('meetup plugin is disabeld.');
    }
  });
};

module.exports = exports = meetup;
