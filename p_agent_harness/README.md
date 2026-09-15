#### 一、项目结构

```shell
my-agent/
├── agent.py                        # 模型和配置，组装agent

├── instructions.md                 # 使用说明和操作指南，提示、决定智能体的行为方式
├── skills/
│   └── <name>/
│       └── SKILL.md                # 代理在相关情况下会加载特定的操作指南来执行任务。

├── tools/                          # 执行的工具
├── middleware/

├── channels/                       # 与 Slack 等消息服务相连，能够启动相关操作并接收反馈信息。
│   └── <name>.py
├── connectors/                     # 为代理程序提供各种工具的远程 MCP 服务器。
│   └── mcp.py
├── schedules/                      # 这些经过管理的 cron 调度任务会定期运行该代理程序。
│   └── <name>.py
├── sandbox/                        # 一个用于运行由代理程序编写的代码的独立文件系统和外壳程序。
│   └── __init__.py
├── identity.py                     # 在多用户环境中，每个调用者都可以拥有独立的线程、内存和身份验证信息。
├── backends.py

├── pyproject.toml                  # Dependencies and secrets
├── .env

└── evals/                          # 用于测试智能体的各种任务。
    ├── harbor-job.json
    └── <task>/                     # Harbor task
        ├── Task.md
        ├── instruction.md
        ├── environment/
        └── tests/
```

