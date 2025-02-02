import os

class Config:
    API_KEY = os.getenv('API_KEY', 'sec_IogpAHJtfhdFFAnZoXd4y1W3BDGmlt84')  
    PROMPT_FILE_PATH = os.getenv('PROMPT_FILE_PATH', 'prompt.txt')  
