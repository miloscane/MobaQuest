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
var multer 				=	require('multer');
var path				=	require('path');

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

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads/Huntsman/');
	},
	filename: function (req, file, cb) {
		let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
		cb(null, file.fieldname + '-' + Date.now()+ext)
	}
});

var upload = multer({ storage: storage, limits: { fileSize: 1000000000 } }).any();

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

/*mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
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
		/*collection.find({}).toArray(function(err,result){
			if(err){
				console.log(err)
			}else{
				console.log(result);
				client.close();
			}
		});
	}
})*/

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

/*server.post('/test',upload.any(), function(req,res){
	console.log(req.files);
	res.send('Ok')
});*/
server.post('/test', (req, res) => {

    upload(req, res, function(err) {
        // req.files contains information of uploaded files
        // req.body contains information of text fields
		//console.log(req)
		var questJson	=	JSON.parse(req.body.questjson);
		for(var i=0;i<questJson.questions.length;i++){
			if(Number(questJson.questions[i].type)==2){
				//Find the file
				for(var j=0;j<req.files.length;j++){
					if(req.files[j].fieldname=="file-"+eval(i+1)+"-2"){
						questJson.questions[i].image	=	req.files[j].destination.substring(8,req.files[j].destination.length)+req.files[j].filename;
						break;
					}
				}
			}else if(Number(questJson.questions[i].type)==5){
				//Find the file
				for(var j=0;j<req.files.length;j++){
					if(req.files[j].fieldname=="file-"+eval(i+1)+"-5"){
						questJson.questions[i].image	=	req.files[j].destination.substring(8,req.files[j].destination.length)+req.files[j].filename;
						break;
					}
				}
			}
		}
		questJson.filename	=	new Date().getTime();
		fs.writeFileSync("./quests/"+questJson.filename+".json",JSON.stringify(questJson,null,"\t"));
        res.redirect('/questAdded/'+questJson.filename);
    });
});

server.get('/questAdded/:questFilename',function(req,res){
	if(fs.existsSync('./quests/'+req.params.questFilename+'.json')){
		var questJson	=	JSON.parse(fs.readFileSync('./quests/'+req.params.questFilename+'.json'));
		res.render('message',{
			pageInfo: fetchPageInfo('message',''),
			message: "<div>Quest \""+questJson.name+"\" has been successfully added.</div><div class='linkWrap'><a href='/quest/"+questJson.filename+"'>View Quest</a></div>"
		});
	}else{
		res.render('message',{
			pageInfo: fetchPageInfo('message',''),
			message: "No no :)"
		});
	}
});

server.get('/deleteQuest/:questFilename',function(req,res){
	if(fs.existsSync('./quests/'+req.params.questFilename+'.json')){
		var questJson	=	JSON.parse(fs.readFileSync('./quests/'+req.params.questFilename+'.json'));
		var filesToDelete	=	[];
		for(var i=0;i<questJson.questions.length;i++){
			if(questJson.questions[i].image!=""){
				filesToDelete.push("./public"+questJson.questions[i].image);
			}
		}
		console.log(filesToDelete)
		for(var i=0;i<filesToDelete.length;i++){
			if(fs.existsSync(filesToDelete[i])){
				fs.unlinkSync(filesToDelete[i].toString());
			}
		}
		fs.unlinkSync(fs.existsSync('./quests/'+req.params.questFilename+'.json'));
		res.render('message',{
			pageInfo: fetchPageInfo('message',''),
			message: "<div>Quest successfully deleted.</div><div class='linkWrap'><a href='/allQuests'>All Quests</a></div>"
		});
	}else{
		res.render('message',{
			pageInfo: fetchPageInfo('message',''),
			message: "No no :)"
		});
	}
});

server.get('/allQuests',function(req,res){
	var questFiles	=	fs.readdirSync('./quests');
	var quests	=	[];
	for(var i=0;i<questFiles.length;i++){
		var questJson	=	JSON.parse(fs.readFileSync('./quests/'+questFiles[i]));
		quests.push({"filename":questJson.filename,"name":questJson.name});
	}

	res.render('allQuests',{
		pageInfo: fetchPageInfo('allQuests',''),
		quests: quests
	});
});

server.get('/quest/:questFilename',function(req,res){
	if(fs.existsSync('./quests/'+req.params.questFilename+'.json')){
		var questJson	=	JSON.parse(fs.readFileSync('./quests/'+req.params.questFilename+'.json'));
		res.render('questViewer',{
			pageInfo: fetchPageInfo('questViewer',''),
			quest: questJson
		});
	}else{
		res.render('message',{
			pageInfo: fetchPageInfo('message',''),
			message: "No no :)"
		});
	}
});

server.get('/:pageName',function(req,res){
	res.render(req.params.pageName,{
		pageInfo: fetchPageInfo(req.params.pageName,'')
	});
});

server.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

server.get('*',function(req,res){
	res.redirect('/');
});