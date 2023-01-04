import argparse
import configparser
import os
import sys
from pyChatGPT import ChatGPT


config = configparser.ConfigParser()
config.read("./src/models/chatGPT/config.ini")
session_token = config['session_token']['session_token']

api = ChatGPT(session_token)

rst_message = api.send_message("Hello")["message"]
api.driver.close()
print("\n\nreturn message")
print(rst_message)
sys.stdout. flush() 