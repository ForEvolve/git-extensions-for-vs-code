//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as vscode from 'vscode';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension', function() {
    const context = {} as vscode.ExtensionContext;
    suite('activate', function() {
        test('Should register the "extension.forevolve.gitext.browse" command', async function(done) {
            // TODO: fix this test
            myExtension.activate(context);
            vscode.commands.getCommands().then(x => {
                console.log(x);
                var cmd = x.find(c => c === 'extension.forevolve.gitext.browse');
                assert.notEqual(cmd, undefined);
                done();
            });
        });
    });
});
