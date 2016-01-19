var test = require('tape');
var nock = require('nock');
var sinon = require('sinon');
var meetup = require('../index');

test('create() function output type', assert => {
  var config = require('../common/config');
  meetup.init(config);

  const actual = meetup.create() instanceof Promise;
  const expected = true;

  assert.equal(actual, expected, 'meetup.create() should return a Promise.');

  assert.end();
});

test('create() should not do anything if plugin is disabled', assert => {
  var config = require('../common/config');
  config.plugins.meetup.enabled = false;
  meetup.init(config);
  var event = require('./data/event');

  const actual = meetup.create(event);

  actual.catch((error) => {
    config.plugins.meetup.enabled = true;
    assert.equal(error.message, 'Meetup plugin is disabeld');
    assert.end();
  });
});

test('create() should create an event on meetup.com', assert => {
  var config = require('../common/config');
  var event = require('./data/event');
  meetup.init(config);

  var mockError = null;
  var mockResponse = { id: 123 };

  var postEventStub = sinon.stub(meetup.meetup, 'postEvent');
  postEventStub.callsArgWith(1, mockError, mockResponse);

  meetup.create(event).then((eventId) => {
    assert.equal(eventId, mockResponse.id, 'returned meetup id should match');

    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('group_id', 18232090)), 'group id is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('name', 'BarcelonaJS Meetup.com')), 'name is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('venue_visibility', 'public')), 'venue visibility is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('hosts', '194993837')), 'hosts list is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('group_urlname', 'http://barcelonajs.org')), 'group url is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('simple_html_description', 'This slot could be yours! <a href="https://github.com/BarcelonaJS/speakers">Submit your talk now</a>. You did some crazy stuff with JavaScript? You want to show it to the community? Drop us a line on your topic on <a href="https://twitter.com/bcnjs">Twitter</a>.')), 'html description is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('time', 4102425900000)), 'event time is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('duration', 8100000)), 'event duration is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('publish_status', 'published')), 'publish status is passed to meetup client');
    assert.ok(postEventStub.calledWith(sinon.match.hasOwn('venue_id', 13033612)), 'venue id is passed to meetup client');
    assert.end();
  }).catch((error) => {
    console.log(error);
  });
});

test('getRsvps() should return a list of attendees from meetup.com', assert => {
  var config = require('../common/config');
  meetup.init(config);

  var mockError = null;
  var mockResponse = {
    results: [
      {
        created: 1449151202000,
        response: 'no',
        guests: 0,
        member: {
          member_id: 123,
          name: 'Foo Bar'
        },
        rsvp_id: 123123,
        mtime: 1449685902000,
        event: {
          name: 'Some event',
          id: '1212121212',
          time: 1454446800000,
          event_url: 'http://www.meetup.com/Test-Group/events/1212121212/'
        },
        group: {
          join_mode: 'open',
          created: 1453211766856,
          group_lon: -2.393,
          id: 987987,
          urlname: 'Test-Group',
          group_lat: 5.102
        }
      }
    ]
  };

  var getRSVPsStub = sinon.stub(meetup.meetup, 'getRSVPs');
  getRSVPsStub.callsArgWith(1, mockError, mockResponse);

  meetup.getRSVPs('123').then((rsvps) => {
    assert.equal(rsvps.length, 1, 'returned answers are returned');
    assert.equal(rsvps[0].name, 'Foo Bar', 'attendee name is returned');
    assert.equal(rsvps[0].response, 'no', 'attendee response is returned');

    assert.ok(getRSVPsStub.calledWith(sinon.match.hasOwn('event_id', '123')), 'event id is passed to meetup client');
    assert.end();
  }).catch((error) => {
    console.log(error);
  });
});
