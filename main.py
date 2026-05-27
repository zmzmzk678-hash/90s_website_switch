import os

# 需要创建的空白文件列表（会自动创建对应的父级文件夹）
files = [
    "package.json",
    "tsconfig.json",
    "postcss.config.js",
    "tailwind.config.js",
    ".env.example",
    "Dockerfile",
    "README.md",
    "styles/globals.css",
    "types/index.ts",
    "utils/sanitizer.ts",
    "services/puppeteerService.ts",
    "agents/layoutAnalyzer.ts",
    "agents/htmlRewriter.ts",
    "app/layout.tsx",
    "app/page.tsx",
    "app/api/analyze/route.ts",
    "components/ControlPanel.tsx",
    "components/AgentStatus.tsx",
    "components/LivePreview.tsx",
    "components/OutputTabs.tsx"
]

print("========== 开始初始化项目目录骨架 ==========")
for file_path in files:
    # 自动提取并创建目录
    dir_name = os.path.dirname(file_path)
    if dir_name and not os.path.exists(dir_name):
        os.makedirs(dir_name)
        print(f"[创建目录] -> {dir_name}")

    # 创建空白文件
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("")
        print(f"[创建文件] -> {file_path}")

print("============================================")
print("空白项目结构已全部搭建完毕！")