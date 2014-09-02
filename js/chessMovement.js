//***********************************************************************
//***********************************************************************
// 
//	File contents: All functions used to determine how/where pieces can
//	move on the board
//
//***********************************************************************
//***********************************************************************
"use strict";




//=======================================================================
// Pawn Movement Calculations
//=======================================================================
function calculatePawnMovement(draw, spaceObjectArray, spacePathArray, index, checkCheck) {
	var checkObject = new Object();
	checkObject.numMoves=0;
	checkObject.numCaps=0;
	checkObject.moveIndexes=new Array(2);
	checkObject.capIndexes=new Array(2);
	for(var i=0;i<2;i++) {
		checkObject.moveIndexes[i]=-1;
		checkObject.capIndexes[i]=-1;
	}

	var isOccupied=spaceObjectArray[index].occupied;
	var originalIndex=index;
	var nextDirIndex=spaceObjectArray[index].prevDirIndex+4;
	nextDirIndex=fixIndex(nextDirIndex);
	var nextIndex=spaceObjectArray[index].direct[nextDirIndex];
	var quadrant=spaceObjectArray[index].quadrant;

	//check/move 1 space forwards
	if(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) {
		for(var i=0; i<8; i++) {
			if(spaceObjectArray[nextIndex].direct[i]==index && nextIndex!=26 && nextIndex!=37) {
				spaceObjectArray[nextIndex].prevDirIndex=i;
			}
			else if(nextIndex==26 || nextIndex==37) { //necessary to correct movement issues caused by singularity
				singularityMovementFixPawn(index,nextIndex,quadrant,spaceObjectArray);
			}
		}
		if(draw)
			makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,1,0);
		else if(checkCheck) {
			checkObject.moveIndexes[checkObject.numMoves]=nextIndex;
			checkObject.numMoves++;
		}

		index=nextIndex;
		nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
		nextDirIndex=fixIndex(nextDirIndex);
		nextIndex = spaceObjectArray[index].direct[nextDirIndex];

		if(spaceObjectArray[originalIndex].isPawnUnmoved==1 && spaceObjectArray[nextIndex].occupied==0) {
			for(var i=0; i<8; i++) {
				if(spaceObjectArray[nextIndex].direct[i]==index) {
					spaceObjectArray[nextIndex].prevDirIndex=i;
				}
			}
			if(draw)
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,1,0);
			else if(checkCheck) {
				checkObject.moveIndexes[checkObject.numMoves]=nextIndex;
				checkObject.numMoves++;
			}
		}
	}


	//reset and check diagonals
	index=originalIndex;
	var diagDirIndex1=spaceObjectArray[index].prevDirIndex+3;
	var diagDirIndex2=spaceObjectArray[index].prevDirIndex+5;
	diagDirIndex1=fixIndex(diagDirIndex1);
	diagDirIndex2=fixIndex(diagDirIndex2);

	var diagIndex1=spaceObjectArray[index].direct[diagDirIndex1];
	var diagIndex2=spaceObjectArray[index].direct[diagDirIndex2];

	if(diagIndex1!=-1) {
		if(spaceObjectArray[diagIndex1].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex1,spaceObjectArray)) {
			if(draw)
				makeMovableSpace(spacePathArray[diagIndex1],originalIndex,isOccupied,1,1);
			else if(checkCheck) {
				checkObject.capIndexes[checkObject.numCaps]=diagIndex1;
				checkObject.numCaps++;
			}
		}
		if(!draw && !checkCheck) {
			if(spaceObjectArray[originalIndex].occupied%2==0) {
				spaceObjectArray[diagIndex1].isWhiteDanger=1;
			}
			else if(spaceObjectArray[originalIndex].occupied%2!=0) {
				spaceObjectArray[diagIndex1].isBlackDanger=1;
			}
		}
	}
	if(diagIndex2!=-1) {
		if(spaceObjectArray[diagIndex2].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex2,spaceObjectArray)) {
			if(draw)
				makeMovableSpace(spacePathArray[diagIndex2],originalIndex,isOccupied,1,1);
			else if(checkCheck) {
				checkObject.capIndexes[checkObject.numCaps]=diagIndex2;
				checkObject.numCaps++;
			}
		}
		if(!draw && !checkCheck) {
			if(spaceObjectArray[originalIndex].occupied%2==0) {
				spaceObjectArray[diagIndex2].isWhiteDanger=1;
			}
			else if(spaceObjectArray[originalIndex].occupied%2!=0) {
				spaceObjectArray[diagIndex2].isBlackDanger=1;
			}
		}
	}

	if(checkCheck)
		return checkObject;
}



