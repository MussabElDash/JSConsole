# JSConsole

A Console JavaScript library

This Library is to simulate a Console on the browser

## Usage
use the following javascript code to inject the console in a div and gets the JSConsole

```var jsconsole = JSConsole("divID");```

where ```divID``` is the id of the div to be injected

---

### Methods
There are methods to style the JSConsole :
* **backgroundColor() :** used to set or get the color of the background of the JSConsole (default: #2f0b24)
* **inputColor() :** setter and getter for the color of the user's input (default : white)
* **outputColor() :** setter and getter for the color of the regular output from the JSConsole (default: green)
* **errorColor() :** setter and getter for the color of the output in case of error (default: red)
* **warningColor() :** setter and getter for the color of the output in case of warning (default: orange)
* **dirColor() :** setter and getter for the color of the text in the directory part (default: blue)

all the previous methods can be chained in case of setting

* **applyColorChanges() :** called to apply the previous changes

and the following methods are used to manipulate the JSConsole texts

* **addCommand(commandName, commandHandler) :** this method takes a string commandName and a function commandHandler and it is used to add the command and its handler in the JSConsole
* **addOutput(text) :** prints the text as a regular output in the JSConsole
* **addError(text) :** prints the text as an error in the JSConsole
* **addWarning(text) :** prints the text as a warning in the JSConsole
* **executeCommands(command1, command2,.....) :** executes the given commands
* **directory() :** setter and getter for the text in the directory part (default: JSConsole:~)

---

## Examples:
**in the HTML file :**

```<div id="console"></div>```

**in the javascript**

```
var jsconsole = JSConsole("console");
jsconsole.addCommand("greet", function(name){
	this.addOutput("Hello " + name);
	this.addError("Hello " + name);
	this.addWarning("Hello " + name);
});

jsconsole.addCommand("background", function(color){
	this.backgroundColor(color).applyColorChanges();
});

jsconsole.executeCommands("greet Mussab",
	"greet Mussab ElDash", "greet GitHub user");
```

###[Demo](http://mussabeldash.github.io/JSConsole/)

---

## Requirments:
* JQuery only

## Licence

JSTimer is licensed under MIT http://www.opensource.org/licenses/MIT

#### Copyright &copy;, Mussab ElDash
<mussab14@gmail.com>
