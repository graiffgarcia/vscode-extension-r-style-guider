// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

var commas_to_newline = function (string) {
	var newstring = string.replace(/,\s*\n(\s+)(.)/g, '\n$1, $2');
	return newstring;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "r-style-guider" is now active!');
	let pkglog = vscode.window.createOutputChannel("R Style Guider");

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('r-style-guider.newline_commas', function () {


		const textEditor = vscode.window.activeTextEditor;
		const document = textEditor.document;
		let word = document.getText();
		const fullRange = new vscode.Range(
			document.positionAt(0),
			document.positionAt(word.length - 1)
		)

		
		if (word.trim().length == 0) {
			vscode.window.showErrorMessage("Your document is empty!");
			return;
		}
		let new_word = commas_to_newline(word);

		pkglog.append(new_word);

		textEditor.edit(function (editBuilder) {
			editBuilder.replace(fullRange, new_word);
		});


	});
	context.subscriptions.push(disposable);

	//////////////////////////////////////////////
	//////////////////////////////////////////////
	disposable = vscode.commands.registerCommand('r-style-guider.fix_var_names_underscores_to_dots', function () {


		const textEditor = vscode.window.activeTextEditor;
		const document = textEditor.document;
		const selection = textEditor.selection;
		let full_doc = document.getText();
		let word = document.getText(selection);
		let word_regex = new RegExp(word, "g");
		const fullRange = new vscode.Range(
			document.positionAt(0),
			document.positionAt(full_doc.length)
		)

		if (word.trim().length == 0) {
			vscode.window.showErrorMessage("Please select some text and re-run the command.");
			return;
		}
		let new_word = word.replace(/_/g, '.');
		let new_doc = full_doc.replace(word_regex, new_word);

		pkglog.append(new_word);

		textEditor.edit(function (editBuilder) {
			editBuilder.replace(fullRange, new_doc);
		});


	});
	context.subscriptions.push(disposable);


	//////////////////////////////////////////////
	//////////////////////////////////////////////
	disposable = vscode.commands.registerCommand('r-style-guider.fix_var_names_camelCase', function () {


		const textEditor = vscode.window.activeTextEditor;
		const document = textEditor.document;
		const selection = textEditor.selection;
		let full_doc = document.getText();
		let word = document.getText(selection);
		let word_regex = new RegExp(word, "g");
		const fullRange = new vscode.Range(
			document.positionAt(0),
			document.positionAt(full_doc.length)
		)

		if (word.trim().length == 0) {
			vscode.window.showErrorMessage("Please select some text and re-run the command.");
			return;
		}
		let new_word = word.replace(/_([a-zA-Z])/g, function(m, r) {
			return r.toUpperCase();
		});
		pkglog.appendLine(`old ${word}`);
		pkglog.appendLine(`new ${new_word}`);

		let new_doc = full_doc.replace(word_regex, new_word);

		pkglog.append(new_doc);

		textEditor.edit(function (editBuilder) {
			// editBuilder.replace(fullRange, '');
			editBuilder.replace(fullRange, new_doc);
		});


	});
	context.subscriptions.push(disposable);


	//////////////////////////////////////////////
	//////////////////////////////////////////////
	disposable = vscode.commands.registerCommand('r-style-guider.fix_var_names_list_to_camelCase', async function () {


		const textEditor = vscode.window.activeTextEditor;
		const document = textEditor.document;
		let full_doc = document.getText();
		const fullRange = new vscode.Range(
			document.positionAt(0),
			document.positionAt(full_doc.length)
		)


		let input = await vscode.window.showInputBox({placeHolder: 'Enter every variable name you wish to change, separated by commas.'});
		pkglog.appendLine(`input ${input}`);
		
		let inputs = input.split(/,\s*/);
		inputs.forEach(x => pkglog.appendLine(x));
		// @ts-ignore
		// inputs.forEach((x, i) => inputs[i] = new RegExp(x, 'g'));

		let re_dict = {};
		inputs.forEach(input => re_dict[input] = input.replace(/_([a-zA-Z])/g, function (m, r) {
			return r.toUpperCase();
		}));

		let new_doc = full_doc;
		Object.entries(re_dict).forEach(x => new_doc = new_doc.replace(RegExp(x[0], 'g'), x[1]));

		// if (word.trim().length == 0) {
		// 	vscode.window.showErrorMessage("Please select some text and re-run the command.");
		// 	return;
		// }
		// let new_word = word.replace(/_([a-zA-Z])/g, function(m, r) {
		// 	return r.toUpperCase();
		// });
		// pkglog.appendLine(`old ${word}`);
		// pkglog.appendLine(`new ${new_word}`);

		// let new_doc = full_doc.replace(word_regex, new_word);

		// pkglog.append(new_doc);

		textEditor.edit(function (editBuilder) {
			// editBuilder.replace(fullRange, '');
			editBuilder.replace(fullRange, new_doc);
		});


	});
	context.subscriptions.push(disposable);


	//////////////////////////////////////////////
	//////////////////////////////////////////////
	disposable = vscode.commands.registerCommand('r-style-guider.fix_var_names_list_to_dots', async function () {


		const textEditor = vscode.window.activeTextEditor;
		const document = textEditor.document;
		let full_doc = document.getText();
		const fullRange = new vscode.Range(
			document.positionAt(0),
			document.positionAt(full_doc.length)
		)


		let input = await vscode.window.showInputBox({placeHolder: 'Enter every variable name you wish to change, separated by commas.'});
		pkglog.appendLine(`input ${input}`);
		
		let inputs = input.split(/,\s*/);
		inputs.forEach(x => pkglog.appendLine(x));
		// @ts-ignore
		// inputs.forEach((x, i) => inputs[i] = new RegExp(x, 'g'));

		let re_dict = {};
		inputs.forEach(input => re_dict[input] = input.replace(/_/g, '.'));

		let new_doc = full_doc;
		Object.entries(re_dict).forEach(x => new_doc = new_doc.replace(RegExp(x[0], 'g'), x[1]));

		// if (word.trim().length == 0) {
		// 	vscode.window.showErrorMessage("Please select some text and re-run the command.");
		// 	return;
		// }
		// let new_word = word.replace(/_([a-zA-Z])/g, function(m, r) {
		// 	return r.toUpperCase();
		// });
		// pkglog.appendLine(`old ${word}`);
		// pkglog.appendLine(`new ${new_word}`);

		// let new_doc = full_doc.replace(word_regex, new_word);

		// pkglog.append(new_doc);

		textEditor.edit(function (editBuilder) {
			// editBuilder.replace(fullRange, '');
			editBuilder.replace(fullRange, new_doc);
		});


	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
