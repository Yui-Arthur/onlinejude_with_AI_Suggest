import os
import subprocess
import sys
from typing import Tuple

# system arguments
TITLE_ROOT = sys.argv[1]  # ex /home/problem/A_question/
FILE_ROOT = sys.argv[2]  # ex /home/uploadfiles/main.cpp

# UPLOAD_ROOT = "/home/uploadfiles", FILE = "main.cpp"
UPLOAD_ROOT, FILE = os.path.split(FILE_ROOT)

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
    os.remove(COMPILED_ROOT + FILENAME)  # 刪除執行檔
    return (retcode, retmessage)


def cppJudge() -> Tuple[int, str]:

    statcode, error_message = cppCompile()
    if statcode or len(error_message):
        return (COMPILE_ERROR, error_message)
    return cppExecute()


def javaCompile() -> Tuple[int, str]:
    result = subprocess.run(
        ["javac", "-d", COMPILED_ROOT, FILE_ROOT], capture_output=True)
    return (result.returncode, result.stderr.decode())


def javaExecute() -> Tuple[int, str]:
    retcode = AC
    retmessage = ""
    problem_nums = os.listdir(TITLE_ROOT + "./input/")
    for problem_num in problem_nums:
        with open(TITLE_ROOT + "/input/" + problem_num, "r") as inputfile, open(TITLE_ROOT + "/answer/" + problem_num, "r") as answerfile:
            try:
                execute_result = subprocess.run(
                    ["java", COMPILED_ROOT + FILENAME + ".class"], capture_output=True, timeout=1, stdin=inputfile)
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
    os.remove(COMPILED_ROOT + FILENAME + ".class")  # 刪除執行檔
    return (retcode, retmessage)


def javaJudge() -> Tuple[int, str]:
    statcode, error_message = javaCompile()
    if statcode or len(error_message):
        return (COMPILE_ERROR, error_message)
    return javaExecute()


def main() -> int:
    funcptr = {"c": cppJudge, "cpp": cppJudge, "java": javaJudge}
    statcode, error_message = funcptr[EXTENSION]()
    #print(os.getcwd())
    with open(ERROR_MSG_ROOT + FILENAME + ".txt", 'w') as file:
        file.write(error_message)
    return statcode


if __name__ == '__main__':
    #os._exit(main())
    print(main())
    sys.stdout.flush()