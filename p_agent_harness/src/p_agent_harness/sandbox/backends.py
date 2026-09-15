# ! /usr/bin/env/python3
# -*- coding=utf-8 -*-
"""
======================模块功能描述=========================    
       @File     : memory
       @Author   : 老杨
       @Date     : 2026/9/12 22:39 
       @Desc     : 
=========================================================   
"""
from datetime import timedelta
from typing import Dict

from deepagents.backends import StoreBackend, CompositeBackend, FilesystemBackend
from deepagents.backends.sandbox import BaseSandbox
from langchain_opensandbox import OpenSandboxBackend
from opensandbox import SandboxSync
from opensandbox.config.connection_sync import ConnectionConfigSync

from p_agent_harness.configs.settings import get_resource_path


def build_open_sandbox_backend(ip_addr: str, port: int, image_name: str) -> BaseSandbox:
    sandbox_connection = ConnectionConfigSync(
        domain=f"{ip_addr}:{port}",
        protocol="http",
        use_server_proxy=True
    )
    sandbox = SandboxSync.create(
        image=image_name,
        timeout=timedelta(seconds=300),
        connection_config=sandbox_connection,
    )
    return OpenSandboxBackend(
        sandbox=sandbox,
        timeout=300,
    )


def build_store_routes() -> Dict[str, StoreBackend]:
    root_dir_path = get_resource_path("work_space")
    routes = {
        "/work_space/": FilesystemBackend(root_dir=root_dir_path, virtual_mode=True),
        "/memories/session/": StoreBackend(
            namespace=lambda rt: ("session", rt.context.user_id, rt.context.thread_id,)
        ),
        "/memories/user/": StoreBackend(
            namespace=lambda rt: ("user", rt.context.user_id,)
        ),
    }
    return routes


def build_composite_backend(ip_addr: str, port: int, image_name: str) -> CompositeBackend:
    sandbox = build_open_sandbox_backend(ip_addr, port, image_name)
    store_routes = build_store_routes()
    return CompositeBackend(
        default=sandbox,
        routes=store_routes
    )
