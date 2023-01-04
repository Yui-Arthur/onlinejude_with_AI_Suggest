import os
import random
import subprocess
import sys
from typing import Tuple
import shutil

# system arguments:

# ex /home/problem/A_question/
TITLE_ROOT = sys.argv[1]

# ex /home/uploadfiles/main.cpp
FILE_ROOT = sys.argv[2]

# UPLOAD_ROOT = "/home/uploadfiles/", FILE = "main.cpp"
UPLOAD_ROOT, FILE = os.path.split(FILE_ROOT)
UPLOAD_ROOT += '/'

# COMPILED_ROOT = "/home/uploadfiles/compiledfiles/"
COMPILED_ROOT = UPLOAD_ROOT + "/compiledfiles/"

# ERROR_MSG_ROOT = "/home/uploadfiles/errormessages/"
ERROR_MSG_ROOT = UPLOAD_ROOT + "/errormessagefiles/"

# FILENAME = "main", EXTENSION = "cpp"
FILENAME, EXTENSION = FILE.split('.')

# return value
AC = 0
COMPILE_ERROR = 1
RNTIME_ERROR = 2
TIME_LIMIT_ERROR = 3
WRONG_ANSWER = 4


def judgeOutput(answer: str, output: str) -> bool:
    return answer.split() == output.split()


def cppCompile() -> Tuple[int, str]:
    result = subprocess.run(
        ["g++", FILE_ROOT, "-o", COMPILED_ROOT + FILENAME], capture_output=True)
    return (result.returncode, result.stderr.decode())


def cppExecute() -> Tuple[int, str]:
    retcode = AC
    retmessage = ""
    problem_nums = os.listdir(TITLE_ROOT + "/input/")
    for problem_num in problem_nums:
        with open(TITLE_ROOT + "/input/" + problem_num, "r") as inputfile, open(TITLE_ROOT + "/answer/" + problem_num, "r") as answerfile:
            try:
                execute_result = subprocess.run(
                    [COMPILED_ROOT + FILENAME], capture_output=True, timeout=1, stdin=inputfile)
            except:  # catch timeout
                retcode = TIME_LIMIT_ERROR  # TLE
                break
            if execute_result.returncode:  # return code != 0  -> runtime error
                retcode = RNTIME_ERROR
                retmessage = execute_result.stderr.decode()
                break
            if not judgeOutput(answerfile.read(), execute_result.stdout.decode()):  # compare output
                retcode = WRONG_ANSWER
                break
    return (retcode, retmessage)


def cppJudge() -> Tuple[int, str]:

    statcode, error_message = cppCompile()
    if statcode or len(error_message):
        return (COMPILE_ERROR, error_message)
    ret = cppExecute()
    os.remove(COMPILED_ROOT + FILENAME)  # 刪除執行檔
    return ret


def adjustJavaFile():
    global FILE, FILENAME, FILE_ROOT
    filename = 'M' + str(random.randint(1, 999999))
    while(os.path.exists(COMPILED_ROOT + filename + '.java')):
        filename = random.randint(1, 999999)
    with open(FILE_ROOT, "r") as f:
        content = f.read()
    # 將內容修改
    content = content.replace("public class Main", "public class " + filename)
    # 將修改後的內容寫回 Java 檔
    with open(FILE_ROOT, "w") as f:
        f.write(content)
    FILENAME = str(filename)
    FILE = FILENAME + '.java'
    shutil.copyfile(FILE_ROOT, UPLOAD_ROOT + FILE)
    #os.rename(FILE_ROOT, UPLOAD_ROOT + FILE)
    FILE_ROOT = UPLOAD_ROOT + FILE


def readjustJavaFile():
    global FILE, FILENAME, FILE_ROOT
    with open(FILE_ROOT, "r") as f:
        content = f.read()
    content = content.replace("public class " + FILENAME, "public class Main")
    with open(FILE_ROOT, "w") as f:
        f.write(content)
    FILENAME = "Main"
    FILE = FILENAME + '.java'
    os.rename(FILE_ROOT, UPLOAD_ROOT + FILE)
    FILE_ROOT = UPLOAD_ROOT + FILE


def javaCompile() -> Tuple[int, str]:
    result = subprocess.run(
        ["javac", "-d", COMPILED_ROOT, FILE_ROOT], capture_output=True)
    return (result.returncode, result.stderr.decode())


def javaExecute() -> Tuple[int, str]:
    retcode = AC
    retmessage = ""
    problem_nums = os.listdir(TITLE_ROOT + "/input/")
    for problem_num in problem_nums:
        with open(TITLE_ROOT + "/input/" + problem_num, "r") as inputfile, open(TITLE_ROOT + "/answer/" + problem_num, "r") as answerfile:
            try:
                execute_result = subprocess.run(
                    ["java", "-cp", COMPILED_ROOT, FILENAME], capture_output=True, timeout=1, stdin=inputfile)
            except:  # catch timeout
                retcode = TIME_LIMIT_ERROR  # TLE
                break
            if execute_result.returncode:  # return code != 0  -> runtime error
                retcode = RNTIME_ERROR
                retmessage = execute_result.stderr.decode()
                break
            if not judgeOutput(execute_result.stdout.decode(), answerfile.read()):  # compare output
                retcode = WRONG_ANSWER
                break
    return (retcode, retmessage)


def javaJudge() -> Tuple[int, str]:
    adjustJavaFile()
    statcode, error_message = javaCompile()
    if statcode or len(error_message):
        return (COMPILE_ERROR, error_message)
    ret = javaExecute()
    os.remove(COMPILED_ROOT + FILENAME + ".class")  # 刪除執行檔
    return ret


def main() -> int:
    funcptr = {"c": cppJudge, "cpp": cppJudge, "java": javaJudge}
    statcode, error_message = funcptr[EXTENSION]()
    with open(ERROR_MSG_ROOT + FILENAME + ".txt", 'w') as file:
        file.write(error_message)
    if(EXTENSION == "java"):
        readjustJavaFile()
    return statcode


if __name__ == '__main__':

    #os._exit(main())
    print(main())
    sys.stdout.flush()