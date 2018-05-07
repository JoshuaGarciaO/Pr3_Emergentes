const axios = require('axios');

let client = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 10000,
});


client.get("/datasets")
      .then(response => console.log(response.data))
      .catch(error => console.log(error));

//client.get("/dataset/primero")
//      .then(response => console.log(response.data))
//      .catch(error => console.log(error)); 

client.get("/dataset/primero/polarity")
      .then(response => console.log(response.data))
      .catch(error => console.log(error)); 

client.get("/dataset/primero/words?top=2")
      .then(response => console.log(response.data))
      .catch(error => console.log(error));  

client.get("/dataset/primero/geo")
      .then(response => console.log(response.data))
      .catch(error => console.log(error)); 

client.get("/dataset/primero?limit=3")
      .then(response => console.log(response.data))
      .catch(error => console.log(error)); 

client.get("/dataset/graph2")
      .then(response => console.log(response.data))
      .catch(error => console.log(error)); 

client.get("/dataset/graph")
      .then(response => console.log(response.data))
      .catch(error => console.log(error)); 
