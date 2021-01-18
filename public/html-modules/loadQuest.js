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
		nextButton.setAttribute("id","prev-button");
		nextButton.setAttribute("class","button");
		nextButton.setAttribute("onclick","navigate(1)");
		nextButton.innerHTML="Next";
		questControls.appendChild(nextButton);
	questWrap.appendChild(questControls);

elemToAdd.appendChild(questWrap);

document.getElementsByClassName("questionWrap")[0].classList.add("questionActive");
document.getElementById("number").innerHTML="1/"+quest.questions.length;
document.getElementById("prev-button").classList.add("buttonInactive");