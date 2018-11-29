'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.forevolve.gitext.browse', async (uri: vscode.Uri) => {
        // Getting the current right-clicked file, defaulting to the root workspace directory
        let workspaceRoot: string = uri.fsPath || vscode.workspace.rootPath || '';
        const usedDefault = uri && uri.fsPath ? false : true;

        // Logging some debug info no matter what
        console.log(`extension.forevolve.gitext.browse based on: ${workspaceRoot} | Used default: ${usedDefault}`);

        // If there is nothing to launch, return
        const emptyTasks: vscode.Task[] = [];
        if (!workspaceRoot) {
            return emptyTasks;
        }

        // If its a file, strip the filename; gitext is expecting a directory
        if (uri.scheme === 'file') {
            const indexWin = workspaceRoot.lastIndexOf('\\');
            const indexOthers = workspaceRoot.lastIndexOf('//');
            const index = Math.max(indexWin, indexOthers);
            workspaceRoot = workspaceRoot.substr(0, index);
            console.log(`extension.forevolve.gitext.browse extracted directory: ${workspaceRoot}`);
        }

        // Displaying a message box to the user
        const message = usedDefault
            ? 'Opening GitExtensions based on the workspace root.'
            : `Opening GitExtensions based on: ${workspaceRoot}`;
        vscode.window.showInformationMessage(message);

        // Launching Git Extensions
        const { stdout, stderr } = await exec('gitextensions browse', { cwd: workspaceRoot });

        // Display error
        if (stderr && stderr.length > 0) {
            vscode.window.showErrorMessage(stderr);
        }

        // Display output
        if (stdout) {
            vscode.window.showInformationMessage(stdout);
        }
        return emptyTasks;
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function exec(command: string, options: cp.ExecOptions): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        cp.exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stdout, stderr });
            }
            resolve({ stdout, stderr });
        });
    });
}
