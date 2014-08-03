/*Notes
* 
* 
* 
/Notes */

"use strict";

function toggleSettings(num) {
	var idMobile,idDesktop,id;

	for(var i=1; i<6; i++) {
		document.getElementById("settingsOption0").style.display="none";

		var temp=i.toString();
		idMobile="liSettingsM".concat(temp);
		idDesktop="liSettingsD".concat(temp);
		id="settingsOption".concat(temp);

		if(i==num) {
			document.getElementById(id).style.display="inline";
			document.getElementById(idDesktop).className="active";
			document.getElementById(idMobile).className="active";
		}
		else {
			document.getElementById(id).style.display="none";
			document.getElementById(idDesktop).className="none";
			document.getElementById(idMobile).className="none";
		}
	}
}


function toggleSearch() { /* toggles the display of the search options on the Browse page */
	var state=new String(document.getElementById("toggleSearch").innerHTML);
	if(state=="Hide Options") {
		document.getElementById("toggleSearch").innerHTML="Show Options";
		/*document.getElementById("searchTitle").style.marginBottom="10px"; enable this if the toggle button is going to be displayed on desktop */
		document.getElementById("searchOptions").style.display="none";
	}
	else {
		document.getElementById("toggleSearch").innerHTML="Hide Options";
		/*document.getElementById("searchTitle").style.marginBottom="5px"; enable this if the toggle button is going to be displayed on desktop */
		document.getElementById("searchOptions").style.display="inline";
	}
}

function addBandFields(numBands) { /*toggles the visible/hidden attribute of fields on the first campaign creation page*/
	if(numBands==1) {
		document.getElementById("numBandsInTour").innerHTML="1 Other Band <span class='caret'></span>";
		document.getElementById("makeAdminInfo").style.display="inline";
	}
	else if(numBands!=1 && numBands!=0){
		var temp = numBands.toString();
		document.getElementById("numBandsInTour").innerHTML=temp.concat(" Other Bands <span class='caret'></span>");
		document.getElementById("makeAdminInfo").style.display="inline";
	}
	else {
		document.getElementById("numBandsInTour").innerHTML=("No Other Bands <span class='caret'></span>");
		document.getElementById("enterBandName1").style.display="none";
		document.getElementById("enterBandName2").style.display="none";
		document.getElementById("enterBandName3").style.display="none";
		document.getElementById("enterBandName4").style.display="none";
		document.getElementById("enterBandName5").style.display="none";
		document.getElementById("makeAdminInfo").style.display="none";
	}

	for(var i=1; i<=numBands; i++) {
		var temp2 = i.toString();
		var tempId1 = "enterBandName".concat(temp2);
		var tempId2 = "adminBandName".concat(temp2);
		document.getElementById(tempId1).style.display="inline";
		document.getElementById(tempId2).style.display="inline";
	}
	for(var i=5; i>numBands; i--) {
		var temp2 = i.toString();
		var tempId1 = "enterBandName".concat(temp2);
		var tempId2 = "adminBandName".concat(temp2);
		document.getElementById(tempId1).style.display="none";
		document.getElementById(tempId2).style.display="none";
	}
}

function displayBadgeSelection() {
	document.getElementById('badgeSelectionPlaceholder').innerHTML="<div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title'>Select Badge</h4></div><div id='badgeBox'><div class='row fix-margin'><div class='col-md-4 modalBadge'><img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''></div><div class='col-md-4 modalBadge'><img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''></div><div class='col-md-4 modalBadge'><img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''></div></div><div class='row fix-margin'><div class='col-md-4 modalBadge'><img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''></div><div class='col-md-4 modalBadge'><img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''></div><div class='col-md-4 modalBadge'><img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''></div></div></div><div class='modal-footer'><button class='btn btn-submit disabled'>Save Selection</button><button class='btn btn-danger' id='cancelBadgeModal'>Cancel</button></div></div></div>";
	document.getElementById('cancelBadgeModal').onclick=Function("$('#badgeSelectionPlaceholder').modal('toggle')");
	$('#badgeSelectionPlaceholder').modal('toggle');

	/* expanded code for the badge modal
	=============================================
	<div class='modal-dialog'>
		<div class='modal-content'>
			<div class='modal-header'>
				<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
				<h4 class='modal-title'>Select Badge</h4>
			</div>
			<div id='badgeBox'>
				<div class='row fix-margin'>
					<div class='col-md-4 modalBadge'>
						<img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''>
					</div>
					<div class='col-md-4 modalBadge'>
						<img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''>
					</div>
					<div class='col-md-4 modalBadge'>
						<img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''>
					</div>
				</div>
				<div class='row fix-margin'>
					<div class='col-md-4 modalBadge'>
						<img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''>
					</div>
					<div class='col-md-4 modalBadge'>
						<img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''>
					</div>
					<div class='col-md-4 modalBadge'>
						<img class='img-responsive' src='../static/images/donor1.png' title='Donate over $1000 in total' onclick=''>
					</div>
				</div>
			</div>
			<div class='modal-footer'>
				<button class='btn btn-submit disabled'>Save Selection</button>
				<button class='btn btn-danger' id='cancelBadgeModal'>Cancel</button>
			</div>
		</div>
	</div>
	*/
}

function toggleAboutTour() {
	var state=new String(document.getElementById("toggleAboutTour").innerHTML);
	if(state=="[-]") {
		document.getElementById("toggleAboutTour").innerHTML="[+]";
		document.getElementById("aboutTourCard").style.display="none";
	}
	else {
		document.getElementById("toggleAboutTour").innerHTML="[-]";
		document.getElementById("aboutTourCard").style.display="inherit";
	}
}

function toggleUpdates() {
	var state=new String(document.getElementById("toggleUpdates").innerHTML);
	if(state=="[-]") {
		document.getElementById("toggleUpdates").innerHTML="[+]";
		document.getElementById("updatesCard").style.display="none";
	}
	else {
		document.getElementById("toggleUpdates").innerHTML="[-]";
		document.getElementById("updatesCard").style.display="inherit";
	}
}

function toggleManage(num) {
	var id = "manageBand".concat(num.toString());

	document.getElementById(id).style.display="inherit";
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