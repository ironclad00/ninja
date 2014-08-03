"use strict";

$(document).ready(function(){
	loadGauge("gauge",1);
});

function loadGauge(id, animate) {
	var jid = "#".concat(id);

	var rect;													/* object that contains the relative (x,y) coords of the four points of the gauge container */
	var cWidth;													/* width of the container that the gauge is in */
	var cHeight;												/* height of the container that the gauge is in */
	var startX;													/* x-coord of the top-left corner of the gauge container */
	var startY;													/* y-coord of the top-left corner of the gauge container */

	rect = (document.getElementById(id)).getBoundingClientRect();
	cWidth = document.getElementById(id).offsetWidth;
	cHeight = cWidth*0.65;
	startX = rect.left;
	if(animate)
		startY = rect.bottom+window.pageYOffset;
	else
		startY = rect.top+window.pageYOffset;
	$(jid).height(cHeight);
	
	/* the following are variables that are pulled from the database */
	var goal = 50000;											/* campaigns fundraising goal */
	var raised = 23000;											/* amount that the campaign has raised */
	var pcd = 2;												/* number of days left for a campaign*/
	var numCities = 5;											/* number of cities that the campaign has in its itinerary */
	var cityWorthArray = [30,40,50,72,100];						/* the percentage of the overall fundraising goal per city PLUS the percent worth of each city before it */
	var cityWorthArrayRel = [30,10,10,22,28];					/* relative worth of each city as a PERCENT of the overall fundraising goal */
	var cityNameArray = ["name1","name2","name3","name4","name5"];
	var cityBarArray = [numCities];								/* declaration of an array of svg objects used to draw progress bars for each individual city */
	/* end database variables */

	/* the following are variables that can be tweeked to adjust the gauge's design */
	var radius1 = 50;											/* radius of upper arc of top bar given as a PERCENT of the gauge container's width */
	var drawY = 70;												/* y-coord of the first point of the gauge as a PERCENT of the gauge container's height */
	var outerBarWidth = 10;										/* width of the fundraising progress bar as a PERCENT of the gauge container's width */
	var innerBarWidth = 10;										/* width of the time progress bar as a PERCENT of the gauge container's width */
	var intraBarSpacing = 10;									/* width of the space between the two progress bars as a PERCENT of the gauge container's width */
	var lrMargins = 12;											/* width of the margins as a PERCENT of the gauge container's width (example: if value=10, then both the left and the right margins will be 10% of the container's width for a total of 20%) */
	var textSpace = 5;
	var needleRad = 2;											/* radius of the circle of the needle as a PERCENT of the container's width */
	var timing = 10;											/* duration (in ms) of each animation frame */
	/* end of design variables */

	/* the following converts the above design and database variables to their appropriate values for use in the gauge */
	var pc = (raised/goal)*100;									/* pc is the overall completion of the fundraising goal as a percent */
	pcd = ((30-pcd)/30)*100;
	lrMargins = cWidth*(lrMargins/100);
	radius1 = cWidth*(radius1/100)-lrMargins;
	var radius2 = radius1-cWidth*0.1;							/* radius of the lower arc of the fundraising progress bar */
	var radius3 = radius2-cWidth*0.1;							/* radius of the upper arc of the time progress bar */
	var radius4 = radius3-cWidth*0.1;							/* radius of the lower arc of the time progress bar */
	drawY = cHeight*(drawY/100);
	outerBarWidth = cWidth*(outerBarWidth/100);
	innerBarWidth = cWidth*(innerBarWidth/100);
	intraBarSpacing = cWidth*(intraBarSpacing/100);
	textSpace = cHeight*(textSpace/100);

	/* end variable conversions */

	var m1prog;													/* svg object for the animated fundraising progress bar */
	var m2prog;													/* svg object for the animated time progress bar */
	var theta;													/* current angle of the fundraising progress bar */
	var theta2;													/* current angle of the time progress bar */
	var tempX1,tempY1;											/* keeps track of the x,y-coords of the top point on the fundraising progress bar */
	var tempX2,tempY2;											/* keeps track of the x,y-coords of the bottom point on the fundraising progress bar */
	var m1x1,m1y1;												/* current x,y-coords of the top point of the fundraising progress bar */
	var m1x2,m1y2;												/* current x,y-coords of the bottom point of the fundraising progress bar*/
	var m2x1,m2y1;												/* current x,y-coords of the top point of the time progress bar */
	var m2x2,m2y2;												/* current x,y-coords of the bottom point of the time progress bar */
	var xn1,yn1;												/* current x,y-coords of the fundraising needle */
	var xn2,yn2;												/* current x,y-coords of the time needle */
	var xd,yd;													/* current x,y-coords of the 'days' variable */
	var xm,ym;
	var pCity;													/* current percent complete of the city at index curCity */
	var prior;													/* value of the previous index in cityWorthArray */
	var percent;												/* equal to count/100 */
	var days;													/* variable used to track the number of days left for the text animation for the time progress bar */
	var money;

	var curCity=0;												/* index used in the city value arrays */
	var count=0;												/* keeps track of the animation loop iterations */
	/* the following variables are used to track the starting x,y-coords for drawing multiple svg progress objects for each city */
	var lastX1=lrMargins;
	var lastY1=drawY;
	var lastX2=outerBarWidth+lrMargins;
	var lastY2=drawY;
	/* end coord trackers */

	/* the following sets up all non-animate parts of the gauge */
	var paper = Raphael(startX, startY, cWidth, cHeight);
	var center = paper.circle((cWidth/2),drawY,(cWidth*(needleRad/100)));
	/*var title = paper.text((cWidth/2),(drawY*0.05), "Progress");*/
	/*var liftoff = paper.text((cWidth-lrMargins-outerBarWidth-(intraBarSpacing/2)),(drawY+3*textSpace), "LIFTOFF");*/
	var titleMoney = paper.text((lrMargins+(outerBarWidth/2)),(drawY+3.5*textSpace), "Amount\nRaised");
	var titleTime = paper.text((lrMargins+outerBarWidth+intraBarSpacing+(innerBarWidth/2)),(drawY+3.5*textSpace), "Days\nLeft");
	var daysStart = paper.text((lrMargins+outerBarWidth+intraBarSpacing+(innerBarWidth/2)),(drawY+textSpace), "30");
	var daysEnd = paper.text((cWidth-lrMargins-outerBarWidth-intraBarSpacing-(innerBarWidth/2)),(drawY+textSpace), "0");
	var moneyStart = paper.text((lrMargins+(outerBarWidth/2)),(drawY+textSpace), "$0");
	var moneyEnd = paper.text((cWidth-lrMargins-(outerBarWidth/2)),(drawY+textSpace), "$".concat(goal.toString()));
	var m1back = paper.path("M"+lrMargins+","+drawY+" A"+radius1+","+radius1+" 0,0,1 "+(cWidth-lrMargins)+","+drawY+" H"+(cWidth-outerBarWidth-lrMargins)+" A"+radius2+","+radius2+" 0,0,0 "+(outerBarWidth+lrMargins)+","+drawY+" Z");
	var m2back = paper.path("M"+(outerBarWidth+intraBarSpacing+lrMargins)+","+drawY+" A"+radius3+","+radius3+" 0,0,1 "+(cWidth-outerBarWidth-intraBarSpacing-lrMargins)+","+drawY+" H"+(cWidth-outerBarWidth-intraBarSpacing-innerBarWidth-lrMargins)+" A"+radius4+","+radius4+" 0,0,0 "+(outerBarWidth+intraBarSpacing+innerBarWidth+lrMargins)+","+drawY+" Z");
	for(var j=0; j<numCities; j++) {
		theta = (cityWorthArray[j]/100)*Math.PI;
		m1x1 = Math.abs(radius1*Math.cos(theta)-(cWidth/2));
		m1y1 = Math.abs(radius1*Math.sin(theta)-drawY);
		m1x2 = Math.abs(radius2*Math.cos(theta)-(cWidth/2-lrMargins))+lrMargins;
		m1y2 = Math.abs(radius2*Math.sin(theta)-drawY);
		var partition = paper.path("M"+m1x1+","+m1y1+" L"+m1x2+","+m1y2);
		partition.attr("stroke", "#999");
	}
	center.attr("fill", "#666");
	center.attr("stroke", "#666");
	// title.attr("font-size", "25%");
	// title.attr("font-family", "Corbel");
	//liftoff.attr("font-size", "15%");
	//liftoff.attr("font-family", "Trebuchet");
	titleMoney.attr("font-size", "10%");
	titleMoney.attr("font-family", "Trebuchet");
	titleTime.attr("font-size", "10%");
	titleTime.attr("font-family", "Trebuchet");
	daysStart.attr("font-size", "10%");
	daysStart.attr("font-family", "Trebuchet");
	daysEnd.attr("font-size", "10%");
	daysEnd.attr("font-family", "Trebuchet");
	moneyStart.attr("font-size", "10%");
	moneyStart.attr("font-family", "Trebuchet");
	m1back.attr("fill", "#fff");
	m1back.attr("stroke", "#999");
	m2back.attr("fill", "#fff");
	m2back.attr("stroke", "#999");
	/* end non-animate set up */


	for(var i=0; i<numCities; i++) {
		cityBarArray[i]=paper.path();
	}
	var needle1=paper.path();									/* svg object for the fundraising progress needle */
	var needle2=paper.path();									/* svg object for the time progress needle */
	var daysPassed=paper.text(0,0,"");							/* svg object for the days left animation */
	var moneyRaised=paper.text(0,0,"");							/* svg object for the current money animation */
	lastX1=lrMargins;
	lastY1=drawY;
	lastX2=outerBarWidth+lrMargins;
	lastY2=drawY;

	if(1) { /* animation is only used after the page has loaded or been reloaded */
		var anim = setInterval(function(){
			/* the following sets up variables for each animation frame */
			percent = count/100;
			days = (30-Math.round(30*((percent*pcd)/100))).toString();
			money = "$".concat((Math.round((goal)*(percent*pc)/100)).toString());
			theta = (percent*(pc/100))*Math.PI;
			theta2 = (percent*(pcd/100))*Math.PI;

			m1x1 = Math.abs(radius1*Math.cos(theta)-(cWidth/2));
			m1y1 = Math.abs(radius1*Math.sin(theta)-drawY);
			m1x2 = Math.abs(radius2*Math.cos(theta)-(cWidth/2-lrMargins))+lrMargins;
			m1y2 = Math.abs(radius2*Math.sin(theta)-drawY);
			
			m2x1 = Math.abs(radius3*Math.cos(theta2)-(cWidth/2));
			m2y1 = Math.abs(radius3*Math.sin(theta2)-drawY);
			m2x2 = Math.abs(radius4*Math.cos(theta2)-(cWidth/2-lrMargins))+lrMargins;
			m2y2 = Math.abs(radius4*Math.sin(theta2)-drawY);

			xn1 = Math.abs((radius2-5)*Math.cos(theta)-(cWidth/2-lrMargins))+lrMargins;
			yn1 = Math.abs((radius2-5)*Math.sin(theta)-drawY);
			xn2 = Math.abs((radius4-5)*Math.cos(theta2)-(cWidth/2-lrMargins))+lrMargins;
			yn2 = Math.abs((radius4-5)*Math.sin(theta2)-drawY);

			xd = Math.abs((radius3+intraBarSpacing/2)*Math.cos(theta2)-(cWidth/2-lrMargins))+lrMargins;
			yd = Math.abs((radius3+intraBarSpacing/2)*Math.sin(theta2)-drawY);
			xm = Math.abs((radius1+lrMargins/2)*Math.cos(theta)-cWidth/2);
			ym = Math.abs((radius1+lrMargins/2)*Math.sin(theta)-drawY);
			/*xm = Math.abs((radius1+lrMargins/2)*Math.cos(theta)-(cWidth/2-lrMargins))+lrMargins;
			ym = Math.abs((radius1+lrMargins/2)*Math.sin(theta)-drawY);*/

			var tooltip = paper.rect();
			var ttData = paper.text(0,0,"");
			var x,y;

			needle1.remove();
			needle2.remove();
			daysPassed.remove();
			moneyRaised.remove();
			/* end variable setup */

			/* draw fundraising progress bar */
			if((count*(pc/100))<=cityWorthArray[curCity]) {
				cityBarArray[curCity] = paper.path("M"+lastX1+","+lastY1+" A"+radius1+","+radius1+" 0,0,1 "+m1x1+","+m1y1+" L"+m1x2+","+m1y2+" A"+radius2+","+radius2+" 0,0,0 "+lastX2+","+lastY2+" Z");
				if(curCity==0)
					prior=0;
				else
					prior = cityWorthArray[curCity-1];
				pCity = 100*(cityWorthArray[curCity]-(count*(pc/100)))/(cityWorthArray[curCity]-prior);
				cityBarArray[curCity].attr("fill", colorGrad("5cb85c","ff4646",pCity));
				cityBarArray[curCity].attr("stroke", "#999");
			}
			else {
				lastX1=tempX1;
				lastY1=tempY1;
				lastX2=tempX2;
				lastY2=tempY2;
				curCity++;
				count--;
			}
			
			tempX1=m1x1;
			tempY1=m1y1;
			tempX2=m1x2;
			tempY2=m1y2;

			for(var i=0;i<=curCity;i++) {
				cityBarArray[i].mousemove(function() {
					tooltip.remove();
					ttData.remove();
					cityBarArray[i].attr("fill","#8dcd8d");
					x = event.clientX;
					y = event.clientY;
					tooltip = paper.rect((x-startX),(y-startY-20),80,20,5);
					ttData = paper.text((x-startX)+28,(y-startY-11),cityNameArray[i]);
					ttData.attr("font-color","#fff");
					tooltip.attr("fill","#999");
				});
				cityBarArray[i].mouseout(function() {
					cityBarArray[i].attr("fill","#5cb85c");
					tooltip.remove();
					ttData.remove();
				});
			}
			
			/* end fundraising progress bar */

			/* the following draws the remaining animated objects and sets the attributes for each one */
			m2prog = paper.path("M"+(outerBarWidth+intraBarSpacing+lrMargins)+","+drawY+" A"+radius3+","+radius3+" 0,0,1 "+m2x1+","+m2y1+" L"+m2x2+","+m2y2+" A"+radius4+","+radius4+" 0,0,0 "+(outerBarWidth+intraBarSpacing+innerBarWidth+lrMargins)+","+drawY+" Z");
			needle1 = paper.path("M"+(cWidth/2)+","+drawY+" L"+xn1+","+yn1);
			needle2 = paper.path("M"+(cWidth/2)+","+drawY+" L"+xn2+","+yn2);
			daysPassed = paper.text(xd,yd,days);
			moneyRaised = paper.text(xm,ym,money);
			needle1.attr("stroke", "#666");
			needle2.attr("stroke", "#666");
			daysPassed.attr("font-size", "10%");
			daysPassed.attr("font-family", "Trebuchet");
			moneyRaised.attr("font-size", "10%");
			moneyRaised.attr("font-family", "Trebuchet");
			m2prog.attr("fill", "#428bca");
			m2prog.attr("stroke", "#c0c0c0");
			/* end object animation */

			m2prog.mousemove(function() {
				tooltip.remove();
				ttData.remove();
				m2prog.attr("fill","#7baeda");
				x = event.clientX;
				y = event.clientY;
				tooltip = paper.rect((x-startX),(y-startY-20),80,20,5);
				ttData = paper.text((x-startX)+28,(y-startY-11),"2 days left");
				ttData.attr("font-color","#fff");
				tooltip.attr("fill","#999");
			});
			m2prog.mouseout(function() {
				m2prog.attr("fill","#428bca");
				tooltip.remove();
				ttData.remove();
			});

			count++;
			if(count>=101) {
				clearInterval(anim);
			}

		}, timing);
	}
	else {
		/*theta = (pc/100)*Math.PI;
		theta2 = (pcd/100)*Math.PI;
		m1prog = paper.path("M"+lrMargins+","+drawY+" A"+radius1+","+radius1+" 0,0,1 "+Math.abs(radius1*Math.cos(theta)-(cWidth/2))+","+Math.abs(radius1*Math.sin(theta)-drawY)+" L"+(Math.abs(radius2*Math.cos(theta)-(cWidth/2-lrMargins))+lrMargins)+","+Math.abs(radius2*Math.sin(theta)-drawY)+" A"+radius2+","+radius2+" 0,0,0 "+(outerBarWidth+lrMargins)+","+drawY+" Z");
		m2prog = paper.path("M"+(outerBarWidth+intraBarSpacing+lrMargins)+","+drawY+" A"+radius3+","+radius3+" 0,0,1 "+Math.abs(radius3*Math.cos(theta2)-(cWidth/2))+","+Math.abs(radius3*Math.sin(theta2)-drawY)+" L"+(Math.abs(radius4*Math.cos(theta2)-(cWidth/2-lrMargins))+lrMargins)+","+Math.abs(radius4*Math.sin(theta2)-drawY)+" A"+radius4+","+radius4+" 0,0,0 "+(outerBarWidth+intraBarSpacing+innerBarWidth+lrMargins)+","+drawY+" Z");
		needle1 = paper.path("M"+(cWidth/2)+","+drawY+" L"+(Math.abs((radius2-5)*Math.cos(theta)-(cWidth/2-lrMargins))+lrMargins)+","+(Math.abs((radius2-5)*Math.sin(theta)-drawY)));
		needle2 = paper.path("M"+(cWidth/2)+","+drawY+" L"+(Math.abs((radius4-5)*Math.cos(theta2)-(cWidth/2-lrMargins))+lrMargins)+","+(Math.abs((radius4-5)*Math.sin(theta2)-drawY)));
		center = paper.circle((cWidth/2),drawY,5);
		daysPassed = paper.text((Math.abs((radius3+intraBarSpacing/2)*Math.cos(theta2)-(cWidth/2-lrMargins))+lrMargins),(Math.abs((radius3+intraBarSpacing/2)*Math.sin(theta2)-drawY)),(30-Math.round((pcd/100)*30)).toString());
		m1prog.attr("fill", "#428bca");
		m1prog.attr("stroke", "#c0c0c0");
		m2prog.attr("fill", colorGrad("5cb85c","ff4646",pcd));
		m2prog.attr("stroke", "#c0c0c0");
		needle1.attr("stroke", "#666");
		needle2.attr("stroke", "#666");
		center.attr("fill", "#666");
		center.attr("stroke", "#666");
		daysPassed.attr("font-size", "10%");
		daysPassed.attr("font-family", "Trebuchet");*/
	}



	window.onresize = function reloadGauge() {
		paper.remove();
		loadGauge(id, 1);
	};
}

