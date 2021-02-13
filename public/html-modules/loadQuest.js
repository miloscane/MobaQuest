console.log(quest)
var elemToAdd	=	document.getElementById("site-wrap");

var questWrap	=	document.createElement("DIV");
questWrap.setAttribute("class","questWrap");

	var questTitle			=	document.createElement("DIV");
	questTitle.setAttribute("class","questTitle");
	questTitle.innerHTML	=	quest.name;
	questWrap.appendChild(questTitle);

	var questionsWrap		=	document.createElement("DIV");
	questionsWrap.setAttribute("class","questionsWrap");

	for(var i=0;i<quest.questions.length;i++){
		var questionWrap	=	document.createElement("DIV");
		var question		=	JSON.parse(JSON.stringify(quest.questions[i]));
		questionWrap.setAttribute("class","questionWrap");
		questionWrap.classList.add("questionType"+Number(question.type))
		questionWrap.setAttribute("data-type",Number(question.type));
		questionWrap.setAttribute("data-scoreimpact",Number(question.scoreImpact))

			var questionText		=	document.createElement("DIV");
			questionText.setAttribute("class","questionText");
			questionText.innerHTML	=	question.text;
			questionWrap.appendChild(questionText);

			var answersWrap			=	document.createElement("DIV");
			answersWrap.setAttribute("class","answersWrap");

			switch (Number(question.type)){
				case 1:
					//True-false
					for(var j=0;j<question.answers.length;j++){
						var answer		=	JSON.parse(JSON.stringify(question.answers[j]));
						var answerElem	=	document.createElement("DIV");
						answerElem.setAttribute("class","answer button");
						answerElem.setAttribute("onclick","pickAnswer(this)");
						if(answer.correct){
							answerElem.classList.add("correct");
						}
						if(answer.image!=""){
							answerElem.innerHTML	=	"<img class='answerImage' src='"+answer.image+"'>";
						}else{
							answerElem.innerHTML	=	answer.text;
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
							var answer					=	JSON.parse(JSON.stringify(question.answers[j]));
							var imageAnswer				=	document.createElement("DIV");
							imageAnswer.setAttribute("class","answer correct");
							imageAnswer.style.top		=	answer.coordinates.y+"%";
							imageAnswer.style.left		=	answer.coordinates.x+"%";
							imageAnswer.style.width		=	answer.size.width+"%";
							imageAnswer.style.height	=	answer.size.height+"%";
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
					var answerList			=	document.createElement("UL");
					answerList.setAttribute("class","sortable");
					answerList.setAttribute("id","sortable"+i);
					var shuffledAnswers		=	shuffleArray(JSON.parse(JSON.stringify(question.answers)));
					for(var j=0;j<shuffledAnswers.length;j++){
						var answer							=	JSON.parse(JSON.stringify(shuffledAnswers[j]));
						var answerElem						=	document.createElement("LI");
						answerElem.setAttribute("class","answer");
						answerElem.setAttribute("data-order",Number(answer.order));
						shuffledAnswers[j].displaynum		=	eval(j+1);
						answerElem.innerHTML				=	eval(j+1)+". "+answer.text;
						answerList.appendChild(answerElem);
					}
					answersWrap.appendChild(answerList);

					var correctAnswers			=	document.createElement("DIV");
					correctAnswers.setAttribute("class","correctAnswers");
					var correctSequence			=	[];
					shuffledAnswers.sort((a,b)=>a.order - b.order);
					for(var j=0;j<shuffledAnswers.length;j++){
						correctSequence.push(shuffledAnswers[j].displaynum);
					}
					sequenceString				=	"Correct order: [ ";
					for(var j=0;j<correctSequence.length;j++){
						sequenceString			+=	correctSequence[j]+", ";
					}
					sequenceString				=	sequenceString.substring(0,sequenceString.length-2);
					sequenceString				+=	" ]";
					correctAnswers.innerHTML	=	sequenceString;

					answersWrap.appendChild(correctAnswers);

					break;

				case 4:
					//connect the dots
					var dragCanvasWrap	=	document.createElement("DIV");
					dragCanvasWrap.setAttribute("class","dragCanvasWrap");

						var dragTable		=	document.createElement("TABLE");
						dragTable.setAttribute("class","dragTable noselect");

							var tbody			=	document.createElement("TBODY");

								var tr				=	document.createElement("TR");

									var td				=	document.createElement("TD");
									td.setAttribute("class","answer-column");
									td.setAttribute("style","padding-left:2%");

										var shuffledAnswers	=	shuffleArray(JSON.parse(JSON.stringify(question.answers)));

										for(var j=0;j<shuffledAnswers.length;j++){
											var answer	=	JSON.parse(JSON.stringify(shuffledAnswers[j]));
											if(answer.coordinates.position=="left"){
												var	answerElem	=	document.createElement("DIV");
												answerElem.setAttribute("class","answer");
												answerElem.setAttribute("data-partnerId",Number(answer.partnerId));

												if(answer.image!=""){
													answerElem.innerHTML	=	"<img src='"+answer.image+"'>";
												}else{
													answerElem.innerHTML	=	answer.text;
												}
												td.appendChild(answerElem);
											}
										}

									tr.appendChild(td);

									var td				=	document.createElement("TD");
									td.setAttribute("class","answer-column");
									td.setAttribute("style","padding-right:2%");

										for(var j=0;j<shuffledAnswers.length;j++){
											var answer			=	JSON.parse(JSON.stringify(shuffledAnswers[j]));
											if(answer.coordinates.position=="right"){
												var	answerElem	=	document.createElement("DIV");
												answerElem.setAttribute("class","answer");
												answerElem.setAttribute("data-partnerId",Number(answer.partnerId));

												if(answer.image!=""){
													answerElem.innerHTML	=	"<img src='"+answer.image+"'>";
												}else{
													answerElem.innerHTML	=	answer.text;
												}
												td.appendChild(answerElem);
											}
										}

									tr.appendChild(td);

								tbody.appendChild(tr);

							dragTable.appendChild(tbody);

						dragCanvasWrap.appendChild(dragTable);

						var dragCanvas	=	document.createElement("DIV");
						dragCanvas.setAttribute("class","dragCanvas");
						dragCanvas.addEventListener("mousedown", dragStart);
						dragCanvas.addEventListener("mouseup", dragEnd);
						dragCanvas.addEventListener("mousemove", draggingFunction);
						dragCanvas.addEventListener("mouseout", dragEndOut);
						dragCanvas.addEventListener('contextmenu', event => event.preventDefault());
						//Touches
						dragCanvas.addEventListener("touchstart", touchStart);
						dragCanvas.addEventListener("touchend", touchEnd);
						dragCanvas.addEventListener("touchmove", touchMoveFunction);
						dragCanvas.addEventListener("touchcancel", touchCancelFunction);
						dragCanvasWrap.appendChild(dragCanvas);

						var drawCanvas	=	document.createElement("CANVAS");
						drawCanvas.setAttribute("class","drawCanvas");
						drawCanvas.setAttribute("width","335");
						drawCanvas.setAttribute("height","330");
						dragCanvasWrap.appendChild(drawCanvas);

					answersWrap.appendChild(dragCanvasWrap);

					var correctAnswers	=	document.createElement("DIV");
					correctAnswers.setAttribute("class","correctAnswers");

						var title		=	document.createElement("DIV");
						title.setAttribute("style","text-align:center");
						title.innerHTML	=	"Correct sequence:"
						correctAnswers.appendChild(title);

						var correctTable	=	document.createElement("TABLE");
						correctTable.setAttribute("class","correctTable");

							var tbody			=	document.createElement("TBODY");
								for(var j=0;j<question.answers.length;j++){
									var answer	=	question.answers[j];
									if(answer.coordinates.position=="left"){
										var tr		=	document.createElement("TR");
											var td		=	document.createElement("TD");
												var answerElem	=	document.createElement("DIV");
												answerElem.setAttribute("class","correctAnswer");
												if(answer.image!=""){
													answerElem.innerHTML	=	"<img src='"+answer.image+"'>";
												}else{
													answerElem.innerHTML	=	answer.text;
												}
												td.appendChild(answerElem);
											tr.appendChild(td);

											var td		=	document.createElement("TD");
												var answerElem	=	document.createElement("DIV");
												answerElem.setAttribute("class","correctAnswer");
												for(var k=0;k<question.answers.length;k++){
													var partnerAnswer	=	question.answers[k];
													if(partnerAnswer.partnerId==answer.partnerId){
														if(partnerAnswer.image!=""){
															answerElem.innerHTML	=	"<img src='"+partnerAnswer.image+"'>";
														}else{
															answerElem.innerHTML	=	partnerAnswer.text;
														}
														td.appendChild(answerElem);
													}
												}
												
											tr.appendChild(td);
											

										tbody.appendChild(tr);

									}
								}

							correctTable.appendChild(tbody);

						correctAnswers.appendChild(correctTable);

					answersWrap.appendChild(correctAnswers)



					break;

				case 5:
					//tap on image and add description
					var imageWrap	=	document.createElement("DIV");
					imageWrap.setAttribute("class","imageWrap");

						var image	=	document.createElement("IMG");
						image.setAttribute("src",question.image);
						imageWrap.appendChild(image);

						for(var j=0;j<question.activePoints.length;j++){
							var activePoint	=	JSON.parse(JSON.stringify(question.activePoints[j]));
							var activeElem	=	document.createElement("DIV");
							activeElem.setAttribute("class","activePoint");
							activeElem.style.left	=	activePoint.coordinates.x+"%";
							activeElem.style.top	=	activePoint.coordinates.y+"%";
							activeElem.style.width	=	activePoint.size.width+"%";
							activeElem.style.height	=	activePoint.size.height+"%";
							activeElem.setAttribute("onclick","focusAnswer(this)");
							activeElem.innerHTML	=	eval(i+1)+".";

							imageWrap.appendChild(activeElem);
						}

					answersWrap.appendChild(imageWrap);

					var answers	=	document.createElement("DIV");
					answers.setAttribute("class","answers");

						for(var j=0;j<question.activePoints.length;j++){
							var activePoint	=	JSON.parse(JSON.stringify(question.activePoints[j]));

							var answerWrap	=	document.createElement("DIV");
							answerWrap.setAttribute("class","answerWrap")

								var answerTitle				=	document.createElement("DIV");
								answerTitle.setAttribute("class","answerTitle");
								answerTitle.innerHTML		=	eval(i+1)+".";
								answerWrap.appendChild(answerTitle);

								var answerTextarea			=	document.createElement("TEXTAREA");
								answerTextarea.setAttribute("class","answerTextarea");
								answerWrap.appendChild(answerTextarea);

								var correctAnswers			=	document.createElement("DIV");
								correctAnswers.setAttribute("class","correctAnswers");
								correctAnswers.innerHTML	=	activePoint.correctText;
								answerWrap.appendChild(correctAnswers);

							answers.appendChild(answerWrap);
						}

					answersWrap.appendChild(answers);

					break;

				case 6:
					//write a story and recognize keywords
					var answerWrap	=	document.createElement("DIV");
					answerWrap.setAttribute("class","answerWrap");

						var answer	=	document.createElement("TEXTAREA");
						answer.setAttribute("class","answer");
						answer.setAttribute("data-keywords",JSON.stringify(question.keywords));
						answerWrap.appendChild(answer);

					answersWrap.appendChild(answerWrap);

					var correctAnswers			=	document.createElement("DIV");
					correctAnswers.setAttribute("class","correctAnswers");
					correctAnswers.innerHTML	=	question.correctText;
					answerWrap.appendChild(correctAnswers);

					break;
			}

			questionWrap.appendChild(answersWrap);

			var score	=	document.createElement("DIV");
			score.setAttribute("class","score");
			questionWrap.appendChild(score);

		questionsWrap.appendChild(questionWrap);
	}

	var questResult		=	document.createElement("DIV");
	questResult.setAttribute("id","result");
	questionsWrap.appendChild(questResult);

	questWrap.appendChild(questionsWrap);

	var questControls	=	document.createElement("DIV");
	questControls.setAttribute("class","questControls");

		var previousButton			=	document.createElement("DIV");
		previousButton.setAttribute("id","prev-button");
		previousButton.setAttribute("class","button");
		previousButton.setAttribute("onclick","navigate(-1)");
		previousButton.innerHTML	=	"Previous";
		questControls.appendChild(previousButton);

		var number					=	document.createElement("DIV");
		number.setAttribute("id","number");
		questControls.appendChild(number);

		var nextButton				=	document.createElement("DIV");
		nextButton.setAttribute("id","next-button");
		nextButton.setAttribute("class","button");
		nextButton.setAttribute("onclick","navigate(1)");
		nextButton.innerHTML		=	"Next";
		questControls.appendChild(nextButton);
	questWrap.appendChild(questControls);

elemToAdd.appendChild(questWrap);

function navigate(num){
	var questionToOpen	=	0;
	document.getElementsByClassName("questWrap")[0].scrollTop = 0;
	var questions		=	document.getElementsByClassName("questionWrap");
	var totalQuestions	=	quest.questions.length;
	for(var i=0;i<questions.length;i++){
		if(questions[i].classList.contains("questionActive")){
			questionToOpen	=	i+num;
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
		document.getElementById("next-button").innerHTML	=	"Next";
		document.getElementById("prev-button").innerHTML	=	"Previous";
		document.getElementById("result").style.display		=	"none";
		document.getElementById("number").innerHTML			=	"1/"+totalQuestions;
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
			document.getElementById("next-button").innerHTML	=	"Results";
		}else{
			document.getElementById("next-button").innerHTML	=	"Finish Quest";
		}
		document.getElementById("result").style.display	=	"none";
		document.getElementById("number").innerHTML		=	eval(questionToOpen+1)+"/"+totalQuestions;
	}else if(questionToOpen>=questions.length){
		//Quest has ended
		for(var i=0;i<questions.length;i++){
			questions[i].classList.remove("questionActive");
			questions[i].classList.remove("questionHiddenRight");
			questions[i].classList.add("questionHiddenLeft");
		}
		document.getElementById("next-button").innerHTML	=	"Quest ended";
		document.getElementById("next-button").classList.add("buttonInactive");
		document.getElementById("prev-button").classList.remove("buttonInactive");
		document.getElementById("prev-button").innerHTML	=	"Review Answers";
		document.getElementById("result").style.display		=	"block";
		document.getElementById("number").innerHTML			=	"";
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
		document.getElementById("next-button").innerHTML	=	"Next";
		document.getElementById("prev-button").innerHTML	=	"Previous";
		document.getElementById("result").style.display		=	"none";
		document.getElementById("number").innerHTML			=	eval(questionToOpen+1)+"/"+totalQuestions;
	}

	if(document.getElementsByClassName("questionActive")[0]){
		if(document.getElementsByClassName("questionActive")[0].getBoundingClientRect().height>document.getElementsByClassName("questWrap")[0].getBoundingClientRect().height){
			document.getElementsByClassName("questWrap")[0].classList.remove("noOverflow")
		}else{
			document.getElementsByClassName("questWrap")[0].classList.add("noOverflow")
		}
	}
}

navigate(1);

function pickAnswer(elem){
	console.log(elem.parentElement.parentElement);
	var question	=	elem.parentElement.parentElement;
	var type		=	Number(question.dataset.type);
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
		var elemRect		=	currentAnswer.getBoundingClientRect();
		var boundingBox		=	elem;
		var top				=	elemRect.top-boundingBox.getBoundingClientRect().top;//Because main image is not at the top of viewport
		var bottom			=	top	+ elemRect.height;
		
		var left			=	elemRect.left-boundingBox.getBoundingClientRect().left;
		var right			=	left	+ elemRect.width;

		if(event.offsetY<bottom && event.offsetY>top && event.offsetX>left && event.offsetX<right){
			answerExists	=	true;
			var answerIndex	=	i;
			break;
		}
	}

	if(!answerExists){
		var answer					=	document.createElement("DIV");
		answer.setAttribute("class","imageAnswer");
		answer.style.top			=	eval(event.offsetY-13)+"px";
		answer.style.left			=	eval(event.offsetX-13)+"px";
		answer.dataset.coordinates	=	event.offsetX+","+event.offsetY;
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

function focusAnswer(elem){
	var activePoints	=	elem.parentElement.getElementsByClassName(elem.classList[0]);
	for(var i=0;i<activePoints.length;i++){
		if(activePoints[i] == elem){
			document.getElementsByClassName("questionActive")[0].querySelectorAll("textarea")[i].focus();
			break;
		}
	}
}

function finishQuest(){
	document.getElementsByClassName("questionsWrap")[0].classList.add("finished");
	//Scoring
	var questions	=	document.getElementsByClassName("questionWrap");
	var scoreArray	=	[];
	for(var i=0;i<questions.length;i++){
		var question	=	questions[i];
		switch (Number(question.dataset.type)){
			case 1:
				//True-false
				var answers						=	question.querySelectorAll(".answer");
				var PickedCorrectAnswers		=	0;
				var TotalCorrectAnswers			=	0;
				var PickedWrongAnswers			=	0;
				for(var j=0;j<answers.length;j++){
					answer						=	answers[j];
					if(answer.classList.contains("correct")){
						TotalCorrectAnswers		=	TotalCorrectAnswers+1;
					}
					if(answer.classList.contains("answerSelected") && answer.classList.contains("correct")){
						PickedCorrectAnswers	=	PickedCorrectAnswers+1;
					}
					if(answer.classList.contains("answerSelected") && !answer.classList.contains("correct")){
						PickedWrongAnswers		=	PickedWrongAnswers+1;
					}
				}
				var score						=	Math.max(0,(PickedCorrectAnswers-PickedWrongAnswers*0.5)/TotalCorrectAnswers*Number(question.dataset.scoreimpact));
				scoreArray.push(score);
				break;
			case 2:
				//True-false image
				var answers						=	question.querySelectorAll(".answer");
				var PickedCorrectAnswers		=	0;
				var TotalCorrectAnswers			=	0;
				var PickedWrongAnswers			=	0;
				for(var j=0;j<answers.length;j++){
					answer						=	answers[j];
					if(answer.classList.contains("correct")){
						TotalCorrectAnswers		=	TotalCorrectAnswers+1;
					}
				}
				var pickedAnswers				=	question.getElementsByClassName("imageAnswer");
				for(var j=0;j<pickedAnswers.length;j++){
					var pickedAnswer			=	pickedAnswers[j];
					var x						=	Number(pickedAnswer.dataset.coordinates.split(",")[0]);
					var y						=	Number(pickedAnswer.dataset.coordinates.split(",")[1]);
					var answerCorrect			=	false;
					for(var k=0;k<answers.length;k++){
						//Check if x and y are inside element (boundingBox is the large box which contains main image)
						var elemRect			=	answers[k].getBoundingClientRect();
						var top					=	elemRect.top-question.getElementsByClassName("imageOverlay")[0].getBoundingClientRect().top;//Because main image is not at the top of viewport
						var bottom				=	top	+ elemRect.height;
						
						var left				=	elemRect.left-question.getElementsByClassName("imageOverlay")[0].getBoundingClientRect().left;
						var right				=	left	+ elemRect.width;
						
						if(y<bottom && y>top && x>left && x<right){
							answerCorrect		=	true;
							break;
						}
					}
					if(answerCorrect){
						PickedCorrectAnswers	=	PickedCorrectAnswers+1;
					}else{
						PickedWrongAnswers		=	PickedWrongAnswers+1;
					}
				}
				var score						=	Math.max(0,(PickedCorrectAnswers-PickedWrongAnswers*0.5)/TotalCorrectAnswers*Number(question.dataset.scoreimpact));
				scoreArray.push(score);
				break;
			case 3:
				//Reorder actions
				var correctOrder				=	true;
				for(var j=0;j<question.getElementsByClassName("answer").length;j++){
					if(eval(j+1)!=Number(question.getElementsByClassName("answer")[j].dataset.order)){
						correctOrder			=	false;
					}
				}
				if(correctOrder){
					scoreArray.push(Number(question.dataset.scoreimpact))
				}else{
					scoreArray.push(0);
				}
				break;
			case 4:
				//connect the dots
				var PickedCorrectAnswers	=	0;
				var TotalCorrectAnswers		=	question.getElementsByClassName("answer-column")[0].getElementsByClassName("answer").length;
				var PickedWrongAnswers		=	0;

				for(var j=0;j<TotalCorrectAnswers;j++){
					var answer			=	question.getElementsByClassName("answer-column")[0].getElementsByClassName("answer")[j];
					var answerCorrect	=	false;
					for(var k=0;k<TotalCorrectAnswers;k++){
						if(answer.dataset.answerindex){
							if(answer.dataset.answerindex==question.getElementsByClassName("answer-column")[1].getElementsByClassName("answer")[k].dataset.answerindex){
								//found the connected answer, now find out if its the correct one
								if(answer.dataset.partnerid==question.getElementsByClassName("answer-column")[1].getElementsByClassName("answer")[k].dataset.partnerid){
									PickedCorrectAnswers	=	PickedCorrectAnswers+1;
								}else{
									PickedWrongAnswers		=	PickedWrongAnswers+1;
								}
								break;
							}
						}
					}
				}
				var score	=	Math.max(0,(PickedCorrectAnswers-PickedWrongAnswers*0.5)/TotalCorrectAnswers*Number(question.dataset.scoreimpact));
				scoreArray.push(score);
				break;
			case 5:
				//tap on image and add description
				scoreArray.push("review");
				break;
			case 6:
				//write a story and recognize keywords
				scoreArray.push("review");
				break;
		}
		if(scoreArray[i]!="review"){
			var scoreDisp	=	(scoreArray[i].toString().split(".")[1]) ? scoreArray[i].toFixed(2) : scoreArray[i];
			question.getElementsByClassName("score")[0].innerHTML	=	"Scored <span>" + scoreDisp + "</span> out of <span>" + questions[i].dataset.scoreimpact + "</span>";	
		}else{
			question.getElementsByClassName("score")[0].innerHTML	=	"Waiting for review";
		}
		
	}
	var totalScore		=	0;
	var reviews			=	0;
	for(var i=0;i<scoreArray.length;i++){
		if(scoreArray[i]!="review"){
			totalScore	=	eval(totalScore + scoreArray[i]);
		}else{
			reviews++;
		}
	}

	var totalScoreDisp	=	(totalScore.toString().split(".")[1]) ? totalScore.toFixed(2) : totalScore;

	document.getElementById("result").innerHTML			=	"You scored <span>" + totalScoreDisp + "</span> out of <span>100</span><br>&nbsp;<br>";
	if(reviews>0){
		if(reviews==1){
			document.getElementById("result").innerHTML	+=	reviews + " question is waiting for review";	
		}else{
			document.getElementById("result").innerHTML +=	reviews + " questions are waiting for reviews";	
		}
	}
}