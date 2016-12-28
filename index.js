
//import
var http = require('http'); 
var fs=require('fs');
var express = require('express');

var list=new Array(); 
var latitude;
var longitude;
//read database
fs.readFile('G:/technical_test/starbucks_new_york.json',function(err,data){  
	if(err)  
		throw err;  
		  
	var jsonObj=JSON.parse(data);   
	var length=0;  
	var size=jsonObj.length;
	
	for(var i=0;i<size;i++){ //Read file 
		var record =jsonObj[i];
		list[i] = record;
		//console.log(list[i]['id']);
	}

});
			
var app = express();

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})	

var response="\nThe Starbucks restaurants around you are:\n";	
app.get('/process_get', function (req, res) {
	latitude=req.query.lat;
	longitude=req.query.lng;
	res.write('Your location is:\nlatitude:'+latitude+',longitude:'+longitude+'\n');
	for(var i=0;i<list.length;i++){ 		
		var lat =list[i]['location']['latitude']; 
		var lon =list[i]['location']['longitude']; 
		var tem = (lat-latitude)*(lat-latitude)+ (lon-longitude)*(lon-longitude);//math.pow((lat-latitude),2)+ math.pow((lon-longitude),2);
		list[i]['distance']= tem;	
		//console.log(list[i]['distance']);		
	}	
	list.sort(keysrt('distance',false));
	
	for(var i=0;i<10;i++){		
	var value=(i+1) +": Name:"+list[i]['name']+" ; Address:"+ list[i]['street']+'\n';
	response+=value;
	}
  
   //console.log(response);
   res.end(response);
})
		
function keysrt(key,desc) {
  return function(a,b){
    return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}

var server = app.listen(1337, function () {

  var host = erver.address().address
  var port = server.address().port

  console.log("Server running at http://%s:%s", host, port)

});