//=======================================================================
// Rook Movement Calculations
//=======================================================================
function calculateRookMovement(draw, spaceObjectArray, spacePathArray, index, checkCheck) {
	var checkObject = new Object();
	checkObject.numMoves=0;
	checkObject.numCaps=0;
	checkObject.moveIndexes=new Array(64);
	checkObject.capIndexes=new Array(64);
	for(var i=0;i<64;i++) {
		checkObject.moveIndexes[i]=-1;
		checkObject.capIndexes[i]=-1;
	}

	var isOccupied=spaceObjectArray[index].occupied;
	var originalIndex=index;
	var originalNextDirIndex=0;
	var nextDirIndex=0;
	for(var j=0;j<4;j++) {
		var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		while(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) {
			for(var i=0; i<8; i++) {
				if(spaceObjectArray[nextIndex].direct[i]==index && nextIndex!=26 && nextIndex!=37) {
					spaceObjectArray[nextIndex].prevDirIndex=i;
				}
				else if(nextIndex==26 || nextIndex==37) { //necessary to correct movement issues caused by singularity
					singularityMovementFix(originalIndex,index,nextIndex,spaceObjectArray, i);
				}
			}
			if(draw)
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,0);
			else if(spaceObjectArray[originalIndex].occupied%2==0 && !checkCheck)
				spaceObjectArray[nextIndex].isWhiteDanger=1;
			else if(spaceObjectArray[originalIndex].occupied%2!=0 && !checkCheck)
				spaceObjectArray[nextIndex].isBlackDanger=1;
			else {
				checkObject.moveIndexes[checkObject.numMoves]=nextIndex;
				checkObject.numMoves++;
			}

			index=nextIndex;
			nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
			nextDirIndex=fixIndex(nextDirIndex);
			nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		}
		if(nextIndex!=-1) {
			if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && draw) {
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,1);
			}
			else if(!draw && !checkCheck) {
				if(spaceObjectArray[originalIndex].occupied%2==0) {
					spaceObjectArray[nextIndex].isWhiteDanger=1;
				}
				else if(spaceObjectArray[originalIndex].occupied%2!=0) {
					spaceObjectArray[nextIndex].isBlackDanger=1;
				}
			}
			else if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && checkCheck) {
				checkObject.capIndexes[checkObject.numCaps]=nextIndex;
				checkObject.numCaps++;
			}
		}
		originalNextDirIndex+=2;
		nextDirIndex=originalNextDirIndex;
		index=originalIndex;
	}

	if(checkCheck)
		return checkObject;
}



