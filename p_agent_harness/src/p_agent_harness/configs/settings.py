# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================    
       @File     : Settings
       @Author   : 老杨
       @Date     : 2026/6/29 14:19 
       @Desc     : 
=========================================================   
"""
import os
import sys
import tomllib
from pathlib import Path
from dotenv import load_dotenv


def get_resource_path(relative_path):
    if getattr(sys, 'frozen', False):
        base_path = Path(sys.executable).parent
    else:
        base_path = Path(__file__).parent.parent.parent.parent
    return os.path.join(base_path, relative_path)


load_dotenv(get_resource_path("./.env"), override=True)

config_path = get_resource_path("./settings.toml")

# 加载配置文件
with open(config_path, "rb") as f:
    config_data = tomllib.load(f)

# 日志及本地数据库路径
pro_dir_path = Path.home() / config_data["project"]["name"]
config_data["project"]["dir_path"] = Path.home() / config_data["project"]["name"]
config_data["log"]["file"]["log_file_path"] = pro_dir_path / 'logs' / 'p_logs_{time:YYYY-MM-DD}.log'
config_data["log"]["file"]["local_db_path"] = pro_dir_path / 'logs' / 'p_agent_harness.db'

# 是否是开发环境
IS_DEV = True

# 是否是初始化数据库
IS_INIT = False

# 搜索引擎的账号
ANY_SEARCH_KEY = os.getenv("ANY_SEARCH_KEY")

# 沙盒配置
SANDBOX_IP = os.getenv("SANDBOX_IP")
SANDBOX_PORT = os.getenv("SANDBOX_PORT")
SANDBOX_IMAGE_NAME = config_data["sandbox"]["image_name"]
