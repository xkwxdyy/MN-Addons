import os
import re
import subprocess
import shutil
import filecmp
import zipfile

# 列出当前目录下所有的 .mnaddon 文件
addon_files = [f for f in os.listdir('.') if os.path.isfile(f) and f.endswith('.mnaddon')]

# 定义正则表达式来匹配文件名格式
pattern = r"mnutils_v(\d+)_(\d+)_(\d+)(?:_alpha(\d+))?\.mnaddon"

max_x = max_y = max_z = -1
target_addon = None

for addon_file in addon_files:
    match = re.match(pattern, addon_file)
    if match:
        x = int(match.group(1))
        y = int(match.group(2))
        z = int(match.group(3))
        w = int(match.group(4)) if match.group(4) else None

        is_alpha = w is not None  # 是否是 alpha 版本

        if (x > max_x or 
            (x == max_x and y > max_y) or 
            (x == max_x and y == max_y and z > max_z) or 
            (x == max_x and y == max_y and z == max_z and 
             (is_alpha and (target_addon is None or not re.search(r"alpha", target_addon) or 
             (re.search(r"alpha(\d+)", target_addon) and w > int(re.search(r"alpha(\d+)", target_addon).group(1))))))):
            
            max_x, max_y, max_z = x, y, z
            target_addon = addon_file
            
new_addon_name = target_addon.replace('.mnaddon', '')

# 将找到的目标插件赋值给 target_addon
if target_addon is not None:
    target_addon = os.path.join(os.getcwd(), target_addon)
    newVersion_path = target_addon.replace('.mnaddon', '')
    print(f"目标插件：{target_addon}\n目标目录：{newVersion_path}")
else:
    print("未找到符合条件的插件文件")
    exit()

# 旧版本地址
oldVersion_path = os.path.join(os.getcwd(), 'mnutils')

# 调试信息
print(f"正在解压文件：{target_addon}")

# 检查是否需要解压，存在时是否强制覆盖（这里没有覆盖检查）
if os.path.exists(newVersion_path) and os.path.isdir(newVersion_path):
    shutil.rmtree(newVersion_path)

# 执行命令行命令：mnaddon unpack target_addon
try:
    command = f"mnaddon unpack {target_addon}"
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"解压失败：{result.stderr}")
        exit()
    print("解压成功")
except subprocess.CalledProcessError as e:
    print(f"解压失败：{e}")
    exit()

# 检查新解压目录是否存在
if not os.path.isdir(newVersion_path):
    print(f"解压目录 {newVersion_path} 不存在")
    exit()

# 将 newVersion_path 中的 .js 文件和 .html 文件复制到 oldVersion_path 中 
for file in os.listdir(newVersion_path):
    if file.endswith('.js') or file.endswith('.html') or file.endswith('.json') or file.endswith('.css') or file.endswith('.png') or file.endswith('.svg') or file.endswith('.jpg') or file.endswith('.jpeg') or file.endswith('.png'):
        new_file = os.path.join(newVersion_path, file)
        old_file = os.path.join(oldVersion_path, file)
        if os.path.exists(old_file):
            if filecmp.cmp(new_file, old_file):
                print(f"{file} 未发生变化，跳过")
                continue
        print(f"复制文件：{new_file} -> {old_file}")
        shutil.copy(new_file, old_file)

# 调试信息
print("更新完成")

# 自动修改 main.js 文件，添加 JSB.require("xdyyutils") 
main_js_path = os.path.join(oldVersion_path, 'main.js')  # 使用 os.path.join 拼接出 main.js 的绝对/相对路径，确保跨平台路径正确
if os.path.exists(main_js_path):  # 判断 main.js 文件是否真实存在，避免后续读写报错
    print("正在修改 main.js 以加载 xdyyutils.js...")  # 提示当前正在进行的操作，方便用户知晓进度
    
    with open(main_js_path, 'r', encoding='utf-8') as f:  # 以只读方式打开 main.js，并指定 UTF-8 编码，避免中文或特殊字符乱码
        content = f.read()  # 一次性读取整个文件内容到内存中，后续基于字符串做正则替换
    
    # 使用正则表达式查找并替换 JSB.require("mnutils") 调用
    # 匹配模式：JSB.require("mnutils"),MNUtil.init(t) 或类似的调用
    pattern = r'(JSB\.require\("mnutils"\)(?:,\s*JSB\.require\("xdyyutils"\))?)(,\s*MNUtil\.init\([^)]*\))'  # 分组1匹配 JSB.require("mnutils") 以及可能已存在的 xdyyutils 引用；分组2匹配紧随其后的 MNUtil.init(...) 调用
    replacement = r'JSB.require("mnutils"),JSB.require("xdyyutils")\2'  # 在分组1后面强制插入 JSB.require("xdyyutils")，并保留原分组2（即 MNUtil.init(...)）
    
    modified_content = re.sub(pattern, replacement, content)  # 执行第一次替换：确保引入 xdyyutils
    
    # 新增功能：在 static checkSubscribed(t=!0,e=!1,i=!0){ 的后面插入 return true;
    # 说明：
    # 1) 使用分组把函数头部（含 {）捕获为分组1
    # 2) (?!return true;) 是负向前瞻，保证只有在 { 后面“没有”紧跟 return true; 时才插入，避免重复插入
    func_pattern = r'(static\s+checkSubscribed\(t=!0,e=!1,i=!0\)\{)(?!return true;)'  # 精确匹配函数签名与 {，允许 static 与函数名之间有空白
    func_replacement = r'\1return true;'  # 在捕获的 { 后面立刻拼接 return true; 达到“{return true;”的效果
    modified_content = re.sub(func_pattern, func_replacement, modified_content)  # 执行第二次替换：给函数强制返回 true
    
    # 检查是否成功修改（任意一处替换都会导致内容变化）
    if modified_content != content:  # 如果替换后的内容和原内容不同，说明至少有一处被成功修改
        with open(main_js_path, 'w', encoding='utf-8') as f:  # 以写入模式重新打开 main.js，覆盖写入修改后的内容
            f.write(modified_content)  # 将修改后的文本内容写回文件，完成落盘
        print("✅ 已成功添加 JSB.require(\"xdyyutils\") 到 main.js")  # 打印成功提示（此处保持原有提示文案，表示修改已生效）
    else:
        print("❌ 未找到匹配的 JSB.require(\"mnutils\") 模式，可能需要手动添加")  # 如果两处替换都没有发生，统一提示可能需要手动处理
else:
    print("❌ main.js 文件不存在")  # 如果路径不存在，提示用户检查路径与文件是否存在

# 输出 newVersion_path 中 oldVersion_path 没有的文件
old_files = set(os.listdir(oldVersion_path))
new_files = set(os.listdir(newVersion_path))

extra_files = new_files - old_files

if not extra_files:
    print("没有新文件")
    shutil.rmtree(newVersion_path)
    