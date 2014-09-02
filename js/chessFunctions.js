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
	else									 //the main function (drawGameBoard()) reads the "pawn" attribute and corrects the capturing pawns direction.
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
function checkMateProtocol(spaceObjectArray, spacePathArray, indexOfKing, indexOfAggressor, devmode) {
	//note on terminology: "checking piece" and "aggressing piece" are synonymous and refer to the piece most recently moved that caused a check to occur
	var isOccupied=spaceObjectArray[indexOfKing].occupied;
	var kingColor;
	if(spaceObjectArray[indexOfKing].occupied%2==0)
		kingColor=0;//black
	else
		kingColor=1;//white
	var tempStorageArray=new Array(64);
	for(var i=0;i<64;i++) {
		tempStorageArray[i]=new Object();
		tempStorageArray[i]=spaceObjectArray[i];
	}

	var displayPieceData=0;
	if(devmode && kingColor)
		displayPieceData = confirm("White king is in check. Display piece data as checkmate calculations are being made?");
	else if(devmode && !kingColor)
		displayPieceData = confirm("Black king is in check. Display piece data as checkmate calculations are being made?");

	var kingData=new Object();
	kingData=calculateKingMovement(0, spaceObjectArray, spacePathArray, indexOfKing, 1);
	
	if(devmode)
		alert("Attempting to find non-capture spaces that the king can safely move to...");
	for(var i=0;i<kingData.numMoves;i++) {//check if any spaces exist that 1) the king can move to and 2) that aren't danger spaces
		var moveIndex=kingData.moveIndexes[i];

		if((kingColor && !spaceObjectArray[moveIndex].isWhiteDanger) || (!kingColor && !spaceObjectArray[moveIndex].isBlackDanger)) {
			if(devmode)
				alert("A safe move has been found at index "+kingData.moveIndexes[i]);
			return 0;
		}
	}

	if(devmode)
		alert("None found. Attempting to find safe captures that the king can make...");
	for(var i=0;i<kingData.numCaps;i++) {//if the king can capture a nearby piece, do so and recalculate danger spaces for each possible capture
		var capIndex=kingData.capIndexes[i];
		var capPiece=spaceObjectArray[capIndex].occupied;

		spaceObjectArray[capIndex].occupied=isOccupied;
		spaceObjectArray[indexOfKing].occupied=0;
		calculateDangerSpaces(spaceObjectArray, spacePathArray);

		//if the king is safe at the new index, king is not in checkmate
		if((!spaceObjectArray[capIndex].isWhiteDanger && kingColor) || (!spaceObjectArray[capIndex].isBlackDanger && !kingColor)) {
			spaceObjectArray[capIndex].occupied=capPiece;
			spaceObjectArray[indexOfKing].occupied=isOccupied;
			for(var j=0;j<64;j++)
				spaceObjectArray[j]=tempStorageArray[j];
			calculateDangerSpaces(spaceObjectArray, spacePathArray);
			if(devmode)
				alert("The king can safely capture the aggressing piece.");
			return 0;
		}
		else {//if the king is not safe at the new index, reset and try again
			spaceObjectArray[capIndex].occupied=capPiece;
			spaceObjectArray[indexOfKing].occupied=isOccupied;
			for(var j=0;j<64;j++)
				spaceObjectArray[j]=tempStorageArray[j];
			calculateDangerSpaces(spaceObjectArray, spacePathArray);
		}
	}

	if(devmode)
		alert("None found. Attempting to find a friendly piece can safely capture OR block the checking piece...");
	for(var i=0;i<64;i++) {//without using the king, try capturing or moving in front of the checking piece
		if(!isOccupiedByOpposite(indexOfKing,i,spaceObjectArray) && spaceObjectArray[i].occupied!=0 && spaceObjectArray[i].occupied!=11 && spaceObjectArray[i].occupied!=12) {//if piece is friendly to checked king, get movement and capture data for piece
			var pieceData=new Object();
			
			switch(spaceObjectArray[i].occupied) {//create movement and capture data for friendly piece
				case(1):
				case(2):
					pieceData=calculatePawnMovement(0, spaceObjectArray, spacePathArray, i, 1);
					break;
				case(3):
				case(4):
					pieceData=calculateRookMovement(0, spaceObjectArray, spacePathArray, i, 1);
					break;
				case(5):
				case(6):
					pieceData=calculateKnightMovement(0, spaceObjectArray, spacePathArray, i, 1);
					break;
				case(7):
				case(8):
					pieceData=calculateBishopMovement(0, spaceObjectArray, spacePathArray, i, 1);
					break;
				case(9):
				case(10):
					pieceData=calculateQueenMovement(0, spaceObjectArray, spacePathArray, i, 1);
					break;
				default:
					alert("ERROR 4");
					break;
			}

			if(devmode && displayPieceData)
				displayAllPieceData(pieceData,i);

			for(var j=0;j<pieceData.numCaps;j++) {//try capturing the checking piece
				if(pieceData.capIndexes[j]==indexOfAggressor) {//if a friendly piece can capture the aggressing piece, do so and recalculate danger spaces
					var aggressivePiece=spaceObjectArray[indexOfAggressor].occupied;
					var friendlyIndex=i;
					var friendlyPiece=spaceObjectArray[i].occupied;

					spaceObjectArray[indexOfAggressor].occupied=friendlyPiece;
					spaceObjectArray[friendlyIndex].occupied=0;
					calculateDangerSpaces(spaceObjectArray, spacePathArray);

					//if the king is safe with the piece captured, checkmate has not occured
					if((!spaceObjectArray[indexOfKing].isWhiteDanger && kingColor) || (!spaceObjectArray[indexOfKing].isBlackDanger && !kingColor)) {
						spaceObjectArray[indexOfAggressor].occupied=aggressivePiece;
						spaceObjectArray[friendlyIndex].occupied=friendlyPiece;
						for(var k=0;k<64;k++)
							spaceObjectArray[k]=tempStorageArray[k];
						calculateDangerSpaces(spaceObjectArray, spacePathArray);
						if(devmode)
							alert("a piece at index "+i+" has been found that can capture the aggressor!");
						return 0;
					}
					else {//if the king is not safe once the capture has been made, reset and retry
						spaceObjectArray[indexOfAggressor].occupied=aggressivePiece;
						spaceObjectArray[friendlyIndex].occupied=friendlyPiece;
						for(var k=0;k<64;k++)
							spaceObjectArray[k]=tempStorageArray[k];
						calculateDangerSpaces(spaceObjectArray, spacePathArray);
					}
				}
			}

			for(var j=0;j<pieceData.numMoves;j++) {
				var moveIndex=pieceData.moveIndexes[j];
				var friendlyIndex=i;
				var friendlyPiece=spaceObjectArray[i].occupied;

				spaceObjectArray[moveIndex].occupied=friendlyPiece;
				spaceObjectArray[i].occupied=0;
				calculateDangerSpaces(spaceObjectArray, spacePathArray);

				//if the king is safe once the move has been made, checkmate has not occured
				if((!spaceObjectArray[indexOfKing].isWhiteDanger && kingColor) || (!spaceObjectArray[indexOfKing].isBlackDanger && !kingColor)) {
					spaceObjectArray[moveIndex].occupied=0;
					spaceObjectArray[friendlyIndex].occupied=friendlyPiece;
					for(var k=0;k<64;k++)
						spaceObjectArray[k]=tempStorageArray[k];
					calculateDangerSpaces(spaceObjectArray, spacePathArray);
					if(devmode)
						alert("a piece at index "+i+" has been found that can block the aggressor!");
					return 0;
				}
				else {//if the king is not safe once the capture has been made, reset and retry
					spaceObjectArray[moveIndex].occupied=0;
					spaceObjectArray[friendlyIndex].occupied=friendlyPiece;
					for(var k=0;k<64;k++)
						spaceObjectArray[k]=tempStorageArray[k];
					calculateDangerSpaces(spaceObjectArray, spacePathArray);
				}
			}

			//the following section should NOT be necessary. it addresses faults in the checkMateProtocol algorithm that SHOULD only be seen if the game is run in devmode
			//determine if there are ANY other captures that can be made that would result in the king being freed from check
			/*for(var j=0;j<64;j++) {
				if(spaceObjectArray[j].occupied!=0 && isOccupiedByOpposite(spaceObjectArray[j].occupied,kingColor)) {
					if((kingColor && spaceObjectArray[j].isBlackDanger) || (!kingColor && spaceObjectArray[j].isWhiteDanger)) {
						var enemyTestPiece=spaceObjectArray[j].occupied;
						var enemyTestIndex=j;


					}
				}
			}*/
		}
	}

	//If this point is reached, circumventing the check is not possible. therefore, a checkmate has occured
	return 1;
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
	var isWhite=0;
	if(spaceObjectArray[moveToIndex].occupied==1)
		isWhite=1;
	spaceObjectArray[moveToIndex].singularity=0;
	
	var moveToAbsolute=moveToIndex;
	for(var i=0;i<2;i++) {
		if(isWhite) {
			if((moveToIndex>36 && moveToIndex<43) && (moveFromIndex>25 && moveFromIndex<32)) {
				spaceObjectArray[moveToAbsolute].singularity=1;
			}
		}
		else {
			if(moveToIndex>31 && moveToIndex<38 && moveFromIndex>20 && moveFromIndex<27) {
				spaceObjectArray[moveToAbsolute].singularity=1;
			}
		}

		var temp=moveToIndex;
		moveToIndex=moveFromIndex;
		moveFromIndex=temp;
	}
}




