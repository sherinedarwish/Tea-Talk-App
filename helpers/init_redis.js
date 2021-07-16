const redis = require("redis");
const client = redis.createClient();




client.on("connect", () => {
    console.log("client is Connected to rediss...");
});

client.on("ready", () => {
console.log("Client is ready and connected...");
});

  
client.on("error", function(error) {
    console.error(error);
});



client.on("end", () => {
console.log("Client id disconnected from redis");
});
  

process.on('SIGINT' ,() => {
    client.quit()
});

module.exports=client;