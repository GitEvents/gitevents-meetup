# gitevents - Meetup plugin

Add the meetup.com config to your production.json. The venue ID can be found in the DOM as `data-id` of the `Select` button when you create a new event. You can add up to 5 hosts IDs.

    module.exports = {
      apikey: '<your api key>',
      group: '<meetup group name>',
      group_id: <meetup group id>,
      default_venue_id: <default venue id>,
      hosts: [<host>, <host>, <host>],
      simple_html_description: 'This slot could be yours! <a href="https://github.com/yourevent/speakers">Submit your talk now</a>. You did some crazy stuff with JavaScript? You want to show it to the community? Drop us a line on your topic on <a href="https://twitter.com/youraccount">Twitter</a>.'
    };
