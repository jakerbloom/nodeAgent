# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent
       @File     : bootstrap.py
       @Author   : ymy
       @Date     : 2026/9/3 13:45
       @Desc     : 
=========================================================
"""
import asyncio
from typing import TYPE_CHECKING, Dict

import httpx
from deepagents.backends.utils import create_file_data
from langchain.chat_models import init_chat_model
from langchain_core.language_models.chat_models import BaseChatModel
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.store.postgres import AsyncPostgresStore
from loguru import logger as _root_logger
from psycopg.rows import dict_row
from psycopg_pool import AsyncConnectionPool

from p_agent_harness.configs.settings import *
from p_agent_harness.context import AppContext
from p_agent_harness.sandbox.backends import build_composite_backend

if TYPE_CHECKING:
    from loguru import Logger

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


def _init_logging() -> "Logger":
    _root_logger.remove()

    if config_data["log"]["console"]["log_console_enable"]:
        _root_logger.add(
            sys.stderr,
            level=config_data["log"]["console"]["log_console_level"],
            format=config_data["log"]["console"]["log_format"],
            colorize=config_data["log"]["console"]["log_console_colorize"],
            backtrace=config_data["log"]["console"]["log_console_backtrace"],
            diagnose=config_data["log"]["console"]["log_console_diagnose"]
        )

    if config_data["log"]["file"]["log_file_enable"]:
        _root_logger.add(
            config_data["log"]["file"]["log_file_path"],
            format=config_data["log"]["console"]["log_format"],
            level=config_data["log"]["file"]["log_file_level"],
            rotation=config_data["log"]["file"]["log_file_rotation"],
            encoding=config_data["log"]["file"]["log_file_encoding"],
            retention=config_data["log"]["file"]["log_file_retention"],
            backtrace=config_data["log"]["file"]["log_file_backtrace"],
            diagnose=config_data["log"]["file"]["log_file_diagnose"]
        )
    return _root_logger


async def _init_model_pool(log: "Logger") -> Dict[str, BaseChatModel]:
    log.info("正在进行model的初始化！！！")
    url = os.getenv("DEEP_BASE_URL") + "/models"
    api_key = os.getenv("DEEP_API_KEY")
    headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    model_pool = {}
    model_name = ""
    async with httpx.AsyncClient(headers=headers) as client:
        response = await client.get(url)
        model_list: Dict = response.json()
        for model in model_list["data"]:
            model_name += model["id"] + ","
            model_pool[model["id"]] = init_chat_model(
                model_provider="openai",
                model=model["id"],
                api_key=api_key,
                base_url=os.getenv("DEEP_BASE_URL"),
                temperature=config_data["agent"]["temperature"],
                max_tokens=config_data["agent"]["max_tokens"],
                extra_body={"thinking": {"type": "enabled"}}
            )
    log.info(f"已完成model初始化，模型名称包含{model_name}")
    return model_pool


async def _init_postgresql_conn(log: "Logger") -> AsyncConnectionPool:
    db_user = os.getenv("POSTGRESQL_DB_USER")
    db_pwd = os.getenv("POSTGRESQL_DB_PWD")
    db_url = os.getenv("POSTGRESQL_DB_URL")
    db_port = os.getenv("POSTGRESQL_DB_PORT")
    db_name = os.getenv("POSTGRESQL_DB_NAME")
    log.info(f"初始化postgresql,db_url:{db_url},db_port:{db_port},db_name:{db_name}")
    post_gre_sql = f"postgresql://{db_user}:{db_pwd}@{db_url}:{db_port}/{db_name}?sslmode=disable"
    pool = AsyncConnectionPool(
        conninfo=post_gre_sql,
        min_size=1,
        max_size=10,
        max_idle=300.0,
        max_lifetime=1800,
        timeout=10,
        open=False,
        kwargs={
            "autocommit": True,  # 解决 setup() 报错的关键
            "row_factory": dict_row,  # LangGraph 要求的行工厂
            "prepare_threshold": 0,  # 禁用预编译语句，避免事务块问题
            "connect_timeout": 5
        }
    )
    await pool.open(wait=True, timeout=15)
    return pool


async def __init_store_data(store: AsyncPostgresStore):
    pass



async def build_content() -> AppContext:
    logger = _init_logging()
    model = await _init_model_pool(logger)
    conn = await _init_postgresql_conn(logger)
    saver = AsyncPostgresSaver(conn)
    store = AsyncPostgresStore(conn)
    if IS_INIT:
        await store.setup()
        await saver.setup()
    await __init_store_data(store)
    backend = build_composite_backend(SANDBOX_IP, SANDBOX_PORT, SANDBOX_IMAGE_NAME)
    ctx = AppContext(logger=logger, model=model, db_conn_pool=conn, saver=saver, store=store, backend=backend)
    logger.info("上下文类已创建！！！")
    return ctx
