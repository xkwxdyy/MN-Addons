# Git 仓库迁移指南

## 背景
- mntoolbar 和 mnutils 原本是独立的 Git 仓库
- 现在要整合到 MN-Addon 主项目中
- 需要保留所有提交历史

## 推荐方案：Subtree + 归档

### 步骤 1：备份
```bash
cd /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop
cp -r MN-Addon MN-Addon-backup-$(date +%Y%m%d)
```

### 步骤 2：处理未提交的修改
```bash
# 在 mntoolbar 中
cd MN-Addon/mntoolbar
git add .
git commit -m "Save work before merging"
git push origin dev
```

### 步骤 3：准备主仓库
```bash
cd /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon

# 临时移动子目录
mv mntoolbar ../mntoolbar-temp
mv mnutils ../mnutils-temp

# 提交当前状态
git add .
git commit -m "Prepare for subtree merge"
```

### 步骤 4：使用 subtree 合并
```bash
# 合并 mntoolbar
git subtree add --prefix=mntoolbar ../mntoolbar-temp dev

# 合并 mnutils  
git subtree add --prefix=mnutils ../mnutils-temp dev
```

### 步骤 5：推送到 GitHub
```bash
# 创建新的 GitHub 仓库 MN-Addon
git remote add origin https://github.com/your-username/MN-Addon.git
git push -u origin main
```

### 步骤 6：处理原仓库
在原来的 mntoolbar 和 mnutils 仓库中：

1. 更新 README.md：
```markdown
# ⚠️ Project Moved / 项目已迁移

This project has been moved to [MN-Addon](https://github.com/your-username/MN-Addon).

此项目已迁移至 [MN-Addon](https://github.com/your-username/MN-Addon) 主仓库。

## New Structure / 新结构
```
MN-Addon/
├── mntoolbar/    # 工具栏插件
├── mnutils/      # 核心框架
└── docs/         # 文档
```

Please visit the new repository for latest updates.
请访问新仓库获取最新更新。
```

2. 在 GitHub Settings 中将仓库设为 Archive

### 步骤 7：清理
```bash
# 删除临时目录
rm -rf ../mntoolbar-temp ../mnutils-temp
```

## 后续维护

### 如果需要单独更新子项目
```bash
# 设置远程仓库（一次性）
git remote add mntoolbar-remote https://github.com/your-username/mntoolbar.git
git remote add mnutils-remote https://github.com/your-username/mnutils.git

# 推送更新到子项目
git subtree push --prefix=mntoolbar mntoolbar-remote main
git subtree push --prefix=mnutils mnutils-remote main
```

### 优势
1. ✅ 保留完整的提交历史
2. ✅ 统一的版本管理
3. ✅ 简化的开发流程
4. ✅ 更容易的跨项目重构
5. ✅ 原仓库可以保留作为历史记录

### 注意事项
- 合并后，子项目的独立 .git 目录会被移除
- 所有提交历史会整合到主项目中
- 建议在 README 中说明项目结构的变化