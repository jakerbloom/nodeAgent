# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent
       @File     : context.py
       @Author   : ymy
       @Date     : 2026/9/3 13:45
       @Desc     : 
=========================================================
"""

from dataclasses import dataclass
from typing import TYPE_CHECKING, Dict

if TYPE_CHECKING:
    from loguru import Logger
    from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
    from langgraph.store.postgres import AsyncPostgresStore
    from psycopg_pool import AsyncConnectionPool
    from langchain.chat_models import BaseChatModel
    from deepagents.backends import CompositeBackend


@dataclass
class AppContext:
    logger: "Logger"
    db_conn_pool: "AsyncConnectionPool"
    model: Dict[str, "BaseChatModel"]
    saver: "AsyncPostgresSaver"
    store: "AsyncPostgresStore"
    backend: "CompositeBackend"
