if (typeof jQuery === 'undefined') { throw new Error('JSConsole requires jQuery') }
(function ($, window, undefined) {

	window.JSConsole = function(ConsoleElemntId){
		if( !(this instanceof JSConsole) )
			return new JSConsole(ConsoleElemntId);

		$cursor = $("<span id='jsconsole_cursor'>|</span>");
		var $ConsoleElemnt = $("#" + ConsoleElemntId).addClass("jsconsole");
		var typing = false;

		$ConsoleElemnt.on({
			keypress: function(e){
				typing = true;
				$(this).text($(this).text() + String.fromCharCode(e.which));
			}, keydown: function(e){
				typing = true;
				switch(e.which){
					case 8:
						e.preventDefault();
						$(this).text($(this).text().slice(0, -1));
						break;
					case 13:
						e.preventDefault();
						addLine();
						break;
				}
			}, keyup: function(){
				setTimeout(function(){
					typing = false;
				},1000);
			}
		}, ".jsconsole_input.jsconsole_active");

		$ConsoleElemnt.click(function(){
			var $toBeFocused = $("#" + ConsoleElemntId + " .jsconsole_input.jsconsole_active");
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
			$("#" + ConsoleElemntId + " .jsconsole_input.jsconsole_active")
				.removeClass("jsconsole_active")
				.removeAttr("tabindex");
			var $dir = $("<div class='jsconsole_directory'>JSConsole:~$ </div>");
			var $active = $("<div class='jsconsole_input jsconsole_active'></div>");
			$active.attr("tabindex", -1);
			$cursor.detach();
			$ConsoleElemnt.append($dir).append($active).append($cursor).click();
		}

		addLine();
		setInterval (cursorAnimation, 1000);
	}

	var styles = function(){

		var $style = $("<style id='jsconsole'></style>");

		var input = function(){
			var styleText = ".jsconsole_input{";
			styleText += "outline:none;";
			styleText += "display:block;";
			styleText += "height:16px;"
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
			styleText += "white-space:pre-wrap;";
			styleText += "height:100%;";
			styleText += "width:100%;";
			styleText += "overflow:auto;";
			styleText += "display:block;";
			styleText += "cursor:text;";
			styleText += "}";
			$style.append(styleText);
		}

		var cursor = function(){
			var styleText = "#jsconsole_cursor{";
			styleText += "font-weight:900;"
			styleText += "}";
			$style.append(styleText);
		}

		var dir = function(){
			var styleText = ".jsconsole_directory{";
			styleText += "display:inline;"
			styleText += "}";
			$style.append(styleText);
		}

		input();
		active();
		cosole();
		cursor();
		dir();
		$("head").append($style);
	}

	styles();
}(jQuery, window));