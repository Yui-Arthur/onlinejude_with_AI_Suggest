import argparse
import os
import subprocess
import sys
from typing import Tuple

# system arguments
TITLE = sys.argv[1]
FILENAME, EXTENSION = sys.argv[2].split('.')
EXTENSION = '.' + EXTENSION
#ROOT = sys.argv[3] if len(sys.argv) > 3 else r"/home/a10955psys/onlineJudge"

# return value
AC = 0
COMPILE_ERROR = 1
RNTIME_ERROR = 2
TIME_LIMIT_ERROR = 3
WRONG_ANSWER = 4

os.chdir(ROOT)  # 設定當前目錄


def judgeOutput(answer: str, output: str) -> bool:
    output = output.replace(" \n", "\n")
    if output[-2:] == "\n\n":
        output.pop()
    return answer == output


def cppCompile() -> Tuple[int, str]:
    result = subprocess.run(
        ["g++", "./uploadfiles/" + FILENAME + EXTENSION, "-o", "./compiledfiles/" + FILENAME], capture_output=True)
    return (result.returncode, result.stderr.decode())


def cppExecute() -> Tuple[int, str]:
    retcode = AC
    retmessage = ""
    problem_nums = os.listdir(TITLE + "/input/")
    for problem_num in problem_nums:
        with open(TITLE + "/input/" + problem_num, "r") as inputfile, open(TITLE + "/answer/" + problem_num, "r") as answerfile:
            try:
                execute_result = subprocess.run(
                    ["./compiledfiles/" + FILENAME], capture_output=True, timeout=1, stdin=inputfile)
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
    os.remove("./compiledfiles/" + FILENAME)  # 刪除執行檔
    return (retcode, retmessage)


def cppJudge() -> Tuple[int, str]:

    statcode, error_message = cppCompile()
    if statcode or len(error_message):
        return (COMPILE_ERROR, error_message)
    return cppExecute()


def javaCompile() -> Tuple[int, str]:
    result = subprocess.run(
        ["javac", "./uploadfiles/" + FILENAME], capture_output=True)
    return (result.returncode, result.stderr.decode())


def javaExecute() -> Tuple[int, str]:
    retcode = AC
    retmessage = ""
    problem_nums = os.listdir(TITLE + "./input/")
    for problem_num in problem_nums:
        with open(TITLE + "/input/" + problem_num, "r") as inputfile, open(TITLE + "/answer/" + problem_num, "r") as answerfile:
            try:
                execute_result = subprocess.run(
                    ["java", "./compiledfiles/" + FILENAME + ".class"], capture_output=True, timeout=1, stdin=inputfile)
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
    os.remove("./compiledfiles/" + FILENAME + ".class")  # 刪除執行檔
    return (retcode, retmessage)


def javaJudge() -> Tuple[int, str]:
    statcode, error_message = javaCompile()
    if statcode or len(error_message):
        return (COMPILE_ERROR, error_message)
    return javaExecute()


def main() -> int:
    funcptr = {".c": cppJudge, ".cpp": cppJudge, ".java": javaJudge}
    statcode, error_message = funcptr[EXTENSION]()
    print(os.getcwd())
    with open("./errormessagefiles/" + FILENAME + "_ERROR.txt", 'w') as file:
        file.write(error_message)
    return statcode


if __name__ == '__main__':
    os._exit(main())