/*===================================================*/
/*             Color Gradient Calculator             */
/*===================================================*/
function colorGrad(color1, color2, count) { /* color1 is original color, color 2 is the end color */
	var percent = count/100;

	color1 = color1.replace("#","");
	color2 = color2.replace("#","");
	var length1 = color1.length;
	var length2 = color2.length;

	if(!(length1==3 || length1==6) || !(length2==3 || length2==6)) {
		alert("Error: incorrect length for color entries (must be 3 or 6).");
		return 0;
	}

	var hex1 = [""];
	var hex2 = [""];
	for(var i=5; i>=0; i--)
	{
		if(length1==3 && (i%2==0)) {
			hex1[i] = hex1[i-1];
		}
		else
			hex1[i] = color1.charAt(i);
		if(length2==3 && (i%2!=0)) {
			hex2[i] = hex2[i-1];
		}
		else
			hex2[i] = color2.charAt(i);
	}

	hex1[0] = hex1[0].concat(hex1[1]);
	hex1[1] = hex1[2].concat(hex1[3]);
	hex1[2] = hex1[4].concat(hex1[5]);
	hex2[0] = hex2[0].concat(hex2[1]);
	hex2[1] = hex2[2].concat(hex2[3]);
	hex2[2] = hex2[4].concat(hex2[5]);


	var dec1 = [];
	var dec2 = [];
	var newColor = [""];

	for(var i=0; i<3; i++) {
		dec1[i] = hexDecConvert(hex1[i], 0);
		dec2[i] = hexDecConvert(hex2[i], 0);

		dec1[i] = dec1[i]-((dec1[i]-dec2[i])*percent);		

		newColor[i] = hexDecConvert(Math.floor(dec1[i]),1);
		if(newColor[i].length==1) {
			newColor[i] = "0".concat(newColor[i]);
		}
	}

	var color = newColor[0].concat(newColor[1].concat(newColor[2]));

	return ("#".concat(color));
}


