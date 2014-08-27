"use strict";
//images from http://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

/* Bug/To-Do list
	- add en passant to pawn movement rules
	- add ability to detect checkmates and unsafe moves for king
	- tweek piece coords in both wide and vert modes
	- turn off hover coloring on touchscreen-only devices
	- ensure knights are moving throught the singularity properly
	- fix issue: chrome crashes when too many resizes have been done
	- disable text highlighting
	- disable user interactions with background picture
*/

function playChess() {
	$("#gamboard").show();
	$(".dangerSpace").hide();
	$(".banner").fadeOut(500);
	$(".navbar").fadeOut(500);
	$(".desktopMedia").fadeOut(500);
	$(".mobileMedia").fadeOut(500);
	$("#top").fadeOut();
	$("#chess").fadeOut();
	setTimeout(function() {
		if($(window).width()>992)
			drawGameBoard(0,0,1);
		else
			drawGameBoard(0,0,0);
		$("#chessBackground").css({"display":"block"});
	}, 550);
}



function quitChess(newGame) {
	var doubleCheck;
	if(newGame) {
		doubleCheck = confirm("Are you sure you want to start a new game?");
		if(doubleCheck) {
			$("svg").remove();
			if($(window).width()>992)
				drawGameBoard(0,0,1);
			else
				drawGameBoard(0,0,0);
		}
	}
	else {
		doubleCheck = confirm("Are you sure you want to quit?");
		if(doubleCheck) {
			$(".dangerSpace").hide(); //dev class for displaying danger spaces
			$("svg").fadeOut(500);
			$("#gameControls").fadeOut(500);
			$("#chessBackground").fadeOut(500);
			$("body").css({"overflow-y":"visible"}); //re-enable scrolling
			$("html").css({"overflow-y":"visible"}); //re-enable scrolling
			setTimeout(function() {
				$("#gamboard").hide();
				$(".banner").fadeIn(500);
				$(".navbar").fadeIn(500);
				$(".desktopMedia").fadeIn(500);
				$(".desktopMedia").fadeIn(500);
				$(".mobileMedia").fadeIn(500);
				$("#top").fadeIn();
				$("#chess").fadeIn();
				$("svg").remove();
			}, 550);
		}
	}
}



