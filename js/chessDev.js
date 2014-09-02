//***********************************************************************
//***********************************************************************
// 
//	File contents: All functions used for developing and debugging the game
//
//***********************************************************************
//***********************************************************************
"use strict";




//=======================================================================
// Display prevDirIndex attributes of all spaceObjects
//=======================================================================
function displayAllPrevDirIndex(spaceObjectArray) {
	alert(
		"0: "+spaceObjectArray[0].prevDirIndex+"       1: "+spaceObjectArray[1].prevDirIndex+"\n"+
		"2: "+spaceObjectArray[2].prevDirIndex+"       3: "+spaceObjectArray[3].prevDirIndex+"\n"+
		"4: "+spaceObjectArray[4].prevDirIndex+"       5: "+spaceObjectArray[5].prevDirIndex+"\n"+
		"6: "+spaceObjectArray[6].prevDirIndex+"       7: "+spaceObjectArray[7].prevDirIndex+"\n"+
		"8: "+spaceObjectArray[8].prevDirIndex+"       9: "+spaceObjectArray[9].prevDirIndex+"\n"+
		"10: "+spaceObjectArray[10].prevDirIndex+"     11: "+spaceObjectArray[11].prevDirIndex+"\n"+
		"12: "+spaceObjectArray[12].prevDirIndex+"     13: "+spaceObjectArray[13].prevDirIndex+"\n"+
		"14: "+spaceObjectArray[14].prevDirIndex+"     15: "+spaceObjectArray[15].prevDirIndex+"\n"+
		"16: "+spaceObjectArray[16].prevDirIndex+"     17: "+spaceObjectArray[17].prevDirIndex+"\n"+
		"18: "+spaceObjectArray[18].prevDirIndex+"     19: "+spaceObjectArray[19].prevDirIndex+"\n"+
		"20: "+spaceObjectArray[20].prevDirIndex+"     21: "+spaceObjectArray[21].prevDirIndex+"\n"+
		"22: "+spaceObjectArray[22].prevDirIndex+"     23: "+spaceObjectArray[23].prevDirIndex+"\n"+
		"24: "+spaceObjectArray[24].prevDirIndex+"     25: "+spaceObjectArray[25].prevDirIndex+"\n"+
		"26: "+spaceObjectArray[26].prevDirIndex+"     27: "+spaceObjectArray[27].prevDirIndex+"\n"+
		"28: "+spaceObjectArray[28].prevDirIndex+"     29: "+spaceObjectArray[29].prevDirIndex+"\n"+
		"30: "+spaceObjectArray[30].prevDirIndex+"     31: "+spaceObjectArray[31].prevDirIndex+"\n"+
		"32: "+spaceObjectArray[32].prevDirIndex+"     33: "+spaceObjectArray[33].prevDirIndex+"\n"+
		"34: "+spaceObjectArray[34].prevDirIndex+"     35: "+spaceObjectArray[35].prevDirIndex+"\n"+
		"36: "+spaceObjectArray[36].prevDirIndex+"     37: "+spaceObjectArray[37].prevDirIndex+"\n"+
		"38: "+spaceObjectArray[38].prevDirIndex+"     39: "+spaceObjectArray[39].prevDirIndex+"\n"+
		"40: "+spaceObjectArray[40].prevDirIndex+"     41: "+spaceObjectArray[41].prevDirIndex+"\n"+
		"42: "+spaceObjectArray[42].prevDirIndex+"     43: "+spaceObjectArray[43].prevDirIndex+"\n"+
		"44: "+spaceObjectArray[44].prevDirIndex+"     45: "+spaceObjectArray[45].prevDirIndex+"\n"+
		"46: "+spaceObjectArray[46].prevDirIndex+"     47: "+spaceObjectArray[47].prevDirIndex+"\n"+
		"48: "+spaceObjectArray[48].prevDirIndex+"     49: "+spaceObjectArray[49].prevDirIndex+"\n"+
		"50: "+spaceObjectArray[50].prevDirIndex+"     51: "+spaceObjectArray[51].prevDirIndex+"\n"+
		"52: "+spaceObjectArray[52].prevDirIndex+"     53: "+spaceObjectArray[53].prevDirIndex+"\n"+
		"54: "+spaceObjectArray[54].prevDirIndex+"     55: "+spaceObjectArray[55].prevDirIndex+"\n"+
		"56: "+spaceObjectArray[56].prevDirIndex+"     57: "+spaceObjectArray[57].prevDirIndex+"\n"+
		"58: "+spaceObjectArray[58].prevDirIndex+"     59: "+spaceObjectArray[59].prevDirIndex+"\n"+
		"60: "+spaceObjectArray[60].prevDirIndex+"     61: "+spaceObjectArray[61].prevDirIndex+"\n"+
		"62: "+spaceObjectArray[62].prevDirIndex+"     63: "+spaceObjectArray[63].prevDirIndex+"\n"
	);
}




