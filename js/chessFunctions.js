//***********************************************************************
//***********************************************************************
// 
//	File contents: all stand-alone functions used in the game except
//	for piece movement calculation functions
//
//***********************************************************************
//***********************************************************************
"use strict";




//=======================================================================
// Function to draw pieces on the board using svg image files
//=======================================================================
function setPieces(paper, objectArray, boardWidth, windowIsSmall, wasBig) {
	$(".extended").remove(); //this is here in case a media flyout was created right as the 'Play' button was pressed
	$(".piece").remove();
	var pieceSize=(65/881)*boardWidth; //size scaled based on empirically determined ratio
	for(var i=0;i<64;i++) {
		var x=objectArray[i].cx;
		var y=objectArray[i].cy;
		switch(objectArray[i].occupied) {
			case(1): //white pawn
				var pawn = paper.image("images/chess/pawn_white.svg", x, y, pieceSize, pieceSize);
				pawn.node.setAttribute("class","piece");
				pawn.node.setAttribute("index",i);
				break;
			case(2): //black pawn
				var pawn = paper.image("images/chess/pawn_black.svg", x, y, pieceSize, pieceSize);
				pawn.node.setAttribute("class","piece");
				pawn.node.setAttribute("index",i);
				break;
			case(3): //white rook
				var rook = paper.image("images/chess/rook_white.svg", x, y, pieceSize, pieceSize);
				rook.node.setAttribute("class","piece");
				rook.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(4): //black rook
				var rook = paper.image("images/chess/rook_black.svg", x, y, pieceSize, pieceSize);
				rook.node.setAttribute("class","piece");
				rook.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(5): //white knite
				var knight = paper.image("images/chess/knight_white.svg", x, y, pieceSize, pieceSize);
				knight.node.setAttribute("class","piece");
				knight.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(6): //black knite
				var knight = paper.image("images/chess/knight_black.svg", x, y, pieceSize, pieceSize);
				knight.node.setAttribute("class","piece");
				knight.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(7): //white bishop
				var bishop = paper.image("images/chess/bishop_white.svg", x, y, pieceSize, pieceSize);
				bishop.node.setAttribute("class","piece");
				bishop.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(8): //black bishop
				var bishop = paper.image("images/chess/bishop_black.svg", x, y, pieceSize, pieceSize);
				bishop.node.setAttribute("class","piece");
				bishop.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(9): //white queen
				var queen = paper.image("images/chess/queen_white.svg", x, y, pieceSize, pieceSize);
				queen.node.setAttribute("class","piece");
				queen.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(10): //black queen
				var queen = paper.image("images/chess/queen_black.svg", x, y, pieceSize, pieceSize);
				queen.node.setAttribute("class","piece");
				queen.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(11): //white king
				var king = paper.image("images/chess/king_white.svg", x, y, pieceSize, pieceSize);
				king.node.setAttribute("class","piece");
				king.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			case(12): //black king
				var king = paper.image("images/chess/king_black.svg", x, y, pieceSize, pieceSize);
				king.node.setAttribute("class","piece");
				king.node.setAttribute("index",i);
				objectArray[i].quadrant=0;
				break;
			default:
				break;
		}
	}

	var string1;
	for(var i=0; i<64; i++) {
		string1 = ((i.toString()).concat(": ")).concat((objectArray[i].prevDirIndex.toString()).concat("\n"));
		//alert(string1);
	}

	//allow the pieces to be hovered through
	if(!windowIsSmall || wasBig) {
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
	}

	//allow the pieces to be clicked through
	$('.piece').click(function (e) {
	    $(this).hide();
	    $(document.elementFromPoint(e.clientX, e.clientY)).trigger("click");
	    $(this).show();
	});
}



//=======================================================================
// Creates red and yellow spaces to highlight available capture and
// movement locations for pieces
//=======================================================================
function makeMovableSpace(spacePathObject, index, isOccupied, isPawn, isCapture) {
	var moveToIndex = parseInt(spacePathObject.node.getAttribute("id").replace("sp",""))-1;
	var movable = spacePathObject.clone();
	movable.node.setAttribute("class","movableSpaces");
	movable.node.setAttribute("to",moveToIndex);
	movable.node.setAttribute("from",index);
	movable.node.setAttribute("with",isOccupied);
	movable.node.setAttribute("pawn",0);
	
	if(isPawn && isCapture)
		movable.node.setAttribute("pawn",1); //the "pawn" attribute is only set on a space that a pawn can capture diagonally. if the pawn captures,
	else									 //the main function reads the "pawn" attribute and corrects the capturing pawns direction.
		movable.node.setAttribute("pawn",0);
	
	if(isCapture) { //if capture space, color it red
		movable.attr("fill","#FF6666");
		movable.attr("stroke","#8C2E2E");
	}
	else { //else, its a movable space, so color it yellow
		movable.attr("fill","#FFFF52");
		movable.attr("stroke","#8C8C2E");
	}
}




