function setQuestionType(elem){
	var buttons	=	elem.parentElement.getElementsByClassName(elem.classList[0]);
	var buttonIndex	=	false;
	for(var i=0;i<buttons.length;i++){
		buttons[i].classList.remove("buttonActive");
		if(buttons[i]==elem){
			buttonIndex	=	i;
		}
	}
	elem.classList.add("buttonActive");

	var questionTypes	=	elem.parentElement.parentElement.getElementsByClassName("questionType");
	for(var i=0;i<questionTypes.length;i++){
		if(buttonIndex==i){
			questionTypes[i].style.display="block";
		}else{
			questionTypes[i].style.display="none"
		}
	}
}

function selectQuestion(elem){
	var buttons	=	elem.parentElement.getElementsByClassName(elem.classList[0]);
	var questions	=	document.getElementById("questions-wrap").getElementsByClassName("questionWrap");
	var questionIndex	=	false;
	for(var i=0;i<buttons.length;i++){
		buttons[i].classList.remove("buttonActive");
		if(buttons[i]==elem){
			questionIndex	=	i;
		}
	}
	elem.classList.add("buttonActive");

	for(var i=0;i<questions.length;i++){
		questions[i].style.display="none";
	}
	if(questionIndex || questionIndex==0){
		questions[questionIndex].style.display="block";
	}else{
		console.log("Couldn't find question index");
	}

}

function addQuestion(){
	var buttons	=	document.getElementById("question-numbers-list").getElementsByClassName("button");
	var button	=	document.createElement("LI");
	button.setAttribute("class","button");
	button.setAttribute("onclick","selectQuestion(this)");
	button.innerHTML=eval(buttons.length+1)+".";
	document.getElementById("question-numbers-list").appendChild(button);
	createQuestion();
	selectQuestion(button);
}

function createQuestion(){
	var questionWrap	=	document.createElement("DIV");
	questionWrap.setAttribute("class","questionWrap");
	questionWrap.innerHTML=document.getElementById("question-template").innerHTML;
	var questionNumber	=	document.getElementById("question-numbers-list").getElementsByClassName("button").length;
	questionWrap.getElementsByClassName("image2")[0].setAttribute("name","file-"+questionNumber+"-2");//2 is for question type
	questionWrap.getElementsByClassName("image5")[0].setAttribute("name","file-"+questionNumber+"-5");//5 is for question type

	document.getElementById("questions-wrap").appendChild(questionWrap)
}

function removeQuestion(elem){
	var questionIndex	=	false;
	var questions	=	elem.parentElement.parentElement.parentElement.getElementsByClassName("questionWrap");
	for(var i=0;i<questions.length;i++){
		if(elem.parentElement.parentElement==questions[i]){
			questionIndex	=	i;
			break;
		}
	}

	if(questionIndex || questionIndex==0){
		elem.parentElement.parentElement.parentElement.removeChild(elem.parentElement.parentElement);
		document.getElementById("question-numbers-list").removeChild(document.getElementById("question-numbers-list").getElementsByClassName("button")[questionIndex]);
	}else{
		console.log("Couldnt find which question to delete");
	}
}

function imageUploaded(elem){
	if(elem.files && elem.files[0]){
		var reader = new FileReader();
		reader.onload = function(e){
			elem.parentElement.getElementsByClassName("image")[0].src=e.target.result;

		}

		reader.readAsDataURL(elem.files[0]);
	}
}

addQuestion();

