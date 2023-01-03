var editor = ace.edit('editor');
var code_language = "c";
editor.setAutoScrollEditorIntoView(true);
editor.setTheme("ace/theme/gruvbox");
editor.getSession().setMode("ace/mode/java");
const annotation = "\
/* \n\
 * Author 		: Pinpunyu , YuiArthur , A1095551 , A1095552\n\
 * Project Name : Online Judge with AI suggest\n\
 */\n\n";

const cSource = "\
#include <stdio.h>\n\
\n\
int main(void) {\n\
    printf(\"Hello World!\\n\");\n\
    return 0;\n\
}\n\
";

const cppSource = "\
#include <iostream>\n\
\n\
int main() {\n\
    std::cout << \"Hello World!\" << std::endl;\n\
    return 0;\n\
}\n\
";

const javaSource = "\
public class Main {\n\
    public static void main(String[] args) {\n\
        System.out.println(\"Hello World!\");\n\
    }\n\
}\n\
";



function setLanguage(Language) {
	switch(Language){

		case "c":
			code_language = "c";
			editor.getSession().setMode("ace/mode/c_cpp");
			editor.setValue(annotation + cSource);
			document.getElementById("c").style.backgroundColor="#ebdab4";
			document.getElementById("cpp").style.backgroundColor="#3c3836";
			document.getElementById("java").style.backgroundColor="#3c3836";
			break;

		case "cpp":
			code_language = "cpp";
			editor.getSession().setMode("ace/mode/c_cpp");
			editor.setValue(annotation + cppSource);
			document.getElementById("c").style.backgroundColor="#3c3836";
			document.getElementById("cpp").style.backgroundColor="#ebdab4";
			document.getElementById("java").style.backgroundColor="#3c3836";
			break;

		case "java":
			code_language = "java";
			editor.getSession().setMode("ace/mode/java");
			editor.setValue(annotation + javaSource);
			document.getElementById("c").style.backgroundColor="#3c3836";
			document.getElementById("cpp").style.backgroundColor="#3c3836";
			document.getElementById("java").style.backgroundColor="#ebdab4";
			break;
	}
} 

function selectTextFile(files) {

	var filename = document.getElementById('formFileLg').files.item(0).name;
	setLanguage(filename.split('.')[1]);

    if (!files.length) {
        return false;
    }
    
    let file    = files[0];
    let reader = new FileReader();
    reader.onload = function () {
		editor.setValue(this.result);
    };
    
    reader.readAsText(file);
}

function saveDynamicDataToFile() {
	//filename = {Problem}_{Language}
	var Problemname = document.getElementById("promble").value;
	var codefilename = Problemname+'.'+code_language;

	var code = editor.getValue();
	var formData = new FormData();
	const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
	formData.append('filetoupload', blob, codefilename);
	//xhr.send(formData);

	const request = new XMLHttpRequest();
	request.open('POST', './fileupload');
	request.send(formData);
}


setLanguage("c");
/*
	'dracula' => 'Dracula',
	'gruvbox' => 'Gruvbox',讚
	'idle_fingers' => 'idle Fingers',一般的



let editor = document.querySelector("#editor");


ace.edit(editor, {
  theme: "ace/theme/cobalt",
  mode: "ace/mode/python",
});



*/
// C or C++ : c_cpp
// Java : java
// Python : python