/*===================================================*/
/*                Hex/Decimal Converter              */
/*===================================================*/
function hexDecConvert(number, flag) { /* if hex->dec, flag=0  ;  if dec->hex, flag=1 */
	if(number==0 && flag==1)
		return "0";

	if(number<0)
		number*=-1;

	if(flag) { /* dec->hex */
		var array = [""];
		var quot = number;
		var rem = 1;
		var hex = [""];
		var count = 0;

		while(quot) {
			rem = (quot%16);
			quot = Math.floor(quot/16);
			
			var tempChar;
			if(rem>9) {
				switch(rem) {
					case 10:
						tempChar='A';
						break;
					case 11:
						tempChar='B';
						break;
					case 12:
						tempChar='C';
						break;
					case 13:
						tempChar='D';
						break;
					case 14:
						tempChar='E';
						break;
					case 15:
						tempChar='F';
						break;
					default:
						alert("Something went wrong. Case not found.");
						return 0;
						break;
				}
				array[count] = tempChar.toString();
			}
			else
				array[count] = rem.toString();
			count++;
		}


		var length = array.length;
		for(var i=0; i<length; i++) {
			hex[i] = array[length-(i+1)];
		}

		hex = hex.toString();

		for(var i=1; i<length; i++) { /* this shouldnt be necessary... why are commas being added? */
			hex = hex.replace(",",""); 
		}
		return hex;
	}
	else { /* hex->dec */
		var length = number.length;
		var sum=0;
		var uni;
		for(var i=0; i<length; i++) {
			uni = number.charCodeAt(i);
			switch(uni) {
				case 65:
				case 97:
					sum+=(10*Math.pow(16,(length-(i+1))));
					break;
				case 66:
				case 98:
					sum+=(11*Math.pow(16,(length-(i+1))));
					break;
				case 67:
				case 99:
					sum+=(12*Math.pow(16,(length-(i+1))));
					break;
				case 68:
				case 100:
					sum+=(13*Math.pow(16,(length-(i+1))));
					break;
				case 69:
				case 101:
					sum+=(14*Math.pow(16,(length-(i+1))));
					break;
				case 70:
				case 102:
					sum+=(15*Math.pow(16,(length-(i+1))));
					break;
				case 48:
					sum+=0;
					break;
				case 49:
					sum+=(1*Math.pow(16,(length-(i+1))));
					break;
				case 50:
					sum+=(2*Math.pow(16,(length-(i+1))));
					break;
				case 51:
					sum+=(3*Math.pow(16,(length-(i+1))));
					break;
				case 52: 
					sum+=(4*Math.pow(16,(length-(i+1))));
					break;
				case 53:
					sum+=(5*Math.pow(16,(length-(i+1))));
					break;
				case 54:
					sum+=(6*Math.pow(16,(length-(i+1))));
					break;
				case 55:
					sum+=(7*Math.pow(16,(length-(i+1))));
					break;
				case 56:
					sum+=(8*Math.pow(16,(length-(i+1))));
					break;
				case 57:
					sum+=(9*Math.pow(16,(length-(i+1))));
					break;
				default:
					alert("Something went wrong. No case found.");
					return 0;
					break;
			}
		}
		return sum;
	}
}