//=======================================================================
// Knight Movement Calculations
//=======================================================================
function calculateKnightMovement(draw, spaceObjectArray, spacePathArray, index, checkCheck) {
	var checkObject = new Object();
	checkObject.numMoves=0;
	checkObject.numCaps=0;
	checkObject.moveIndexes=new Array(8);
	checkObject.capIndexes=new Array(8);
	for(var i=0;i<8;i++) {
		checkObject.moveIndexes[i]=-1;
		checkObject.capIndexes[i]=-1;
	}

	var isOccupied=spaceObjectArray[index].occupied;
	var originalNextDirIndex=0;
	var originalIndex=index;
	var nextDirIndex=0;
	var nextIndex=spaceObjectArray[index].direct[nextDirIndex];

	var tempStorageArray=new Array(64); //since prevDirIndexes of occupied spaces get changed, they need to be reset after movement is calculated
	for(var i=0;i<64;i++) {
		tempStorageArray[i]=new Object();
		tempStorageArray[i].prevDirIndex=spaceObjectArray[i].prevDirIndex;
	}

	for(var j=0;j<4;j++) {
		if(nextIndex!=-1) {
			for(var i=0; i<8; i++)
				if(spaceObjectArray[nextIndex].direct[i]==index)
					spaceObjectArray[nextIndex].prevDirIndex=i;
			
			//nextDirIndex fixes for knights moving from inside the singularity
			if(originalIndex==26 && j==3) {
				spaceObjectArray[37].prevDirIndex=0;
			}
			else if(originalIndex==37 && j==2) {
				spaceObjectArray[26].prevDirIndex=4;
			}

			nextDirIndex=spaceObjectArray[nextIndex].prevDirIndex+4;
			var diagDirIndex1=nextDirIndex+1;
			var diagDirIndex2=nextDirIndex-1;
			diagDirIndex1=fixIndex(diagDirIndex1);
			diagDirIndex2=fixIndex(diagDirIndex2);

			var diagIndex1=spaceObjectArray[nextIndex].direct[diagDirIndex1];
			var diagIndex2=spaceObjectArray[nextIndex].direct[diagDirIndex2];

			if(checkCheck)
				alert("diagIndex1="+diagIndex1+", diagIndex2="+diagIndex2);

			if(diagIndex1!=-1) {
				if(spaceObjectArray[diagIndex1].occupied==0) {
					if(draw)
						makeMovableSpace(spacePathArray[diagIndex1],originalIndex,isOccupied,0,0);
					else if(checkCheck) {
						checkObject.moveIndexes[checkObject.numMoves]=diagIndex1;
						checkObject.numMoves++;
					}
				}
				else if(spaceObjectArray[diagIndex1].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex1,spaceObjectArray)) {
					if(draw)
						makeMovableSpace(spacePathArray[diagIndex1],originalIndex,isOccupied,0,1);
					else if(checkCheck) {
						//alert("a "+spaceObjectArray[diagIndex1].occupied+" can be captured at index "+diagIndex1);
						checkObject.capIndexes[checkObject.numCaps]=diagIndex1;
						checkObject.numCaps++;
					}
				}
				if(!draw && !checkCheck) {
					if(spaceObjectArray[originalIndex].occupied%2==0) {
						spaceObjectArray[diagIndex1].isWhiteDanger=1;
					}
					else if(spaceObjectArray[originalIndex].occupied%2!=0) {
						spaceObjectArray[diagIndex1].isBlackDanger=1;
					}
				}
			}
			if(diagIndex2!=-1) {
				if(spaceObjectArray[diagIndex2].occupied==0) {
					if(draw)
						makeMovableSpace(spacePathArray[diagIndex2],originalIndex,isOccupied,0,0);
					else if(checkCheck) {
						checkObject.moveIndexes[checkObject.numMoves]=diagIndex2;
						checkObject.numMoves++;
					}
				}
				else if(spaceObjectArray[diagIndex2].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex2,spaceObjectArray)) {
					if(draw)
						makeMovableSpace(spacePathArray[diagIndex2],originalIndex,isOccupied,0,1);
					else if(checkCheck) {
						//alert("a "+spaceObjectArray[diagIndex2].occupied+" can be captured at index "+diagIndex2);
						checkObject.capIndexes[checkObject.numCaps]=diagIndex2;
						checkObject.numCaps++;
					}
				}
				if(!draw) {
					if(spaceObjectArray[originalIndex].occupied%2==0) {
						spaceObjectArray[diagIndex2].isWhiteDanger=1;
					}
					else if(spaceObjectArray[originalIndex].occupied%2!=0) {
						spaceObjectArray[diagIndex2].isBlackDanger=1;
					}
				}
			}
		}

		originalNextDirIndex+=2;
		nextDirIndex=originalNextDirIndex;
		nextIndex=spaceObjectArray[index].direct[nextDirIndex];
	}

	for(var i=0;i<64;i++)
		spaceObjectArray[i].prevDirIndex=tempStorageArray[i].prevDirIndex;

	if(checkCheck)
		return checkObject;
}



//=======================================================================
// Bishop Movement Calculations
//=======================================================================
function calculateBishopMovement(draw, spaceObjectArray, spacePathArray, index, checkCheck) {
	var checkObject = new Object();
	checkObject.numMoves=0;
	checkObject.numCaps=0;
	checkObject.moveIndexes=new Array(64);
	checkObject.capIndexes=new Array(64);
	for(var i=0;i<64;i++) {
		checkObject.moveIndexes[i]=-1;
		checkObject.capIndexes[i]=-1;
	}

	var isOccupied=spaceObjectArray[index].occupied;
	var originalIndex=index;
	var originalNextDirIndex=1;
	var nextDirIndex=1;
	for(var j=0;j<4;j++) {
		var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		while(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) {
			for(var i=0; i<8; i++) {
				if(spaceObjectArray[nextIndex].direct[i]==index && nextIndex!=26 && nextIndex!=37) {
					spaceObjectArray[nextIndex].prevDirIndex=i;
				}
				else if(nextIndex==26 || nextIndex==37) { //necessary to correct movement issues caused by singularity
					singularityMovementFix(originalIndex,index,nextIndex,spaceObjectArray,i);
				}
			}

			if(draw)
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,0);
			else if(spaceObjectArray[originalIndex].occupied%2==0 && !checkCheck)
				spaceObjectArray[nextIndex].isWhiteDanger=1;
			else if(spaceObjectArray[originalIndex].occupied%2!=0 && !checkCheck)
				spaceObjectArray[nextIndex].isBlackDanger=1;
			else {
				checkObject.moveIndexes[checkObject.numMoves]=nextIndex;
				checkObject.numMoves++;
			}

			index=nextIndex;
			nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
			nextDirIndex=fixIndex(nextDirIndex);
			nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		}
		if(nextIndex!=-1) {
			if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && draw) {
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,1);
			}
			else if(!draw && !checkCheck) {
				if(spaceObjectArray[originalIndex].occupied%2==0) {
					spaceObjectArray[nextIndex].isWhiteDanger=1;
				}
				else if(spaceObjectArray[originalIndex].occupied%2!=0) {
					spaceObjectArray[nextIndex].isBlackDanger=1;
				}
			}
			else if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && checkCheck) {
				checkObject.capIndexes[checkObject.numCaps]=nextIndex;
				checkObject.numCaps++;
			}
		}
		originalNextDirIndex+=2;
		nextDirIndex=originalNextDirIndex;
		index=originalIndex;
	}

	if(checkCheck)
		return checkObject;
}



