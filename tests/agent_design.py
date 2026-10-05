from pathlib import Path

import pymupdf


# 1. 读取简历pdf
# 根据每个岗位需要创建对应的文件夹；
# 将候选人的简历pdf存至其中；

UPLOAD_DIR_NAME = './uploads/'
JOB_DIR_NAME = 'python'

UPLOAD_DIR = Path(UPLOAD_DIR_NAME + JOB_DIR_NAME)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def read_files(path: str):
    FILE_PATH = f"{UPLOAD_DIR}/{path}" 
    print(FILE_PATH)
    doc = pymupdf.open(FILE_PATH)
    text = ""
    for page in doc: # iterate the document pages
        text = page.get_text() # get plain text (is in UTF-8)
    print(text)

read_files('test.pdf')

# （阶段一）2. 岗位基本要求过滤
# 学位、技能、工作年限

# （阶段二）3. 经历（实习、工作、项目）

# （阶段二）4. 打分，rank，推给hr

# （阶段三）5. HR最终审核

# （阶段三）5. 列出待面试的候选人列表，即hr接下来要发出面试邀请和安排面试进程的TODO任务列表