//=======================================================================
// Determines if a piece can be selected/moved based on current turn color
//=======================================================================
function isCorrectTurn(devmode, turnColor, isOccupied) { //determines whether or not a piece can be moved based on whos turn it is
	if(devmode)
		return 1;
	else if((turnColor.search("White")==0 && isOccupied%2==0) || (turnColor.search("Black")==0 && isOccupied%2!=0))
		return 0;
	else
		return 1;
}




//=======================================================================
// Determines if a king is in checkmate or just check
//=======================================================================
function checkMateProtocol(spaceObjectArray, spacePathArray, index) {
	/*var isOccupied=spaceObjectArray[index].occupied;
	var kingColor;
	if(spaceObjectArray[index].occupied%2==0)
		kingColor=0;//black
	else
		kingColor=1;//white
	var tempStorageArray=new Array(64); //create a temp array
	for(var i=0;i<64;i++) {
		tempStorageArray[i]=new Object();
		tempStorageArray[i]=spaceObjectArray[i];
	}

	var kingData=new Object();
	kingData=calculateKingMovement(0, spaceObjectArray, spacePathArray, index, 1);

	for(var i=0;i<kingData.numCaps;i++) {//if the king can capture a nearby piece, do so and recalculate danger spaces for each possible capture
		var capIndex=kingData.capIndexes[i];
		var capPiece=spaceObjectArray[capIndex].occupied;

		spaceObjectArray[capIndex].occupied=isOccupied;
		spaceObjectArray[index].occupied=0;
		calculateDangerSpaces(spaceObjectArray, spacePathArray);

		//if the king is safe at the new index, king is not in checkmate
		if((!spaceObjectArray[capIndex].isWhiteDanger && kingColor) || (!spaceObjectArray[capIndex].isBlackDanger && !kingColor)) {
			spaceObjectArray[capIndex].occupied=capPiece;
			spaceObjectArray[index].occupied=isOccupied;
			for(var i=0;i<64;i++)
				spaceObjectArray[i]=tempStorageArray[i];
			return 0;
		}
	}*/
	

	/* algorithm:
	1) can the king capture a nearby piece?
		if yes: 1) temporarily delete a capturable piece
				2) recalculate danger spaces
				3) replace deleted piece
				4) was the captured piece on a danger space?
					if yes: perform steps 1-3 for each capturable piece. did any yield a result of no?
						if yes: NOT checkmate, return 0
						if no: proceed to step 2
					if no: NOT checkmate, return 0
		if no: proceed to step 2
	2) can the king move to any nearby spaces that are not danger spaces?
			if yes: NOT checkmate, return 0
			if no: proceed to step 3
	3) can a piece friendly to the checked king move to a friendly danger space?
		if yes: 1) spawn a temporary copy of said friendly piece at a single, unoccupied danger space
				2) recalculate danger pieces
				3) is the king still in check?
					if yes: has steps 1-3 been done for every single friendly danger space?
						if yes: Was an permutation found that removed the check?
							if yes: NOT checkmate, return 0
							if no: checkmate, return 1
						if no: repeat steps 1-3
					if no: NOT checkmate, return 0
	*/
	return 0;
}




//=======================================================================
// Resets input to be [0,7]
//=======================================================================
function fixIndex(index) {
	if(index>7)
		index-=8;
	else if(index<0)
		index+=8;
	return index;
}




//=======================================================================
// Determines whether two spaces are occupied by pieces of opposite color or not
//=======================================================================
function isOccupiedByOpposite(moveFromIndex, moveToIndex, objectArray) {
	if((objectArray[moveToIndex].occupied%2==0 && objectArray[moveFromIndex].occupied%2!=0) || (objectArray[moveToIndex].occupied%2!=0 && objectArray[moveFromIndex].occupied%2==0))
		return 1;
	else
		return 0;
}