//=======================================================================
// Queen Movement Calculations
//=======================================================================
function calculateQueenMovement(draw, spaceObjectArray, spacePathArray, index, checkCheck) {
	var checkObject = new Object();
	checkObject.numMoves=0;
	checkObject.numCaps=0;
	checkObject.moveIndexes=new Array(64);
	checkObject.capIndexes=new Array(64);
	for(var i=0;i<64;i++) {
		checkObject.moveIndexes[i]=-1;
		checkObject.capIndexes[i]=-1;
	}

	var isOccupied=spaceObjectArray[index].occupied;
	var originalIndex=index;
	var originalNextDirIndex=0;
	var nextDirIndex=0;
	for(var j=0;j<8;j++) {
		var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		while(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) {
			for(var i=0; i<8; i++) {
				if(spaceObjectArray[nextIndex].direct[i]==index && nextIndex!=26 && nextIndex!=37) {
					spaceObjectArray[nextIndex].prevDirIndex=i;
				}
				else if(nextIndex==26 || nextIndex==37) { //necessary to correct movement issues caused by singularity
					singularityMovementFix(originalIndex,index,nextIndex,spaceObjectArray, i);
				}
			}

			if(draw)
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,0);
			else if(spaceObjectArray[originalIndex].occupied%2==0 && !checkCheck)
				spaceObjectArray[nextIndex].isWhiteDanger=1;
			else if(spaceObjectArray[originalIndex].occupied%2!=0 && !checkCheck)
				spaceObjectArray[nextIndex].isBlackDanger=1;
			else {
				checkObject.moveIndexes[checkObject.numMoves]=nextIndex;
				checkObject.numMoves++;
			}

			index=nextIndex;
			nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
			nextDirIndex=fixIndex(nextDirIndex);
			nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		}
		if(nextIndex!=-1) {
			if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && draw) {
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,1);
			}
			else if(!draw && !checkCheck) {
				if(spaceObjectArray[originalIndex].occupied%2==0) {
					spaceObjectArray[nextIndex].isWhiteDanger=1;
				}
				else if(spaceObjectArray[originalIndex].occupied%2!=0) {
					spaceObjectArray[nextIndex].isBlackDanger=1;
				}
			}
			else if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && checkCheck) {
				checkObject.capIndexes[checkObject.numCaps]=nextIndex;
				checkObject.numCaps++;
			}
		}
		originalNextDirIndex++;
		nextDirIndex=originalNextDirIndex;
		index=originalIndex;
	}

	if(checkCheck)
		return checkObject;
}



