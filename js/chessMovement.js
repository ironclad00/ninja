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
function calculatePawnMovement(draw, spaceObjectArray, spacePathArray, index) {
	var isOccupied=spaceObjectArray[index].occupied;
	var originalIndex=index;
	var nextDirIndex=spaceObjectArray[index].prevDirIndex+4;
	nextDirIndex=fixIndex(nextDirIndex);
	var nextIndex=spaceObjectArray[index].direct[nextDirIndex];
	var quadrant=spaceObjectArray[index].quadrant;

	//if within singularity, check/move to the diagonal within the singularity
	if(originalIndex==26 && spaceObjectArray[37].occupied!=0 && isOccupiedByOpposite(26,37,spaceObjectArray)) {
		if(draw)
			makeMovableSpace(spacePathArray[37],originalIndex,isOccupied,1,1);
		else if(!draw && spaceObjectArray[originalIndex].occupied%2==0) {
			spaceObjectArray[37].isWhiteDanger=1;
		}
		else if(!draw && spaceObjectArray[originalIndex].occupied%2!=0) {
			spaceObjectArray[37].isBlackDanger=1;
		}
	}
	else if(originalIndex==37 && spaceObjectArray[26].occupied!=0 && isOccupiedByOpposite(37,26,spaceObjectArray)) {
		if(draw)
			makeMovableSpace(spacePathArray[26],originalIndex,isOccupied,1,1);
		else if(!draw && spaceObjectArray[originalIndex].occupied%2==0) {
			spaceObjectArray[26].isWhiteDanger=1;
		}
		else if(!draw && spaceObjectArray[originalIndex].occupied%2!=0) {
			spaceObjectArray[26].isBlackDanger=1;
		}
	}

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
			//danger spaces are not made as pawns only capture diagonally

		index=nextIndex;
		nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
		nextDirIndex=fixIndex(nextDirIndex);
		nextIndex = spaceObjectArray[index].direct[nextDirIndex];

		if(spaceObjectArray[originalIndex].isPawnUnmoved==1 && draw && spaceObjectArray[nextIndex].occupied==0) {
			for(var i=0; i<8; i++) {
				if(spaceObjectArray[nextIndex].direct[i]==index) {
					spaceObjectArray[nextIndex].prevDirIndex=i;
				}
			}
			if(draw)
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,1,0);
				//danger spaces are not made as pawns only capture diagonally
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
		if(spaceObjectArray[diagIndex1].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex1,spaceObjectArray) && draw) {
			makeMovableSpace(spacePathArray[diagIndex1],originalIndex,isOccupied,1,1);
		}
		if(!draw) {
			if(spaceObjectArray[originalIndex].occupied%2==0) {
				spaceObjectArray[diagIndex1].isWhiteDanger=1;
			}
			else if(spaceObjectArray[originalIndex].occupied%2!=0) {
				spaceObjectArray[diagIndex1].isBlackDanger=1;
			}
		}
	}
	if(diagIndex2!=-1) {
		if(spaceObjectArray[diagIndex2].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex2,spaceObjectArray) && draw) {
			makeMovableSpace(spacePathArray[diagIndex2],originalIndex,isOccupied,1,1);
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



//=======================================================================
// Rook Movement Calculations
//=======================================================================
function calculateRookMovement(draw, spaceObjectArray, spacePathArray, index) {
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
			else if(spaceObjectArray[originalIndex].occupied%2==0)
				spaceObjectArray[nextIndex].isWhiteDanger=1;
			else
				spaceObjectArray[nextIndex].isBlackDanger=1;
			
			index=nextIndex;
			nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
			nextDirIndex=fixIndex(nextDirIndex);
			nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		}
		if(nextIndex!=-1) {
			if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && draw) {
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,1);
			}
			else if(!draw) {
				if(spaceObjectArray[originalIndex].occupied%2==0) {
					spaceObjectArray[nextIndex].isWhiteDanger=1;
				}
				else if(spaceObjectArray[originalIndex].occupied%2!=0) {
					spaceObjectArray[nextIndex].isBlackDanger=1;
				}
			}
		}
		originalNextDirIndex+=2;
		nextDirIndex=originalNextDirIndex;
		index=originalIndex;
	}
}



