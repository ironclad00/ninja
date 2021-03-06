"use strict";

/*To-Do
	- 
*/

$(document).ready(function(){
	var numGalleryImages=13;
	var currImage=1;
	var isScrolled=0;
	var getScrollDir=window.pageYOffset;
	var mediaIsHidden=0;
	var dmTop;
	var widthPadding,jumpToWidth; //widthPadding keeps the bottom border on the JumpTo menus constant
	if(!document.getElementById("gameboard")) {
		dmTop = $(".mainTab").offset().top;
		$(".desktopMedia").css({"top":dmTop+25+"px"});
	}
	if(document.getElementById("jumpTo")) {
		widthPadding = (22/1680)*$(window).width();
		jumpToWidth = $("#jumpTo").width();
	}

	var modalLength,modalTop,modalLeft;
	if($(window).width() < 550)
		modalLength = $(window).width() * 0.9;
	else if($(window).height() < 550)
		modalLength = $(window).height() * 0.9;
	else
		modalLength = 500;
	modalTop = ($(window).height()/2) - modalLength/2;
	modalLeft = ($(window).width()/2) - modalLength/2;
	$("#emailModal").css({"width":modalLength+"px","height":modalLength+"px","top":modalTop+"px","left":modalLeft+"px"});
	$("#closeModal").css({"left":(modalLength*0.94)+"px"});

	//TEMPORARY
	$("#mflag4").hide();
	//TEMPORARY

	//=======================================================================
	// Enable vibration (if supported)
	//=======================================================================
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	if (navigator.vibrate) {
		$(".navbar-toggle").click(function(){
			vibrate(50);
		});
		if(document.getElementById("topShortcut"))
			$("#topShortcut").click(function(){
				vibrate(50);
			});
	}

	//=======================================================================
	// Hover function for stick flick background
	//=======================================================================
	if(document.getElementById("sfBack")) {
		$("#sfBack").mouseover(function(){
			$("#sfBack").hide();
			$("#sfBackHover").show();
		});
		$("#sfBackHover").mouseout(function(){
			$("#sfBack").show();
			$("#sfBackHover").hide();
		});
	}

	//=======================================================================
	// Flyout function for desktop media links
	//=======================================================================
	$(".desktopMedia img").hover(function() {
		var id = $(this).attr("id");
		var bounds = document.getElementById(id).getBoundingClientRect();
		var top = bounds.top;
		var bottom = bounds.bottom;
		var right = bounds.right;
		var cHeight = Math.abs(top-bottom);
		var cWidth = cHeight;

		var xmax = 0.5*cWidth;
		var xmin = 0;
		var width = xmax-xmin;

		var paper=Raphael(right,top+window.pageYOffset,cWidth,cHeight);
		var square;
		var x=xmin;
		var count=0;
		var color;

		if(id=="mflag1")	  //facebook
			color="#3b5999";
		else if(id=="mflag2") //g+
			color="#cb3b2a";
		else if(id=="mflag3") //linkedin
			color="#0274b3";
		else if(id=="mflag4") //email
			color="#d9d9d9";
		else if(id=="mflag5") //github
			color="#492248";
		else 				  //twitter
			color="#5ea9dd";

		var anim = setInterval(function(){
			count++;
			x=(width*count/10);

			paper.clear();
			var square=paper.path("M"+xmin+",0 L"+x+",0 L"+x+","+cHeight+" L"+xmin+","+cHeight+" z");
			square.attr("fill",color);
			square.attr("stroke",color);
			square.node.setAttribute("class","extended");
		
			if(count>=10)
				clearInterval(anim);
		},10);
	}, function() {
		setTimeout(function(){//removal of flyout NEEDS to be delayed to prevent deletion of the flyout before the animation is compelete
			$(".extended").parent().remove();
		}, 10);
	});


	//=======================================================================
	// Set up functions for displaying and viewing photoshop pics
	//=======================================================================
	$(".tnCollect img").hover(function() {
		$(this).addClass("hovering");
	}, function() {
		$(this).removeClass("hovering");
	});

	$("#nextPic").click(function(){
		if(currImage<numGalleryImages) {
			var thisClass = ".img".concat(currImage.toString());
			var nextClass = ".img".concat((currImage+1).toString());
			$(thisClass).hide();
			$(nextClass).fadeIn();
			currImage++;
		} else {
			var thisClass = ".img".concat(currImage.toString());
			$(thisClass).hide();
			$(".img1").fadeIn();
			currImage=1;
		}
	});
	$("#prevPic").click(function(){
		if(currImage>1) {
			var thisClass = ".img".concat(currImage.toString());
			var nextClass = ".img".concat((currImage-1).toString());
			$(thisClass).hide();
			$(nextClass).fadeIn();
			currImage--;
		} else {
			var thisClass = ".img".concat(currImage.toString());
			$(thisClass).hide();
			$(".img".concat(numGalleryImages.toString())).fadeIn();
			currImage=numGalleryImages;
		}
	});
	$(".tnCollect img").click(function(){
		var i;
		var newClass = ".img"+($(this).attr("id")).replace("tn","");
		currImage=parseInt(($(this).attr("id")).replace("tn",""));
		for(i=1;i<=numGalleryImages;i++)
			$(".img".concat(i.toString())).hide();
		$(newClass).fadeIn();
	});

	//=======================================================================
	// All functions for when the user scrolls
	//=======================================================================
	$(document).scroll(function() {
		//hides mobile media links if user scrolls down, shows if user scrolls up
		if((getScrollDir-5) > window.pageYOffset && mediaIsHidden) {//scroll up
			$(".mobileMedia").transition({
				y:'0px'
			});
			mediaIsHidden=0;
			getScrollDir = window.pageYOffset;
		}
		else if ((getScrollDir+10) < window.pageYOffset && !mediaIsHidden) {//scroll down.
			$(".mobileMedia").transition({
				y:'38px'
			});
			mediaIsHidden=1;
			getScrollDir = window.pageYOffset;
		}
		else {
			getScrollDir = window.pageYOffset;
		}

		//funcionality for scroll behavior for Jump To menus
		var right,left;
		var jumpToExists=0;
		if(document.getElementById("jumpTo")){
			jumpToExists=1;
			right = document.getElementById("jumpToBounds").getBoundingClientRect();
			left = document.getElementById("jumpToIndent").getBoundingClientRect();
		}
		if(window.pageYOffset>150) {
			if(jumpToExists) {
				$("#jumpTo").css({"position":"fixed","top":"0","margin-left":(right.right-left.left+10),"margin-top":"0","width":jumpToWidth+widthPadding+"px"});
			}
			if(!isScrolled && document.getElementById("topShortcut")) {
				isScrolled=1;
				$("#topShortcut").fadeIn();
			}
		}
		else {
			if(isScrolled && document.getElementById("topShortcut")) {
				isScrolled=0;
				$("#topShortcut").fadeOut();
			}
			$("#jumpTo").css({"position":"relative","margin-left":"0","margin-top":"70px"});
		}
	});

	//=======================================================================
	// All functions for when the user resizes the page
	//=======================================================================
	$(window).resize(function() {
		//reload the gauge if on the Liftoff page
		if(document.getElementById("liftoff")) {
			$("svg").remove();
			loadGauge("gauge",0);
		}

		//hides mobile media link to Twitter if there's no room
		if($(window).width()<993) {
			var availableSpace = $(window).width()-$("#topShortcut").width()-20;
			if(availableSpace<288)
				$("#twitterLinkMobile").hide();
			else
				$("#twitterLinkMobile").show();
		}

		//resize the email modal
		if($(window).width() < 550)
			modalLength = $(window).width() * 0.9;
		else if($(window).height() < 550)
			modalLength = $(window).height() * 0.9;
		else
			modalLength = 500;
		modalTop = ($(window).height()/2) - modalLength/2;
		modalLeft = ($(window).width()/2) - modalLength/2;
		$("#emailModal").css({"width":modalLength+"px","height":modalLength+"px","top":modalTop+"px","left":modalLeft+"px"});
		$("#closeModal").css({"left":(modalLength*0.94)+"px"});
	});

	//=======================================================================
	// 
	//=======================================================================
	$("#mflag4").click(function() {
		$("#modalBackground").fadeIn(500);
		$("#emailModal").fadeIn(500);
	});
	$("#closeModal").click(function() {
		$("#modalBackground").fadeOut(500);
		$("#emailModal").fadeOut(500);
	});
	$("#cancelModal").click(function() {
		$("#modalBackground").fadeOut(500);
		$("#emailModal").fadeOut(500);
	});
});

//=======================================================================
// All stand-alone functions
//=======================================================================
function loadProg(num) {//toggles the visibility of programs on the Euler page
	var id = "#prog".concat(num.toString());
	var prev = document.getElementsByClassName("progactive")[0];
	$(".progactive").hide();
	$(prev).removeClass("progactive");
	$(prev).hide();
	$(id).addClass("progactive");
	$(id).show();
}

function vibrate(num) {//causes vibration on supported devices
	navigator.vibrate(num);
}

function getResume() {
    window.open("https://docs.google.com/document/d/1_nBJDVH88IDn9W3NpL39mT8CsY24MiI0utvXqyBxiDg/","_blank");
}