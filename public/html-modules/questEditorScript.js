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
						answerAttribute.innerHTML="<div style='display:inline-block'>Answer is True: </div><div style='display:inline-block;width:20px;'><input type='checkbox'></div>";
						answerAttributes.appendChild(answerAttribute);

					answerWrap.appendChild(answerAttributes);

				questionTypes[questionType-1].getElementsByClassName("answersWrap")[0].appendChild(answerWrap);
				break;
			case 2:
				//true-false image
				var answer	=	document.createElement("DIV");
				answer.setAttribute("class","imageAnswer");

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
						answer.appendChild(input);

					answerWrap.appendChild(answer);

					var answer	=	document.createElement("DIV");
					answer.setAttribute("class","answer");

						var input	=	document.createElement("INPUT");
						input.setAttribute("class","answerInput");
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

				questionTypes[questionType-1].getElementsByClassName("imageWrap")[0].appendChild(answer);
				$(function() {
					$(".imageAnswer").draggable({
						"containment":$(".imageAnswer").parent()
					}).resizable({
						"containment":$(".imageAnswer").parent()
					});

				});
				break;
		}
	}else{
		console.log("couldn't figure out question type");
	}
}