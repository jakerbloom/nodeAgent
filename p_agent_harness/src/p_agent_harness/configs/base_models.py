# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent_harness
       @File     : base_models.py
       @Author   : ymy
       @Date     : 2026/9/11 10:15
       @Desc     : 
=========================================================
"""
from typing import Any, List, TypedDict, Optional, Dict

from pydantic import BaseModel


class CustomerContextStatus(BaseModel):
    user_id: str = None
    thread_id: str = None
    ctx: Any = None


class WebMsgReturn(BaseModel):
    code: int
    msg: str
    data: Any = None


class ChatRequest(BaseModel):
    user_id: str
    message: str
    thread_id: str


class ChatResumeRequest(BaseModel):
    user_id: str
    decisions: List[Any]
    thread_id: str


class InterruptInfo(TypedDict):
    decisions: str
    tool_args: Optional[Dict[str, Any]]
    tool_name: str
    approve_command: List[str]


class ChatResponseCommon(BaseModel):
    content: Any = None  # 消息内容
    thread_id: str  # 会话id
    user_id: str  # 用户id
    run_id: str  # 执行id


class ChatResponseToolResult(ChatResponseCommon):
    tool_name: str
    tool_call_id: str
    tool_response: Any


class ChatResponseToolCall(ChatResponseCommon):
    tool_infos: List[Dict]  # 可能有多个工具需要调用


# 中断消息的模型类
class ChatInterruptEvent(ChatResponseCommon):
    interrupt_id: Optional[str]
    decisions: str
    tool_args: Optional[Dict[str, Any]]
    tool_name: str
    approve_command: List[str]