//=======================================================================
// Calculates a pawns progress through the sigularity loop
//=======================================================================
function updateSingularityMarkers(spaceObjectArray,moveToIndex,moveFromIndex) {
	var initialStatus=spaceObjectArray[moveFromIndex].singularity;
	spaceObjectArray[moveFromIndex].singularity=0;
	
	switch(moveToIndex) {
		case(2):
		case(8):
		case(16):
		case(26):
			if(initialStatus==2)
				spaceObjectArray[moveToIndex].singularity=3;
			else
				spaceObjectArray[moveToIndex].singularity=1;
			break;
		case(37):
		case(47):
		case(55):
		case(61):
			if(initialStatus==1)
				spaceObjectArray[moveToIndex].singularity=3;
			else
				spaceObjectArray[moveToIndex].singularity=2;
			break;
		case(7):
		case(9):
			//sets singularity movement status appropriately if edge pawns choose to move 2 spaces
			if(spaceObjectArray[moveFromIndex].isPawnUnmoved==1) {
				spaceObjectArray[moveToIndex].singularity=1;
			}
			else {
				spaceObjectArray[moveToIndex].singularity=initialStatus;
			}
			break;
		case(54):
		case(56):
			//sets singularity movement status appropriately if edge pawns choose to move 2 spaces
			if(spaceObjectArray[moveFromIndex].isPawnUnmoved==1) {
				spaceObjectArray[moveToIndex].singularity=2;
			}
			else {
				spaceObjectArray[moveToIndex].singularity=initialStatus;
			}
			break;
		default:
			spaceObjectArray[moveToIndex].singularity=initialStatus;
			break;
	}
}





function calculateDangerSpaces(spaceObjectArray, spacePathArray) {
	// Calculate all danger spaces for both colors
	for(var i=0; i<64; i++) {//reset danger spaces every turn
		if(spaceObjectArray[i].occupied!=0 && spaceObjectArray[i].occupied%2==0) {
			spaceObjectArray[i].isWhiteDanger=1; 
			spaceObjectArray[i].isBlackDanger=0;
		}
		else if(spaceObjectArray[i].occupied!=0 && spaceObjectArray[i].occupied%2!=0) {
			spaceObjectArray[i].isWhiteDanger=0; 
			spaceObjectArray[i].isBlackDanger=1;
		}
		else {
			spaceObjectArray[i].isWhiteDanger=0; 
			spaceObjectArray[i].isBlackDanger=0;
		}
	}

	var tempStorageArray = new Array(64); //create a temp array since the prevDirIndexes keep getting changed during calculations somehow
	for(var i=0;i<64;i++) {
		tempStorageArray[i] = new Object();
		tempStorageArray[i].prevDirIndex=spaceObjectArray[i].prevDirIndex;
	}

	for(var i=0; i<64; i++) {//recalculate danger spaces every turn
		switch(spaceObjectArray[i].occupied) {
			case(0):
				break;
			case(1):
			case(2):
				calculatePawnMovement(0, spaceObjectArray, spacePathArray, i);
				break;
			case(3):
			case(4):
				calculateRookMovement(0, spaceObjectArray, spacePathArray, i);
				break;
			case(5):
			case(6):
				calculateKnightMovement(0, spaceObjectArray, spacePathArray, i);
				break;
			case(7):
			case(8):
				calculateBishopMovement(0, spaceObjectArray, spacePathArray, i);
				break;
			case(9):
			case(10):
				calculateQueenMovement(0, spaceObjectArray, spacePathArray, i);
				break;
			case(11):
			case(12):
				calculateKingMovement(0, spaceObjectArray, spacePathArray, i, 0);
				break;
			default:
				alert("ERROR 2");
		}
	}

	//reset original prevDirIndexes
	for(var i=0;i<64;i++)
		spaceObjectArray[i].prevDirIndex=tempStorageArray[i].prevDirIndex;
}





function checkStatus(spaceObjectArray, spacePathArray) {
	//check current positions in case of a check
	for(var i=0; i<64; i++) {
		if(spaceObjectArray[i].occupied==11 && spaceObjectArray[i].isWhiteDanger==1) { //white king
			var checkMate=checkMateProtocol(spaceObjectArray, spacePathArray, i);
			if(!checkMate)
				alert("White King is in check.");
			else
				alert("Checkmate. Black has won!");
		}
		else if(spaceObjectArray[i].occupied==12 && spaceObjectArray[i].isBlackDanger==1) { //black king
			var checkMate=checkMateProtocol(spaceObjectArray, spacePathArray, i);
			if(!checkMate)
				alert("Black King is in check.");
			else
				alert("Checkmate. White has won!");
		}
	}
}