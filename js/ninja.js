"use strict";

$(document).ready(function(){
	var numGalleryImages=13;
	var currImage=1;
	var isScrolled=0;
	var getScrollDir=window.pageYOffset;
	var mediaIsHidden=0;
	var dmTop = $(".mainTab").offset().top;

	$(".desktopMedia").css({"top":dmTop+25+"px"});

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

		if(id=="mflag1")
			color="#3b5999";
		else if(id=="mflag2")
			color="#cb3b2a";
		else if(id=="mflag3")
			color="#0274b3";
		else
			color="#d9d9d9";

		var anim = setInterval(function(){
			count++;
			x=(width*count/10);

			paper.clear();
			var square=paper.path("M"+xmin+",0 L"+x+",0 L"+x+","+cHeight+" L"+xmin+","+cHeight+" z");
			square.attr("fill",color);
			square.attr("stroke",color);
			//square.node.setAttribute("id","extended"); //omg it worked
			square.node.setAttribute("class","extended");
		
			if(count>=10)
				clearInterval(anim);
		},10);
	}, function() {
		$(".extended").parent().remove();
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
		$(".extended").parent().remove();

		if(getScrollDir > window.pageYOffset && mediaIsHidden) {
			$(".mobileMedia").transition({
				y:'0px'
			});
			mediaIsHidden=0;
			getScrollDir = window.pageYOffset;
		}
		else if (getScrollDir < window.pageYOffset && !mediaIsHidden) {
			$(".mobileMedia").transition({
				y:'38px'
			});
			mediaIsHidden=1;
			getScrollDir = window.pageYOffset;
		}
		else {
			getScrollDir = window.pageYOffset;
		}

		var right,left;
		var sf=0;
		if(document.getElementById("jumpToBounds")){
			sf=1;
			right = document.getElementById("jumpToBounds").getBoundingClientRect();
			left = document.getElementById("jumpToIndent").getBoundingClientRect();
		}

		if(window.pageYOffset>150) {
			if(sf) {
				$("#jumpTo").css({"position":"fixed","top":"0","margin-left":(right.right-left.left+10),"margin-top":"0"});
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
		if($(window).width() > 768) {
			$(".extended").parent().remove();
		}
		else {
			$(".extended").parent().remove();
		}

		if(document.getElementById("liftoff")) {
			$("svg").remove();
			loadGauge("gauge",0);
		}
	});
});

//=======================================================================
// All stand-alone functions
//=======================================================================
function loadProg(num) {
	var id = "#prog".concat(num.toString());
	var prev = document.getElementsByClassName("progactive")[0];
	$(".progactive").hide();
	$(prev).removeClass("progactive");
	$(prev).hide();
	$(id).addClass("progactive");
	$(id).show();
}

function vibrate(num) {
	navigator.vibrate(num);
}
