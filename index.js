var debug = require('debug')('gitevents-meetup');
var moment = require('moment');

var meetup = {};

meetup.config = null;

meetup.init = function(config) {
  if (!config) {
    return new Error('No configuration found');
  }

  this.config = config;
  this.meetup = require('meetup-api')({
    key: this.config.plugins.meetup.apikey
  });
};

meetup.create = function create(event) {
  return new Promise(function(resolve, reject) {
    debug('create');
    this.validateConfig();
    debug('Plugin enabled. Proceeding.');

    this.meetup.postEvent(
      buildEventParams(this.config, event),
      handlePostEventResponse(resolve, reject)
    );
  }.bind(this));
};

meetup.getRSVPs = function getRSVPs(eventId) {
  return new Promise(function(resolve, reject) {
    debug('getRsvps');
    this.validateConfig();
    debug('Plugin enabled. Proceeding.');

    this.meetup.getRSVPs(
      { event_id: eventId },
      handleGetRSVPsResponse(resolve, reject)
    );
  }.bind(this));
};

meetup.validateConfig = function() {
  if (!Boolean(this.config.plugins.meetup)) {
    debug('GitEvents meetup.com plugin is not configured!');
    throw new Error('Meetup plugin is not configured');
  }

  if (this.config.plugins.meetup.enabled !== true) {
    debug('Plugin disabled. Exiting.');
    throw new Error('Meetup plugin is disabeld');
  }
}

function buildEventParams(config, event) {
  var doorTime = resolveDoorTime(event);
  var duration = resolveDuration(event, doorTime);

  return {
    group_id: config.plugins.meetup.group_id,
    name: event.name,
    venue_visibility: 'public',
    hosts: config.plugins.meetup.hosts.join(','),
    group_urlname: event.organizer.url,
    simple_html_description: config.plugins.meetup.simple_html_description,
    time: doorTime.valueOf(),
    duration: duration.asMilliseconds(),
    publish_status: 'published',
    venue_id: resolveVenueId(event, config)
  };
}

function resolveDoorTime(event) {
  var doorTime = moment(event.startDate, 'YYYY-MM-DDTHH:mm:ss');
  doorTime.hour(event.doorTime.split(':')[0]);
  doorTime.minute(event.doorTime.split(':')[1]);

  return doorTime;
}

function resolveDuration(event, doorTime) {
  var startTime = moment(event.startDate, 'YYYY-MM-DDTHH:mm:ss');
  var differenceDoorStartTime = startTime.diff(doorTime);
  var duration = moment.duration(event.duration);
  duration.add(differenceDoorStartTime);

  return duration;
}

function resolveVenueId(event, config) {
  if (event.meetupVenueId) {
    return event.meetupVenueId;
  }

  return config.plugins.meetup.default_venue_id;
}

function handlePostEventResponse(resolve, reject) {
  return function(error, response) {
    debug('Meetup:postEvent()');
    if (error) {
      debug(error);
      return reject(error);
    }
    return resolve(response.id);
  }
}

function handleGetRSVPsResponse(resolve, reject) {
  return function(error, response) {
    debug('Meetup:getRSVPs()');
    if (error) {
      debug(error);
      return reject(error);
    }

    var rsvps = response.results.map(function(result) {
      return {
        name: result.member.name,
        response: result.response
      };
    });

    return resolve(rsvps);
  }
}

module.exports = exports = meetup;
