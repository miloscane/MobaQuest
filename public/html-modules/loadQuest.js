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
		questionWrap.classList.add("questionType"+Number(question.type))
		questionWrap.setAttribute("data-type",Number(question.type));
		questionWrap.setAttribute("data-scoreImpact",Number(question.scoreImpact))

			var questionText	=	document.createElement("DIV");
			questionText.setAttribute("class","questionText");
			questionText.innerHTML	=	question.text;
			questionWrap.appendChild(questionText);

			var answersWrap	=	document.createElement("DIV");
			answersWrap.setAttribute("class","answersWrap");

			switch (Number(question.type)){
				case 1:
					//True-false
					for(var j=0;j<question.answers.length;j++){
						var answer	=	JSON.parse(JSON.stringify(question.answers[j]));
						var answerElem	=	document.createElement("DIV");
						answerElem.setAttribute("class","answer button");
						answerElem.setAttribute("onclick","pickAnswer(this)");
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

				case 2:
					//Tap on image

					var imageWrap	=	document.createElement("DIV");
					imageWrap.setAttribute("class","imageWrap");

						var image	=	document.createElement("IMG");
						image.setAttribute("src",question.image);
						imageWrap.appendChild(image);

						for(var j=0;j<question.answers.length;j++){
							var answer	=	JSON.parse(JSON.stringify(question.answers[j]));
							var imageAnswer	=	document.createElement("DIV");
							imageAnswer.setAttribute("class","answer correct");
							imageAnswer.style.top=answer.coordinates.y+"%";
							imageAnswer.style.left=answer.coordinates.x+"%";
							imageAnswer.style.width=answer.size.width+"%";
							imageAnswer.style.height=answer.size.height+"%";
							imageWrap.appendChild(imageAnswer);
						}

					var imageOverlay	=	document.createElement("DIV");
					imageOverlay.setAttribute("class","imageOverlay");
					imageOverlay.setAttribute("onclick","pickAnswerOnImage(event,this)");
					imageWrap.appendChild(imageOverlay);

					answersWrap.appendChild(imageWrap);

					break;

				case 3:
					//Reorder
					var answerList	=	document.createElement("UL");
					answerList.setAttribute("class","sortable");
					answerList.setAttribute("id","sortable"+i);
					for(var j=0;j<question.answers.length;j++){
						var answer	=	JSON.parse(JSON.stringify(question.answers[j]));
						var answerElem	=	document.createElement("LI");
						answerElem.setAttribute("class","answer");
						answerElem.setAttribute("data-order",Number(answer.order));
						answerElem.innerHTML	=	eval(j+1)+". "+answer.text;
						answerList.appendChild(answerElem);
					}
					answersWrap.appendChild(answerList);
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
		document.getElementsByClassName("questionsWrap")[0].classList.add("finished")
		document.getElementById("number").innerHTML="";
		//finishQuest();
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

function pickAnswer(elem){
	console.log(elem.parentElement.parentElement);
	var question	=	elem.parentElement.parentElement;
	var type	=	Number(question.dataset.type);
	switch (type){
		case 1:
			if(elem.classList.contains("answerSelected")){
				elem.classList.remove("answerSelected")
			}else{
				elem.classList.add("answerSelected")
			}
			break;
	}
}

function pickAnswerOnImage(event,elem){
		var answerExists	=	false;
		var currentAnswers	=	elem.parentElement.getElementsByClassName("imageAnswer");
		for(var i=0;i<currentAnswers.length;i++){
			var currentAnswer	=	currentAnswers[i];
			var elemRect	=	currentAnswer.getBoundingClientRect();
			var boundingBox	=	elem;
			var top			=	elemRect.top-boundingBox.getBoundingClientRect().top;//Because main image is not at the top of viewport
			var bottom		=	top	+ elemRect.height;
			
			var left	=	elemRect.left-boundingBox.getBoundingClientRect().left;
			var right	=	left	+ elemRect.width;

			if(event.offsetY<bottom && event.offsetY>top && event.offsetX>left && event.offsetX<right){
				answerExists	=	true;
				var answerIndex	=	i;
				break;
			}
		}

		if(!answerExists){
			var answer	=	document.createElement("DIV");
			answer.setAttribute("class","imageAnswer");
			answer.style.top=eval(event.offsetY-13)+"px";
			answer.style.left=eval(event.offsetX-13)+"px";
			answer.dataset.coordinates=event.offsetX+","+event.offsetY;
			elem.parentElement.appendChild(answer);
		}else{
			elem.parentElement.removeChild(currentAnswers[answerIndex]);
		}
}


//Initilazie sortable lists
for(var i=0;i<document.getElementsByClassName("sortable").length;i++){
	new Sortable(document.getElementsByClassName("sortable")[i], {
		animation: 150,
		ghostClass: 'invisible'
	});
}