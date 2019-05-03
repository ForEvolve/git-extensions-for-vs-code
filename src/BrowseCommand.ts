import * as vscode from 'vscode';
import { exec } from './Utils';

export class BrowseCommand {
    public async executeAsync(uri: vscode.Uri): Promise<vscode.Task[]> {
        // Getting the current right-clicked file, defaulting to the root workspace directory
        const result = this.findUserSelectionPath(uri);

        // If there is nothing to launch, return
        const emptyTasks: vscode.Task[] = [];
        if (!result) {
            return emptyTasks;
        }

        // Displaying a message box to the user
        const message = result.usedDefault
            ? 'Opening GitExtensions based on the workspace root.'
            : `Opening GitExtensions based on: ${result.userSelectionPath}`;
        vscode.window.showInformationMessage(message);

        // Launch Git Extensions
        const { stdout, stderr } = await exec('gitextensions browse', { cwd: result.userSelectionPath });

        // Display error
        if (stderr && stderr.length > 0) {
            vscode.window.showErrorMessage(stderr);
        }

        // Display output
        if (stdout) {
            vscode.window.showInformationMessage(stdout);
        }
        return emptyTasks;
    }

    findUserSelectionPath(uri: vscode.Uri): { userSelectionPath: string; usedDefault: boolean } | undefined {
        let userSelectionPath: string = uri.fsPath || vscode.workspace.rootPath || '';
        const usedDefault = uri.fsPath ? false : true;

        // Logging some debug info no matter what
        console.log(`extension.forevolve.gitext.browse based on: ${userSelectionPath} | Used default: ${usedDefault}`);

        // If there is nothing to launch, return
        if (!userSelectionPath) {
            return;
        }

        // If its a file, strip the filename; gitext is expecting a directory
        if (uri.scheme === 'file') {
            userSelectionPath = this.trimPathToDirectory(userSelectionPath);
            console.log(`extension.forevolve.gitext.browse extracted directory: ${userSelectionPath}`);
        }

        return { userSelectionPath, usedDefault };
    }

    trimPathToDirectory(userSelectionPath: string): string {
        const indexWin = userSelectionPath.lastIndexOf('\\');
        const indexOthers = userSelectionPath.lastIndexOf('//');
        const index = Math.max(indexWin, indexOthers);
        const prefix = userSelectionPath.substr(0, index);
        const suffix = userSelectionPath.substr(index);
        // TODO: find a better file detection "algo"
        if (suffix.indexOf('.') > -1) {
            return prefix;
        }
        return userSelectionPath;
    }
}