//=======================================================================
// 
//=======================================================================
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




//=======================================================================
// 
//=======================================================================
function checkStatus(spaceObjectArray, spacePathArray, indexOfPreviouslyMovedPiece, devmode) {
	//check current positions in case of a check
	for(var i=0; i<64; i++) {
		if(spaceObjectArray[i].occupied==11 && spaceObjectArray[i].isWhiteDanger==1) { //white king
			var checkMate;
			if(isOccupiedByOpposite(i,indexOfPreviouslyMovedPiece,spaceObjectArray)) {//a checkmate canNOT occur if a friendly piece puts a friendly king in check
				checkMate=checkMateProtocol(spaceObjectArray, spacePathArray, i, indexOfPreviouslyMovedPiece, devmode);
			}
			else
				checkMate=0;

			if(!checkMate)
				return 1;
			else {
				alert("Checkmate. Black has won!");
				return 3;
			}
		}
		else if(spaceObjectArray[i].occupied==12 && spaceObjectArray[i].isBlackDanger==1) { //black king
			var checkMate;
			if(isOccupiedByOpposite(i,indexOfPreviouslyMovedPiece,spaceObjectArray)) {//a checkmate canNOT occur if a friendly piece puts a friendly king in check
				checkMate=checkMateProtocol(spaceObjectArray, spacePathArray, i, indexOfPreviouslyMovedPiece, devmode);
			}
			else
				checkMate=0;

			if(!checkMate)
				return 2;
			else {
				alert("Checkmate. White has won!");
				return 3;
			}
		}
	}
	return 0;
}




//=======================================================================
// 
//=======================================================================
function hasCrossedVertCenter(moveFromIndex,moveToIndex) {
	for(var i=0;i<2;i++) {
		switch(moveFromIndex) {
			case(1):
				if(moveToIndex==3)
					return 1;
			case(7):
				if(moveToIndex==9)
					return 1;
			case(15):
				if(moveToIndex==17)
					return 1;
			case(25):
				if(moveToIndex==27)
					return 1;
			case(36):
				if(moveToIndex==38)
					return 1;
			case(46):
				if(moveToIndex==48)
					return 1;
			case(54):
				if(moveToIndex==56)
					return 1;
			case(60):
				if(moveToIndex==62)
					return 1;
			default:
				break;
		}

		var temp=moveFromIndex;
		moveFromIndex=moveToIndex;
		moveToIndex=temp;
	}
	return 0;
}