from datetime import timedelta

from opensandbox import SandboxSync
from opensandbox.config.connection_sync import ConnectionConfigSync
from langchain_opensandbox import OpenSandboxBackend

# ========== 1. 连接配置 ==========
print("=" * 50)
print("[1/5] 配置连接...")
sandbox_connection = ConnectionConfigSync(
    domain="192.168.2.2:8080",
    protocol="http",
    use_server_proxy=True
)
print("  ✅ 连接配置完成")

# ========== 2. 创建沙箱 ==========
print("[2/5] 创建沙箱 (镜像: my-)...")
sandbox = SandboxSync.create(
    "sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/code-interpreter:v1.1.0",
    timeout=timedelta(seconds=300),
    connection_config=sandbox_connection,
)
print(f"  ✅ 沙箱创建成功! ID: {sandbox.id}")

# ========== 3. 初始化后端 ==========
print("[3/5] 初始化 OpenSandboxBackend...")
sandbox_backend = OpenSandboxBackend(
    sandbox=sandbox,
    timeout=300,
)
print("  ✅ 后端初始化完成")

# ========== 4. 执行简单命令 ==========
print("[4/5] 执行命令: echo 'Hello from sandbox!'")
try:
    result = sandbox.commands.run("echo 'Hello from sandbox!'")
    print(f"  ✅ 命令执行成功!")
    print(f"  📤 输出: {result}")
except Exception as e:
    print(f"  ❌ 命令执行失败: {e}")

# ========== 5. 执行 Python 代码 ==========
print("[5/5] 执行 Python 代码: print('1 + 1 =', 1 + 1)")
try:
    result = sandbox.commands.run("python --version")
    print(f"  ✅ Python 代码执行成功!")
    print(f"  📤 输出: {result}")
except Exception as e:
    print(f"  ❌ Python 代码执行失败: {e}")
sandbox.kill()


print("=" * 50)
print("🎉 全部测试完成!")

