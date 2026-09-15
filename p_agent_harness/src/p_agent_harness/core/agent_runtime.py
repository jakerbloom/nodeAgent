# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent_harness
       @File     : agent_runtime.py
       @Author   : ymy
       @Date     : 2026/9/11 11:19
       @Desc     : 
=========================================================
"""
from typing import AsyncIterator, Any

from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, BaseMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import Command, Interrupt

from p_agent_harness.configs.base_models import ChatRequest, CustomerContextStatus, ChatResumeRequest, \
    ChatResponseToolCall, ChatResponseToolResult, ChatResponseCommon, ChatInterruptEvent
from p_agent_harness.configs.enums import AgentEventType
from p_agent_harness.context import AppContext


class AgentRuntime:

    def __init__(self, agent: CompiledStateGraph, ctx: AppContext):
        self._agent: CompiledStateGraph = agent
        self._ctx: AppContext = ctx

    async def stream(self, request: ChatRequest) -> AsyncIterator[Any]:
        config: RunnableConfig = {"configurable": {"thread_id": request.thread_id}}
        context = CustomerContextStatus(user_id="03002693", ctx=self._ctx, thread_id=request.thread_id)
        hum_msg = {"messages": [HumanMessage(content=request.message)]}
        async for chunk in self._agent.astream(input=hum_msg, config=config, version="v2",
                                               stream_mode=["updates"], context=context):
            for source, update in chunk["data"].items():
                if source in ("model", "tools"):
                    data = self._render_completed_message(request.thread_id, request.user_id,
                                                          update["messages"][-1])
                    if data is not None:
                        yield data
                if source == "__interrupt__":
                    yield self._render_interrupt(request.thread_id, request.user_id, update[0])

    async def resume(self, request: ChatResumeRequest):
        config: RunnableConfig = {"configurable": {"thread_id": request.thread_id}}
        async for chunk in self._agent.astream(Command(resume=request.decisions), config=config, version="v2",
                                               stream_mode=["updates"]):
            for source, update in chunk["data"].items():
                if source in ("model", "tools"):
                    data = self._render_completed_message(request.thread_id, request.user_id, update["messages"][-1])
                    if data is not None:
                        yield data

    async def get_status(self, request: ChatRequest):
        config: RunnableConfig = {"configurable": {"thread_id": request.thread_id}}
        return await self._agent.aget_state(config=config)

    @staticmethod
    def _render_completed_message(thread_id: str, user_id: str, message: BaseMessage) -> Any:
        if isinstance(message, AIMessage) and message.tool_calls:
            tool_call_list = []
            for tool_call_info in message.tool_calls:
                tool_call_list.append({"tool_call_id": tool_call_info["id"], "tool_name": tool_call_info["name"],
                                       "tool_args": tool_call_info["args"]})
            return ChatResponseToolCall(event_type=AgentEventType.TOOL_CALL_STARTED, thread_id=thread_id,
                                        user_id=user_id, run_id=message.id,
                                        tool_infos=tool_call_list,
                                        content=message.content)
        if isinstance(message, ToolMessage):
            return ChatResponseToolResult(event_type=AgentEventType.TOOL_CALL_COMPLETED, content=message.content,
                                          thread_id=thread_id, user_id=user_id, run_id=message.id,
                                          tool_name=message.name, tool_call_id=message.tool_call_id,
                                          tool_response=message.content)
        if isinstance(message, AIMessage):
            return ChatResponseCommon(event_type=AgentEventType.MESSAGE_COMPLETED, content=message.content,
                                      thread_id=thread_id, user_id=user_id, run_id=message.id)
        return None

    @staticmethod
    def _render_interrupt(thread_id: str, user_id: str, interrupt: Interrupt) -> Any:
        val = interrupt.value
        return ChatInterruptEvent(event_type=AgentEventType.INTERRUPTED, thread_id=thread_id, user_id=user_id,
                                  run_id=interrupt.id, interrupt_id=interrupt.id, decisions=val["decisions"],
                                  tool_name=val["tool_name"], approve_command=val["approve_command"],
                                  tool_args=val["tool_args"])