//=======================================================================
// Display .occupied attributes of all spaceObjects
//=======================================================================
function displayAllOccupied(spaceObjectArray) {
	alert(
		"0: "+spaceObjectArray[0].occupied+"       1: "+spaceObjectArray[1].occupied+"\n"+
		"2: "+spaceObjectArray[2].occupied+"       3: "+spaceObjectArray[3].occupied+"\n"+
		"4: "+spaceObjectArray[4].occupied+"       5: "+spaceObjectArray[5].occupied+"\n"+
		"6: "+spaceObjectArray[6].occupied+"       7: "+spaceObjectArray[7].occupied+"\n"+
		"8: "+spaceObjectArray[8].occupied+"       9: "+spaceObjectArray[9].occupied+"\n"+
		"10: "+spaceObjectArray[10].occupied+"     11: "+spaceObjectArray[11].occupied+"\n"+
		"12: "+spaceObjectArray[12].occupied+"     13: "+spaceObjectArray[13].occupied+"\n"+
		"14: "+spaceObjectArray[14].occupied+"     15: "+spaceObjectArray[15].occupied+"\n"+
		"16: "+spaceObjectArray[16].occupied+"     17: "+spaceObjectArray[17].occupied+"\n"+
		"18: "+spaceObjectArray[18].occupied+"     19: "+spaceObjectArray[19].occupied+"\n"+
		"20: "+spaceObjectArray[20].occupied+"     21: "+spaceObjectArray[21].occupied+"\n"+
		"22: "+spaceObjectArray[22].occupied+"     23: "+spaceObjectArray[23].occupied+"\n"+
		"24: "+spaceObjectArray[24].occupied+"     25: "+spaceObjectArray[25].occupied+"\n"+
		"26: "+spaceObjectArray[26].occupied+"     27: "+spaceObjectArray[27].occupied+"\n"+
		"28: "+spaceObjectArray[28].occupied+"     29: "+spaceObjectArray[29].occupied+"\n"+
		"30: "+spaceObjectArray[30].occupied+"     31: "+spaceObjectArray[31].occupied+"\n"+
		"32: "+spaceObjectArray[32].occupied+"     33: "+spaceObjectArray[33].occupied+"\n"+
		"34: "+spaceObjectArray[34].occupied+"     35: "+spaceObjectArray[35].occupied+"\n"+
		"36: "+spaceObjectArray[36].occupied+"     37: "+spaceObjectArray[37].occupied+"\n"+
		"38: "+spaceObjectArray[38].occupied+"     39: "+spaceObjectArray[39].occupied+"\n"+
		"40: "+spaceObjectArray[40].occupied+"     41: "+spaceObjectArray[41].occupied+"\n"+
		"42: "+spaceObjectArray[42].occupied+"     43: "+spaceObjectArray[43].occupied+"\n"+
		"44: "+spaceObjectArray[44].occupied+"     45: "+spaceObjectArray[45].occupied+"\n"+
		"46: "+spaceObjectArray[46].occupied+"     47: "+spaceObjectArray[47].occupied+"\n"+
		"48: "+spaceObjectArray[48].occupied+"     49: "+spaceObjectArray[49].occupied+"\n"+
		"50: "+spaceObjectArray[50].occupied+"     51: "+spaceObjectArray[51].occupied+"\n"+
		"52: "+spaceObjectArray[52].occupied+"     53: "+spaceObjectArray[53].occupied+"\n"+
		"54: "+spaceObjectArray[54].occupied+"     55: "+spaceObjectArray[55].occupied+"\n"+
		"56: "+spaceObjectArray[56].occupied+"     57: "+spaceObjectArray[57].occupied+"\n"+
		"58: "+spaceObjectArray[58].occupied+"     59: "+spaceObjectArray[59].occupied+"\n"+
		"60: "+spaceObjectArray[60].occupied+"     61: "+spaceObjectArray[61].occupied+"\n"+
		"62: "+spaceObjectArray[62].occupied+"     63: "+spaceObjectArray[63].occupied+"\n"
	);
}




