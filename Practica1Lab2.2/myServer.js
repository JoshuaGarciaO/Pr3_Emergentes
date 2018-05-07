const application_root=__dirname,
    express = require("express"),
    path = require("path"),
    bodyparser=require("body-parser");

const ctrl = require('./controllers');

var app = express();
app.use(express.static(path.join(application_root,"public")));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

//Cross-domain headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(8080, function () {
	console.log("the server is running!");
});

app.get('/',ctrl.sendStatic);

app.get('/datasets',ctrl.sendDatasets);

app.get('/dataset/:name/polarity',ctrl.devolverSentimiento);

app.get('/dataset/:name/words',ctrl.devolverTop);

app.get('/dataset/:name/geo',ctrl.geoLocalizacion);

app.get('/dataset/graph2', ctrl.devolverGraphMongoDB);

app.get('/dataset/graph', ctrl.devolverGraphCompleto);

app.get('/dataset/:name',ctrl.devolverId);






ctrl.warmup.once("warmup", _ => {
   console.log("Web server running on port 8080");
   app.listen(8080);
});

