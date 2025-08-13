# GitHub Actions Workflows

## 暂时禁用的工作流

以下工作流因为 API 余额不足暂时禁用：

- `claude-code-review.yml.disabled` - PR 自动代码审查
- `claude.yml.disabled` - @claude 提及响应

### 如何重新启用

当 Anthropic API 账户充值后，执行以下命令重新启用：

```bash
# 重新启用 workflows
mv .github/workflows/claude-code-review.yml.disabled .github/workflows/claude-code-review.yml
mv .github/workflows/claude.yml.disabled .github/workflows/claude.yml

# 提交更改
git add .github/workflows/*.yml
git commit -m "chore: 重新启用 Claude GitHub Actions"
git push
```

### 问题说明

- 错误原因：`Credit balance is too low`
- 需要充值 Anthropic API 账户
- 充值地址：https://console.anthropic.com/