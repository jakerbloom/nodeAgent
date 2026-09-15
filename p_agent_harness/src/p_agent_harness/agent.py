# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent_harness
       @File     : agent.py
       @Author   : ymy
       @Date     : 2026/9/11 09:25
       @Desc     : 
=========================================================
"""

from deepagents import create_deep_agent

from p_agent_harness.configs.prompts import sys_prompt
from p_agent_harness.context import AppContext
from p_agent_harness.tools.online_tools import web_search_any, web_search_by_url


async def build_agent(ctx: AppContext):
    agent = create_deep_agent(
        model=ctx.model["deepseek-flash"],
        system_prompt=sys_prompt,
        memory=["/work_space/AGENTS.md"],
        skills=["/work_space/skills/"],
        tools=[web_search_any, web_search_by_url],
        backend=ctx.backend,
        store=ctx.store,
        checkpointer=ctx.saver
    )
    return agent
