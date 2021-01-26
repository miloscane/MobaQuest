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

addQuestion();