function addAnswer(elem){
	var questionType	=	false;
	var questionTypes	=	elem.parentElement.parentElement.getElementsByClassName("questionType");
	for(var i=0;i<questionTypes.length;i++){
		if(questionTypes[i].getElementsByClassName("addAnswerButton")[0]==elem){
			questionType	=	eval(i+1);
		}
	}

	if(questionType || questionType==0){
		switch (questionType){
			case 1:
				//True-false text
				var answerWrap	=	document.createElement("DIV");
				answerWrap.setAttribute("class","answerWrap");

					var answer	=	document.createElement("DIV");
					answer.setAttribute("class","button answer");

						var answerInput	=	document.createElement("INPUT");
						answerInput.setAttribute("type","text");
						answerInput.setAttribute("class","answerTextInput");
						answer.appendChild(answerInput);

						var answerDelete	=	document.createElement("DIV");
						answerDelete.setAttribute("class","killAnswer");
						answerDelete.setAttribute("onclick","this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement)");
						answerDelete.innerHTML="X";
						answer.appendChild(answerDelete);

					answerWrap.appendChild(answer);

					var answerAttributes	=	document.createElement("DIV");
					answerAttributes.setAttribute("class","answerAttributes");

						var answerAttribute	=	document.createElement("DIV");
						answerAttribute.innerHTML="<div style='display:inline-block'>Answer is True: </div><div style='display:inline-block;width:20px;'><input class='truefalse' type='checkbox'></div>";
						answerAttributes.appendChild(answerAttribute);

					answerWrap.appendChild(answerAttributes);

				questionTypes[questionType-1].getElementsByClassName("answersWrap")[0].appendChild(answerWrap);
				break;
			case 2:
				//true-false image
				var answer	=	document.createElement("DIV");
				answer.setAttribute("class","imageAnswer");
				answer.setAttribute("style","width:30px;height:30px;top:0px;left:0px;");

				questionTypes[questionType-1].getElementsByClassName("imageWrap")[0].appendChild(answer);
				$(function() {
					$(".imageAnswer").draggable({
						"containment":$(".imageAnswer").parent()
					}).resizable({
						"containment":$(".imageAnswer").parent()
					});

				});
				break;
			case 3:
				//Reorder actions
				var answerWrap	=	document.createElement("DIV");
				answerWrap.setAttribute("class","answerWrap");

					var answer	=	document.createElement("INPUT");
					answer.setAttribute("type","text");
					answer.setAttribute("class","answer");
					answerWrap.appendChild(answer);

					var answerDelete	=	document.createElement("DIV");
					answerDelete.setAttribute("class","killAnswer");
					answerDelete.setAttribute("onclick","this.parentElement.parentElement.removeChild(this.parentElement)");
					answerDelete.innerHTML="X";
					answerWrap.appendChild(answerDelete);

				questionTypes[questionType-1].getElementsByClassName("answersWrap")[0].appendChild(answerWrap);
				break;
			case 4:
				//Connect questions
				var answerWrap	=	document.createElement("DIV");
				answerWrap.setAttribute("class","answerWrap");

					var answer	=	document.createElement("DIV");
					answer.setAttribute("class","answer");

						var input	=	document.createElement("INPUT");
						input.setAttribute("class","answerInput");
						input.setAttribute("type","text");
						answer.appendChild(input);

					answerWrap.appendChild(answer);

					var answer	=	document.createElement("DIV");
					answer.setAttribute("class","answer");

						var input	=	document.createElement("INPUT");
						input.setAttribute("class","answerInput");
						input.setAttribute("type","text");
						answer.appendChild(input);

					answerWrap.appendChild(answer);

					var answerDelete	=	document.createElement("DIV");
					answerDelete.setAttribute("class","killAnswer");
					answerDelete.setAttribute("onclick","this.parentElement.parentElement.removeChild(this.parentElement)");
					answerDelete.innerHTML="X";
					answerWrap.appendChild(answerDelete);

				questionTypes[questionType-1].getElementsByClassName("answersWrap")[0].appendChild(answerWrap);
				break;
			case 5:
				//Tap on image and add a story
				var answer	=	document.createElement("DIV");
				answer.setAttribute("class","imageAnswer");
				answer.setAttribute("style","width:30px;height:30px;top:0px;left:0px;");
				answer.innerHTML=eval(questionTypes[questionType-1].getElementsByClassName("imageWrap")[0].getElementsByClassName("imageAnswer").length+1)+".";

				questionTypes[questionType-1].getElementsByClassName("imageWrap")[0].appendChild(answer);
				$(function() {
					$(".imageAnswer").draggable({
						"containment":$(".imageAnswer").parent()
					}).resizable({
						"containment":$(".imageAnswer").parent()
					});

				});

				var answerWrap	=	document.createElement("DIV");
				answerWrap.setAttribute("class","answerWrap");

					var title	=	document.createElement("DIV");
					title.setAttribute("class","title");
					title.innerHTML=eval(questionTypes[questionType-1].getElementsByClassName("imageWrap")[0].getElementsByClassName("imageAnswer").length)+".";
					answerWrap.appendChild(title);

					var correctText	=	document.createElement("TEXTAREA");
					correctText.setAttribute("class","correctText");
					answerWrap.appendChild(correctText);

				questionTypes[questionType-1].getElementsByClassName("answersWrap")[0].appendChild(answerWrap);

				break;
		}
	}else{
		console.log("couldn't figure out question type");
	}
}

