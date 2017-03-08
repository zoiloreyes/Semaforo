var express = require('express');
var app = express();
var path = require('path')
var tiempos;
var faye = require('faye');
var faye_server = new faye.NodeAdapter({mount: '/faye', timeout: 45});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

faye_server.attach(server);


var rojo = 6;
var amarillo = 6;
var verde = 5;
var currentColorA;
var currentColorB;
var fs = require('fs');

setInterval( function()
{   
    faye_server.getClient().publish('/temporizador', 
    {
        lightCurrentColorA : currentColorA,
        lightCurrentColorB : currentColorB
    });
}, 1000);

setInterval(function () { 
    if(rojo > 1){
    	rojo--;
    	currentColorA = "rojo";
    	if(rojo >= 5){
    		currentColorB = "verde";
    	}else{
    		currentColorB = "amarillo";
    	}
    	
    }else if(verde > 1){
    	verde--;
    	currentColorA = "verde";
    	currentColorB = "rojo";
    }else if(amarillo > 1){
    	amarillo--;
    	currentColorA = "amarillo";
    }else{
    	initializeTimer();
    }
}, 1000); 


function initializeTimer(){
	if(typeof tiempos !== 'undefined'){
		rojo = Number(tiempos.rojo);
		verde = Number(tiempos.verde) - 5;
		amarillo = 5;
	}else{
		rojo = 6;
		verde = 6;
		amarillo = 5;
	}
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/', function (req, res) {
   res.sendFile( __dirname +"/"+ "index.html" );
})

app.get('/semaforoA.html', function (req, res) {
   res.sendFile( __dirname +"/"+ "semaforoA.html" );
})

app.get('/semaforoB.html', function (req, res) {
   res.sendFile( __dirname +"/"+ "semaforoB.html" );
})

app.get('/', function (req, res) {
   res.sendFile( __dirname +"/"+ "index.html" );
})

app.get('/set_timer', function (req, res) {
   
   tiempos = {
      rojo:req.query.txtrojo,
      verde:req.query.txtverde
   };
   console.log(tiempos);
   initializeTimer();
   res.sendFile( __dirname + "/" + "index.html" );

})