//=======================================================================
// King Movement Calculations
//=======================================================================
function calculateKingMovement(draw, spaceObjectArray, spacePathArray, index, checkCheck) {
	var checkObject = new Object();
	checkObject.numMoves=0;
	checkObject.numCaps=0;
	checkObject.moveIndexes=new Array(8);
	checkObject.capIndexes=new Array(8);
	for(var i=0;i<8;i++) {
		checkObject.moveIndexes[i]=-1;
		checkObject.capIndexes[i]=-1;
	}

	var isOccupied=spaceObjectArray[index].occupied;
	var originalIndex=index;
	var originalNextDirIndex=0;
	var nextDirIndex=0;
	for(var j=0;j<8;j++) {
		var nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		if(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied==0) {
			for(var i=0; i<8; i++)
				if(spaceObjectArray[nextIndex].direct[i]==index)
					spaceObjectArray[nextIndex].prevDirIndex=i;
			if(draw)
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,0);
			else if(spaceObjectArray[originalIndex].occupied%2==0 && !checkCheck) {
				spaceObjectArray[nextIndex].isWhiteDanger=1;
			}
			else if(spaceObjectArray[originalIndex].occupied%2!=0 && !checkCheck) {
				spaceObjectArray[nextIndex].isBlackDanger=1;
			}
			else {
				checkObject.moveIndexes[checkObject.numMoves]=nextIndex;
				checkObject.numMoves++;
			}

			index=nextIndex;
			nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
			nextDirIndex=fixIndex(nextDirIndex);
			nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		}
		else if(nextIndex!=-1 && spaceObjectArray[nextIndex].occupied!=0) {
			if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && draw) {
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,1);
			}
			else if(!draw && !checkCheck) {
				if(spaceObjectArray[originalIndex].occupied%2==0) {
					spaceObjectArray[nextIndex].isWhiteDanger=1;
				}
				else if(spaceObjectArray[originalIndex].occupied%2!=0) {
					spaceObjectArray[nextIndex].isBlackDanger=1;
				}
			}
			else if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && checkCheck) {
				checkObject.capIndexes[checkObject.numCaps]=nextIndex;
				checkObject.numCaps++;
			}
		}
		originalNextDirIndex++;
		nextDirIndex=originalNextDirIndex;
		index=originalIndex;
	}

	if(checkCheck)
		return checkObject;
}




//=======================================================================
// 
//=======================================================================
function singularityMovementFix(originalIndex, index, nextIndex, spaceObjectArray, i) {
	//manual movement fixes for pieces (excluding pawns and knights) moving through the singularity
	switch(originalIndex) {
		//vert diagonals top
		case(2):
		case(8):
		case(16):
		case(26):
			if(nextIndex==26)
				spaceObjectArray[nextIndex].prevDirIndex=0;
			else if(nextIndex==37 && index==26)
				spaceObjectArray[nextIndex].prevDirIndex=3;
			break;
		//TL straight
		case(21):
		case(22):
		case(23):
		case(24):
		case(25):
			if(nextIndex==26)
				spaceObjectArray[nextIndex].prevDirIndex=1;
			else if(nextIndex==37 && index==26)
				spaceObjectArray[nextIndex].prevDirIndex=4;
			else
				spaceObjectArray[nextIndex].prevDirIndex=1;
			break;
		//TR straight
		case(27):
		case(28):
		case(29):
		case(30):
		case(31):
			if(nextIndex==26)
				spaceObjectArray[nextIndex].prevDirIndex=2;
			else if(nextIndex==37 && index==26)
				spaceObjectArray[nextIndex].prevDirIndex=2;
			else
				spaceObjectArray[nextIndex].prevDirIndex=5;
			break;
		//BL straight
		case(32):
		case(33):
		case(34):
		case(35):
		case(36):
			if(nextIndex==37)
				spaceObjectArray[nextIndex].prevDirIndex=i;
			else if(nextIndex==26 && index==37)
				spaceObjectArray[nextIndex].prevDirIndex=4;
			else
				spaceObjectArray[nextIndex].prevDirIndex=7;
			break;
		//BR straight
		case(38):
		case(39):
		case(40):
		case(41):
		case(42):
			if(index==37)
				spaceObjectArray[nextIndex].prevDirIndex=6;
			else if(nextIndex==26 && index==37)
				spaceObjectArray[nextIndex].prevDirIndex=6;
			else
				spaceObjectArray[nextIndex].prevDirIndex=6;
			break;
		//vert diagonals bottom
		case(37):
		case(47):
		case(55):
		case(61):
			if(nextIndex==26)
				spaceObjectArray[nextIndex].prevDirIndex=5;
			else
				spaceObjectArray[nextIndex].prevDirIndex=0;
			break;
		//TL diagonals
		case(1):
		case(7):
		case(15)://25
			spaceObjectArray[nextIndex].prevDirIndex=1;
			break;
		//TR diagonals
		case(3):
		case(9):
		case(17)://27
			spaceObjectArray[nextIndex].prevDirIndex=5;
			break;
		//BL diagonals
		case(46):
		case(54):
		case(60)://36
			spaceObjectArray[nextIndex].prevDirIndex=7;
			break;
		//BR diagonals
		case(48):
		case(56):
		case(62)://38
			spaceObjectArray[nextIndex].prevDirIndex=3;
			break;
		default:
			alert("ERROR 3");
	}
}




