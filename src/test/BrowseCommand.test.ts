//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as vscode from 'vscode';

import * as sinon from 'sinon';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
import { BrowseCommand } from '../BrowseCommand';

// Defines a Mocha test suite to group tests of similar kind together
suite('BrowseCommand', function() {
    var browseCommand = new BrowseCommand();
    suite('executeAsync', function() {
        // test('Should register the "extension.forevolve.gitext.browse" command', async function(done) {
        //     // TODO: fix this test
        //     myExtension.activate(context);
        //     vscode.commands.getCommands().then(x => {
        //         console.log(x);
        //         var cmd = x.find(c => c === 'extension.forevolve.gitext.browse');
        //         assert.notEqual(cmd, undefined);
        //         done();
        //     });
        // });
    });

    suite('findUserSelectionPath', function() {
        test('should return the "uri.fsPath" when there is one and not "usedDefault"', function() {
            const uri = vscode.Uri.file('c:\\some-dir');
            const result = browseCommand.findUserSelectionPath(uri) as { userSelectionPath: string; usedDefault: boolean };
            assert.notEqual(result, undefined);
            assert.equal(result.userSelectionPath, 'c:\\some-dir');
            assert.equal(result.usedDefault, false);
        });
        test('should return the "vscode.workspace.rootPath" when there is no "uri.fsPath" and "usedDefault"', function() {
            sinon.stub(vscode.workspace, 'rootPath').get(() => 'some-test-value');
            const result = browseCommand.findUserSelectionPath({} as vscode.Uri) as { userSelectionPath: string; usedDefault: boolean };
            assert.notEqual(result, undefined);
            assert.equal(result.userSelectionPath, 'some-test-value');
            assert.equal(result.usedDefault, true);
        });
        test('should return the "uri.fsPath" and strip out the file name', function() {
            const uri = vscode.Uri.file('c:\\some-dir\\some-file.ext');
            const result = browseCommand.findUserSelectionPath(uri) as { userSelectionPath: string; usedDefault: boolean };
            assert.notEqual(result, undefined);
            assert.equal(result.userSelectionPath, 'c:\\some-dir');
        });
    });
});
