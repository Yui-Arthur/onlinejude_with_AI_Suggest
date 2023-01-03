var editor = ace.edit('editor');
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
	// editor.setTheme("ace/theme/cobalt");

	switch(Language){

		case "c":
			editor.getSession().setMode("ace/mode/c_cpp");
			editor.setValue(annotation + cSource);
			document.getElementById("c").style.backgroundColor="#ebdab4";
			document.getElementById("cpp").style.backgroundColor="#3c3836";
			document.getElementById("java").style.backgroundColor="#3c3836";
			break;

		case "cpp":
			editor.getSession().setMode("ace/mode/c_cpp");
			editor.setValue(annotation + cppSource);
			document.getElementById("c").style.backgroundColor="#3c3836";
			document.getElementById("cpp").style.backgroundColor="#ebdab4";
			document.getElementById("java").style.backgroundColor="#3c3836";
			break;

		case "java":
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

	const fs = require('fs')
      
    // Data which will write in a file.
    // var code = editor.getValue();
      
	let data = "Learning how to write in a file."
      
    // Write data in 'Output.txt' .
    fs.writeFile('Output.txt', data, (err) => {
          
        // In case of a error throw err.
        if (err) throw err;
    })

    // Write data in 'Output.txt' .
    // fs.writeFile('Output.txt', code, (err) => {
          
    //     // In case of a error throw err.
    //     if (err) throw err;
    // })
	//filename = {Problem}_{Language}
	

	// var FileSaver = require('file-saver');
	// var blob = new Blob([code], {type: "text/plain;charset=utf-8"});
	// //FileSaver.saveAs(blob, "dynamic.txt");
	// FileSaver.saveAs(blob, "/home/a10955psys/onlineJudge/uploadfiles/dynamic.txt");

	
	//var blob = new Blob([code], { type: "text/plain;charset=utf-8" });
	//saveAs(blob, "/home/a10955psys/onlineJudge/uploadfiles/dynamic.txt");
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
