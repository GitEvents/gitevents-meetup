var config = {
	"meetup": {
	  "apikey": "YOUR_API_KEY",
	  "groupid": "GROUP_ID",
	  "groupurl": "GROUP_URL"
	}
};

var talks = {
      'date': '2014-02-12T23:00:00.000Z',
      'event': {
      	'name': 'My awesome event',
      	'date': '2015-02-12T12:00:00.000Z'	
      },
      'talks': [{
        'title': 'Using the API Blueprint to generate nodejs consumers',
        'speaker': {
          'twitter': 'bpedro',
          'name': 'Bruno Pedro',
          'portrait': 'https://pbs.twimg.com/profile_images/378800000473642830/2f20ecdcd1ec41452b174d04a69e87ee.jpeg'
        },
        'level': 'Intermediate',
        'language': 'en',
        'git': '',
        'slides': 'http://www.slideshare.net/bpedro/api-code-generation',
        'video': 'https://vimeo.com/87488883',
        'description': 'I\'ll show you how to generate a nodejs API consumer by using the API Blueprint (http://apiblueprint.org/) to generate code from a Postman (http://www.getpostman.com/) collection.'
      },
      {
        'title': 'Build stuff using node.js',
        'speaker': {
          'twitter': 'nsaouli',
          'name': 'Nazim Saouli',
          'portrait': ''
        },
        'level': 'Beginner',
        'language': 'en',
        'git': '',
        'slides': 'http://www.slideshare.net/bpedro/api-code-generation',
        'video': 'https://vimeo.com/87488883',
        'description': 'I\'ll discuss all things node.js and how to use it to build cool things.'
      }
      ]
    };

var meetup = require('./meetup')(config);

meetup.trigger(talks, function(err, result){
	if (err) throw err;


	console.log(result);
});
// meetup.trigger();
