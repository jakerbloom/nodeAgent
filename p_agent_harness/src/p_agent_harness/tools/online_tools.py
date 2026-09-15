# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================
       @Pro      : p_agent
       @File     : online_tools.py
       @Author   : ymy
       @Date     : 2026/9/8 13:32
       @Desc     : 
=========================================================
"""
import os
from typing import Annotated, Dict, Literal

import httpx
from langchain_core.tools import tool
from pydantic import Field

from p_agent_harness.configs.settings import ANY_SEARCH_KEY

HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {ANY_SEARCH_KEY}'
}


@tool(parse_docstring=True)
async def web_search_any(query: Annotated[str, Field(description="需要查询的内容")],
                         return_format: Annotated[
                             Literal['json', 'markdown'], Field(
                                 description="输出格式，取值为 json 或 markdown")] = "json") -> Dict:
    """联网搜索工具

    Args:
        query: 需要查询的内容
        return_format: 输出格式，取值为 json 或 markdown

    Returns:
        Dict: key为code，msg, data,如果code为0，代表查询失败。
    """
    params = {
        "query": query,
        "max_results": 10,
        "zone": "cn",
        "language": "zh-CN",
        "format": return_format
    }
    async with httpx.AsyncClient(headers=HEADERS) as client:
        response = await client.post("https://api.anysearch.com/v1/search", json=params)
        data = response.json()
        if data['code'] == -1:
            return {"code": 0, "msg": data["message"], "data": None}
        return {"code": 1, "msg": "查询成功", "data": data["data"]["results"]}


@tool(parse_docstring=True)
async def web_search_by_url(url: Annotated[str, Field(description="需要查询的网址")]) -> Dict:
    """联网搜索工具

    Args:
        url: 需要查询的网址

    Returns:
        Dict: key为url（调用方提交的原始 URL。），title（页面标题；没有标题时为空字符串）, content（提取后的正文内容。）
    """
    async with httpx.AsyncClient(headers=HEADERS) as client:
        response = await client.post("https://api.anysearch.com/v1/extract", json={"url": url})
        data = response.json()
        if data['code'] == -1:
            return {"code": 0, "msg": "查询失败", "data": data}
        return {"code": 1, "msg": "查询成功", "data": data}


@tool(parse_docstring=True)
def get_weather(city: Annotated[str, Field(description="城市的名字")]) -> str:
    """ 根据城市获取天气情况

    Args:
        city: 城市的名称，例如南京，北京

    Returns:
        str: 该城市天气的情况
    """
    return f"{city}的天气非常的好"
