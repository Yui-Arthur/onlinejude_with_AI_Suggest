import argparse
import configparser
import os
from pyChatGPT import ChatGPT


verdict ={
  
    # compiler_error
    "1":"可以告訴我為什麼以下程式碼會編譯錯誤嘛?,語言是",
    # runtime_error
    "2":"可以告訴我為什麼以下程式碼在上述的問題中會出現runtime error嘛?,語言是",
    # time_limit
    "3":"可以告訴我下列程式碼在上述的問題中可能出現time limit的原因嘛?，語言是",
    # wrong_answer
    "4":"可以告訴我為什麼以下程式碼無法解決上述的問題嘛?,語言是"
    
}


def read_file(file_path):
  with open(file_path,"r") as f:
      data =f.read()
  return data 


def create_question_toChatGPT(problem,code,lang,judge_result):
  
  if judge_result:
    prompt = problem+"\n-----------------------\n"+verdict[str(judge_result)]+lang+"\n-----------------------\n"+code
  else :
    prompt = verdict[str(judge_result)]+lang+"\n-----------------------\n"+code
    
  
  prompt += "\n\n請用中文回答我"
  return prompt


def start_chatGPT(args,judge_result):
  
  

  question_filepath = args["question"]
  code_filepath = args["code"]
  config_filepath =args["session"]
  lang = args["lang"]
  # question filepath
  question_description_filepath= os.path.join(question_filepath,"./description.txt")
  
  # get file data
  problem = read_file(question_description_filepath)
  code = read_file(code_filepath)
  
  prompt = create_question_toChatGPT(problem,code,lang,judge_result)
  
  print(prompt)
  # get session token
  config = configparser.ConfigParser()
  config.read(config_filepath)
  session_token = config['session_token']['session_token']
  
  # start connect ChatGPT
  api = ChatGPT(session_token)
  
  rst_message = api.send_message(prompt)["message"]
  api.driver.close()
  print("\n\nreturn message")
  print(rst_message)
  
  with open(opt.save,"w") as f:
    f.write(rst_message)

def print_input_args(args):
  
  print("\n\n")
  for i in args:
    print(f"{i} : {args[i]}")
  print("\n\n")

def main(opt):
  
  args = vars(opt)
  print_input_args(args)
  
  judge_result = args["judge_rst"]
  #print("!!!!",flush=True)
  if judge_result :
    start_chatGPT(args,judge_result)

def parse_opt(known=False):
  
  
  parser =argparse.ArgumentParser()
  parser.add_argument("--judge_rst",type=str,default = 4,help="judge result")
  parser.add_argument("--question",type=str ,default="./question",help="question path")
  parser.add_argument("--session",type=str ,default="./config.ini",help="config.ini path")
  parser.add_argument("--code",type=str ,help = "the path of code file ")
  parser.add_argument("--lang",type=str,help = "you use programming language")
  parser.add_argument("--save",type=str,default="./chatgpt_rst_msg.txt",help = "the path that save the charGPT return message ")
  
  
  return parser.parse_known_args()[0] if known else parser.parse_args()

def run(**kwargs):
  opt=parse_opt(True)
  for k , v in kwargs.items():
      setattr(opt,k,v)
  main(opt)
  return opt
    
if __name__ == "__main__":
  opt = parse_opt()
  main(opt)

# python3 check_and_reply.py --judge_rst 4 --question /home/yi-cheng/Desktop/Judge_Code_Reply_with_ChatGPT/question/BuildingRoads --session /home/yi-cheng/Desktop/Judge_Code_Reply_with_ChatGPT/config.ini --lang c++
