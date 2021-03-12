// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { isSymbol } from 'util';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function valid(c: number) {
	return (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
}

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "roy-ext1" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('roy-ext1.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		vscode.window.showOpenDialog();
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello roy!');
	});

	context.subscriptions.push(disposable);

	let tmp = vscode.languages.registerHoverProvider('*', {
		provideHover(document, position, token) {
			vscode.window.showInformationMessage(document.fileName);
			let line = document.lineAt(position.line).text;
			var str;
			var info;
			for (var i = 0; i < position.character; i++) {
				if (!valid(line.charCodeAt(i))) {
					str = "";
					continue;
				}
				str = str + line.charAt(i);
			}
			while (i < line.length) {
				if (!valid(line.charCodeAt(i))) {
					break;
				}
				str = str + line.charAt(i);
				i++;
			}
			// vscode.window.showInformationMessage(String(str));
			info = "**异构内存优化插件**               \n\n" 
				+ "**变量名：**  "+ String(str) + "               \n\n" 
				+ "**store：**10" + "              \n\n" 
				+ "**load：**1000" + "              \n\n" 
				+ "顺序读结构，**建议存放在NVM中**"
			// vscode.window.showInformationMessage(String(position.line) + " " + String(position.character));
			return new vscode.Hover(info);
		}
	});
	context.subscriptions.push(tmp);


}

// this method is called when your extension is deactivated
export function deactivate() {}


// const tokenTypes = new Map<string, number>();
// const tokenModifiers = new Map<string, number>();

// const legend = (function () {
// 	const tokenTypesLegend = [
// 		'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
// 		'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
// 		'method', 'macro', 'variable', 'parameter', 'property', 'label'
// 	];
// 	tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

// 	const tokenModifiersLegend = [
// 		'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
// 		'modification', 'async'
// 	];
// 	tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

// 	return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
// })();

// export function activate(context: vscode.ExtensionContext) {
		
// 	context.subscriptions.push(vscode.commands.registerCommand('roy-ext1.helloWorld', () => {
// 		vscode.window.showInformationMessage('Hello roy!');
// 	}));
// 	context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(
// 		{ language: '*'}, new DocumentSemanticTokensProvider(), legend));
// }

// interface IParsedToken {
// 	line: number;
// 	startCharacter: number;
// 	length: number;
// 	tokenType: string;
// 	tokenModifiers: string[];
// }

// class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
// 	async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
// 		const allTokens = this._parseText(document.getText());
// 		const builder = new vscode.SemanticTokensBuilder();
// 		allTokens.forEach((token) => {
// 			builder.push(token.line, token.startCharacter, token.length, this._encodeTokenType(token.tokenType), this._encodeTokenModifiers(token.tokenModifiers));
// 		});
// 		return builder.build();
// 	}

// 	private _encodeTokenType(tokenType: string): number {
// 		if (tokenTypes.has(tokenType)) {
// 			return tokenTypes.get(tokenType)!;
// 		} else if (tokenType === 'notInLegend') {
// 			return tokenTypes.size + 2;
// 		}
// 		return 0;
// 	}

// 	private _encodeTokenModifiers(strTokenModifiers: string[]): number {
// 		let result = 0;
// 		for (let i = 0; i < strTokenModifiers.length; i++) {
// 			const tokenModifier = strTokenModifiers[i];
// 			if (tokenModifiers.has(tokenModifier)) {
// 				result = result | (1 << tokenModifiers.get(tokenModifier)!);
// 			} else if (tokenModifier === 'notInLegend') {
// 				result = result | (1 << tokenModifiers.size + 2);
// 			}
// 		}
// 		return result;
// 	}

// 	private _parseText(text: string): IParsedToken[] {
// 		const r: IParsedToken[] = [];
// 		const lines = text.split(/\r\n|\r|\n/);
// 		for (let i = 0; i < lines.length; i++) {
// 			const line = lines[i];
// 			let currentOffset = 0;
// 			do {
// 				const openOffset = line.indexOf('[', currentOffset);
// 				if (openOffset === -1) {
// 					break;
// 				}
// 				const closeOffset = line.indexOf(']', openOffset);
// 				if (closeOffset === -1) {
// 					break;
// 				}
// 				const tokenData = this._parseTextToken(line.substring(openOffset + 1, closeOffset));
// 				r.push({
// 					line: i,
// 					startCharacter: openOffset + 1,
// 					length: closeOffset - openOffset - 1,
// 					tokenType: tokenData.tokenType,
// 					tokenModifiers: tokenData.tokenModifiers
// 				});
// 				currentOffset = closeOffset;
// 			} while (true);
// 		}
// 		return r;
// 	}

// 	private _parseTextToken(text: string): { tokenType: string; tokenModifiers: string[]; } {
// 		const parts = text.split('.');
// 		return {
// 			tokenType: parts[0],
// 			tokenModifiers: parts.slice(1)
// 		};
// 	}
// }