//=======================================================================
// Knight Movement Calculations
//=======================================================================
function calculateKnightMovement(draw, spaceObjectArray, spacePathArray, index) {
	var isOccupied=spaceObjectArray[index].occupied;
	var originalNextDirIndex=0;
	var originalIndex=index;
	var nextDirIndex=0;
	var nextIndex=spaceObjectArray[index].direct[nextDirIndex];

	var tempStorageArray=new Array(64);
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
			if(originalIndex==2 || originalIndex==8 || originalIndex==16 || originalIndex==26) {
				switch(j) {
					case(1):
						nextDirIndex=4;
					break;
					case(2):
						nextDirIndex=0;
						break;
					default:
						break;
				}
			}
			else if(originalIndex==61 || originalIndex==55 || originalIndex==47 || originalIndex==37) {
				switch(j) {
					case(2):
						nextDirIndex=0;
						break;
					case(3):
						nextDirIndex=4;
						break;
					default:
						break;
				}
			}

			var diagDirIndex1=nextDirIndex+1;
			var diagDirIndex2=nextDirIndex-1;
			diagDirIndex1=fixIndex(diagDirIndex1);
			diagDirIndex2=fixIndex(diagDirIndex2);

			var diagIndex1=spaceObjectArray[nextIndex].direct[diagDirIndex1];
			var diagIndex2=spaceObjectArray[nextIndex].direct[diagDirIndex2];

			if(draw)
				alert("moving to index "+nextIndex+" with a nextDirIndex of "+nextDirIndex+" and checking diagonals "+diagIndex1+" and "+diagIndex2);

			if(diagIndex1!=-1) {
				if(spaceObjectArray[diagIndex1].occupied==0 && draw) {
					makeMovableSpace(spacePathArray[diagIndex1],originalIndex,isOccupied,0,0);
				}
				else if(spaceObjectArray[diagIndex1].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex1,spaceObjectArray) && draw) {
					makeMovableSpace(spacePathArray[diagIndex1],originalIndex,isOccupied,0,1);
				}
				if(!draw) {
					if(spaceObjectArray[originalIndex].occupied%2==0) {
						spaceObjectArray[diagIndex1].isWhiteDanger=1;
					}
					else if(spaceObjectArray[originalIndex].occupied%2!=0) {
						spaceObjectArray[diagIndex1].isBlackDanger=1;
					}
				}
			}
			if(diagIndex2!=-1) {
				if(spaceObjectArray[diagIndex2].occupied==0 && draw) {
					makeMovableSpace(spacePathArray[diagIndex2],originalIndex,isOccupied,0,0);
				}
				else if(spaceObjectArray[diagIndex2].occupied!=0 && isOccupiedByOpposite(originalIndex,diagIndex2,spaceObjectArray) && draw) {
					makeMovableSpace(spacePathArray[diagIndex2],originalIndex,isOccupied,0,1);
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
		
		for(var i=0; i<8; i++)
			if(spaceObjectArray[nextIndex].direct[i]==index)
				spaceObjectArray[nextIndex].prevDirIndex=i;
		originalNextDirIndex+=2;

		index=originalIndex;
		nextDirIndex=originalNextDirIndex;
		nextIndex=spaceObjectArray[index].direct[nextDirIndex];
	}

	for(var i=0;i<64;i++)
		spaceObjectArray[i].prevDirIndex=tempStorageArray[i].prevDirIndex;
}



//=======================================================================
// Bishop Movement Calculations
//=======================================================================
function calculateBishopMovement(draw, spaceObjectArray, spacePathArray, index) {
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
			else if(spaceObjectArray[originalIndex].occupied%2==0)
				spaceObjectArray[nextIndex].isWhiteDanger=1;
			else
				spaceObjectArray[nextIndex].isBlackDanger=1;

			index=nextIndex;
			nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
			nextDirIndex=fixIndex(nextDirIndex);
			nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		}
		if(nextIndex!=-1) {
			if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && draw) {
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,1);
			}
			else if(!draw) {
				if(spaceObjectArray[originalIndex].occupied%2==0) {
					spaceObjectArray[nextIndex].isWhiteDanger=1;
				}
				else if(spaceObjectArray[originalIndex].occupied%2!=0) {
					spaceObjectArray[nextIndex].isBlackDanger=1;
				}
			}
		}
		originalNextDirIndex+=2;
		nextDirIndex=originalNextDirIndex;
		index=originalIndex;
	}
}



//=======================================================================
// Queen Movement Calculations
//=======================================================================
function calculateQueenMovement(draw, spaceObjectArray, spacePathArray, index) {
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
			else if(spaceObjectArray[originalIndex].occupied%2==0)
				spaceObjectArray[nextIndex].isWhiteDanger=1;
			else
				spaceObjectArray[nextIndex].isBlackDanger=1;

			index=nextIndex;
			nextDirIndex = spaceObjectArray[index].prevDirIndex+4;
			nextDirIndex=fixIndex(nextDirIndex);
			//alert(nextIndex+" "+nextDirIndex);
			nextIndex = spaceObjectArray[index].direct[nextDirIndex];
		}
		if(nextIndex!=-1) {
			if(isOccupiedByOpposite(originalIndex,nextIndex,spaceObjectArray) && draw) {
				makeMovableSpace(spacePathArray[nextIndex],originalIndex,isOccupied,0,1);
			}
			else if(!draw) {
				if(spaceObjectArray[originalIndex].occupied%2==0) {
					spaceObjectArray[nextIndex].isWhiteDanger=1;
				}
				else if(spaceObjectArray[originalIndex].occupied%2!=0) {
					spaceObjectArray[nextIndex].isBlackDanger=1;
				}
			}
		}
		originalNextDirIndex++;
		nextDirIndex=originalNextDirIndex;
		index=originalIndex;
	}
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
			else {
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
				spaceObjectArray[nextIndex].prevDirIndex=3;
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
		default:
			for(var i=0; i<8; i++)
				if(spaceObjectArray[nextIndex].direct[i]==index)
					spaceObjectArray[nextIndex].prevDirIndex=i;
			break;
	}
}



