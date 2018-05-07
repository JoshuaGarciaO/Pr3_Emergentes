const db=require('./myStorage.js')
const DB=new db.myDB('./data')
const util=require('util')


DB.events.once('warmup', _ => {

       DB.createDataset('motos',{'creator':'yo','about':'vehiculos'});
       DB.createDataset('coches',{'creator':'yo','about':'vehiculos'});
       DB.createDataset('camiones',{'creator':'yo','about':'vehiculos'});

       DB.insertObject('coches',{body:',mi primer coche',creator:'yo'});
       DB.insertObject('coches',{body:',mi segundo coche',creator:'yo'});
       DB.insertObject('camiones',{body:',mi primer coche',creator:'yo'});
       DB.insertObject('motos',{body:',mi primera moto',creator:'yo'});
       DB.insertObject('motos',{body:',mi segunda moto',creator:'yo'});
       DB.insertObject('motos',{body:',mi tercera moto',creator:'yo'});
       
       DB.getLastObjects('motos',1, data => console.log(data));

       console.log(DB.getDatasets());

       console.log(util.inspect(DB.getCounts()));

});

