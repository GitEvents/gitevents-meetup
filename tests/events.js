var test = require('tape');
var nock = require('nock');
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
  const expected = 'meetup plugin is disabeld.';

  // assert.equal(actual, expected, 'meetup.create()');
  actual.then((actual) => {
    assert.equal(actual, expected);
    config.plugins.meetup.enabled = true;
    assert.end();
  });

  actual.catch(() => {
    assert.fail('should not get here.');
    assert.end();
  });
});

test('create() should create an event on meetup.com', assert => {
  var config = require('../common/config');
  var event = require('./data/event');
  meetup.init(config);

  nock('https://api.meetup.com:443', {
      'encodedQueryParams': true
    })
    .post('/2/event')
    .query({
      'group_id': '18232090',
      'name': 'BarcelonaJS%20Meetup.com',
      'venue_visibility': 'public',
      'hosts': '194993837',
      'group_urlname': 'http%3A%2F%2Fbarcelonajs.org',
      'simple_html_description': 'This%20slot%20could%20be%20yours!%20%3Ca%20href%3D%22https%3A%2F%2Fgithub.com%2FBarcelonaJS%2Fspeakers%22%3ESubmit%20your%20talk%20now%3C%2Fa%3E.%20You%20did%20some%20crazy%20stuff%20with%20JavaScript%3F%20You%20want%20to%20show%20it%20to%20the%20community%3F%20Drop%20us%20a%20line%20on%20your%20topic%20on%20%3Ca%20href%3D%22https%3A%2F%2Ftwitter.com%2Fbcnjs%22%3ETwitter%3C%2Fa%3E.',
      'time': '4102422300000',
      'duration': '8100000',
      'publish_status': 'published',
      'venue_id': '13033612',
      'key': config.plugins.meetup.apikey
    })
    .reply(201, ['1f8b08000000000000037d53db6adb40107def574cf7d9d8d24ab664933ad0943e040285144a4120d6d238da44da5df612e1867c4f3fa43fd659d938090dd5839066e79c33337be68905dfd47abf77e8d9265b25f199b1475401d9e689353a286f0f6cc3d0b1196ba48fdf9f856db0d74a5048b4ad45e7ea94e27025ac450b5fb5f24261df8b19f01924659270a05c25068c69377a277b841fdaf62d5c212920080fdf7af1e7b720122ffaa00e224248856df83c2dd25551ce986cd926cd922c5ba59c0e05159da7f3ac5cadf37cc62c1aa91452ce5ef40e9f67ac43d14e3db04d6c4b3a49cac7264cd8f5b221895148df4be7eb97c4c6a2f09127cd976951f06cc9f992040771d8616ddda37995dca26bac345ec652d985d97eefa403d76b0f94441dee100e3a58f7112e047416f79f2ad6796fdca65a548b3be9bbb09b377aa816e7c15edf560b67503ca07515dbde86dd20fdc402349c07507abca816623b879f3a402b5b707a4068acf87500e7c37e0f23f1c2b57814b753759753e6289407afc1757a04397dfa8e707a1882a2b95cc217ab0d0407027aa910b43aa96a239bf8f75e0b9eb43cda630fbb46ddc79abf1f83c732e96db6346b2467f93ad89e2615f1137c1cc7f980e88379670a13c2550bce8ba22c8a55562d88e780eecd35a4740dc18ae31d94e9c9c642293a6ece86383bf09502dc9c95d9d15fec2c45012f23204f139e739e9d788369dfb5c79dd5c1c4b5b9d752d5836ea39636a8d81b4b1124e5699e4f5cff56c44e44f5d9fb936cb1e2eb6c9d2fb3d316943ce3c93a5663fbff919c7624aa25e9922fcba25c272bb27da709f26210721aa38d715ef8e0e824181a895477ecf9c35f91bd5fda26040000'], {
      server: 'cloudflare-nginx',
      date: 'Sat, 02 Jan 2016 22:05:52 GMT',
      'content-type': 'application/json;charset=utf-8',
      'content-length': '628',
      connection: 'close',
      'set-cookie': ['__cfduid=d598ac3395235c9d43849cdcc8024cbeb1451772351; expires=Sun, 01-Jan-17 22:05:51 GMT; path=/; domain=.meetup.com; HttpOnly'],
      'x-meetup-server': 'api10',
      'x-ratelimit-limit': '30',
      'x-ratelimit-remaining': '29',
      'x-ratelimit-reset': '10',
      'x-oauth-scopes': 'basic',
      'x-accepted-oauth-scopes': 'basic',
      location: 'https://api.meetup.com/2/event/227787763',
      vary: 'Accept-Encoding,User-Agent',
      'content-encoding': 'gzip'
    });

  const actual = meetup.create(event);
  const expected = '227787763';

  actual.then((actual) => {
    assert.equal(actual, expected, 'returned meetup id should match');
    assert.end();
  });

  actual.catch((error) => {
    assert.fail('should not get here.');
    assert.end();
  });
});
