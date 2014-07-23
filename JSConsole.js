if (typeof jQuery === 'undefined') { throw new Error('JSConsole requires jQuery') }
(function ($, window, undefined) {

	var background_color = "#2f0b24";
	var input_color = "white";
	var output_color = "green";
	var error_color = "red";
	var warning_color = "orange";
	var dir_color = "blue";

	window.JSConsole = function(ConsoleElementId){
		if( !(this instanceof JSConsole) )
			return new JSConsole(ConsoleElementId);

		var $ConsoleElement = $("#" + ConsoleElementId).addClass("jsconsole");
		$ConsoleElement.attr("tabindex", 0);
		var commands = {};
		var history = [];
		var historyIndex = 0;
		var currentIndex = null;
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
					// up
					case 38:
						e.preventDefault();
						if(historyIndex === 0 && currentIndex === null)
							currentIndex = $(this).text();
						historyIndex += 1;
						if(historyIndex > history.length){
							historyIndex = history.length;
							return;
						}
						if(historyIndex === 0 && currentIndex != null){
							$(this).text(currentIndex);
							setEndOfContenteditable(this);
							return;
						}
						$(this).text(history[historyIndex - 1]);
						setEndOfContenteditable(this);
						break;
					// down
					case 40:
						e.preventDefault();
						if(historyIndex === 0 && currentIndex === null)
							currentIndex = $(this).text();
						historyIndex -= 1;
						if(historyIndex < 0){
							historyIndex = 0;
							return;
						}
						if(historyIndex === 0 && currentIndex != null){
							$(this).text(currentIndex);
							setEndOfContenteditable(this);
							return;
						}
						$(this).text(history[historyIndex - 1]);
						setEndOfContenteditable(this);
						break;
					default:
						break;
				}
			}
		}, ".jsconsole_input.jsconsole_active .jsconsole_line");

		$ConsoleElement.click(function(e){
			if($(e.target).is(".jsconsole .jsconsole_line"))
				return;
			var $toBeFocused = $ConsoleElement.
				children(".jsconsole_input.jsconsole_active").
				children(".jsconsole_line");
			$toBeFocused.focus();
		}).on("contextmenu", function(e){
			return false;
		}).keypress(function(){
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

		var commandsHandler = function(){
			var text = $ConsoleElement.children(".jsconsole_input.jsconsole_active").
				children(".jsconsole_line").text();
			historyIndex = 0;
			currentIndex = null;
			history.unshift(text);
			var cmds = text.split(";");
			$.each(cmds, function(){
				var cmd = this.split(" ", 1);
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
			var $line = $("<div class='jsconsole_line'></div>")
			$line.text(text);
			$output.append($line);
			$ConsoleElement.append($output);
		}

		this.addError = function(text){
			var $output = $("<div class='jsconsole_error'></div>");
			var $line = $("<div class='jsconsole_line'></div>")
			$line.text(text);
			$output.append($line);
			$ConsoleElement.append($output);
		}


		this.addWarning = function(text){
			var $output = $("<div class='jsconsole_warning'></div>");
			var $line = $("<div class='jsconsole_line'></div>")
			$line.text(text);
			$output.append($line);
			$ConsoleElement.append($output);
		}

		this.backgroundColor = function(color){
			if(color === undefined)
				return background_color;
			background_color = color;
			return this;
		}

		this.inputColor = function(color){
			if(color === undefined)
				return input_color;
			input_color = color;
			return this;
		}

		this.outputColor = function(color){
			if(color === undefined)
				return output_color;
			output_color = color;
			return this;
		}

		this.errorColor = function(color){
			if(color === undefined)
				return error_color;
			error_color = color;
			return this;
		}

		this.warningColor = function(color){
			if(color === undefined)
				return warning_color;
			warning_color = color;
			return this;
		}

		this.dirColor = function(color){
			if(color === undefined)
				return dir_color;
			dir_color = color;
			return this;
		}

		this.applyColorChanges = function(){
			styles();
			return this;
		}

		this.executeCommands = function(){
			$.each(arguments, function(){
				var $line = $(".jsconsole_input.jsconsole_active .jsconsole_line");
				$line.text(this);
				$line.trigger({
					type: "keydown",
					which: 13
				});
			});
		}

		function setEndOfContenteditable(contentEditableElement){
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
		this.addCommand("clear", function(){
			$ConsoleElement.children().remove();
		});
	}

	var styles = function(){

		$("#jsconsoleStyleID").remove();
		var $style = $("<style id='jsconsoleStyleID'></style>");

		var input = function(){
			var styleText = ".jsconsole_input{";
			styleText += "color:" + input_color + ";";
			// styleText += "z-index:0;";
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
			styleText += "padding-right:8px;";
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

	styles();
}(jQuery, window));