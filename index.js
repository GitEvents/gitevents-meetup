var debug = require('debug')('gitevents-meetup');
var moment = require('moment');
var meetup = {};
var config;

meetup.config = null;

meetup.init = function(cfg) {
  if (!cfg) {
    return new Error('No configuration found');
  } else {
    this.config = cfg;
    this.meetup = require('meetup-api')({
      key: this.config.plugins.meetup.apikey
    });
  }
};

meetup.create = function create(event) {
  return new Promise(function(resolve, reject) {
    debug('create');

    if (!isConfigured(this.config)) {
      debug('GitEvents meetup.com plugin is not configured!');
      reject(new Error('Meetup plugin is not configured'));
      return;
    }

    if (!isEnabled(this.config)) {
      debug('Plugin disabled. Exiting.');
      reject(new Error('Meetup plugin is disabeld'));
      return;
    }

    debug('Plugin enabled. Proceeding.');

    var doorTime = moment(event.startDate, 'YYYY-MM-DDTHH:mm:ss');
    var startTime = moment(event.startDate, 'YYYY-MM-DDTHH:mm:ss');
    doorTime.hour(event.doorTime.split(':')[0]);
    doorTime.minute(event.doorTime.split(':')[1]);
    var differenceDoorStartTime = startTime.diff(doorTime);

    var duration = moment.duration(event.duration);
    duration.add(differenceDoorStartTime);

    var meetupVenueId = resolveVenueId(event, this.config);

    this.meetup.postEvent({
      group_id: this.config.plugins.meetup.group_id,
      name: event.name,
      venue_visibility: 'public',
      hosts: this.config.plugins.meetup.hosts.join(','),
      group_urlname: event.organizer.url,
      simple_html_description: this.config.plugins.meetup.simple_html_description,
      time: doorTime.valueOf(),
      duration: duration.asMilliseconds(),
      publish_status: 'published',
      venue_id: meetupVenueId
    }, function(error, response) {
      debug('Meetup:postEvent()');
      if (error) {
        debug(error);
        return reject(error);
      }
      return resolve(response.id);
    });
  }.bind(this));
};

meetup.getRSVPs = function getRSVPs(eventId) {
  return new Promise(function(resolve, reject) {
    debug('getRsvps');

    if (!isConfigured(this.config)) {
      debug('GitEvents meetup.com plugin is not configured!');
      reject(new Error('Meetup plugin is not configured'));
      return;
    }

    if (!isEnabled(this.config)) {
      debug('Plugin disabled. Exiting.');
      reject(new Error('Meetup plugin is disabeld'));
      return;
    }

    debug('Plugin enabled. Proceeding.');

    this.meetup.getRSVPs({
      event_id: eventId
    }, function(error, response) {
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
    });
  }.bind(this));
};

function isConfigured(config) {
  return Boolean(config.plugins.meetup);
}

function isEnabled(config) {
  return config.plugins.meetup.enabled === true;
}

function resolveVenueId(event, config) {
  if (event.meetupVenueId) {
    return event.meetupVenueId;
  }

  return config.plugins.meetup.default_venue_id;
}

module.exports = exports = meetup;
