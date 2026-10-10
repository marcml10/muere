const https = require('https');

const categories = [
  { name: 'Spatial Audio', term: 'spatial+audio' },
  { name: 'Apple Music Live', term: 'apple+music+live' },
  { name: 'Pop', term: 'taylor+swift' },
  { name: 'Hip-Hop', term: 'kendrick+lamar' },
  { name: 'Country', term: 'morgan+wallen' },
  { name: 'R&B', term: 'sza' },
  { name: 'Alternative', term: 'arctic+monkeys' },
  { name: 'Rock', term: 'foo+fighters' },
  { name: 'Dance', term: 'calvin+harris' },
  { name: 'Electronic', term: 'daft+punk' },
  { name: 'Jazz', term: 'miles+davis' },
  { name: 'Classical', term: 'beethoven' },
  { name: 'Latin', term: 'bad+bunny' },
  { name: 'K-Pop', term: 'bts' },
  { name: 'Acoustic', term: 'ed+sheeran' },
  { name: 'Chill', term: 'lofi' },
  { name: 'Decades', term: '80s' },
  { name: 'Focus', term: 'focus' },
  { name: 'Fitness', term: 'workout' },
  { name: 'Kids & Family', term: 'disney' }
];

async function fetchArt(term) {
  return new Promise((resolve, reject) => {
    https.get(`https://itunes.apple.com/search?term=${term}&entity=album&limit=1`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            const img = json.results[0].artworkUrl100.replace('100x100', '600x600');
            resolve(img);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', resolve);
  });
}

async function run() {
  const results = [];
  for (const cat of categories) {
    const img = await fetchArt(cat.term);
    results.push({ name: cat.name, img });
  }
  console.log(JSON.stringify(results, null, 2));
}

run();
