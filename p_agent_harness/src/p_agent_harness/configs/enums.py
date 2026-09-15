# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent
       @File     : enums.py
       @Author   : ymy
       @Date     : 2026/9/8 14:02
       @Desc     : 
=========================================================
"""
from enum import Enum


class AgentEventType(str, Enum):
    # Run 生命周期
    RUN_STARTED = "run.started"
    RUN_COMPLETED = "run.completed"
    RUN_FAILED = "run.failed"
    RUN_CANCELLED = "run.cancelled"

    # 模型回复
    MESSAGE_COMPLETED = "message.completed"

    # 工具
    TOOL_CALL_STARTED = "tool_call.started"
    TOOL_CALL_COMPLETED = "tool_call.completed"
    TOOL_CALL_FAILED = "tool_call.failed"

    # 中断
    INTERRUPTED = "interrupt.created"
    RESUMED = "interrupt.resumed"

    # 状态
    STATE_UPDATED = "state.updated"

    # 其他
    ERROR = "error"