function drawGameBoard(resize,objectArray,wasBig) { //main function that runs most aspects of the game
	//initial css changes
	if(resize)
		$("svg").remove(); //this prevents the browser from crashing due to too many SVG objects being drawn (browser is still crashing D:)
	$("#gameControls").css({"display":"inline"});
	$("body").css({"overflow-y":"hidden"}); //disable
	$("html").css({"overflow-y":"hidden"}); //scrolling


	//declarations for a some initial variables
	var isWide;					//stores the orientation of the board (vertical or horizontal)
	var paper;					//Raphael object that the board is drawn in/on
	var rad1;					//initial radius used to draw the board
	var turnColor="White";		//tracks whos turn it is
	var devmode=1;				//turns off turn rotations if enabled (1)
	var windowIsSmall=1;		//if true, assume user is on mobile device. used to determine whether or not board spaces should have hover function
								//true=no hover, false=enable hover
	var moveCount=1;			//current move number
	var color1="#333";			//fill color for odd-indexed board spaces (darker)
	var color2="#bbb";			//fill color for even-indexed board spaces (lighter)
	var colorS="";				//stroke color for all non-modified board spaces
	var colorH="#0ff";			//fill color for spaces being hovered over
	var colorHS="#016E6E";		//stroke (edge) color for spaces being hovered over
	var colorSelect="#FFFF52";	//fill color for selected and movable spaces
	var colorSelectS="#8C8C2E";	//stroke (edge) color for selected and movable spaces
	var colorCapture="#FF6666";	//fill color for capture spaces
	var colorCaptureS="#8C2E2E";//stroke (edge) color for capture spaces


	//set up info displays. if devmode is enabled, display will be static
	//otherwise, display will show the user whos turn it is and how many moves have been made
	if(devmode)
		document.getElementById("gameDisplay1").innerHTML="Devmode Enabled";
	else {
		document.getElementById("gameDisplay1").innerHTML=turnColor.concat("'s Turn");
		document.getElementById("gameDisplay2").innerHTML="Move #"+moveCount;
	}


	//=======================================================================
	// Determine board orientation and size
	//=======================================================================
	if($(window).width()>992) //uses bootstrap size definitions (xs, sm, md, lg). window is small if its sm or xs
		windowIsSmall=0;
	//initial size calculation
	var windowHeight=$(window).height()-$("#gameControls").height();
	var windowWidth=$(window).width();
	var boardHeight=windowHeight*0.9;	//board height is 90% of the window's available height
	var boardWidth=0;

	//determine if board will be drawn horizontally or vertically
	if(windowWidth > windowHeight) {
		isWide=1;
		$("#chessBackground").css({"width":"100%"});
		boardWidth=(3/2)*boardHeight;
		if(boardWidth>=windowWidth) { //prevents board overflow
			boardWidth=windowWidth*0.9; //meaning 5% spacing on each side
			boardHeight=(2/3)*boardWidth;
		}
		rad1=boardWidth/12;
	}
	else {
		isWide=0;
		$("#chessBackground").css({"width":"200%"});
		boardWidth=(2/3)*boardHeight;
		if(boardWidth>=windowWidth) { //prevents board overflow
			boardWidth=windowWidth*0.9; //meaning 5% spacing on each side
			boardHeight=(3/2)*boardWidth;
		}
		rad1=boardHeight/12;

		//create horiz margins if vertical orientation has board pressed right up against the sides of the screen
		if(boardWidth>=$(window).width()*0.95) {
			boardWidth*=0.9;
			boardHeight=(3/2)*boardWidth;
		}
	}



	//create starting points for the canvas, then create the canvas (with Raphael)
	var startX=($(window).width()/2)-(boardWidth/2);
	var startY=(windowHeight/2)-(boardHeight/2)+35; //for some reason, an arbitrary constant is needed to center the board
	paper=Raphael(startX, startY, boardWidth, boardHeight);


	//calculate the (x,y) coords of the boards center and other radiuses for drawing spaces
	var cx=boardWidth/2;
	var cy=boardHeight/2;
	var rad05 = rad1/2;
	var rad2=2*rad1;
	var rad3=3*rad1;
	var rad4=4*rad1;
	var rad5=5*rad1;
	var rad6=6*rad1;


	//declare arrays used to store most of the game's data
	var spacePathArray=		new Array(64);	//stores each SVG-drawn space of the board (not the pieces)
	var spaceObjectArray=	new Array(64);	/*stores necessary data attributes for each space on the board. these include:
											an array of spaces surrounding any given space, direction index previously used,
											the (x,y) coords for the center of the space (for placing pieces), and its 
											occupied value (equal to [0,13])*/


	//initialize spaceObjectArray
	for(var i=0; i<64; i++) {
		spaceObjectArray[i]=new Object();
		spaceObjectArray[i].direct = new Array(8);

		for(var j=0; j<8; j++)
			spaceObjectArray[i].direct[j]=-1;	//these get manually set below. all edges of the board are marked by -1
		spaceObjectArray[i].prevDirIndex=0;		//used for determining all other piece directions
		spaceObjectArray[i].cx=-1;
		spaceObjectArray[i].cy=-1;
		spaceObjectArray[i].occupied=0;			//odd=white, even=black
		spaceObjectArray[i].isPawnUnmoved=0;	/*if 1, space is occupied by a pawn that has not been moved yet (and therefore
												can be moved two spaces instead of one)*/
		spaceObjectArray[i].isWhiteDanger=0;	//stores whether or not a white piece can be captured by existing on space i
		spaceObjectArray[i].isBlackDanger=0;	//stores whether or not a black piece can be captured by existing on space i
		spaceObjectArray[i].quadrant=0;			/*pawn-only attribute. stores the quadrant that the ith pawn was originally drawn in.
												quadrants numbers are assigned in the same fashion as quadrants in cartesian coordinate systems*/
		spaceObjectArray[i].singularity=0;		/*pawn-only attribute. stores whether or not the pawn has passed through the singularity or not.
												0=not passed/unused
												1=through the top part of the loop only (indexes 2,8,16, or 26)
												2=through the bottom part of the loop only (indexes 37,47,55, or 61)
												3=passed through both parts of the loop*/
	}


	/* set direction attributes for each space on the board. even indexes are cardinal directions and
	odd indexes are diagonal directions with 0=west and ascending clock-wise */
	spaceObjectArray[0].direct[4]=1;
	spaceObjectArray[0].direct[5]=6;
	spaceObjectArray[0].direct[6]=5;

	spaceObjectArray[1].direct[0]=0;
	spaceObjectArray[1].direct[3]=3;
	spaceObjectArray[1].direct[4]=2;
	spaceObjectArray[1].direct[5]=7;
	spaceObjectArray[1].direct[6]=6;
	spaceObjectArray[1].direct[7]=5;

	spaceObjectArray[2].direct[0]=1;
	spaceObjectArray[2].direct[2]=3;
	spaceObjectArray[2].direct[3]=10;
	spaceObjectArray[2].direct[4]=9;
	spaceObjectArray[2].direct[5]=8;
	spaceObjectArray[2].direct[6]=7;
	spaceObjectArray[2].direct[7]=6;

	spaceObjectArray[3].direct[0]=2;
	spaceObjectArray[3].direct[1]=1;
	spaceObjectArray[3].direct[4]=4;
	spaceObjectArray[3].direct[5]=11;
	spaceObjectArray[3].direct[6]=10;
	spaceObjectArray[3].direct[7]=9;

	spaceObjectArray[4].direct[0]=3;
	spaceObjectArray[4].direct[6]=11;
	spaceObjectArray[4].direct[7]=10;

	spaceObjectArray[5].direct[2]=0;
	spaceObjectArray[5].direct[3]=1;
	spaceObjectArray[5].direct[4]=6;
	spaceObjectArray[5].direct[5]=13;
	spaceObjectArray[5].direct[6]=12;

	spaceObjectArray[6].direct[0]=5;
	spaceObjectArray[6].direct[1]=0;
	spaceObjectArray[6].direct[2]=1;
	spaceObjectArray[6].direct[3]=2;
	spaceObjectArray[6].direct[4]=7;
	spaceObjectArray[6].direct[5]=14;
	spaceObjectArray[6].direct[6]=13;
	spaceObjectArray[6].direct[7]=12;

	spaceObjectArray[7].direct[0]=6;
	spaceObjectArray[7].direct[1]=1;
	spaceObjectArray[7].direct[2]=2;
	spaceObjectArray[7].direct[3]=9;
	spaceObjectArray[7].direct[4]=8;
	spaceObjectArray[7].direct[5]=15;
	spaceObjectArray[7].direct[6]=14;
	spaceObjectArray[7].direct[7]=13;

	spaceObjectArray[8].direct[0]=7;
	spaceObjectArray[8].direct[1]=2;
	spaceObjectArray[8].direct[2]=9;
	spaceObjectArray[8].direct[3]=18;
	spaceObjectArray[8].direct[4]=17;
	spaceObjectArray[8].direct[5]=16;
	spaceObjectArray[8].direct[6]=15;
	spaceObjectArray[8].direct[7]=14;

	spaceObjectArray[9].direct[0]=8;
	spaceObjectArray[9].direct[1]=7;
	spaceObjectArray[9].direct[2]=2;
	spaceObjectArray[9].direct[3]=3;
	spaceObjectArray[9].direct[4]=10;
	spaceObjectArray[9].direct[5]=19;
	spaceObjectArray[9].direct[6]=18;
	spaceObjectArray[9].direct[7]=17;

	spaceObjectArray[10].direct[0]=9;
	spaceObjectArray[10].direct[1]=2;
	spaceObjectArray[10].direct[2]=3;
	spaceObjectArray[10].direct[3]=4;
	spaceObjectArray[10].direct[4]=11;
	spaceObjectArray[10].direct[5]=20;
	spaceObjectArray[10].direct[6]=19;
	spaceObjectArray[10].direct[7]=18;

	spaceObjectArray[11].direct[0]=10;
	spaceObjectArray[11].direct[1]=3;
	spaceObjectArray[11].direct[2]=4;
	spaceObjectArray[11].direct[6]=20;
	spaceObjectArray[11].direct[7]=19;

	spaceObjectArray[12].direct[2]=5;
	spaceObjectArray[12].direct[3]=6;
	spaceObjectArray[12].direct[4]=13;
	spaceObjectArray[12].direct[5]=22;
	spaceObjectArray[12].direct[6]=21;

	spaceObjectArray[13].direct[0]=12;
	spaceObjectArray[13].direct[1]=5;
	spaceObjectArray[13].direct[2]=6;
	spaceObjectArray[13].direct[3]=7;
	spaceObjectArray[13].direct[4]=14;
	spaceObjectArray[13].direct[5]=23;
	spaceObjectArray[13].direct[6]=22;
	spaceObjectArray[13].direct[7]=21;

	spaceObjectArray[14].direct[0]=13;
	spaceObjectArray[14].direct[1]=6;
	spaceObjectArray[14].direct[2]=7;
	spaceObjectArray[14].direct[3]=8;
	spaceObjectArray[14].direct[4]=15;
	spaceObjectArray[14].direct[5]=24;
	spaceObjectArray[14].direct[6]=23;
	spaceObjectArray[14].direct[7]=22;

	spaceObjectArray[15].direct[0]=14;
	spaceObjectArray[15].direct[1]=7;
	spaceObjectArray[15].direct[2]=8;
	spaceObjectArray[15].direct[3]=17;
	spaceObjectArray[15].direct[4]=16;
	spaceObjectArray[15].direct[5]=25;
	spaceObjectArray[15].direct[6]=24;
	spaceObjectArray[15].direct[7]=23;

	spaceObjectArray[16].direct[0]=15;
	spaceObjectArray[16].direct[1]=8;
	spaceObjectArray[16].direct[2]=17;
	spaceObjectArray[16].direct[3]=28;
	spaceObjectArray[16].direct[4]=27;
	spaceObjectArray[16].direct[5]=26;
	spaceObjectArray[16].direct[6]=25;
	spaceObjectArray[16].direct[7]=24;

	spaceObjectArray[17].direct[0]=16;
	spaceObjectArray[17].direct[1]=15;
	spaceObjectArray[17].direct[2]=8;
	spaceObjectArray[17].direct[3]=9;
	spaceObjectArray[17].direct[4]=18;
	spaceObjectArray[17].direct[5]=29;
	spaceObjectArray[17].direct[6]=28;
	spaceObjectArray[17].direct[7]=27;

	spaceObjectArray[18].direct[0]=17;
	spaceObjectArray[18].direct[1]=8;
	spaceObjectArray[18].direct[2]=9;
	spaceObjectArray[18].direct[3]=10;
	spaceObjectArray[18].direct[4]=19;
	spaceObjectArray[18].direct[5]=30;
	spaceObjectArray[18].direct[6]=29;
	spaceObjectArray[18].direct[7]=28;

	spaceObjectArray[19].direct[0]=18;
	spaceObjectArray[19].direct[1]=9;
	spaceObjectArray[19].direct[2]=10;
	spaceObjectArray[19].direct[3]=11;
	spaceObjectArray[19].direct[4]=20;
	spaceObjectArray[19].direct[5]=31;
	spaceObjectArray[19].direct[6]=30;
	spaceObjectArray[19].direct[7]=29;

	spaceObjectArray[20].direct[0]=19;
	spaceObjectArray[20].direct[1]=10;
	spaceObjectArray[20].direct[2]=11;
	spaceObjectArray[20].direct[6]=31;
	spaceObjectArray[20].direct[7]=30;

	spaceObjectArray[21].direct[2]=12;
	spaceObjectArray[21].direct[3]=13;
	spaceObjectArray[21].direct[4]=22;
	spaceObjectArray[21].direct[5]=33;
	spaceObjectArray[21].direct[6]=32;

	spaceObjectArray[22].direct[0]=21;
	spaceObjectArray[22].direct[1]=12;
	spaceObjectArray[22].direct[2]=13;
	spaceObjectArray[22].direct[3]=14;
	spaceObjectArray[22].direct[4]=23;
	spaceObjectArray[22].direct[5]=34;
	spaceObjectArray[22].direct[6]=33;
	spaceObjectArray[22].direct[7]=32;

	spaceObjectArray[23].direct[0]=22;
	spaceObjectArray[23].direct[1]=13;
	spaceObjectArray[23].direct[2]=14;
	spaceObjectArray[23].direct[3]=15;
	spaceObjectArray[23].direct[4]=24;
	spaceObjectArray[23].direct[5]=35;
	spaceObjectArray[23].direct[6]=34;
	spaceObjectArray[23].direct[7]=33;

	spaceObjectArray[24].direct[0]=23;
	spaceObjectArray[24].direct[1]=14;
	spaceObjectArray[24].direct[2]=15;
	spaceObjectArray[24].direct[3]=16;
	spaceObjectArray[24].direct[4]=25;
	spaceObjectArray[24].direct[5]=36;
	spaceObjectArray[24].direct[6]=35;
	spaceObjectArray[24].direct[7]=34;

	spaceObjectArray[25].direct[0]=24;
	spaceObjectArray[25].direct[1]=15;
	spaceObjectArray[25].direct[2]=16;
	spaceObjectArray[25].direct[3]=27;
	spaceObjectArray[25].direct[4]=26;
	spaceObjectArray[25].direct[5]=37;
	spaceObjectArray[25].direct[6]=36;
	spaceObjectArray[25].direct[7]=35;

	spaceObjectArray[26].direct[0]=25;
	spaceObjectArray[26].direct[1]=16;
	spaceObjectArray[26].direct[2]=27;
	spaceObjectArray[26].direct[3]=38;
	spaceObjectArray[26].direct[4]=37; //problem
	spaceObjectArray[26].direct[5]=37; //problem
	spaceObjectArray[26].direct[6]=37; //problem
	spaceObjectArray[26].direct[7]=36;

	spaceObjectArray[27].direct[0]=26;
	spaceObjectArray[27].direct[1]=25;
	spaceObjectArray[27].direct[2]=16;
	spaceObjectArray[27].direct[3]=17;
	spaceObjectArray[27].direct[4]=28;
	spaceObjectArray[27].direct[5]=39;
	spaceObjectArray[27].direct[6]=38;
	spaceObjectArray[27].direct[7]=37;

	spaceObjectArray[28].direct[0]=27;
	spaceObjectArray[28].direct[1]=16;
	spaceObjectArray[28].direct[2]=17;
	spaceObjectArray[28].direct[3]=18;
	spaceObjectArray[28].direct[4]=29;
	spaceObjectArray[28].direct[5]=40;
	spaceObjectArray[28].direct[6]=39;
	spaceObjectArray[28].direct[7]=38;

	spaceObjectArray[29].direct[0]=28;
	spaceObjectArray[29].direct[1]=17;
	spaceObjectArray[29].direct[2]=18;
	spaceObjectArray[29].direct[3]=19;
	spaceObjectArray[29].direct[4]=30;
	spaceObjectArray[29].direct[5]=41;
	spaceObjectArray[29].direct[6]=40;
	spaceObjectArray[29].direct[7]=39;

	spaceObjectArray[30].direct[0]=29;
	spaceObjectArray[30].direct[1]=18;
	spaceObjectArray[30].direct[2]=19;
	spaceObjectArray[30].direct[3]=20;
	spaceObjectArray[30].direct[4]=31;
	spaceObjectArray[30].direct[5]=42;
	spaceObjectArray[30].direct[6]=41;
	spaceObjectArray[30].direct[7]=40;

	spaceObjectArray[31].direct[0]=30;
	spaceObjectArray[31].direct[1]=19;
	spaceObjectArray[31].direct[2]=20;
	spaceObjectArray[31].direct[6]=42;
	spaceObjectArray[31].direct[7]=41;

	spaceObjectArray[32].direct[2]=21;
	spaceObjectArray[32].direct[3]=22;
	spaceObjectArray[32].direct[4]=33;
	spaceObjectArray[32].direct[5]=44;
	spaceObjectArray[32].direct[6]=43;

	spaceObjectArray[33].direct[0]=32;
	spaceObjectArray[33].direct[1]=21;
	spaceObjectArray[33].direct[2]=22;
	spaceObjectArray[33].direct[3]=23;
	spaceObjectArray[33].direct[4]=34;
	spaceObjectArray[33].direct[5]=45;
	spaceObjectArray[33].direct[6]=44;
	spaceObjectArray[33].direct[7]=43;

	spaceObjectArray[34].direct[0]=33;
	spaceObjectArray[34].direct[1]=22;
	spaceObjectArray[34].direct[2]=23;
	spaceObjectArray[34].direct[3]=24;
	spaceObjectArray[34].direct[4]=35;
	spaceObjectArray[34].direct[5]=46;
	spaceObjectArray[34].direct[6]=45;
	spaceObjectArray[34].direct[7]=44;

	spaceObjectArray[35].direct[0]=34;
	spaceObjectArray[35].direct[1]=23;
	spaceObjectArray[35].direct[2]=24;
	spaceObjectArray[35].direct[3]=25;
	spaceObjectArray[35].direct[4]=36;
	spaceObjectArray[35].direct[5]=47;
	spaceObjectArray[35].direct[6]=46;
	spaceObjectArray[35].direct[7]=45;

	spaceObjectArray[36].direct[0]=35;
	spaceObjectArray[36].direct[1]=24;
	spaceObjectArray[36].direct[2]=25;
	spaceObjectArray[36].direct[3]=26;
	spaceObjectArray[36].direct[4]=37;
	spaceObjectArray[36].direct[5]=38;
	spaceObjectArray[36].direct[6]=47;
	spaceObjectArray[36].direct[7]=46;

	spaceObjectArray[37].direct[0]=36;
	spaceObjectArray[37].direct[1]=25;
	spaceObjectArray[37].direct[2]=26; //problem
	spaceObjectArray[37].direct[3]=26; //problem
	spaceObjectArray[37].direct[4]=26; //problem
	spaceObjectArray[37].direct[5]=27;
	spaceObjectArray[37].direct[6]=38;
	spaceObjectArray[37].direct[7]=47;

	spaceObjectArray[38].direct[0]=37;
	spaceObjectArray[38].direct[1]=26;
	spaceObjectArray[38].direct[2]=27;
	spaceObjectArray[38].direct[3]=28;
	spaceObjectArray[38].direct[4]=39;
	spaceObjectArray[38].direct[5]=48;
	spaceObjectArray[38].direct[6]=47;
	spaceObjectArray[38].direct[7]=36;

	spaceObjectArray[39].direct[0]=38;
	spaceObjectArray[39].direct[1]=27;
	spaceObjectArray[39].direct[2]=28;
	spaceObjectArray[39].direct[3]=29;
	spaceObjectArray[39].direct[4]=40;
	spaceObjectArray[39].direct[5]=49;
	spaceObjectArray[39].direct[6]=48;
	spaceObjectArray[39].direct[7]=47;

	spaceObjectArray[40].direct[0]=39;
	spaceObjectArray[40].direct[1]=28;
	spaceObjectArray[40].direct[2]=29;
	spaceObjectArray[40].direct[3]=30;
	spaceObjectArray[40].direct[4]=41;
	spaceObjectArray[40].direct[5]=50;
	spaceObjectArray[40].direct[6]=49;
	spaceObjectArray[40].direct[7]=48;

	spaceObjectArray[41].direct[0]=40;
	spaceObjectArray[41].direct[1]=29;
	spaceObjectArray[41].direct[2]=30;
	spaceObjectArray[41].direct[3]=31;
	spaceObjectArray[41].direct[4]=42;
	spaceObjectArray[41].direct[5]=51;
	spaceObjectArray[41].direct[6]=50;
	spaceObjectArray[41].direct[7]=49;

	spaceObjectArray[42].direct[0]=41;
	spaceObjectArray[42].direct[1]=30;
	spaceObjectArray[42].direct[2]=31;
	spaceObjectArray[42].direct[6]=51;
	spaceObjectArray[42].direct[7]=50;

	spaceObjectArray[43].direct[2]=32;
	spaceObjectArray[43].direct[3]=33;
	spaceObjectArray[43].direct[4]=44;
	spaceObjectArray[43].direct[5]=53;
	spaceObjectArray[43].direct[6]=52;

	spaceObjectArray[44].direct[0]=43;
	spaceObjectArray[44].direct[1]=32;
	spaceObjectArray[44].direct[2]=33;
	spaceObjectArray[44].direct[3]=34;
	spaceObjectArray[44].direct[4]=45;
	spaceObjectArray[44].direct[5]=54;
	spaceObjectArray[44].direct[6]=53;
	spaceObjectArray[44].direct[7]=52;

	spaceObjectArray[45].direct[0]=44;
	spaceObjectArray[45].direct[1]=33;
	spaceObjectArray[45].direct[2]=34;
	spaceObjectArray[45].direct[3]=35;
	spaceObjectArray[45].direct[4]=46;
	spaceObjectArray[45].direct[5]=55;
	spaceObjectArray[45].direct[6]=54;
	spaceObjectArray[45].direct[7]=53;

	spaceObjectArray[46].direct[0]=45;
	spaceObjectArray[46].direct[1]=34;
	spaceObjectArray[46].direct[2]=35;
	spaceObjectArray[46].direct[3]=36;
	spaceObjectArray[46].direct[4]=47;
	spaceObjectArray[46].direct[5]=48;
	spaceObjectArray[46].direct[6]=55;
	spaceObjectArray[46].direct[7]=54;

	spaceObjectArray[47].direct[0]=46;
	spaceObjectArray[47].direct[1]=35;
	spaceObjectArray[47].direct[2]=36;
	spaceObjectArray[47].direct[3]=37;
	spaceObjectArray[47].direct[4]=38;
	spaceObjectArray[47].direct[5]=39;
	spaceObjectArray[47].direct[6]=48;
	spaceObjectArray[47].direct[7]=55;

	spaceObjectArray[48].direct[0]=47;
	spaceObjectArray[48].direct[1]=38;
	spaceObjectArray[48].direct[2]=39;
	spaceObjectArray[48].direct[3]=40;
	spaceObjectArray[48].direct[4]=49;
	spaceObjectArray[48].direct[5]=56;
	spaceObjectArray[48].direct[6]=55;
	spaceObjectArray[48].direct[7]=46;

	spaceObjectArray[49].direct[0]=48;
	spaceObjectArray[49].direct[1]=39;
	spaceObjectArray[49].direct[2]=40;
	spaceObjectArray[49].direct[3]=41;
	spaceObjectArray[49].direct[4]=50;
	spaceObjectArray[49].direct[5]=57;
	spaceObjectArray[49].direct[6]=56;
	spaceObjectArray[49].direct[7]=55;

	spaceObjectArray[50].direct[0]=49;
	spaceObjectArray[50].direct[1]=40;
	spaceObjectArray[50].direct[2]=41;
	spaceObjectArray[50].direct[3]=42;
	spaceObjectArray[50].direct[4]=51;
	spaceObjectArray[50].direct[5]=58;
	spaceObjectArray[50].direct[6]=57;
	spaceObjectArray[50].direct[7]=56;

	spaceObjectArray[51].direct[0]=50;
	spaceObjectArray[51].direct[1]=41;
	spaceObjectArray[51].direct[2]=42;
	spaceObjectArray[51].direct[6]=58;
	spaceObjectArray[51].direct[7]=57;

	spaceObjectArray[52].direct[2]=43;
	spaceObjectArray[52].direct[3]=44;
	spaceObjectArray[52].direct[4]=53;
	spaceObjectArray[52].direct[5]=60;
	spaceObjectArray[52].direct[6]=59;

	spaceObjectArray[53].direct[0]=52;
	spaceObjectArray[53].direct[1]=43;
	spaceObjectArray[53].direct[2]=44;
	spaceObjectArray[53].direct[3]=45;
	spaceObjectArray[53].direct[4]=54;
	spaceObjectArray[53].direct[5]=61;
	spaceObjectArray[53].direct[6]=60;
	spaceObjectArray[53].direct[7]=59;

	spaceObjectArray[54].direct[0]=53;
	spaceObjectArray[54].direct[1]=44;
	spaceObjectArray[54].direct[2]=45;
	spaceObjectArray[54].direct[3]=46;
	spaceObjectArray[54].direct[4]=55;
	spaceObjectArray[54].direct[5]=56;
	spaceObjectArray[54].direct[6]=61;
	spaceObjectArray[54].direct[7]=60;

	spaceObjectArray[55].direct[0]=54;
	spaceObjectArray[55].direct[1]=45;
	spaceObjectArray[55].direct[2]=46;
	spaceObjectArray[55].direct[3]=47;
	spaceObjectArray[55].direct[4]=48;
	spaceObjectArray[55].direct[5]=49;
	spaceObjectArray[55].direct[6]=56;
	spaceObjectArray[55].direct[7]=61;

	spaceObjectArray[56].direct[0]=55;
	spaceObjectArray[56].direct[1]=48;
	spaceObjectArray[56].direct[2]=49;
	spaceObjectArray[56].direct[3]=50;
	spaceObjectArray[56].direct[4]=57;
	spaceObjectArray[56].direct[5]=62;
	spaceObjectArray[56].direct[6]=61;
	spaceObjectArray[56].direct[7]=54;

	spaceObjectArray[57].direct[0]=56;
	spaceObjectArray[57].direct[1]=49;
	spaceObjectArray[57].direct[2]=50;
	spaceObjectArray[57].direct[3]=51;
	spaceObjectArray[57].direct[4]=58;
	spaceObjectArray[57].direct[5]=63;
	spaceObjectArray[57].direct[6]=62;
	spaceObjectArray[57].direct[7]=61;

	spaceObjectArray[58].direct[0]=57;
	spaceObjectArray[58].direct[1]=50;
	spaceObjectArray[58].direct[2]=51;
	spaceObjectArray[58].direct[6]=63;
	spaceObjectArray[58].direct[7]=62;

	spaceObjectArray[59].direct[2]=52;
	spaceObjectArray[59].direct[3]=53;
	spaceObjectArray[59].direct[4]=60;

	spaceObjectArray[60].direct[0]=59;
	spaceObjectArray[60].direct[1]=52;
	spaceObjectArray[60].direct[2]=53;
	spaceObjectArray[60].direct[3]=54;
	spaceObjectArray[60].direct[4]=61;
	spaceObjectArray[60].direct[5]=62;

	spaceObjectArray[61].direct[0]=60;
	spaceObjectArray[61].direct[1]=53;
	spaceObjectArray[61].direct[2]=54;
	spaceObjectArray[61].direct[3]=55;
	spaceObjectArray[61].direct[4]=56;
	spaceObjectArray[61].direct[5]=57;
	spaceObjectArray[61].direct[6]=62;

	spaceObjectArray[62].direct[0]=61;
	spaceObjectArray[62].direct[1]=56;
	spaceObjectArray[62].direct[2]=57;
	spaceObjectArray[62].direct[3]=58;
	spaceObjectArray[62].direct[4]=63;
	spaceObjectArray[62].direct[7]=60;

	spaceObjectArray[63].direct[0]=62;
	spaceObjectArray[63].direct[1]=57;
	spaceObjectArray[63].direct[2]=58;


	//draw all 64 pieces on the board and store each one in spacePathArray
	if(isWide) {//horizontal orientation
		spacePathArray[0] =paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+",0 A"+rad5+","+rad5+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" L"+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad6+","+rad6+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+",0 Z");
		spacePathArray[1] =paper.path("M"+cx+",0 A"+rad4+","+rad4+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" L"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+",0 Z");
		spacePathArray[2] =paper.path("M"+cx+","+(cy-rad3)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" Z");
		spacePathArray[3] =paper.path("M"+cx+",0 A"+rad4+","+rad4+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" L"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+",0 Z");
		spacePathArray[4] =paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+",0 A"+rad5+","+rad5+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" L"+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad6+","+rad6+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+",0 Z");
		spacePathArray[5] =paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad5+","+rad5+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" L"+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad6+","+rad6+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" Z");
		spacePathArray[6] =paper.path("M"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" L"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" Z");
		spacePathArray[7] =paper.path("M"+cx+","+(cy-rad3)+" A"+rad3+","+rad3+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" L"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" Z");
		spacePathArray[8] =paper.path("M"+cx+","+(cy-rad2)+" L"+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad3+","+rad3+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[9] =paper.path("M"+cx+","+(cy-rad3)+" A"+rad3+","+rad3+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" Z");
		spacePathArray[10]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad4+","+rad4+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" L"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" Z");
		spacePathArray[11]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" A"+rad5+","+rad5+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" L"+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad6+","+rad6+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy-rad3)+" Z");
		spacePathArray[12]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad5+","+rad5+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad6+","+rad6+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[13]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[14]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad3+","+rad3+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[15]=paper.path("M"+cx+","+(cy-rad2)+" A"+rad2+","+rad2+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad3+","+rad3+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[16]=paper.path("M"+cx+","+(cy-rad1)+" L"+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad2+","+rad2+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[17]=paper.path("M"+cx+","+(cy-rad2)+" A"+rad2+","+rad2+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad3+","+rad3+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[18]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad3+","+rad3+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[19]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad4+","+rad4+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[20]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" A"+rad5+","+rad5+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad6+","+rad6+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy-rad2)+" Z");
		spacePathArray[21]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad5)+","+cy+" L"+(cx-rad6)+","+cy+" A"+rad6+","+rad6+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[22]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad4)+","+cy+" L"+(cx-rad5)+","+cy+" A"+rad5+","+rad5+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[23]=paper.path("M"+(cx-rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad4)+","+cy+" Z");
		spacePathArray[24]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad2+","+rad2+" 0,0,0 "+(cx-rad2)+","+cy+" L"+(cx-rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[25]=paper.path("M"+cx+","+(cy-rad1)+" A"+rad1+","+rad1+" 0,0,0 "+(cx-rad1)+","+cy+" L"+(cx-rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[26]=paper.path("M"+(cx-rad1)+","+cy+" A"+rad1+","+rad1+" 0,0,1 "+(cx+rad1)+","+cy+" Z");
		spacePathArray[27]=paper.path("M"+cx+","+(cy-rad1)+" A"+rad1+","+rad1+" 0,0,1 "+(cx+rad1)+","+cy+" L"+(cx+rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[28]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad2+","+rad2+" 0,0,1 "+(cx+rad2)+","+cy+" L"+(cx+rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[29]=paper.path("M"+(cx+rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad4)+","+cy+" Z");
		spacePathArray[30]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad4)+","+cy+" L"+(cx+rad5)+","+cy+" A"+rad5+","+rad5+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[31]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad5)+","+cy+" L"+(cx+rad6)+","+cy+" A"+rad6+","+rad6+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy-rad1)+" Z");
		spacePathArray[32]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad5)+","+cy+" L"+(cx-rad6)+","+cy+" A"+rad6+","+rad6+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[33]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad4)+","+cy+" L"+(cx-rad5)+","+cy+" A"+rad5+","+rad5+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[34]=paper.path("M"+(cx-rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad4)+","+cy+" Z");
		spacePathArray[35]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad2+","+rad2+" 0,0,1 "+(cx-rad2)+","+cy+" L"+(cx-rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[36]=paper.path("M"+cx+","+(cy+rad1)+" A"+rad1+","+rad1+" 0,0,1 "+(cx-rad1)+","+cy+" L"+(cx-rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[37]=paper.path("M"+(cx-rad1)+","+cy+" A"+rad1+","+rad1+" 0,0,0 "+(cx+rad1)+","+cy+" Z");
		spacePathArray[38]=paper.path("M"+cx+","+(cy+rad1)+" A"+rad1+","+rad1+" 0,0,0 "+(cx+rad1)+","+cy+" L"+(cx+rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[39]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad2+","+rad2+" 0,0,0 "+(cx+rad2)+","+cy+" L"+(cx+rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[40]=paper.path("M"+(cx+rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad4)+","+cy+" Z");
		spacePathArray[41]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad4)+","+cy+" L"+(cx+rad5)+","+cy+" A"+rad5+","+rad5+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[42]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+rad5)+","+cy+" L"+(cx+rad6)+","+cy+" A"+rad6+","+rad6+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[43]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad6+","+rad6+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[44]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad5+","+rad5+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[45]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad3+","+rad3+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[46]=paper.path("M"+cx+","+(cy+rad2)+" A"+rad2+","+rad2+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad3+","+rad3+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[47]=paper.path("M"+cx+","+(cy+rad1)+" L"+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad2+","+rad2+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" Z");
		spacePathArray[48]=paper.path("M"+cx+","+(cy+rad2)+" A"+rad2+","+rad2+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad3+","+rad3+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[49]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad3+","+rad3+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad4+","+rad4+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[50]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad5+","+rad5+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[51]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" L"+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+","+(cy+rad1)+" A"+rad6+","+rad6+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[52]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" L"+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad6+","+rad6+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" Z");
		spacePathArray[53]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" L"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad5+","+rad5+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" Z");
		spacePathArray[54]=paper.path("M"+cx+","+(cy+rad3)+" A"+rad3+","+rad3+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" L"+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" Z");
		spacePathArray[55]=paper.path("M"+cx+","+(cy+rad2)+" L"+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad3+","+rad3+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" Z");
		spacePathArray[56]=paper.path("M"+cx+","+(cy+rad3)+" A"+rad3+","+rad3+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad4+","+rad4+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" Z");
		spacePathArray[57]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" L"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad5+","+rad5+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" Z");
		spacePathArray[58]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" L"+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+","+(cy+rad2)+" A"+rad6+","+rad6+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" Z");
		spacePathArray[59]=paper.path("M"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+","+(cy+rad4)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" L"+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad6+","+rad6+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+","+(cy+rad4)+" Z");
		spacePathArray[60]=paper.path("M"+cx+","+(cy+rad4)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" L"+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad5+","+rad5+" 0,0,0 "+(cx-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+","+(cy+rad4)+" Z");
		spacePathArray[61]=paper.path("M"+cx+","+(cy+rad3)+" L"+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" Z");
		spacePathArray[62]=paper.path("M"+cx+","+(cy+rad4)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" L"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad5+","+rad5+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+","+(cy+rad4)+" Z");
		spacePathArray[63]=paper.path("M"+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+","+(cy+rad4)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" L"+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+","+(cy+rad3)+" A"+rad6+","+rad6+" 0,0,1 "+(cx+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+","+(cy+rad4)+" Z");
	}
	else {//vertical orientation
		spacePathArray[0] =paper.path("M"+(cx+rad4)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" L"+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" A"+rad6+","+rad6+" 0,0,1 "+(cx+rad4)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+" Z");
		spacePathArray[1] =paper.path("M"+(cx+rad4)+","+cy+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" L"+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad4)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" Z");
		spacePathArray[2] =paper.path("M"+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[3] =paper.path("M"+(cx+rad4)+","+cy+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" L"+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx+rad4)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" Z");
		spacePathArray[4] =paper.path("M"+(cx+rad4)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" L"+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" A"+rad6+","+rad6+" 0,0,0 "+(cx+rad4)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+" Z");
		spacePathArray[5] =paper.path("M"+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" L"+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" A"+rad6+","+rad6+" 0,0,1 "+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[6] =paper.path("M"+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" L"+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[7] =paper.path("M"+(cx+rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,0 "+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" L"+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[8] =paper.path("M"+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" A"+rad3+","+rad3+" 0,0,1 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[9] =paper.path("M"+(cx+rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,1 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" L"+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[10]=paper.path("M"+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" L"+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[11]=paper.path("M"+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" L"+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" A"+rad6+","+rad6+" 0,0,0 "+(cx+rad3)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[12]=paper.path("M"+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,1 "+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[13]=paper.path("M"+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[14]=paper.path("M"+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" A"+rad3+","+rad3+" 0,0,0 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[15]=paper.path("M"+(cx+rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,0 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,1 "+(cx+rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[16]=paper.path("M"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" A"+rad2+","+rad2+" 0,0,1 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" Z");
		spacePathArray[17]=paper.path("M"+(cx+rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,1 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,0 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[18]=paper.path("M"+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" A"+rad3+","+rad3+" 0,0,1 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[19]=paper.path("M"+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[20]=paper.path("M"+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,0 "+(cx+rad2)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[21]=paper.path("M"+cx+","+(cy-rad5)+" A"+rad5+","+rad5+" 0,0,1 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,0 "+cx+","+(cy-rad6)+" Z");
		spacePathArray[22]=paper.path("M"+cx+","+(cy-rad4)+" A"+rad4+","+rad4+" 0,0,1 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,0 "+cx+","+(cy-rad5)+" Z");
		spacePathArray[23]=paper.path("M"+cx+","+(cy-rad3)+" A"+rad3+","+rad3+" 0,0,1 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,0 "+cx+","+(cy-rad4)+" Z");
		spacePathArray[24]=paper.path("M"+cx+","+(cy-rad2)+" A"+rad2+","+rad2+" 0,0,1 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,0 "+cx+","+(cy-rad3)+" Z");
		spacePathArray[25]=paper.path("M"+(cx+rad1)+","+cy+" A"+rad1+","+rad1+" 0,0,0 "+cx+","+(cy-rad1)+" L"+cx+","+(cy-rad2)+" A"+rad2+","+rad2+" 0,0,1 "+(cx+rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" Z");
		spacePathArray[26]=paper.path("M"+cx+","+(cy-rad1)+" A"+rad1+","+rad1+" 0,0,1 "+cx+","+(cy+rad1)+" Z");
		spacePathArray[27]=paper.path("M"+(cx+rad1)+","+cy+" A"+rad1+","+rad1+" 0,0,1 "+cx+","+(cy+rad1)+" L"+cx+","+(cy+rad2)+" A"+rad2+","+rad2+" 0,0,0 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" Z");
		spacePathArray[28]=paper.path("M"+cx+","+(cy+rad2)+" A"+rad2+","+rad2+" 0,0,0 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,1 "+cx+","+(cy+rad3)+" Z");
		spacePathArray[29]=paper.path("M"+cx+","+(cy+rad3)+" A"+rad3+","+rad3+" 0,0,0 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,1 "+cx+","+(cy+rad4)+" Z");
		spacePathArray[30]=paper.path("M"+cx+","+(cy+rad4)+" A"+rad4+","+rad4+" 0,0,0 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,1 "+cx+","+(cy+rad5)+" Z");
		spacePathArray[31]=paper.path("M"+cx+","+(cy+rad5)+" A"+rad5+","+rad5+" 0,0,0 "+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx+rad1)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,1 "+cx+","+(cy+rad6)+" Z");
		spacePathArray[32]=paper.path("M"+cx+","+(cy-rad5)+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,1 "+cx+","+(cy-rad6)+" Z");
		spacePathArray[33]=paper.path("M"+cx+","+(cy-rad4)+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,1 "+cx+","+(cy-rad5)+" Z");
		spacePathArray[34]=paper.path("M"+cx+","+(cy-rad3)+" A"+rad3+","+rad3+" 0,0,0 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,1 "+cx+","+(cy-rad4)+" Z");
		spacePathArray[35]=paper.path("M"+cx+","+(cy-rad2)+" A"+rad2+","+rad2+" 0,0,0 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,1 "+cx+","+(cy-rad3)+" Z");
		spacePathArray[36]=paper.path("M"+(cx-rad1)+","+cy+" A"+rad1+","+rad1+" 0,0,1 "+cx+","+(cy-rad1)+" L"+cx+","+(cy-rad2)+" A"+rad2+","+rad2+" 0,0,0 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" Z");
		spacePathArray[37]=paper.path("M"+cx+","+(cy-rad1)+" A"+rad1+","+rad1+" 0,0,0 "+cx+","+(cy+rad1)+" Z");
		spacePathArray[38]=paper.path("M"+(cx-rad1)+","+cy+" A"+rad1+","+rad1+" 0,0,0 "+cx+","+(cy+rad1)+" L"+cx+","+(cy+rad2)+" A"+rad2+","+rad2+" 0,0,1 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" Z");
		spacePathArray[39]=paper.path("M"+cx+","+(cy+rad2)+" A"+rad2+","+rad2+" 0,0,1 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,0 "+cx+","+(cy+rad3)+" Z");
		spacePathArray[40]=paper.path("M"+cx+","+(cy+rad3)+" A"+rad3+","+rad3+" 0,0,1 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,0 "+cx+","+(cy+rad4)+" Z");
		spacePathArray[41]=paper.path("M"+cx+","+(cy+rad4)+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,0 "+cx+","+(cy+rad5)+" Z");
		spacePathArray[42]=paper.path("M"+cx+","+(cy+rad5)+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,0 "+cx+","+(cy+rad6)+" Z");
		spacePathArray[43]=paper.path("M"+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,0 "+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[44]=paper.path("M"+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[45]=paper.path("M"+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" A"+rad3+","+rad3+" 0,0,1 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[46]=paper.path("M"+(cx-rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,1 "+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,0 "+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[47]=paper.path("M"+(cx-rad1)+","+(cy-Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" A"+rad2+","+rad2+" 0,0,0 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" Z");
		spacePathArray[48]=paper.path("M"+(cx-rad2)+","+cy+" A"+rad2+","+rad2+" 0,0,0 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad2,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" A"+rad3+","+rad3+" 0,0,1 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[49]=paper.path("M"+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" A"+rad3+","+rad3+" 0,0,0 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[50]=paper.path("M"+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[51]=paper.path("M"+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad1,2)))+" L"+(cx-rad1)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad1,2)))+" A"+rad6+","+rad6+" 0,0,1 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[52]=paper.path("M"+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" L"+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" A"+rad6+","+rad6+" 0,0,0 "+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[53]=paper.path("M"+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" L"+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[54]=paper.path("M"+(cx-rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,1 "+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" L"+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[55]=paper.path("M"+(cx-rad2)+","+(cy-Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" A"+rad3+","+rad3+" 0,0,0 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" Z");
		spacePathArray[56]=paper.path("M"+(cx-rad3)+","+cy+" A"+rad3+","+rad3+" 0,0,0 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad3,2)-Math.pow(rad2,2)))+" L"+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[57]=paper.path("M"+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad2,2)))+" L"+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[58]=paper.path("M"+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad2,2)))+" L"+(cx-rad2)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad2,2)))+" A"+rad6+","+rad6+" 0,0,1 "+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[59]=paper.path("M"+(cx-rad4)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" L"+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" A"+rad6+","+rad6+" 0,0,0 "+(cx-rad4)+","+(cy-Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+" Z");
		spacePathArray[60]=paper.path("M"+(cx-rad4)+","+cy+" A"+rad4+","+rad4+" 0,0,1 "+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" L"+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad4)+","+(cy-Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" Z");
		spacePathArray[61]=paper.path("M"+(cx-rad3)+","+(cy-Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" Z");
		spacePathArray[62]=paper.path("M"+(cx-rad4)+","+cy+" A"+rad4+","+rad4+" 0,0,0 "+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad4,2)-Math.pow(rad3,2)))+" L"+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" A"+rad5+","+rad5+" 0,0,1 "+(cx-rad4)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" Z");
		spacePathArray[63]=paper.path("M"+(cx-rad4)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad4,2)))+" A"+rad5+","+rad5+" 0,0,0 "+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad5,2)-Math.pow(rad3,2)))+" L"+(cx-rad3)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad3,2)))+" A"+rad6+","+rad6+" 0,0,1 "+(cx-rad4)+","+(cy+Math.sqrt(Math.pow(rad6,2)-Math.pow(rad4,2)))+" Z");
	}


	$(window).resize(function() {
		if(document.getElementById("sp1")) { //only draw board on resize if game was in progress
			$("svg").remove();
			$(".banner").hide();
			$(".navbar").hide();
			$(".desktopMedia").hide();
			$(".mobileMedia").hide();
			$("#top").hide();
			$("#chess").hide();
			$(".mobileMedia").hide();
			if(!windowIsSmall || wasBig)
				drawGameBoard(1,spaceObjectArray,1);
			else
				drawGameBoard(1,spaceObjectArray,0);
		}
	});


	/*if its a new game, set up pieces in their starting positions
	otherwise, import board data from initial setup*/
	if(!resize) { //if new game
		spaceObjectArray[1].occupied=1;
		spaceObjectArray[6].occupied=1;
		spaceObjectArray[13].occupied=1;
		spaceObjectArray[22].occupied=1;
		spaceObjectArray[33].occupied=1;
		spaceObjectArray[44].occupied=1;
		spaceObjectArray[53].occupied=1;
		spaceObjectArray[60].occupied=1;
		spaceObjectArray[3].occupied=2;
		spaceObjectArray[10].occupied=2;
		spaceObjectArray[19].occupied=2;
		spaceObjectArray[30].occupied=2;
		spaceObjectArray[41].occupied=2;
		spaceObjectArray[50].occupied=2;
		spaceObjectArray[57].occupied=2;
		spaceObjectArray[62].occupied=2;
		spaceObjectArray[1].isPawnUnmoved=1;
		spaceObjectArray[6].isPawnUnmoved=1;
		spaceObjectArray[13].isPawnUnmoved=1;
		spaceObjectArray[22].isPawnUnmoved=1;
		spaceObjectArray[33].isPawnUnmoved=1;
		spaceObjectArray[44].isPawnUnmoved=1;
		spaceObjectArray[53].isPawnUnmoved=1;
		spaceObjectArray[60].isPawnUnmoved=1;
		spaceObjectArray[3].isPawnUnmoved=1;
		spaceObjectArray[10].isPawnUnmoved=1;
		spaceObjectArray[19].isPawnUnmoved=1;
		spaceObjectArray[30].isPawnUnmoved=1;
		spaceObjectArray[41].isPawnUnmoved=1;
		spaceObjectArray[50].isPawnUnmoved=1;
		spaceObjectArray[57].isPawnUnmoved=1;
		spaceObjectArray[62].isPawnUnmoved=1;
		spaceObjectArray[3].quadrant=1;
		spaceObjectArray[10].quadrant=1;
		spaceObjectArray[19].quadrant=1;
		spaceObjectArray[30].quadrant=1;
		spaceObjectArray[1].quadrant=2;
		spaceObjectArray[6].quadrant=2;
		spaceObjectArray[13].quadrant=2;
		spaceObjectArray[22].quadrant=2;
		spaceObjectArray[33].quadrant=3;
		spaceObjectArray[44].quadrant=3;
		spaceObjectArray[53].quadrant=3;
		spaceObjectArray[60].quadrant=3;
		spaceObjectArray[41].quadrant=4;
		spaceObjectArray[50].quadrant=4;
		spaceObjectArray[57].quadrant=4;
		spaceObjectArray[62].quadrant=4;
		spaceObjectArray[1].singularity=0;
		spaceObjectArray[6].singularity=0;
		spaceObjectArray[13].singularity=0;
		spaceObjectArray[22].singularity=0;
		spaceObjectArray[33].singularity=0;
		spaceObjectArray[44].singularity=0;
		spaceObjectArray[53].singularity=0;
		spaceObjectArray[60].singularity=0;
		spaceObjectArray[3].singularity=0;
		spaceObjectArray[10].singularity=0;
		spaceObjectArray[19].singularity=0;
		spaceObjectArray[30].singularity=0;
		spaceObjectArray[41].singularity=0;
		spaceObjectArray[50].singularity=0;
		spaceObjectArray[57].singularity=0;
		spaceObjectArray[62].singularity=0;

		spaceObjectArray[0].occupied=3;
		spaceObjectArray[59].occupied=3;
		spaceObjectArray[4].occupied=4;
		spaceObjectArray[63].occupied=4;

		spaceObjectArray[5].occupied=5;
		spaceObjectArray[52].occupied=5;
		spaceObjectArray[11].occupied=6;
		spaceObjectArray[58].occupied=6;

		spaceObjectArray[12].occupied=7;
		spaceObjectArray[43].occupied=7;
		spaceObjectArray[20].occupied=8;
		spaceObjectArray[51].occupied=8;

		spaceObjectArray[32].occupied=9;
		spaceObjectArray[31].occupied=10;

		spaceObjectArray[21].occupied=11;
		spaceObjectArray[42].occupied=12;
	}
	else { //if page has been resized
		for(var i=0;i<64;i++) {
			spaceObjectArray[i]=objectArray[i];
		}
	}


	/* set default prev-direction vectors. these values indicate the direction that 
	each pieces has moved from so that its path can be calculated based on this directon
	for white, default=0 (west)
	for black, default=4 (east)*/
	for(var i=0; i<64; i++) {
		var temp = spaceObjectArray[i].occupied;
		if(temp!=0 && temp%2==0) {
			spaceObjectArray[i].prevDirIndex=4;
		} else if(temp!=0 && temp%2!=0) {
			spaceObjectArray[i].prevDirIndex=0;
		}
	}


	//set basic space attributes for the spacePathArray. this includes: id, index #, color, and the (x,y) coord of the center of the piece
	for(var i=0; i<64; i++) {
		var title=i.toString();
		var id="sp".concat((i+1).toString());
		var jid="#sp".concat((i+1).toString());
		var theColor;
		if((i+1)%2==0)
			theColor=color1;
		else
			theColor=color2;

		spacePathArray[i].attr("fill",theColor);
		spacePathArray[i].attr("stroke",colorS);
		spacePathArray[i].node.setAttribute("class","boardSpace");
		spacePathArray[i].node.setAttribute("id",id);
		if(devmode)
			spacePathArray[i].attr("title",title); //allows hover to show the index of each space during devmode

		//creates the x,y coordinates for each space
		var sBounds=spacePathArray[i].getBBox();
		var xOffset=(40/881)*boardWidth; //scaling based on empirically-determined ratio
		var yOffset=(35/881)*boardWidth; //scaling based on empirically-determined ratio
		if(i==1 || i==7 || i==15 || i==25 || i==36 || i==46 || i==54 || i==60)
			spaceObjectArray[i].cx=sBounds.x+(sBounds.width/3.6)-xOffset;
		else if(i==3 || i==9 || i==17 || i==27 || i==38 || i==48 || i==56 || i==62)
			spaceObjectArray[i].cx=sBounds.x+(sBounds.width/1.4)-xOffset;
		else
			spaceObjectArray[i].cx=sBounds.x+(sBounds.width/2)-xOffset;
		spaceObjectArray[i].cy=sBounds.y+rad05-yOffset;


		//=======================================================================
		// Fine adjustments to (x,y) coords of piece images
		//=======================================================================
		if(isWide) {
			if(i==4 || i==63 || i==57 || i==49)
				spaceObjectArray[i].cx+=15;
			if(i==11 || i==58 || i==18 || i==54 || i==7 || i==60 || i==10)
				spaceObjectArray[i].cx+=10;
			if(i==20 || i==40)
				spaceObjectArray[i].cx+=8;
			if(i==51 || i==31 || i==42 || i==29 || i==34 || i==23 || i==15 || i==46 || i==39 || i==28 || i==36 || i==25 || i==1 || i==30 || i==41 || i==19 || i==56)
				spaceObjectArray[i].cx+=5;
		}
		else {//fix the method used to calculate (x,y) coords for vertical, they're pretty messed up by default
			if(i==60 || i==1 || i==54) {
				spaceObjectArray[i].cx+=10;
				spaceObjectArray[i].cy+=22;
			}
			if(i==59 || i==0 || i==4 || i==63)
				spaceObjectArray[i].cy+=20;
			if(i==53 || i==6 || i==52 || i==5 || i==14)
				spaceObjectArray[i].cy+=10;
			if(i==44 || i==13 || i==50 || i==19 || i==43 || i==12)
				spaceObjectArray[i].cy+=5;
			if(i==45) {
				spaceObjectArray[i].cy+=10;
				spaceObjectArray[i].cx+=4;
			}
			if(i==7) {
				spaceObjectArray[i].cy+=22;
				spaceObjectArray[i].cx+=10;
			}
			if(i==61) {
				spaceObjectArray[i].cy+=80;
				spaceObjectArray[i].cx+=4;
			}
			if(i==55) {
				spaceObjectArray[i].cy+=63;
				spaceObjectArray[i].cx+=4;
			}
			if(i==47) {
				spaceObjectArray[i].cy+=41;
				spaceObjectArray[i].cx+=4;
			}
			if(i==36 || i==25) {
				spaceObjectArray[i].cy+=6;
				spaceObjectArray[i].cx+=10;
			}
			if(i==37) {
				spaceObjectArray[i].cy+=11;
				spaceObjectArray[i].cx+=4;
			}
			if(i==46 || i==15) {
				spaceObjectArray[i].cy+=11;
				spaceObjectArray[i].cx+=12;
			}
			if(i==26)
				spaceObjectArray[i].cy+=11;
			if(i==16)
				spaceObjectArray[i].cy+=41;
			if(i==8)
				spaceObjectArray[i].cy+=63;
		}
	}

	setPieces(paper, spaceObjectArray, boardWidth, windowIsSmall, wasBig);

	//set space hover attributes
	if(!windowIsSmall || wasBig) { //hover function only set on md and lg window sizes
		$(".boardSpace").hover(function(){
			$(this).attr("fill",colorH);
			$(this).attr("stroke",colorHS);
		}, function(){
			var idNum = parseInt($(this).attr("id").replace("sp",""));
			if(idNum%2==0)
				$(this).attr("fill",color1);
			else
				$(this).attr("fill",color2);
			$(this).attr("stroke",colorS);
		});
	}


	//=======================================================================
	// ALL functionality for when a boardspace is clicked, including movable spaces
	//=======================================================================
	$(".boardSpace").click(function(){
		if(document.getElementById("selectedSpace")) {
			$("#selectedSpace").remove();
			$(".movableSpaces").remove();
		}
		var index=parseInt($(this).attr("id").replace("sp",""))-1;
		var isOccupied=spaceObjectArray[index].occupied;
		var selectedPath;

		//temp segment, remove for final
		if(devmode) {
			if(spaceObjectArray[index].isWhiteDanger==1 && spaceObjectArray[index].isBlackDanger==0) {
				//alert("White is in danger");
				//alert(spaceObjectArray[index].quadrant);
			}
			else if(spaceObjectArray[index].isWhiteDanger==0 && spaceObjectArray[index].isBlackDanger==1) {
				//alert("Black is in danger");
				//alert(spaceObjectArray[index].quadrant);
			}
			else if(spaceObjectArray[index].isWhiteDanger==1 && spaceObjectArray[index].isBlackDanger==1) {
				//alert("Both colors are in danger");
				//alert(spaceObjectArray[index].quadrant);
			}
		}//end temp segment

		if(isOccupied!=0 && isCorrectTurn(devmode,turnColor,isOccupied)) {
			//color the clicked on space
			selectedPath = spacePathArray[index].clone();
			selectedPath.node.setAttribute("id","selectedSpace");
			selectedPath.attr("fill",colorSelect);
			selectedPath.attr("stroke",colorSelectS);

			switch(isOccupied) {
/*white pawn*/	case(1):
/*black pawn*/	case(2):
					calculatePawnMovement(1, spaceObjectArray, spacePathArray, index);
					break;
/*white rook*/	case(3):
/*black rook*/	case(4):
					calculateRookMovement(1, spaceObjectArray, spacePathArray, index);
					break;
/*white knight*/case(5):
/*black knight*/case(6):
					calculateKnightMovement(1, spaceObjectArray, spacePathArray, index);
					break;
/*white bishop*/case(7):
/*black bishop*/case(8):
					calculateBishopMovement(1, spaceObjectArray, spacePathArray, index);
					break;
/*white queen*/	case(9):
/*black queen*/	case(10):
					calculateQueenMovement(1, spaceObjectArray, spacePathArray, index);
					break;
/*white king*/	case(11):
/*black king*/	case(12):
					calculateKingMovement(1, spaceObjectArray, spacePathArray, index, 0);
					break;
				default:
					alert("ERROR 1");
					break;
			}
			setPieces(paper, spaceObjectArray, boardWidth, windowIsSmall, wasBig);
		}

		//deselect a selected space when said space is clicked
		$("#selectedSpace").click(function(){
			$(this).remove();
			$(".movableSpaces").remove();
		});



		//=======================================================================
		// Functionality when a movable space (yellow/red) is clicked
		//=======================================================================
		$(".movableSpaces").click(function(){
			//parse data from selected space and store it in variables
			var moveToIndex = parseInt($(this).attr("to"));
			var moveFromIndex = parseInt($(this).attr("from"));
			var piece = parseInt($(this).attr("with"));
			$("#selectedSpace").remove();
			$(".movableSpaces").remove();
			$(".piece").remove();

			//calculate pawn progress through the singularity
			if(spaceObjectArray[moveFromIndex].quadrant!=0) //if piece is a pawn
				updateSingularityMarkers(spaceObjectArray,moveToIndex,moveFromIndex);

			/*set pawn as moved, if applicable, and ensure it doesn't get set to unmoved again.
			THIS CANNOT BE DONE BEFORE UPDATING SINGULARITY MARKERS */
			if(spaceObjectArray[moveFromIndex].isPawnUnmoved==1) {
				spaceObjectArray[moveFromIndex].isPawnUnmoved=0;
				spaceObjectArray[moveToIndex].isPawnUnmoved=0;
			}
			else {
				spaceObjectArray[moveToIndex].isPawnUnmoved=0;
			}

			//fixes pawn movement direction after a diagonal capture
			var fixPrevDirIndex=parseInt($(this).attr("pawn"));
			if(fixPrevDirIndex)
				captureMovementFix(spaceObjectArray, moveToIndex, moveFromIndex);

			//set the moved to space to occupied and reset the spaced that was moved from
			spaceObjectArray[moveToIndex].occupied=piece;
			spaceObjectArray[moveFromIndex].occupied=0;

			//if piece is a pawn, transfer the origin quadrant to the new space
			if(spaceObjectArray[moveFromIndex].quadrant!=0) {
				spaceObjectArray[moveToIndex].quadrant=spaceObjectArray[moveFromIndex].quadrant;
			}
			spaceObjectArray[moveFromIndex].quadrant=0;
			
			//disables or enables piece selection based on whos turn it is
			if(devmode) //if devmode is on, all pieces can be selected at any time
				document.getElementById("gameDisplay1").innerHTML="Devmode Enabled";
			else {
				if(turnColor.search("White")==0)
					turnColor="Black";
				else
					turnColor="White";
				moveCount++;
				document.getElementById("gameDisplay1").innerHTML=turnColor.concat("'s Turn");
				document.getElementById("gameDisplay2").innerHTML="Move #"+moveCount;
			}

			setPieces(paper, spaceObjectArray, boardWidth, windowIsSmall, wasBig);
			calculateDangerSpaces(spaceObjectArray, spacePathArray);
			checkStatus(spaceObjectArray, spacePathArray);

			//create svg objects of danger spaces if in devmode
			if(devmode)
				visualizeDangerSpaces(spaceObjectArray,spacePathArray);

		});//end movableSpace click function
	});//end boardSpace click function
}//end drawGameBoard
