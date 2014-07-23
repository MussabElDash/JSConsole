if (typeof jQuery === 'undefined') { throw new Error('JSConsole requires jQuery') }
(function ($, window, undefined) {

	window.JSConsole = function(ConsoleElementId){
		if( !(this instanceof JSConsole) )
			return new JSConsole(ConsoleElementId);

		var $ConsoleElement = $("#" + ConsoleElementId).addClass("jsconsole");
		$ConsoleElement.attr("tabindex", 0);

		$ConsoleElement.on({
			keydown: function(e){
				switch(e.which){
					// tab
					case 9:
						e.preventDefault();
						$(this).text($(this).text() + "\t");
						setEndOfContenteditable(this);
						break;
					// enter
					case 13:
						e.preventDefault();
						addLine();
						break;
				}
			}
		}, ".jsconsole_input.jsconsole_active .jsconsole_line");

		$ConsoleElement.click(function(e){
			if($(e.target).is(".jsconsole_input:not(.jsconsole_active) .jsconsole_line"))
				return;
			var $toBeFocused = $ConsoleElement.
				children(".jsconsole_input.jsconsole_active").
				children(".jsconsole_line");
			$toBeFocused.focus();
		});

		var addLine = function(){
			$ConsoleElement.children(".jsconsole_input.jsconsole_active").
				removeClass("jsconsole_active").children(".jsconsole_line").
				removeAttr("contenteditable");
			var $dir = $("<span class='jsconsole_directory'>JSConsole:~$</span>");
			var $line = $("<div class='jsconsole_line' contenteditable></div>");
			var $active = $("<div class='jsconsole_input jsconsole_active'></div>").
				append($dir).append($line);
			$ConsoleElement.append($active);
			$line.focus();
		}

		function setEndOfContenteditable(contentEditableElement)
		{
			var range,selection;
			if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
			{
				range = document.createRange();//Create a range (a range is a like the selection but invisible)
				range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
				range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
				selection = window.getSelection();//get the selection object (allows you to change selection)
				selection.removeAllRanges();//remove any selections already made
				selection.addRange(range);//make the range you have just created the visible selection
			}
			else if(document.selection)//IE 8 and lower
			{ 
				range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
				range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
				range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
				range.select();//Select the range (make it the visible selection
			}
		}

		addLine();
	}

	var styles = function(){

		var $style = $("<style id='jsconsole'></style>");

		var input = function(){
			var styleText = ".jsconsole_input{";
			styleText += "outline:none;";
			styleText += "display:block;";
			styleText += "}";
			$style.append(styleText);
		}

		var active = function(){
			var styleText = ".jsconsole_input.jsconsole_active{";
			styleText += "display:inline;";
			styleText += "}";
			$style.append(styleText);
		}

		var cosole = function(){
			var styleText = ".jsconsole{";
			styleText += "background-color:#2f0b24;";
			styleText += "color:white;";
			styleText += "height:100%;";
			styleText += "width:100%;";
			styleText += "overflow:auto;";
			styleText += "display:block;";
			styleText += "cursor:text;";
			styleText += "}";
			$style.append(styleText);
		}

		var dir = function(){
			var styleText = ".jsconsole_directory{";
			styleText += "padding-right:4px;";
			styleText += "padding-left:4px;";
			styleText += "display:inline;"
			styleText += "}";
			$style.append(styleText);
		}

		var line = function(){
			var styleText = ".jsconsole_line{";
			styleText += "display:inline;";
			styleText += "border:none;";
			styleText += "outline:0;";
			styleText += "word-wrap:break-word;";
			styleText += "white-space:pre-wrap;";
			styleText += "}";
			$style.append(styleText);
		}

		input();
		active();
		cosole();
		dir();
		line();
		$("head").append($style);
	}

	styles();
}(jQuery, window));