//=======================================================================
// 
//=======================================================================
function singularityMovementFixPawn(index, nextIndex, quadrant, spaceObjectArray) {
	switch(quadrant) {
		case(1):
			if(nextIndex==26)
				spaceObjectArray[nextIndex].prevDirIndex=0;
			else if(nextIndex==37)
				spaceObjectArray[nextIndex].prevDirIndex=2;
			break;
		case(2):
			if(index>31) {
				if(nextIndex==26)
					spaceObjectArray[nextIndex].prevDirIndex=4;
				else if(nextIndex==37)
					spaceObjectArray[nextIndex].prevDirIndex=0;
			}
			else {
				for(var i=0; i<8; i++)
					if(spaceObjectArray[nextIndex].direct[i]==index)
						spaceObjectArray[nextIndex].prevDirIndex=i;
			}
			break;
		case(3):
			if(nextIndex==26)
				spaceObjectArray[nextIndex].prevDirIndex=4;
			else if(nextIndex==37)
				spaceObjectArray[nextIndex].prevDirIndex=0;
			break;
		case(4):
			if(index>31) {
				for(var i=0; i<8; i++)
					if(spaceObjectArray[nextIndex].direct[i]==index)
						spaceObjectArray[nextIndex].prevDirIndex=i;
			}
			else {
				if(nextIndex==26)
					spaceObjectArray[nextIndex].prevDirIndex=0;
				else if(nextIndex==37)
					spaceObjectArray[nextIndex].prevDirIndex=2;
			}
			break;
		default://is thie being used?
			for(var i=0; i<8; i++)
				if(spaceObjectArray[nextIndex].direct[i]==index)
					spaceObjectArray[nextIndex].prevDirIndex=i;
			break;
	}
}




//=======================================================================
// 
//=======================================================================
function captureMovementFix(spaceObjectArray, moveToIndex, moveFromIndex) {
	var quadrant=spaceObjectArray[moveFromIndex].quadrant;
	var isWhite=0;
	if(spaceObjectArray[moveToIndex].occupied==1)
		isWhite=1;
	
	if(moveToIndex==26 || moveToIndex==37) {//as always, the singularity causes problems...
		if(moveFromIndex==26 || moveFromIndex==37)//if the two pawns are BOTH in the singularity when the capture happens, apply the standard movement fix:
			singularityMovementFixPawn(moveFromIndex, moveToIndex, quadrant, spaceObjectArray);
		else {//if a capture is made with the capturing pawn starting outside the singularity, then do the following:
			
			/*flip the capturing pawn's quadrant according to the capturing pawn's color.
			example: a white pawn with a quad=2 will have its quad switched to quad=3 and vice-versa.
			example: a black pawn with a quad=1 will have its quad switched to quad=4 and vice-versa.
			If this is not done, the singularityMovementFixPawn() function will not set the capturing pawn's direction correctly*/
			
			switch(quadrant) {
				case(1):
					spaceObjectArray[moveFromIndex].quadrant=4;
					break;
				case(2):
					spaceObjectArray[moveFromIndex].quadrant=3;
					break;
				case(3):
					spaceObjectArray[moveFromIndex].quadrant=2;
					break;
				case(4):
					spaceObjectArray[moveFromIndex].quadrant=1;
					break;
			}

			if(spaceObjectArray[moveToIndex].singularity==0) {//if the pawn has NOT crossed 
				spaceObjectArray[moveToIndex].prevDirIndex=0;
			}
			else {
				if(isWhite)
					spaceObjectArray[moveToIndex].prevDirIndex=4;
				else
					spaceObjectArray[moveToIndex].prevDirIndex=6;
			}
		}
	}
	else if(hasCrossedVertCenter(moveFromIndex,moveToIndex)) {	//the default rule below in this if-else chain cannot be used when a pawn captures across the vertical center of the
		if(quadrant==1 || quadrant==2)							//board. when this happens, the capturing pawn's direction is manually set as shown
			spaceObjectArray[moveToIndex].prevDirIndex=2;
		else
			spaceObjectArray[moveToIndex].prevDirIndex=6;
	}
	else {//default rule for pawn captures: usually, a capturing pawn's diagonal space simply needs the prevDirIndex of its movable space
		spaceObjectArray[moveToIndex].prevDirIndex=spaceObjectArray[moveFromIndex].prevDirIndex;
	}
}