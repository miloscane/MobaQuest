var dragging	=	false;
var startElemFound	=	false;
var startElemIndex	=	-1;
var endElemFound	=	false;
var dragCount		=	0;
var colorArray		=	["#0d5aaa","#0d87aa","#0daaa1","#0daa32","#62aa0d","#aaa80d","#aa7f0d","#aa480d","#aa0d0d","#aa0d57","#aa0da8","#800daa","#5e0daa","#270daa","#0d2baa"];


function getColor(){
	if(dragCount<=colorArray.length){
		colorString=colorArray[dragCount];
	}else{
		colorString="#254e76";
	}
	return colorString;
}

function dragStart(event){
	event.preventDefault();
	//if elements already answered remove the answer, put new index and find the other pair and remove answerindex
	var startElements	=	event.target.parentElement.querySelectorAll(".answer-column")[0].querySelectorAll(".answer");
	var endElements		=	event.target.parentElement.querySelectorAll(".answer-column")[1].querySelectorAll(".answer");
	
		//Finding existing index
	var existingIndex;
	for(var i=0;i<startElements.length;i++){
		var answerRect	=	startElements[i].getBoundingClientRect();
		var top		=	answerRect.top-event.target.getBoundingClientRect().top;
		var bottom	=	top	+ answerRect.height;
		
		var left	=	answerRect.left-event.target.getBoundingClientRect().left;
		var right	=	left	+ answerRect.width;
		
		if(event.offsetY<bottom && event.offsetY>top && event.offsetX>left && event.offsetX<right){
			if(Number(startElements[i].dataset.answerindex)>=0){
				existingIndex	=	Number(startElements[i].dataset.answerindex);
			}
			
		}
	}
	
	
	if(existingIndex || existingIndex==0){
		for(var i=0;i<startElements.length;i++){
			if(Number(startElements[i].dataset.answerindex)==existingIndex){
				
				for(var j=0;j<endElements.length;j++){
					if(Number(endElements[j].dataset.answerindex)==existingIndex){
						startElements[i].dataset.answerindex=-1;
						endElements[j].dataset.answerindex=-1;
						startElements[i].classList.remove("answered");
						endElements[j].classList.remove("answered");
						startElements[i].borderColor	=	"initial";
						endElements[j].borderColor	=	"initial";
					}
				}
			}
		}
	}
	
	
	
	dragging	=	true;
	//try to find start elem
	for(var i=0;i<startElements.length;i++){
		var answerRect	=	startElements[i].getBoundingClientRect();
		var top		=	answerRect.top-event.target.getBoundingClientRect().top;
		var bottom	=	top	+ answerRect.height;
		
		var left	=	answerRect.left-event.target.getBoundingClientRect().left;
		var right	=	left	+ answerRect.width;
		
		if(event.offsetY<bottom && event.offsetY>top && event.offsetX>left && event.offsetX<right){
			startElemFound	=	true;
			startElements[i].classList.add("answered");
			startElements[i].style.borderColor	=	getColor();
			startElements[i].dataset.color	=	getColor();
			startElements[i].dataset.answerindex=dragCount;
			startElemIndex	=	i;
		}
		
	}
	
	//Draw all connections
	canvasFinalUpdate(event.target.parentElement);
}

