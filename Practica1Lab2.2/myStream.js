const Twitter = require('twitter')
const myCreds = require('./credentials/my-credential.json');
const database = require('./myStorage');
const myDB = new database.myDB('./data');
const client = new Twitter(myCreds);
const sentiment = require('sentiment-spanish');
const mongoose = require('mongoose');

const my_conn_data="mongodb://JoshuaGO:964835483j@ds161939.mlab.com:61939/mydb";

mongoose.connect(my_conn_data);

var agentSchema = new mongoose.Schema({
	"@type" : String,
	"@name" : String
});

var itemSchema = new mongoose.Schema({
		"@context" : String,
		"@type" : String,
		"@identifier" : String,
		"@id" : String,
		"@agent" : agentSchema,
		"@startTime" : Date,
		"@query" : String
	});	
	
var ItemModel = mongoose.model('Items', itemSchema);


class StreamManager{

	constructor(){
		this.streams={};	

	}

	crearstream(nombre, my_track){
		let stream = client.stream('statuses/filter', {track: my_track});
		myDB.createDataset(nombre, {"nombre": nombre, "Context": "http://schema.org/", "type": "SearchAction", "track": my_track,"agent":{"@type":"Person", "@name":"joshua"}, "startTime": new Date(), "id": "http://localhost:8080/dataset/"+nombre});

		var midato = new ItemModel({
			"@context" : "http://schema.org/",
			"@type" : "SearchAction",
			"@identifier" : nombre,
			"@id" : "http://localhost:8080/dataset/"+nombre,
			"@agent" : {"@type":"Person", "@name":"joshua"},
			"@startTime" : new Date(),
			"@query" : my_track
		});

		midato.save(function(err){
			if (err) throw err;
			console.log("Guardado!");
			mongoose.connection.close();
		});

		stream.on('data', tweet => {
		  if (tweet.lang=="es" || tweet.user.lang=="es"){
		     console.log(tweet.id_str,tweet.text, tweet.coordinates);
		     console.log("Sentiment score:",sentiment(tweet.text).score);
		     let objeto={"id":tweet.id_str, "texto":tweet.text,	 "coordenadas":tweet.coordinates, "sentimiento":sentiment(tweet.text).score}		     
		     myDB.insertObject(nombre, objeto);
		  }
		});

		stream.on('error', err => console.log(err));

		this.streams[nombre]= stream;
		console.log("creado");

	}

	getStreamsKeys(){
		return this.streams.keys();
	}

	destruirstream(nombre){
		this.streams[nombre].destroy();
		delete this.streams[nombre];
		console.log("destruido");
	}
}
exports.StreamManager = StreamManager;

