if (typeof jQuery === 'undefined') { throw new Error('JSConsole requires jQuery') }
(function ($, window, undefined) {

	window.JSConsole = function(ConsoleElementId){
		if( !(this instanceof JSConsole) )
			return new JSConsole(ConsoleElementId);

		var $ConsoleElement = $("#" + ConsoleElementId).addClass("jsconsole");
		$ConsoleElement.attr("tabindex", 0);
		var commands = {};
		var contextThis = this;

		$ConsoleElement.on({
			keydown: function(e){
				switch(e.which){
					// tab
					case 9:
						e.preventDefault();
						break;
					// enter
					case 13:
						e.preventDefault();
						commandsHandler();
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
		}).on("contextmenu", function(e){
			return false;
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

		var commandsHandler = function(){
			var text = $ConsoleElement.children(".jsconsole_input.jsconsole_active").
				children(".jsconsole_line").text();
			var cmds = text.split(";");
			$.each(cmds, function(){
				var cmd = this.split(/\s+/, 1);
				var args = "";
				if(this.indexOf(" ") > 0){
					args = this.substring(this.indexOf(" ")).trim();
				}
				var fn = commands[cmd];
				if(typeof fn === "function")
					fn.call(contextThis, args);
			});
		}

		this.addCommand = function(name, fn){
			if(typeof name != "string" || typeof fn != "function")
				return;
			commands[name] = fn;
		}

		this.addOutput = function(text){
			var $output = $("<div class='jsconsole_output'></div>");
			$output.text(text);
			$ConsoleElement.append($output);
		}

		this.addError = function(text){
			var $output = $("<div class='jsconsole_error'></div>");
			$output.text(text);
			$ConsoleElement.append($output);
		}


		this.addWarning = function(text){
			var $output = $("<div class='jsconsole_warning'></div>");
			$output.text(text);
			$ConsoleElement.append($output);
		}

		addLine();
		this.addCommand("clear", function(){
			$ConsoleElement.children(":not(.jsconsole_input.jsconsole_active)").remove();
		});
	}

	var styles = function(background_color, input_color, output_color, error_color, warning_color, dir_color){

		var $style = $("<style id='jsconsole'></style>");

		var input = function(){
			var styleText = ".jsconsole_input{";
			styleText += "color:" + input_color + ";";
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
			styleText += "background-color:" + background_color + ";";
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
			styleText += "color:" + dir_color + ";";
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

		var output = function(){
			var styleText = ".jsconsole_output, .jsconsole_error, .jsconsole_warning{";
			styleText += "display:block;";
			styleText += "color:" + output_color + ";";
			styleText += "border:none;";
			styleText += "outline:0;";
			styleText += "word-wrap:break-word;";
			styleText += "white-space:pre-wrap;";
			styleText += "}";
			$style.append(styleText);
		}

		var error = function(){
			var styleText = ".jsconsole_error{";
			styleText += "color:" + error_color + ";";
			styleText += "}";
			$style.append(styleText);
		}

		var warning = function(){
			var styleText = ".jsconsole_warning{";
			styleText += "color:" + warning_color + ";";
			styleText += "}";
			$style.append(styleText);
		}

		input();
		active();
		cosole();
		dir();
		line();
		output();
		error();
		warning();
		$("head").append($style);
	}

	styles("#2f0b24", "white", "green", "red", "orange", "blue");
}(jQuery, window));