function dragEnd(event){
	//console.log("End is X:"+event.offsetX+", Y:"+event.offsetY);
	var endElements	=	event.target.parentElement.querySelectorAll(".answer-column")[1].querySelectorAll(".answer");
	for(var i=0;i<endElements.length;i++){
		var answerRect	=	endElements[i].getBoundingClientRect();
		var top		=	answerRect.top-event.target.getBoundingClientRect().top;
		var bottom	=	top	+ answerRect.height;
		
		var left	=	answerRect.left-event.target.getBoundingClientRect().left;
		var right	=	left	+ answerRect.width;
		
		if(event.offsetY<bottom && event.offsetY>top && event.offsetX>left && event.offsetX<right){
			
			//check if start elem is found
			if(startElemFound){
				endElemFound	=	true;
				//Remove startElement that had the same index because if it started with a non answered left element and connected to the answered right element
				//Check if element is already answered
				if(Number(endElements[i].dataset.answerindex)>=0){
					var startElements	=	event.target.parentElement.querySelectorAll(".answer-column")[0].querySelectorAll(".answer");
					for(var j=0;j<startElements.length;j++){
						if(Number(startElements[j].dataset.answerindex)==Number(endElements[i].dataset.answerindex)){
							startElements[j].classList.remove("answered");
							startElements[j].style.borderColor="initial";
							startElements[j].dataset.answerindex=-1;
						}
					}
				}
				endElements[i].classList.add("answered");
				endElements[i].dataset.answerindex=dragCount;
				endElements[i].style.borderColor=getColor();
				
			}
			
		}
	}
	
	if(endElemFound){
		dragCount++;
	}else{
		//Remove
		var startElements	=	event.target.parentElement.querySelectorAll(".answer-column")[0].querySelectorAll(".answer");
		for(var i=0;i<startElements.length;i++){
			if(Number(startElements[i].dataset.answerindex)==dragCount){
				startElements[i].classList.remove("answered");
				startElements[i].style.borderColor="initial";
				startElements[i].dataset.answerindex=-1;
				startElemIndex	=	-1;
			}
		}
	}
	startElemFound	=	false;
	endElemFound	=	false;
	dragging		=	false;
	//Draw all connections
	canvasFinalUpdate(event.target.parentElement);
}

function draggingFunction(event){
	if(dragging && startElemFound){
		//console.log("Drag coordinates ("+event.offsetX+","+event.offsetY+")");
		var endElements	=	event.target.parentElement.querySelectorAll(".answer-column")[1].querySelectorAll(".answer");
		for(var i=0;i<endElements.length;i++){
			var answerRect	=	endElements[i].getBoundingClientRect();
			var top		=	answerRect.top-event.target.getBoundingClientRect().top;
			var bottom	=	top	+ answerRect.height;
			
			var left	=	answerRect.left-event.target.getBoundingClientRect().left;
			var right	=	left	+ answerRect.width;
			
			if(event.offsetY<bottom && event.offsetY>top && event.offsetX>left && event.offsetX<right){
				endElements[i].classList.add("answered");
				endElements[i].style.borderColor=getColor();
				endElements[i].classList.answerindex=dragCount;
			}else{
				if(!endElements[i].dataset.answerindex || Number(endElements[i].dataset.answerindex)<0){
					endElements[i].classList.remove("answered");
					endElements[i].style.borderColor="inherit";
				}
			}
		}
		
		var canvas = event.target.parentElement.querySelectorAll(".drawCanvas")[0];
		if (canvas.getContext){
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
			//Already finished lines
			var startElements	=	event.target.parentElement.querySelectorAll(".answer-column")[0].querySelectorAll(".answer");
			var endElements		=	event.target.parentElement.querySelectorAll(".answer-column")[1].querySelectorAll(".answer");
			for(var i=0;i<startElements.length;i++){
				if(startElements[i].dataset.answerindex && Number(startElements[i].dataset.answerindex)>=0){
					for(var j=0;j<endElements.length;j++){
						if(Number(endElements[j].dataset.answerindex)==Number(startElements[i].dataset.answerindex)){
							//Draw the line that connects the event.target.parentElementents
							//Check where the line starts
							var top		=	startElements[i].getBoundingClientRect().top-event.target.getBoundingClientRect().top;
							var startY	=	top	+ startElements[i].getBoundingClientRect().height/2;
							
							var left	=	startElements[i].getBoundingClientRect().left-event.target.getBoundingClientRect().left;
							var startX	=	left	+ startElements[i].getBoundingClientRect().width;
							
							context.beginPath();
							context.moveTo(startX, startY);
							
							//Check where line ends
							var top		=	endElements[j].getBoundingClientRect().top-event.target.getBoundingClientRect().top;
							var endY	=	top	+ endElements[j].getBoundingClientRect().height/2;
							
							var left	=	endElements[j].getBoundingClientRect().left-event.target.getBoundingClientRect().left;
							var endX	=	left;
							
							
							context.lineTo(endX, endY);
							context.lineWidth = 3;
							context.strokeStyle = startElements[i].dataset.color;
							context.stroke();
						}
					}
				}
			}
			
			//Find current event.target.parentElementent that was started with drag from
			var startElements	=	event.target.parentElement.querySelectorAll(".answer-column")[0].querySelectorAll(".answer");
			for(var i=0;i<startElements.length;i++){
				if(Number(startElements[i].dataset.answerindex)==dragCount){
					//Check where the line starts
					var top		=	startElements[i].getBoundingClientRect().top-event.target.getBoundingClientRect().top;
					var startY	=	top	+ startElements[i].getBoundingClientRect().height/2;
					
					var left	=	startElements[i].getBoundingClientRect().left-event.target.getBoundingClientRect().left;
					var startX	=	left	+ startElements[i].getBoundingClientRect().width;
					
					context.beginPath();
					context.moveTo(startX, startY);
					context.lineTo(event.offsetX, event.offsetY);
					
					context.lineWidth = 3;
					context.strokeStyle = getColor();
					context.stroke();
					
				}
			}
			
			
			
		}
	}
}

