"use strict";
//images from http://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

$(document).ready(function(){
	if(document.getElementById("gameboard")) {
		$("svg").remove();
		$("#gameboard").css({"width":"90%","margin-left":"5%"});

		$(".navbar-toggle").click(function(){
			$("svg").toggle();
		});
	}
});

function playChess() {
	$(".banner").fadeOut(500);
	$(".navbar").fadeOut(500);
	$(".desktopMedia").fadeOut(500);
	$(".desktopMedia").fadeOut(500);
	$(".mobileMedia").fadeOut(500);
	$("#top").fadeOut();
	$("#chess").fadeOut();
	setTimeout(function() { drawGameBoard(1); }, 550);
	;
}

function quitChess() {
	$("svg").fadeOut(500);
	$("#gameControls").fadeOut(500);
	$("svg").remove();
	setTimeout(function() {
		$(".banner").fadeIn(500);
		$(".navbar").fadeIn(500);
		$(".desktopMedia").fadeIn(500);
		$(".desktopMedia").fadeIn(500);
		$(".mobileMedia").fadeIn(500);
		$("#top").fadeIn();
		$("#chess").fadeIn();
	}, 550);
	;
}

function drawGameBoard(resize) {
	$("#gameControls").css({"display":"inline"});
	$("body").css({"overflow-y":"hidden"});
	$("html").css({"overflow-y":"hidden"});
	var isWide,paper,rad1;
	var color1="#333";
	var color2="#bbb";
	var colorH="#0ff";
	var colorS="";
	var colorHS="#016E6E";
	var colorSelect="#FFFF52";		//remove
	var colorSelectS="#8C8C2E";		//remove
	var colorCapture="#FF6666";		//remove
	var colorCaptureS="#8C2E2E";	//remove
	if($(window).width() > $(window).height()) //determines board orientation
		isWide=1;
	else
		isWide=0;

	var bounds = document.getElementById("gameboard").getBoundingClientRect();
	var boardWidth=bounds.right-bounds.left;
	var boardHeight=(2/3)*boardWidth;

	if(isWide) {
		if(boardHeight>$(window).height()) {
			boardHeight=$(window).height()*0.9;
			boardWidth=(3/2)*boardHeight;
		}
		rad1=boardWidth/12;
	}
	else {
		var temp=boardHeight;
		boardHeight=boardWidth;
		boardWidth=temp;
		rad1=boardHeight/12;
	}

	var startX=($(window).width()/2)-(boardWidth/2);
	var startY=(bounds.top+window.pageYOffset)+($(window).height()*0.07);
	paper=Raphael(startX, startY, boardWidth, boardHeight);
	$("svg").css({"margin-bottom":"40px"});

	var cx=boardWidth/2;
	var cy=boardHeight/2;

	var rad05 = rad1/2;
	var rad2=2*rad1;
	var rad3=3*rad1;
	var rad4=4*rad1;
	var rad5=5*rad1;
	var rad6=6*rad1;

	var spacePathArray=		new Array(64);
	var spaceObjectArray=	new Array(64);

	for(var i=0; i<64; i++) {
		spaceObjectArray[i]=new Object();
		spaceObjectArray[i].direct = new Array(8);

		for(var j=0; j<8; j++)
			spaceObjectArray[i].direct[j]=-1;
		spaceObjectArray[i].prevDirIndex;
		spaceObjectArray[i].cx=-1;
		spaceObjectArray[i].cy=-1;
		spaceObjectArray[i].occupied=0;	//odd=white, even=black
	}


	/*	set direction attributes for each space on the board
	even indexes are cardinal directions
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

	spaceObjectArray[63].direct[0]=62;
	spaceObjectArray[63].direct[1]=57;
	spaceObjectArray[63].direct[2]=58;


	/* draw all 64 pieces on the board and store each one in spacePathArray */
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


	/* if its a new game, set up pieces in their starting positions */
	/*spaceObjectArray[1].occupied=1;
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
	spaceObjectArray[62].occupied=2;*/

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


	/* set basic space attributes. this includes: id, index #, color, and the (x,y) coord of the center of the piece */
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
		spacePathArray[i].attr("title",title);
		spacePathArray[i].attr("stroke",colorS);
		spacePathArray[i].node.setAttribute("class","boardSpace");
		spacePathArray[i].node.setAttribute("id",id);

		//creates the x,y coordinates for each space (NEEDS ADJUSTING)
		var sBounds = spacePathArray[i].getBBox();
		if(i==1 || i==7 || i==15 || i==25 || i==36 || i==46 || i==54 || i==60)
			spaceObjectArray[i].cx=sBounds.x+(sBounds.width/3.6);
		else if(i==3 || i==9 || i==17 || i==27 || i==38 || i==48 || i==56 || i==62)
			spaceObjectArray[i].cx=sBounds.x+(sBounds.width/1.4);
		else
			spaceObjectArray[i].cx=sBounds.x+(sBounds.width/2);
		spaceObjectArray[i].cy=sBounds.y+rad05;
	}


	/* draw pieces (first time set-up) */
	for(var i=0;i<64;i++) {
		setPiece(paper, spaceObjectArray[i].occupied, spaceObjectArray[i].cx, spaceObjectArray[i].cy, i);
	}


	/* set space hover attributes */
	$(".boardSpace").hover(function(){
		$(this).attr("fill",colorH);
		$(this).attr("stroke",colorHS);
	}, function(){
		var idNum = parseInt($(this).attr("id").replace("sp",""));
		if(idNum%2==0) {
			$(this).attr("fill",color1);
			$(this).attr("stroke",colorS);
		}
		else {
			$(this).attr("fill",color2);
			$(this).attr("stroke",colorS);
		}
	});


	/* set ALL space click functionality */
	$(".boardSpace").click(function(){
		if(document.getElementById("selectedSpace")) {
			$("#selectedSpace").remove();
			$(".movableSpaces").remove();
			$(".temp").remove();
		}
		var index=parseInt($(this).attr("id").replace("sp",""))-1;
		var isOccupied=spaceObjectArray[index].occupied;
		var selectedPath;

		if(isOccupied!=0) {

			/* color the clicked on space */
			selectedPath = spacePathArray[index].clone();
			selectedPath.node.setAttribute("id","selectedSpace");
			selectedPath.attr("fill",colorSelect);
			selectedPath.attr("stroke",colorSelectS);
			/* end color */

			switch(isOccupied) {
/*white pawn*/	case(1):
/*black pawn*/	case(2):
					//account for 2 squares on first turn
					//account for en passant
					//account for diagonal captures
					break;
/*white rook*/	case(3):
/*black rook*/	case(4):
					//check ALL directions
					var originalIndex=index;
					var originalNextDirIndex=0;
					var nextDirIndex=0;
					for(var j=0;j<4;j++) {
						var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						while(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) { //if the next board space exists and is unoccupied
							for(var i=0; i<8; i++) //get piece's vector from current space and store it in next space
								if(spaceObjectArray[nextIndex].direct[i]==index)
									spaceObjectArray[nextIndex].prevDirIndex=i;
							makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied);

							index=nextIndex;
							nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
							if(nextDirIndex>7)
								nextDirIndex-=8;
							else if(nextDirIndex<0)
								nextDirIndex+=8;
							nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						}
						if(nextIndex!=-1) {
							if((spaceObjectArray[nextIndex].occupied%2==0 && spaceObjectArray[originalIndex].occupied%2!=0) || (spaceObjectArray[nextIndex].occupied%2!=0 && spaceObjectArray[originalIndex].occupied%2==0)) {
								makeCaptureSpace(spacePathArray[nextIndex],originalIndex,isOccupied);
							}
						}
						originalNextDirIndex+=2;
						nextDirIndex=originalNextDirIndex;
						index=originalIndex;
					}
					break;
/*white knight*/case(5):
/*black knight*/case(6):
					//ISSUES WITH VECTOR TRANSITIONS IN THE CORNERS OF THE BOARD (same issue with pawns)
					var originalNextDirIndex=0;
					var originalIndex=index;
					var nextDirIndex=0;
					var nextIndex=spaceObjectArray[index].direct[nextDirIndex];
					for(var j=0;j<4;j++) {
						if(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) { //if the next board space exists and is unoccupied
							for(var i=0; i<8; i++) //get piece's vector from current space and store it in next space
								if(spaceObjectArray[nextIndex].direct[i]==index)
									spaceObjectArray[nextIndex].prevDirIndex=i;
							var diagDirIndex1=nextDirIndex+1;
							if(diagDirIndex1>7)
								diagDirIndex1-=8;
							else if(diagDirIndex1<0)
								diagDirIndex1+=8;
							var diagDirIndex2=nextDirIndex-1;
							if(diagDirIndex2>7)
								diagDirIndex2-=8;
							else if(diagDirIndex2<0)
								diagDirIndex2+=8;
							
							var diagIndex1=spaceObjectArray[nextIndex].direct[diagDirIndex1];
							var diagIndex2=spaceObjectArray[nextIndex].direct[diagDirIndex2];

							if(diagIndex1!=-1) {
								if(spaceObjectArray[diagIndex1].occupied==0) {
									makeMovableSpace(spacePathArray[diagIndex1],originalIndex,isOccupied);
								}
							}
							if(diagIndex2!=-1) {
								if(spaceObjectArray[diagIndex2].occupied==0) {
									makeMovableSpace(spacePathArray[diagIndex2],originalIndex,isOccupied);
								}
							}
						}

						index=originalIndex;
						originalNextDirIndex+=2;
						nextDirIndex=originalNextDirIndex;
						nextIndex=spaceObjectArray[index].direct[nextDirIndex];
					}
					break;
/*white bishop*/case(7):
/*black bishop*/case(8):
					var originalIndex=index;
					var originalNextDirIndex=1;
					var nextDirIndex=1;
					for(var j=0;j<4;j++) {
						var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						while(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) { //if the next board space exists and is unoccupied
							for(var i=0; i<8; i++) //get piece's vector from current space and store it in next space
								if(spaceObjectArray[nextIndex].direct[i]==index)
									spaceObjectArray[nextIndex].prevDirIndex=i;
							makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied);

							index=nextIndex;
							nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
							if(nextDirIndex>7)
								nextDirIndex-=8;
							else if(nextDirIndex<0)
								nextDirIndex+=8;
							nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						}
						if(nextIndex!=-1) {
							if((spaceObjectArray[nextIndex].occupied%2==0 && spaceObjectArray[originalIndex].occupied%2!=0) || (spaceObjectArray[nextIndex].occupied%2!=0 && spaceObjectArray[originalIndex].occupied%2==0)) {
								makeCaptureSpace(spacePathArray[nextIndex],originalIndex,isOccupied);
							}
						}
						originalNextDirIndex+=2;
						nextDirIndex=originalNextDirIndex;
						index=originalIndex;
					}
					break;
/*white queen*/	case(9):
/*black queen*/	case(10):
					//check ALL directions
					var originalIndex=index;
					var originalNextDirIndex=0;
					var nextDirIndex=0;
					for(var j=0;j<8;j++) {
						var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						while(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) { //if the next board space exists and is unoccupied
							for(var i=0; i<8; i++) //get piece's vector from current space and store it in next space
								if(spaceObjectArray[nextIndex].direct[i]==index)
									spaceObjectArray[nextIndex].prevDirIndex=i;
							makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied);

							index=nextIndex;
							nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
							if(nextDirIndex>7)
								nextDirIndex-=8;
							else if(nextDirIndex<0)
								nextDirIndex+=8;
							nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						}
						if(nextIndex!=-1) {
							if((spaceObjectArray[nextIndex].occupied%2==0 && spaceObjectArray[originalIndex].occupied%2!=0) || (spaceObjectArray[nextIndex].occupied%2!=0 && spaceObjectArray[originalIndex].occupied%2==0)) {
								makeCaptureSpace(spacePathArray[nextIndex],originalIndex,isOccupied);
							}
						}
						originalNextDirIndex++;
						nextDirIndex=originalNextDirIndex;
						index=originalIndex;
					}
					break;
/*white king*/	case(11):
/*black king*/	case(12):
					//check all directions 1 space away
					var originalIndex=index;
					var originalNextDirIndex=0;
					var nextDirIndex=0;
					for(var j=0;j<8;j++) {
						var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						if(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) { //if the next board space exists and is unoccupied
							for(var i=0; i<8; i++) //get piece's vector from current space and store it in next space
								if(spaceObjectArray[nextIndex].direct[i]==index)
									spaceObjectArray[nextIndex].prevDirIndex=i;
							makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied);

							index=nextIndex;
							nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
							if(nextDirIndex>7)
								nextDirIndex-=8;
							else if(nextDirIndex<0)
								nextDirIndex+=8;
							nextIndex = spaceObjectArray[index].direct[nextDirIndex];
						} else if(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied!=0) {
							if((spaceObjectArray[nextIndex].occupied%2==0 && spaceObjectArray[originalIndex].occupied%2!=0) || (spaceObjectArray[nextIndex].occupied%2!=0 && spaceObjectArray[originalIndex].occupied%2==0)) {
								makeCaptureSpace(spacePathArray[nextIndex],originalIndex,isOccupied);
							}
						}
						originalNextDirIndex++;
						nextDirIndex=originalNextDirIndex;
						index=originalIndex;
					}
					break;
				default:
					alert("ERROR 1");
					break;
			}

			// draw pieces
			$(".piece").remove();
			for(var i=0;i<64;i++) {
				setPiece(paper, spaceObjectArray[i].occupied, spaceObjectArray[i].cx, spaceObjectArray[i].cy, i);
			}
		}

		$("#selectedSpace").click(function(){
			$(this).remove();
			$(".movableSpaces").remove();
			$(".temp").remove();
		});

		$(".movableSpaces").click(function(){
			var moveToIndex = parseInt($(this).attr("to"));
			var moveFromIndex = parseInt($(this).attr("from"));
			var piece = parseInt($(this).attr("with"));
			spaceObjectArray[moveToIndex].occupied=piece;
			spaceObjectArray[moveFromIndex].occupied=0;
			$(".temp").remove();
			$("#selectedSpace").remove();
			$(".movableSpaces").remove();
			$(".piece").remove();

			//draw pieces
			$(".piece").remove();
			for(var i=0;i<64;i++) {
				setPiece(paper, spaceObjectArray[i].occupied, spaceObjectArray[i].cx, spaceObjectArray[i].cy, i);
			}
		});
	});
}


