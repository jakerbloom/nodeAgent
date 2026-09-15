# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent
       @File     : test_agent_service.py
       @Author   : ymy
       @Date     : 2026/9/7 15:30
       @Desc     : 
=========================================================
"""

import pytest
import pytest_asyncio
from langgraph.graph.state import CompiledStateGraph

from p_agent_harness.agent import build_agent
from p_agent_harness.bootstrap import build_content
from p_agent_harness.configs.base_models import ChatRequest
from p_agent_harness.context import AppContext
from p_agent_harness.core.agent_runtime import AgentRuntime


@pytest.fixture(scope="module")
async def app_context() -> AppContext:
    return await build_content()


@pytest_asyncio.fixture(scope="module")
async def agent(app_context: AppContext) -> CompiledStateGraph:
    return await build_agent(app_context)


@pytest.mark.asyncio(loop_scope="session")
async def test_agent_service(agent: CompiledStateGraph, app_context: AppContext):
    run = AgentRuntime(agent, app_context)
    params = ChatRequest(user_id="03002693", thread_id="aaaaa",
                         message="我是谁，我喜欢干嘛，你知道吗")
    async for i in run.stream(params):
        print(i, flush=True)
