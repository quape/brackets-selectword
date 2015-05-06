/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function (require, exports, module) {
    "use strict";
    
    var AppInit             = brackets.getModule("utils/AppInit"),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        KeyEvent            = brackets.getModule("utils/KeyEvent"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus");

    function handleMe(editor) {
        if(!editor) editor = EditorManager.getFocusedEditor();
        
        var pos 			= editor.getCursorPos();
        var document    	= editor.document;
        var linePartBefore 	= document.getLine(pos.line).substr(0,pos.ch);

        var reverse 		= reverse_str(linePartBefore);
        var noword_regex = /[^a-z_$]/i;
        var match 		 = noword_regex.exec(reverse);
        var word_start = match ? pos.ch - match.index : 0; // 0: first word in a line

        var linePartAfter = document.getLine(pos.line).substr(pos.ch);
        var match_end = noword_regex.exec(linePartAfter);
        var word_end = pos.ch + match_end.index;

        editor.setSelection({line: pos.line, ch: word_start}, {line: pos.line, ch: word_end});
    }

    var keyEventHandler = function ($event, editor, event) {
        if(event.type == "keydown" && event.ctrlKey && event.keyCode == 89) { // y
            handleMe(editor);
        }
    }

    var reverse_str = function(s) {
        return s.split("").reverse().join("");
    }
	
    var activeEditorChangeHandler = function ($event, focusedEditor, lostEditor) {
        if(lostEditor) $(lostEditor).off("keyEvent", keyEventHandler);
        if(focusedEditor) $(focusedEditor).on("keyEvent", keyEventHandler);
    };
    
    var MY_COMMAND_ID = "quape.selectword";
    CommandManager.register("Select World", MY_COMMAND_ID, handleMe);
    
//    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
//    menu.addMenuItem(MY_COMMAND_ID);

    AppInit.appReady(function () {
        var currentEditor = EditorManager.getCurrentFullEditor();
       
        $(currentEditor).on('keyEvent', keyEventHandler);
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });
});