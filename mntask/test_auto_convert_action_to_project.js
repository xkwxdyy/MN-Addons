/**
 * 测试动作卡片自动转换为项目功能
 * 
 * 测试场景：
 * 1. 创建一个动作类型的父卡片
 * 2. 给这个动作卡片创建一个子卡片
 * 3. 对子卡片点击制卡
 * 4. 验证：
 *    - 子卡片自动成为动作类型（不弹窗）
 *    - 父卡片自动从动作转为项目类型
 *    - 父卡片添加了"包含"字段和四个状态字段
 */

// 测试步骤
function testAutoConvertActionToProject() {
  MNUtil.log("\n========== 开始测试动作卡片自动转换功能 ==========")
  
  // 步骤1：先确保有一个动作类型的父卡片
  MNUtil.log("\n📝 步骤1：请先手动创建一个动作类型的任务卡片")
  MNUtil.log("   标题格式例如：【动作｜未开始】测试动作卡片")
  
  // 步骤2：为这个动作卡片创建子卡片
  MNUtil.log("\n📝 步骤2：为该动作卡片创建一个普通子卡片（非任务卡片）")
  MNUtil.log("   子卡片标题例如：子任务内容")
  
  // 步骤3：对子卡片执行制卡
  MNUtil.log("\n📝 步骤3：选中子卡片，执行制卡功能")
  MNUtil.log("   预期结果：")
  MNUtil.log("   - 不应该弹出类型选择窗口")
  MNUtil.log("   - 子卡片自动成为动作类型")
  MNUtil.log("   - 父卡片自动从动作转为项目类型")
  
  // 验证点
  MNUtil.log("\n✅ 验证点：")
  MNUtil.log("1. 子卡片标题应该是：【动作｜未开始】子任务内容")
  MNUtil.log("2. 父卡片标题应该变为：【项目｜未开始】测试动作卡片")
  MNUtil.log("3. 父卡片应该有以下字段：")
  MNUtil.log("   - 信息")
  MNUtil.log("   - 启动（原有）")
  MNUtil.log("   - 包含（新增）")
  MNUtil.log("   - 未开始（新增）")
  MNUtil.log("   - 进行中（新增）")
  MNUtil.log("   - 已完成（新增）")
  MNUtil.log("   - 已归档（新增）")
  MNUtil.log("   - 进展")
  
  MNUtil.log("\n========== 测试说明结束 ==========")
}

// 执行测试
testAutoConvertActionToProject()