function setPiece(paper, piece, x, y, index) {
	switch(piece) {
		case(1): //white pawn
			var pawn = paper.image("images/chess/pawn_white.svg", x-40, y-40, 75, 75);
			pawn.node.setAttribute("class","piece");
			pawn.node.setAttribute("index",index);
			break;
		case(2): //black pawn
			var pawn = paper.image("images/chess/pawn_black.svg", x-40, y-40, 75, 75);
			pawn.node.setAttribute("class","piece");
			pawn.node.setAttribute("index",index);
			break;
		case(3): //white rook
			var rook = paper.image("images/chess/rook_white.svg", x-40, y-40, 75, 75);
			rook.node.setAttribute("class","piece");
			rook.node.setAttribute("index",index);
			break;
		case(4): //black rook
			var rook = paper.image("images/chess/rook_black.svg", x-40, y-40, 75, 75);
			rook.node.setAttribute("class","piece");
			rook.node.setAttribute("index",index);
			break;
		case(5): //white knite
			var knight = paper.image("images/chess/knight_white.svg", x-40, y-40, 75, 75);
			knight.node.setAttribute("class","piece");
			knight.node.setAttribute("index",index);
			break;
		case(6): //black knite
			var knight = paper.image("images/chess/knight_black.svg", x-40, y-40, 75, 75);
			knight.node.setAttribute("class","piece");
			knight.node.setAttribute("index",index);
			break;
		case(7): //white bishop
			var bishop = paper.image("images/chess/bishop_white.svg", x-40, y-40, 75, 75);
			bishop.node.setAttribute("class","piece");
			bishop.node.setAttribute("index",index);
			break;
		case(8): //black bishop
			var bishop = paper.image("images/chess/bishop_black.svg", x-40, y-40, 75, 75);
			bishop.node.setAttribute("class","piece");
			bishop.node.setAttribute("index",index);
			break;
		case(9): //white queen
			var queen = paper.image("images/chess/queen_white.svg", x-40, y-40, 75, 75);
			queen.node.setAttribute("class","piece");
			queen.node.setAttribute("index",index);
			break;
		case(10): //black queen
			var queen = paper.image("images/chess/queen_black.svg", x-40, y-40, 75, 75);
			queen.node.setAttribute("class","piece");
			queen.node.setAttribute("index",index);
			break;
		case(11): //white king
			var king = paper.image("images/chess/king_white.svg", x-40, y-40, 75, 75);
			king.node.setAttribute("class","piece");
			king.node.setAttribute("index",index);
			break;
		case(12): //black king
			var king = paper.image("images/chess/king_black.svg", x-40, y-40, 75, 75);
			king.node.setAttribute("class","piece");
			king.node.setAttribute("index",index);
			break;
		default:
			break;
	}

	//allow the pieces to be hovered through
	$('.piece').hover(function () {
		var pathId="#sp".concat(parseInt($(this).attr("index"))+1);
		$(pathId).attr("fill","#0ff");
	},function () {
		var pieceIndex=parseInt($(this).attr("index"));
	    var pathId="#sp".concat(parseInt($(this).attr("index"))+1);
	    if(pieceIndex%2!=0) {
			$(pathId).attr("fill","#333");
		}
		else {
			$(pathId).attr("fill","#bbb");
		}
	});

	//allow the pieces to be clicked through
	$('.piece').click(function (e) {
	    $(this).hide();
	    $(document.elementFromPoint(e.clientX, e.clientY)).trigger("click");
	    $(this).show();
	});
}

function makeMovableSpace(spacePathObject, index, isOccupied) { //function for drawing all highlighted yellow (movable) spaces
	var moveToIndex = parseInt(spacePathObject.node.getAttribute("id").replace("sp",""))-1;
	var movable = spacePathObject.clone();
	movable.node.setAttribute("class","movableSpaces");
	movable.node.setAttribute("to",moveToIndex);
	movable.node.setAttribute("from",index);
	movable.node.setAttribute("with",isOccupied);
	movable.attr("fill","#FFFF52");
	movable.attr("stroke","#8C8C2E");
}

function makeCaptureSpace(spacePathObject, index, isOccupied) { //function for drawing all highlighted red (capturable) spaces
	var moveToIndex = parseInt(spacePathObject.node.getAttribute("id").replace("sp",""))-1;
	var movable = spacePathObject.clone();
	movable.node.setAttribute("class","movableSpaces");
	movable.node.setAttribute("to",moveToIndex);
	movable.node.setAttribute("from",index);
	movable.node.setAttribute("with",isOccupied);
	movable.attr("fill","#FF6666");
	movable.attr("stroke","#8C2E2E");
}