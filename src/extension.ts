'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BrowseCommand } from './BrowseCommand';

export function activate(context: vscode.ExtensionContext) {
    var browseCommand = new BrowseCommand();
    let disposable = vscode.commands.registerCommand(
        'extension.forevolve.gitext.browse',
        async (uri: vscode.Uri) => await browseCommand.executeAsync(uri)
    );
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