function dragEndOut(event){
	if(dragging){
		canvasFinalUpdate(event.target.parentElement)
		var allAnswers	=	event.target.parentElement.querySelectorAll(".answer");
		for(var i=0;i<allAnswers.length;i++){
			if(allAnswers[i].dataset.answerindex==dragCount){
				allAnswers[i].dataset.answerindex=-1;
				allAnswers[i].classList.remove("answered");
				allAnswers[i].style.borderColor="initial";
			}
		}
		dragging	=	false;
	}
}


function canvasFinalUpdate(elem){
	var canvas = elem.querySelectorAll(".drawCanvas")[0];
	if (canvas.getContext){
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		var startElements	=	elem.querySelectorAll(".answer-column")[0].querySelectorAll(".answer");
		var endElements		=	elem.querySelectorAll(".answer-column")[1].querySelectorAll(".answer");
		for(var i=0;i<startElements.length;i++){
			if(startElements[i].dataset.answerindex && Number(startElements[i].dataset.answerindex)>=0){
				for(var j=0;j<endElements.length;j++){
					if(Number(endElements[j].dataset.answerindex)==Number(startElements[i].dataset.answerindex)){
						//Draw the line that connects the elements
						//Check where the line starts
						var top		=	startElements[i].getBoundingClientRect().top-event.target.getBoundingClientRect().top;
						var startY	=	top	+ startElements[i].getBoundingClientRect().height/2;
						
						var left	=	startElements[i].getBoundingClientRect().left-event.target.getBoundingClientRect().left;
						var startX	=	left	+ startElements[i].getBoundingClientRect().width;
						
						context.beginPath();
						context.moveTo(startX, startY);
						
						//Check where line ends
						var top		=	endElements[j].getBoundingClientRect().top-event.target.getBoundingClientRect().top;
						var endY	=	top	+ endElements[j].getBoundingClientRect().height/2;
						
						var left	=	endElements[j].getBoundingClientRect().left-event.target.getBoundingClientRect().left;
						var endX	=	left;
						
						context.lineTo(endX, endY);
						context.lineWidth = 3;
						context.strokeStyle = startElements[i].dataset.color;
						context.stroke();
					}
				}
			}
		}
	}else{
		console.log("No canvas")
	}
}

function touchStart(event){
	event.offsetX=event.touches[0].pageX-event.target.getBoundingClientRect().left;
	event.offsetY=event.touches[0].pageY-event.target.getBoundingClientRect().top;
	dragStart(event);
}
function touchEnd(event){
	event.offsetX=event.changedTouches[0].pageX-event.target.getBoundingClientRect().left;
	event.offsetY=event.changedTouches[0].pageY-event.target.getBoundingClientRect().top;
	dragEnd(event)
}
function touchMoveFunction(event){
	event.offsetX=event.changedTouches[0].pageX-event.target.getBoundingClientRect().left;
	event.offsetY=event.changedTouches[0].pageY-event.target.getBoundingClientRect().top;
	draggingFunction(event)
}
function touchCancelFunction(event){
	event.offsetX=event.changedTouches[0].pageX-event.target.getBoundingClientRect().left;
	event.offsetY=event.changedTouches[0].pageY-event.target.getBoundingClientRect().top;
	dragEndOut(event)
}
