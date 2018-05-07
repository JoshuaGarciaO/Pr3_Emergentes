
const control = require('./myStream.js')

let obj = new control.StreamManager();

obj.crearstream("primero", "cifuentes");
obj.crearstream("segundo", "manada");

setTimeout( _ => obj.destruirstream("primero"), 15000);
setTimeout( _ => obj.destruirstream("segundo"), 15000);