//=======================================================================
// Physically display danger spaces on the board.
// white space=white is in danger of capture
// black space=black is in danger of capture
// green space=both are in danger of capture
//=======================================================================
function visualizeDangerSpaces(spaceObjectArray, spacePathArray) {
	$(".dangerSpace").remove();
	for(var i=0; i<64; i++) {
		if(spaceObjectArray[i].isBlackDanger==1 && spaceObjectArray[i].isWhiteDanger==0) {
			var movable=spacePathArray[i].clone();
			movable.attr("fill","#000");
			movable.node.setAttribute("class","dangerSpace");
		}
		else if(spaceObjectArray[i].isBlackDanger==0 && spaceObjectArray[i].isWhiteDanger==1) {
			var movable=spacePathArray[i].clone();
			movable.attr("fill","#fff");
			movable.node.setAttribute("class","dangerSpace");
		}
		else if(spaceObjectArray[i].isBlackDanger==1 && spaceObjectArray[i].isWhiteDanger==1) {
			var movable=spacePathArray[i].clone();
			movable.attr("fill","#53FF0F");
			movable.node.setAttribute("class","dangerSpace");
		}
	}
	$(".dangerSpace").hide();

	$("#devButton1").click(function(){
		$(".dangerSpace").show();
	});

	$("#devButton2").click(function(){
		$(".dangerSpace").hide();
	});
}


function displayAllPieceData(pieceData,index) {
	alert(
		"The piece at index "+index+" has "+pieceData.numMoves+" moves and "+pieceData.numCaps+" captures.\n"+
		"Move 1: "+pieceData.moveIndexes[0]+"        Cap 1: "+pieceData.capIndexes[0]+"\n"+
		"Move 2: "+pieceData.moveIndexes[1]+"        Cap 2: "+pieceData.capIndexes[1]+"\n"+
		"Move 3: "+pieceData.moveIndexes[2]+"        Cap 3: "+pieceData.capIndexes[2]+"\n"+
		"Move 4: "+pieceData.moveIndexes[3]+"        Cap 4: "+pieceData.capIndexes[3]+"\n"+
		"Move 5: "+pieceData.moveIndexes[4]+"        Cap 5: "+pieceData.capIndexes[4]+"\n"+
		"Move 6: "+pieceData.moveIndexes[5]+"        Cap 6: "+pieceData.capIndexes[5]+"\n"+
		"Move 7: "+pieceData.moveIndexes[6]+"        Cap 7: "+pieceData.capIndexes[6]+"\n"+
		"Move 8: "+pieceData.moveIndexes[7]+"        Cap 8: "+pieceData.capIndexes[7]+"\n"+
		"Move 9: "+pieceData.moveIndexes[8]+"        Cap 9: "+pieceData.capIndexes[8]+"\n"+
		"Move 10: "+pieceData.moveIndexes[9]+"       Cap 10: "+pieceData.capIndexes[9]+"\n"+
		"Move 11: "+pieceData.moveIndexes[10]+"       Cap 11: "+pieceData.capIndexes[10]+"\n"+
		"Move 12: "+pieceData.moveIndexes[11]+"       Cap 12: "+pieceData.capIndexes[11]+"\n"+
		"Move 13: "+pieceData.moveIndexes[12]+"       Cap 13: "+pieceData.capIndexes[12]+"\n"+
		"Move 14: "+pieceData.moveIndexes[13]+"       Cap 14: "+pieceData.capIndexes[13]+"\n"+
		"Move 15: "+pieceData.moveIndexes[14]+"       Cap 15: "+pieceData.capIndexes[14]+"\n"+
		"Move 16: "+pieceData.moveIndexes[15]+"       Cap 16: "+pieceData.capIndexes[15]+"\n"+
		"Move 17: "+pieceData.moveIndexes[16]+"       Cap 17: "+pieceData.capIndexes[16]+"\n"+
		"Move 18: "+pieceData.moveIndexes[17]+"       Cap 18: "+pieceData.capIndexes[17]+"\n"+
		"Move 19: "+pieceData.moveIndexes[18]+"       Cap 19: "+pieceData.capIndexes[18]+"\n"+
		"Move 20: "+pieceData.moveIndexes[19]+"       Cap 20: "+pieceData.capIndexes[19]+"\n"+
		"Move 21: "+pieceData.moveIndexes[20]+"       Cap 21: "+pieceData.capIndexes[20]+"\n"+
		"Move 22: "+pieceData.moveIndexes[21]+"       Cap 22: "+pieceData.capIndexes[21]+"\n"+
		"Move 23: "+pieceData.moveIndexes[22]+"       Cap 23: "+pieceData.capIndexes[22]+"\n"+
		"Move 24: "+pieceData.moveIndexes[23]+"       Cap 24: "+pieceData.capIndexes[23]+"\n"
	);
}