function captureMovementFix(spaceObjectArray, moveToIndex, moveFromIndex) {
	var quadrant=spaceObjectArray[moveFromIndex].quadrant;

	if(spaceObjectArray[moveFromIndex].occupied%2!=0) {//if pawn is white
		switch(moveToIndex) {
			case(3):
			case(4):
			case(9):
			case(10):
			case(11):
			case(17):
			case(18):
			case(19):
			case(20):
			case(27):
			case(28):
			case(29):
			case(30):
			case(31):
			case(38):
			case(39):
			case(40):
			case(41):
			case(42):
			case(48):
			case(49):
			case(50):
			case(51):
			case(56):
			case(57):
			case(58):
			case(62):
			case(63):
				//fixes for white pieces capturing diagonally on right side of board
				if(quadrant==2) {
					spaceObjectArray[moveToIndex].prevDirIndex=2;
				}
				else {
					spaceObjectArray[moveToIndex].prevDirIndex=6;
				}
				break;
			case(26):
			case(37):
				singularityMovementFixPawn(moveFromIndex,moveToIndex,quadrant,spaceObjectArray);
				break;
			case(61):
			case(55):
			case(47):
				//fixes for white pieces capturing diagonally in bottom center of board
				if((moveFromIndex==61 || moveFromIndex==55 || moveFromIndex==47) && quadrant==3)
					spaceObjectArray[moveToIndex].prevDirIndex=0;
				else if((moveFromIndex==61 || moveFromIndex==55 || moveFromIndex==47) && quadrant==2)
					spaceObjectArray[moveToIndex].prevDirIndex=4;
				break;
			case(2):
			case(8):
			case(16):
				//fixes for white pieces capturing diagonally in top center of board
				if((moveFromIndex==2 || moveFromIndex==8 || moveFromIndex==16) && quadrant==3)
					spaceObjectArray[moveToIndex].prevDirIndex=4;
				else if((moveFromIndex==2 || moveFromIndex==8 || moveFromIndex==16) && quadrant==2)
					spaceObjectArray[moveToIndex].prevDirIndex=0;
				break;
			default:
				//catch-all for capture movements determined by whether the pawn has moved throught the singularity or not
				if(spaceObjectArray[moveFromIndex].singularity==3)
					spaceObjectArray[moveToIndex].prevDirIndex=0;
				else
					spaceObjectArray[moveToIndex].prevDirIndex=4;
				break;
		}
	}
	else { //if pawn is black
		switch(moveToIndex) {
			case(0):
			case(1):
			case(5):
			case(6):
			case(7):
			case(12):
			case(13):
			case(14):
			case(15):
			case(21):
			case(22):
			case(23):
			case(24):
			case(25):
			case(32):
			case(33):
			case(34):
			case(35):
			case(36):
			case(43):
			case(44):
			case(45):
			case(46):
			case(52):
			case(53):
			case(54):
			case(59):
			case(60):
				//fixes for black pieces capturing diagonally on left and right sides of board
				if(quadrant==1) {
					spaceObjectArray[moveToIndex].prevDirIndex=2;
				}
				else {
					spaceObjectArray[moveToIndex].prevDirIndex=6;
				}
				break;
			case(26):
			case(37):
				singularityMovementFixPawn(moveFromIndex,moveToIndex,quadrant,spaceObjectArray);
				break;
			case(61):
			case(55):
			case(47):
				//fixes for black pieces capturing diagonally in bottom center of board
				if((moveFromIndex==61 || moveFromIndex==55 || moveFromIndex==47) && quadrant==4)
					spaceObjectArray[moveToIndex].prevDirIndex=6;
				else if((moveFromIndex==61 || moveFromIndex==55 || moveFromIndex==47) && quadrant==1)
					spaceObjectArray[moveToIndex].prevDirIndex=2;
				break;
			case(2):
			case(8):
			case(16):
				//fixes for black pieces capturing diagonally in top center of board
				if((moveFromIndex==2 || moveFromIndex==8 || moveFromIndex==16) && quadrant==4)
					spaceObjectArray[moveToIndex].prevDirIndex=6;
				else if((moveFromIndex==2 || moveFromIndex==8 || moveFromIndex==16) && quadrant==1)
					spaceObjectArray[moveToIndex].prevDirIndex=2;
				break;
			default:
				//catch-all for capture movements determined by whether the pawn has moved throught the singularity or not
				if(spaceObjectArray[moveFromIndex].singularity==3)
					spaceObjectArray[moveToIndex].prevDirIndex=4;
				else
					spaceObjectArray[moveToIndex].prevDirIndex=0;
				break;
		}
	}
}