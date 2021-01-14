//Server
var server				=	require('express')();
var http				=	require('http').Server(server);
var net					=	require('net');
var io					=	require('socket.io')(http);
var express				=	require('express');
var fs					=	require('fs');
var bodyParser			=	require('body-parser');
var session				=	require('express-session');
var cookieParser		=	require('cookie-parser');
var crypto				=	require('crypto');
var mongo				=	require('mongodb');

server.set('view engine','ejs');
var viewArray	=	[__dirname+'/views'];
var viewFolder	=	fs.readdirSync('views');
for(var i=0;i<viewFolder.length;i++){
	if(viewFolder[i].split(".").length==1){
		viewArray.push(__dirname+'/'+viewFolder[i])
	}
}
//server.set('views', [__dirname + '/views']);
server.set('views', viewArray);
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());

http.listen(process.env.PORT || 3000, function(){
  console.log('Server Started');
});

var mainFileVersion	=	1.1;

var pageInfo	=	{};

pageInfo.fileVersion	=	mainFileVersion;
pageInfo.noCacheVersion	=	new Date().getTime();

require('events').EventEmitter.prototype._maxListeners = 0;

function logError(err){
	if(!fs.existsSync('./errorLog.txt')){
		fs.writeFileSync('./errorLog.txt', 'ERROR LOG: \n \n \n', 'utf8');
	}
	var allErrors	=	fs.readFileSync('./errorLog.txt','utf-8');
	var dateOfError	=	new Date();
	allErrors += "------------------"+dateOfError+"\n"+err+"\n";
	var write	=	fs.writeFileSync('./errorLog.txt', allErrors, 'utf8');
}

function fetchPageInfo(companyName){
	return pageInfo
}

var mongoClient	=	mongo.MongoClient;
var url	=	'mongodb+srv://mobatec:m0b@tec!@mobatec.zhull.mongodb.net/MobaQuest?retryWrites=true&w=majority';

mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
	if(err){
		console.log(err)
	}else{
		var collection	=	client.db('MobaQuest').collection('Quests');
		/*collection.insertOne(pageInfo,function(err,res){
			if(err){
				console.log(err)
			}else{
				console.log("Inserted");
				client.close()
			}
		})*/
		/*collection.deleteOne({fileVersion:1.1},function(err,res){
			if(err){
				console.log(err)
			}else{
				console.log("Deleted")
			}
		})*/
		collection.find({}).toArray(function(err,result){
			if(err){
				console.log(err)
			}else{
				console.log(result);
				client.close();
			}
		});
	}
})

/*io.on('connection', function(socket){
	
	socket.on('disconnect',function(){
		
	});
});*/


server.get('/',function(req,res){
	res.render('home',{
		pageInfo: fetchPageInfo('Huntsman'),
		quest: JSON.parse(fs.readFileSync('./quest.json','utf-8')) 
	});
});


server.get('/:pageName',function(req,res){
	res.render(req.params.pageName,{
		pageInfo: fetchPageInfo(req.params.pageName,'')
	},function(err){
		if(err){
			//logError("Couldn't load "+req.params.pageName+":\n"+err.toString());
			res.redirect('/');
		}
	});
});


server.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});




server.get('*',function(req,res){
	res.redirect('/');
});