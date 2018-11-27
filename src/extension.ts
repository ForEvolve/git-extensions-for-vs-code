'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.forevolve.gitext.browse', async () => {
        // Display a message box to the user
        vscode.window.showInformationMessage('Opening GitExtensions...');

        // Launching Git Extensions
        let workspaceRoot = vscode.workspace.rootPath;
        let emptyTasks: vscode.Task[] = [];
        if (!workspaceRoot) {
            return emptyTasks;
        }
        let { stdout, stderr } = await exec('gitextensions browse', { cwd: workspaceRoot });

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
