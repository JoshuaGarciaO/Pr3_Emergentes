const db=require('./myStorage');
const _= require('underscore');
let  DB = new db.myDB('./data');
const mongoose = require('mongoose');
const axios = require('axios');
const request = require("request");

const my_conn_data="mongodb://desklet:964835483j@ds161939.mlab.com:61939/mydb";



exports.sendStatic    = (req,res) => res.sendFile("public/index.html",{root:application_root});

exports.sendDatasets  = (req,res) => res.send({result: DB.getDatasets()}); 

exports.sendCounts    = (req,res) => res.send({error:"No operativo!"});

exports.sendLastPosts = (req,res) => {
    let n = (req.query.n == null) ? 10 : parseInt(req.query.n);
    DB.getLastObjects(req.params.name,n,data => res.send(data));
};

//pon aqui tus funciones adicionales!

//Polaridad
exports.devolverSentimiento = (req,res) => {
       DB.getLastObjects(req.params.name, 100, lista => {
		let polaridades={positive:0,negative:0,neutr:0}
	 	let tweets = lista.result;
		for(let tweet of tweets){
		  
		  if(typeof tweet.sentimiento=="string") {
			tweet.sentimiento = parseInt(tweet.sentimiento.split(",").slice(-1)[0]);
		  }

		  if(tweet.sentimiento>0){
			polaridades.positive++;} //polaridades["pos"]
		  if (tweet.sentimiento <0){
			polaridades.negative++;}
		  if (tweet.sentimiento ==0){
			polaridades.neutr++;}

		}
		res.send({result:polaridades});
       });
};


//Top palabras
exports.devolverTop = (req,res) => {
	DB.getLastObjects(req.params.name, 50, lista =>{
	let n = (req.query.top == null) ? 10 : parseInt(req.query.top);
        let todas=[];
	for (let tweet of lista.result){
		todas=todas.concat(tweet.texto.split(" "));
	}        
	let ordenadas = _.sortBy(_.pairs(_.countBy(todas)), x => -x[1]).slice(0,n);
	res.send({result:ordenadas});
	})
};

//geo-localizacion
exports.geoLocalizacion = (req, res)=> {
	DB.getLastObjects(req.params.name, 0, lista =>{
	let localizacion = {};
	for (let tweet of lista.result){
		if (tweet.coordenadas != null && tweet.coordenadas != " "){
			localizacion[tweet.id] = tweet.coordenadas;
		}
	}
	let pares = _.pairs(localizacion);
	res.send({result:pares});
	})
};

//Devolver ID
exports.devolverId = (req, res)=> {
        let n = (req.query.limit == null) ? 10 : parseInt(req.query.limit);
	DB.getLastObjects(req.params.name, n, lista =>{
	let ID = [];
	for (tweet of lista.result ){
		ID.push(tweet.id);
	}

	//let ID = lista.result.map(x=>x.id); //Lo mismo que el bucle
	res.send({result:ID});
	})
};

//crear JSON-LD
getJSONLD = (nombre)=> {

        return new Promise((accept,reject) => {
		DB.getPrimeraLinea(nombre, track => {
			accept(
                      		{"@context" : track.context,
				"@type": track.type,
				"@identifier" : nombre,
				"@id": track.id,
				"@agent": track.agent,
				"@startTime": track.startTime,
				"@query" : track.track }
			)
		})
    	})
};

exports.devolverGraphCompleto = (req, res) => {
	var datasets = DB.getDatasets();
	var promesas = datasets.map(nombre => getJSONLD(nombre));
	
	Promise.all(promesas).then(values => {
            res.send({"@graph" : values})
        }); 
				
};	

exports.devolverGraphMongoDB = (req, res) => {


// AQUI USAMOS EL HTTP REQUEST PARA CONSEGUIR LOS DATOS QUE NOS DEVUELVE EL GET DE LA URI DE LA API DE MONGO

	const url = "https://api.mlab.com/api/1/databases/mydb/collections/items?apiKey=wsK46ID_oLmSo8xzMtDVQvIFu_u8yxEL";
	request.get(url, (error, response, body) => {
//  		console.log( body); 
		res.send({ "@graph" : body});
	});

};


		
/* AQUI USO EL AXIOS PERO NO LO ENTIENDO ES COPIADO DE ESTE FORO: https://www.valentinog.com/blog/http-requests-node-js-async-await/

    const url = "https://api.mlab.com/api/1/databases/mydb/collections/items?apiKey=wsK46ID_oLmSo8xzMtDVQvIFu_u8yxEL";
    const get_datos_mongo = async url => {
      try {
        const response = await axios.get(url);
        const data_json = response.data;
        console.log( data_json );
      } catch (error) {
        console.log(error);
      }
    };
	res.send({ "@graph" : get_datos_mongo(url)});
*/

exports.warmup = DB.events;

//devolverSentimientos("primero");
