if (typeof jQuery === 'undefined') { throw new Error('JSConsole requires jQuery') }
(function ($, window, undefined) {

	window.JSConsole = function(ConsoleElementId){
		if( !(this instanceof JSConsole) )
			return new JSConsole(ConsoleElementId);

		var $ConsoleElement = $("#" + ConsoleElementId).addClass("jsconsole");
		$ConsoleElement.attr("tabindex", 0);
		var typing = false;

		$ConsoleElement.on({
			keypress: function(e){
				typing = true;
				var child = $(this).children('.jsconsole_before_cursor');
				child.text(child.text() + String.fromCharCode(e.which));
			}, keydown: function(e){
				typing = true;
				var child_before = $(this).children('.jsconsole_before_cursor');
				var child_after = $(this).children('.jsconsole_after_cursor');
				switch(e.which){
					// backspace
					case 8:
						e.preventDefault();
						child_before.text(child_before.text().slice(0, -1));
						break;
					// tab
					case 9:
						e.preventDefault();
						child_before.text(child_before.text() + "\t");
						break;
					// enter
					case 13:
						e.preventDefault();
						addLine();
						break;
					//space
					case 32:
						e.preventDefault();
						child_before.text(child_before.text() + " ");
						break;
					//end
					case 35:
						e.preventDefault();
						child_before.text(child_before.text() + child_after.text());
						child_after.text("");
						break;
					//home
					case 36:
						e.preventDefault();
						child_after.text(child_before.text() + child_after.text());
						child_before.text("");
						break;
					// delete
					case 46:
						e.preventDefault();
						child_after.text(child_after.text().slice(1));
						break;
					// left
					case 37:
						e.preventDefault();
						var chr = child_before.text().slice(-1);
						child_before.text(child_before.text().slice(0, -1));
						child_after.text(chr + child_after.text());
						break;
					// right
					case 39:
						e.preventDefault();
						var chr = child_after.text().slice(0, 1);
						child_after.text(child_after.text().slice(1));
						child_before.text(child_before.text() + chr);
						break;
				}
			}
		}, ".jsconsole_input.jsconsole_active");

		$ConsoleElement.focus(function(){
			var $toBeFocused = $ConsoleElement.
				children(".jsconsole_input.jsconsole_active");
			$toBeFocused.focus();
		});

		var cursorAnimation = function () {
			if(typing)
				return;
			$cursor.animate({
				opacity: 0
			}, 'fast', 'swing').animate({
				opacity: 1
			}, 'fast', 'swing');
		}

		var addLine = function(){
			$ConsoleElement.children(".jsconsole_input.jsconsole_active").
				removeClass("jsconsole_active").
				removeAttr("tabindex");
			var $dir = $("<span class='jsconsole_directory'>JSConsole:~$</span>");
			var $after = $("<span class='jsconsole_after_cursor'></span>");
			var $before = $("<span class='jsconsole_before_cursor'></span>");
			var $active = $("<div class='jsconsole_input jsconsole_active'></div>").
				attr("tabindex", 0).append($dir).
				append($before).append($after);
			$ConsoleElement.append($active);
			$active.focus();
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

		var before_and_after = function(){
			var styleText = ".jsconsole_after_cursor, .jsconsole_before_cursor{";
			styleText += "display:inline;"
			styleText += "border:none;"
			styleText += "word-wrap:break-word;";
			styleText += "white-space:pre-wrap;";
			styleText += "}";
			$style.append(styleText);
		}

		var active_before = function(){
			var styleText = "@-webkit-keyframes blink-empty{";
			styleText += "50% {border-left: 1px solid #fff;}";
			styleText += "}";
			styleText += "-moz-@keyframes blink-empty{";
			styleText += "50% {border-left: 1px solid #fff;}";
			styleText += "}";
			styleText += "-o-@keyframes blink-empty{";
			styleText += "50% {border-left: 1px solid #fff;}";
			styleText += "}";
			styleText += "@keyframes blink-empty{";
			styleText += "50% {border-left: 1px solid #fff;}";
			styleText += "}";
			styleText += ".jsconsole_input.jsconsole_active .jsconsole_after_cursor{";
			styleText += "-webkit-animation: blink-empty 1s infinite;";
			styleText += "-moz-animation: blink-empty 1s infinite;";
			styleText += "-o-animation: blink-empty 1s infinite;";
			styleText += "animation: blink-empty 1s infinite;";
			styleText += "border-left: transparent solid 1px;";
			styleText += "}";
			$style.append(styleText);
		}

		input();
		active();
		cosole();
		dir();
		before_and_after();
		active_before();
		$("head").append($style);
	}

	styles();
}(jQuery, window));