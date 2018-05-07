const gb=require('glob');
const fs=require('fs');
const readLastLines = require('read-last-lines');
const utf8 = require('utf8');
const events = require('events');
const firstline = require('firstline');

class myDB {

  constructor(dataDir) {

    this.events = new events.EventEmitter();
      
    if (!dataDir.endsWith("/")) 
         this.dataDir=dataDir+"/";

    this.datasets=[];
    this.count={};
    this.warmup();
    this.ready=false;
  }

  warmup(){
     let dataDir = this.dataDir;
     let files= gb.glob(this.dataDir+'*.data',{sync:true});
     
     
     this.datasets = files.map(x => x.trim().replace(dataDir,"").replace(".data",""));
      
     let promises = this.datasets.map(name =>
                    new Promise((resolve,reject) =>
                      {this.getCount(name,(count) => resolve([name,count]))})
                   );

     Promise.all(promises).then(values => {
            values.forEach(x => this.count[x[0]]=x[1]);
            this.ready=true;
            this.events.emit('warmup');
     });
  }

  getDatasets (){
    return this.datasets;
  }

  getCounts (){
    return this.count;
  }

  filename(name){
    return this.dataDir+name+".data";
  }

  getTimeStamp(){
    return new Date().toISOString();
  }

  createDataset(name,data){
     
     if (!this.datasets.includes(name)){
        this.datasets.push(name);
        this.count[name]=0;
        data._type="metadata";
        data._n=0;
        data._dt=this.getTimeStamp();
        fs.appendFileSync(this.filename(name),JSON.stringify(data)+"\n");
        return true;
      }
      else 
        return false;
  }

  insertObject(name,data){
      
      if (!this.datasets.includes(name) < 0){
          console.log("(myStorage) ! ",name," not in datasets ",this.datasets)
          return false;
      }

      data._dt=this.getTimeStamp();

      if (this.count[name]!== null){
         this.count[name]++;
         data._n=this.count[name];
      } else 
         return false;
       
      fs.appendFileSync(this.filename(name),JSON.stringify(data)+"\n");

      return true;
  }

  getCount(name, callback){
  
    if (this.datasets.includes(name)){
        readLastLines.read(this.filename(name), 1)
        .then(line => {
          let data=JSON.parse(line.trim());
          callback(data._n);
        })
        .catch(err => {
            console.log('Error reading file '+ this.filename(name) );
            console.log(err);
        })
     }
     else callback(0);
  }

  getLastObjects(name, n, callback){
  
    if (this.datasets.includes(name)){
        
        if (n>this.count[name] || n==0) n = this.count[name];
        
        readLastLines.read(this.filename(name), n)
        .then((lines) => {
          lines = utf8.decode(lines);
          let lista = lines.trim().split("\n");
          lista = lista.map(x => JSON.parse(x.trim()));
          lista = lista.filter(x => (x._type !== "metadata"));
          callback({result: lista})
        })
        .catch(err => {
            callback({error:'Error reading file '+ this.filename(name)});
            console.log(err);
        });
    }
        
    else callback({error:'Not valid dataset '+name},name);
  }

  deleteDataset(name){
    if (this.datasets.includes(name)){
        fs.unlinkSync(this.filename(name));
        this.datasets.splice(this.datasets.indexOf(name),1);
        return true;
      }
    else 
      return false;

  }

  getPrimeraLinea(nombre, callback){
	var nombreFichero = this.filename(nombre);
	var primera = firstline(nombreFichero);
	primera.then(line => {
		var json = JSON.parse(line);
		callback(json);
	});
  }

}//END CLASS

exports.myDB = myDB;