function submitQuest(){
	var questJson		=	{};
	questJson.company	=	"Huntsman";
	questJson.name		=	document.getElementById("title").value;
	questJson.id		=	new Date().getTime();
	questJson.questions	=	[];
	var questions		=	document.getElementsByClassName("questionWrap");
	
	for(var i=0;i<questions.length;i++){
		var question			=	questions[i];//Hide all questions first
		for(var j=0;j<questions.length;j++){
			questions[j].style.display	=	"none";
		}
		question.style.display	=	"block";//You need to display images to extract widths and heights
		var questionType		=	-1;
		var buttons				=	question.getElementsByClassName("questionTypeButtonsWrap")[0].getElementsByClassName("button");
		for(var j=0;j<buttons.length;j++){
			if(buttons[j].classList.contains("buttonActive")){
				questionType	=	eval(j+1);
				break;
			}
		}
		var questionJson			=	{};
		questionJson.text			=	question.getElementsByClassName("questionText")[0].value;
		questionJson.type			=	questionType;
		questionJson.scoreImpact	=	Number(question.getElementsByClassName("questionWorthInput")[0].value);
		switch (questionType){
			case 1:
				//True false
				questionJson.image			=	"";
				questionJson.activePoints	=	[];
				questionJson.answers		=	[];
				var answers					=	question.getElementsByClassName("answersWrap")[0].getElementsByClassName("answer");
				for(var j=0;j<answers.length;j++){
					var answerJson			=	{};
					var answer				=	answers[j];
					answerJson.text			=	answer.getElementsByClassName("answerTextInput")[0].value;
					answerJson.correct		=	answer.parentElement.getElementsByClassName("truefalse")[0].checked;
					answerJson.coordinates	=	{};
					answerJson.size			=	{};
					answerJson.order		=	"";
					answerJson.partnerId	=	"";
					answerJson.image		=	"";
					questionJson.answers.push(answerJson);
				}
				questJson.questions.push(questionJson);
				break;
			case 2:
				//True false image
				questionJson.image			=	"";//Handle on server side
				questionJson.activePoints	=	[];
				questionJson.answers		=	[];
				var answers					=	question.getElementsByClassName("imageWrap")[0].getElementsByClassName("imageAnswer");
				var totalWidth				=	question.getElementsByClassName("imageWrap")[0].offsetWidth;
				var totalHeight				=	question.getElementsByClassName("imageWrap")[0].offsetHeight;
				for(var j=0;j<answers.length;j++){
					var answerJson				=	{};
					var answer					=	answers[j];
					answerJson.text				=	"";
					answerJson.correct			=	"";
					answerJson.coordinates		=	{};
					answerJson.coordinates.x	=	Number(answer.style.left.substring(0,answer.style.left.length-2))/totalWidth*100;
					answerJson.coordinates.y	=	Number(answer.style.top.substring(0,answer.style.top.length-2))/totalHeight*100;
					answerJson.size				=	{};
					answerJson.size.width		=	Number(answer.offsetWidth/totalWidth*100);
					answerJson.size.height		=	Number(answer.offsetWidth/totalHeight*100);
					answerJson.order			=	"";
					answerJson.partnerId		=	"";
					answerJson.image			=	"";
					questionJson.answers.push(answerJson);
				}
				questJson.questions.push(questionJson);
				break;
			case 3:
				//Reorder actions
				questionJson.image			=	"";
				questionJson.activePoints	=	[];
				questionJson.answers		=	[];
				var answers					=	question.getElementsByClassName("answersWrap")[1].getElementsByClassName("answer");
				for(var j=0;j<answers.length;j++){
					var answerJson			=	{};
					var answer				=	answers[j];
					answerJson.text			=	answer.value;
					answerJson.correct		=	"";
					answerJson.coordinates	=	{};
					answerJson.size			=	{};
					answerJson.order		=	eval(j+1);
					answerJson.partnerId	=	"";
					answerJson.image		=	"";
					questionJson.answers.push(answerJson);
				}
				questJson.questions.push(questionJson);
				break;
			case 4:
				//Connect answers
				questionJson.image			=	"";
				questionJson.activePoints	=	[];
				questionJson.answers		=	[];
				var answers					=	question.getElementsByClassName("answersWrap")[2].getElementsByClassName("answerWrap");
				//Left Answers
				for(var j=0;j<answers.length;j++){
					var answerJson					=	{};
					var answer						=	answers[j].getElementsByClassName("answer")[0].getElementsByClassName("answerInput")[0];
					answerJson.text					=	answer.value;
					answerJson.correct				=	"";
					answerJson.coordinates			=	{};
					answerJson.coordinates.position	=	"left";
					answerJson.size					=	{};
					answerJson.order				=	"";
					answerJson.partnerId			=	eval(j+1);
					answerJson.image				=	"";
					questionJson.answers.push(answerJson);
				}
				//Right Answers
				for(var j=0;j<answers.length;j++){
					var answerJson					=	{};
					var answer						=	answers[j].getElementsByClassName("answer")[1].getElementsByClassName("answerInput")[0];
					answerJson.text					=	answer.value;
					answerJson.correct				=	"";
					answerJson.coordinates			=	{};
					answerJson.coordinates.position	=	"right";
					answerJson.size					=	{};
					answerJson.order				=	"";
					answerJson.partnerId			=	eval(j+1);
					answerJson.image				=	"";
					questionJson.answers.push(answerJson);
				}
				questJson.questions.push(questionJson);

				break;
			case 5:
				//Tap on image and add a story
				questionJson.image			=	"";//Handle on server side
				questionJson.activePoints	=	[];
				questionJson.answers		=	[];
				var activePoints			=	question.getElementsByClassName("imageWrap")[1].getElementsByClassName("imageAnswer");
				var totalWidth				=	question.getElementsByClassName("imageWrap")[1].offsetWidth;
				var totalHeight				=	question.getElementsByClassName("imageWrap")[1].offsetHeight;
				for(var j=0;j<activePoints.length;j++){
					var activePointJson				=	{};
					var activePoint					=	activePoints[j];
					activePointJson.coordinates		=	{};
					activePointJson.coordinates.x	=	Number(activePoint.style.left.substring(0,activePoint.style.left.length-2))/totalWidth*100;
					activePointJson.coordinates.y	=	Number(activePoint.style.top.substring(0,activePoint.style.top.length-2))/totalHeight*100;
					activePointJson.size			=	{};
					activePointJson.size.width		=	Number(activePoint.offsetWidth/totalWidth*100);
					activePointJson.size.height		=	Number(activePoint.offsetHeight/totalHeight*100);
					activePointJson.correctText		=	question.getElementsByClassName("answersWrap")[3].getElementsByClassName("correctText")[j].value;
					questionJson.activePoints.push(activePointJson);
				}
				questJson.questions.push(questionJson);

				break;
			case 6:
				
				break;
		}
	}

	document.getElementById("quest-json").value=JSON.stringify(questJson);
	console.log(questJson)
	//document.getElementById('form').submit();
}