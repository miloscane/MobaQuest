console.log(quest)
var elemToAdd	=	document.getElementById("site-wrap");

var questWrap	=	document.createElement("DIV");
questWrap.setAttribute("class","questWrap");

	var questTitle	=	document.createElement("DIV");
	questTitle.setAttribute("class","questTitle");
	questTitle.innerHTML=quest.name;
	questWrap.appendChild(questTitle);

	var questionsWrap	=	document.createElement("DIV");
	questionsWrap.setAttribute("class","questionsWrap");

	for(var i=0;i<quest.questions.length;i++){
		var questionWrap	=	document.createElement("DIV");
		var question	=	JSON.parse(JSON.stringify(quest.questions[i]));
		questionWrap.setAttribute("class","questionWrap");
		questionWrap.setAttribute("data-type",Number(question.type));
		questionWrap.setAttribute("data-scoreImpact",Number(question.scoreImpact))

			var questionTitle	=	document.createElement("DIV");
			questionTitle.setAttribute("class","questionTitle");
			questionTitle.innerHTML	=	question.text;
			questionWrap.appendChild(questionTitle);

			var answersWrap	=	document.createElement("DIV");
			answersWrap.setAttribute("class","answersWrap");

			switch (Number(question.type)){
				case 1:
					//True-false
					for(var j=0;j<question.answers.length;j++){
						var answer	=	JSON.parse(JSON.stringify(question.answers[j]));
						var answerElem	=	document.createElement("DIV");
						answerElem.setAttribute("class","answer textAnswer");
						if(answer.correct){
							answerElem.classList.add("correct");
						}
						if(answer.image!=""){
							answerElem.innerHTML="<img class='answerImage' src='"+answer.image+"'>";
						}else{
							answerElem.innerHTML=answer.text;
						}
						answersWrap.appendChild(answerElem);

					}
					break;
			}

			questionWrap.appendChild(answersWrap);

		questionsWrap.appendChild(questionWrap);
	}

	var questResult	=	document.createElement("DIV");
	questResult.setAttribute("id","result");
	questionsWrap.appendChild(questResult);

	questWrap.appendChild(questionsWrap);

	var questControls	=	document.createElement("DIV");
	questControls.setAttribute("class","questControls");

		var previousButton	=	document.createElement("DIV");
		previousButton.setAttribute("id","prev-button");
		previousButton.setAttribute("class","button");
		previousButton.setAttribute("onclick","navigate(-1)");
		previousButton.innerHTML="Previous";
		questControls.appendChild(previousButton);

		var number	=	document.createElement("DIV");
		number.setAttribute("id","number");
		questControls.appendChild(number);

		var nextButton	=	document.createElement("DIV");
		nextButton.setAttribute("id","next-button");
		nextButton.setAttribute("class","button");
		nextButton.setAttribute("onclick","navigate(1)");
		nextButton.innerHTML="Next";
		questControls.appendChild(nextButton);
	questWrap.appendChild(questControls);

elemToAdd.appendChild(questWrap);

function navigate(num){
	var questionToOpen	=	0;
	document.getElementsByClassName("questWrap")[0].scrollTop = 0;
	var questions	=	document.getElementsByClassName("questionWrap");
	var totalQuestions	=	quest.questions.length;
	for(var i=0;i<questions.length;i++){
		if(questions[i].classList.contains("questionActive")){
			questionToOpen=i+num;
		}
	}
	
	if(questionToOpen<=0){
		//First question will open
		for(var i=0;i<questions.length;i++){
			questions[i].classList.remove("questionActive");
			questions[i].classList.remove("questionHiddenLeft");
			questions[i].classList.add("questionHiddenRight");
		}
		questions[0].classList.add("questionActive");
		questions[0].classList.remove("questionHiddenRight");
		document.getElementById("prev-button").classList.add("buttonInactive");
		document.getElementById("next-button").classList.remove("buttonInactive");
		document.getElementById("next-button").innerHTML="Next";
		document.getElementById("prev-button").innerHTML="Previous";
		document.getElementById("result").style.display="none";
		document.getElementById("number").innerHTML="1/"+totalQuestions;
	}else if(questionToOpen==eval(questions.length-1)){
		//Last question is going to open now
		for(var i=0;i<questions.length;i++){
			questions[i].classList.remove("questionActive");
			questions[i].classList.remove("questionHiddenRight");
			questions[i].classList.add("questionHiddenLeft");
		}
		questions[questionToOpen].classList.add("questionActive");
		questions[questionToOpen].classList.remove("questionHiddenLeft");
		if(document.getElementsByClassName("questWrap")[0].classList.contains("finished")){
			document.getElementById("next-button").innerHTML="Results";
		}else{
			document.getElementById("next-button").innerHTML="Finish Quest";
		}
		document.getElementById("result").style.display="none";
		document.getElementById("number").innerHTML=eval(questionToOpen+1)+"/"+totalQuestions;
	}else if(questionToOpen>=questions.length){
		//Quest has ended
		for(var i=0;i<questions.length;i++){
			questions[i].classList.remove("questionActive");
			questions[i].classList.remove("questionHiddenRight");
			questions[i].classList.add("questionHiddenLeft");
		}
		document.getElementById("next-button").innerHTML="Quest ended";
		document.getElementById("next-button").classList.add("buttonInactive");
		document.getElementById("prev-button").classList.remove("buttonInactive");
		document.getElementById("prev-button").innerHTML="Review Answers";
		document.getElementById("result").style.display="block";
		document.getElementById("number").innerHTML="";
		finishQuest();
	}else{
		for(var i=0;i<questions.length;i++){
			questions[i].classList.remove("questionActive");
			if(i<questionToOpen){
				questions[i].classList.remove("questionHiddenRight");
				questions[i].classList.add("questionHiddenLeft");
			}else{
				questions[i].classList.remove("questionHiddenLeft");
				questions[i].classList.add("questionHiddenRight");
			}
		}
		questions[questionToOpen].classList.add("questionActive");
		document.getElementById("prev-button").classList.remove("buttonInactive");
		document.getElementById("next-button").classList.remove("buttonInactive");
		document.getElementById("next-button").innerHTML="Next";
		document.getElementById("prev-button").innerHTML="Previous";
		document.getElementById("result").style.display="none";
		document.getElementById("number").innerHTML=eval(questionToOpen+1)+"/"+totalQuestions;
	}
}

navigate(1);