const Twitter = require('twitter')
const myCreds = require('./credentials/my-credential.json');

const client = new Twitter(myCreds);
const sentiment = require('sentiment-spanish');

let stream = client.stream('statuses/filter', {track: 'coches,opel,mercedes,bmw,seat,ford,citroen,peugeot'});

stream.on('data', tweet => {
  if (tweet.lang=="es" || tweet.user.lang=="es"){
     console.log(tweet.id_str,tweet.text);
     console.log("Sentiment score:",sentiment(tweet.text).score);
  }
});

stream.on('error', err => console.log(err));

//destruimos el stream despues de 20 segundos (solo para pruebas)
setTimeout( _ => stream.destroy(), 20000);
