/**
 * MNTask 测试数据
 * 用于开发和演示的示例任务数据
 */

const testTaskData = {
    // 任务数据
    tasks: [],
    
    // 初始焦点任务ID
    initialFocusTasks: [],
    
    // 生成测试数据
    generate: function() {
        let taskId = 1;
        const tasks = [];
        const focusTasks = [];
        
        // Q1 目标：提升产品质量
        const goalQ1 = {
            id: `task_${taskId++}`,
            type: "目标",
            status: "进行中",
            title: "Q1目标：提升MarginNote插件生态系统质量和用户体验",
            path: "",
            launchLink: "marginnote4app://note/goal-q1-2025",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-03-31",
                tags: ["Q1目标", "产品质量", "用户体验"],
                today: false,
                progressLog: [
                    {
                        date: "2025-01-15 09:00",
                        note: "完成插件架构重构规划"
                    },
                    {
                        date: "2025-01-18 14:00",
                        note: "MNTask插件基础功能开发完成"
                    }
                ],
                customViews: ["Q1规划", "本周重点"],
                project: "okr"
            }
        };
        tasks.push(goalQ1);
        
        // KR1：修复所有高优先级Bug
        const kr1 = {
            id: `task_${taskId++}`,
            type: "关键结果",
            status: "进行中",
            title: "修复MNTask和MNAI插件中的所有高优先级Bug",
            path: goalQ1.title,
            launchLink: "marginnote4app://note/kr1-bugs",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-02-15",
                tags: ["Bug修复", "质量提升"],
                today: false,
                progressLog: [],
                customViews: ["插件Bug汇总", "Q1规划"],
                project: "okr"
            }
        };
        tasks.push(kr1);
        
        // 项目：MNTask Bug修复计划
        const projectBugFix = {
            id: `task_${taskId++}`,
            type: "项目",
            status: "进行中",
            title: "MNTask插件Bug修复计划",
            path: `${goalQ1.title} >> ${kr1.title}`,
            launchLink: "marginnote4app://note/project-bugfix",
            currentFocus: true,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-01-31",
                tags: ["MNTask", "Bug修复", "紧急"],
                today: false,
                progressLog: [],
                customViews: ["插件Bug汇总", "本周重点"],
                project: "mntask"
            }
        };
        tasks.push(projectBugFix);
        focusTasks.push(projectBugFix.id);
        
        // 具体Bug修复任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "修复TaskFieldUtils方法名冲突导致字段提取失败的问题",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/bug-12345",
            currentFocus: true,
            todayPlannedTime: "09:00-11:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-20",
                tags: ["MNTask", "Bug", "紧急", "方法名冲突"],
                today: true,
                progressLog: [
                    {
                        date: "2025-01-20 09:00",
                        note: "定位到问题原因：JavaScript不支持方法重载，同名方法被覆盖"
                    },
                    {
                        date: "2025-01-20 09:05",
                        note: "遇到点问题：需要找到所有使用该方法的地方"
                    },
                    {
                        date: "2025-01-20 09:10",
                        note: "解决问题：使用grep搜索找到了所有引用位置"
                    },
                    {
                        date: "2025-01-20 10:00",
                        note: "将getFieldContent重命名为extractFieldText，避免冲突"
                    },
                    {
                        date: "2025-01-20 10:30",
                        note: "完成代码修复，正在进行测试验证"
                    }
                ],
                customViews: ["插件Bug汇总", "今日必做"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "修复父子任务链接重复创建的问题",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/bug-12346",
            currentFocus: false,
            todayPlannedTime: "11:00-12:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-20",
                tags: ["MNTask", "Bug", "链接管理"],
                today: true,
                progressLog: [
                    {
                        date: "2025-01-20 11:05",
                        note: "开始分析问题：检查 linkParentTask 方法的实现"
                    },
                    {
                        date: "2025-01-20 11:15",
                        note: "找到原因：没有检查链接是否已存在就直接创建"
                    }
                ],
                customViews: ["插件Bug汇总", "今日必做"],
                project: "mntask"
            }
        });
        
        // 添加一些暂停状态的任务示例
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "暂停",
            title: "重构任务管理系统架构",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "marginnote4app://note/paused-task-1",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-01-28",
                tags: ["MNTask", "重构", "架构"],
                today: false,
                progressLog: [
                    {
                        date: "2025-01-19 15:00",
                        note: "完成初步设计方案"
                    },
                    {
                        date: "2025-01-19 17:00",
                        note: "由于需要等待其他团队反馈，暂时暂停"
                    }
                ],
                customViews: ["暂停任务"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "修复选择焦点任务后看板不更新的问题",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/bug-12347",
            currentFocus: false,
            todayPlannedTime: "14:00-15:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-21",
                tags: ["MNTask", "Bug", "UI更新"],
                today: true,
                progressLog: [
                    {
                        date: "2025-01-20 14:05",
                        note: "检查渲染逻辑，发现是状态更新后没有调用渲染函数"
                    },
                    {
                        date: "2025-01-20 14:20",
                        note: "添加 renderFocusTasks() 调用，问题解决"
                    }
                ],
                customViews: ["插件Bug汇总"],
                project: "mntask"
            }
        });
        
        // 添加并发任务示例
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "参加团队周会",
            path: "工作项目",
            launchLink: "marginnote4app://note/meeting-weekly",
            currentFocus: false,
            todayPlannedTime: "14:30-15:30",
            fields: {
                priority: "中",
                dueDate: "2025-01-20",
                tags: ["会议", "团队协作"],
                today: true,
                progressLog: [],
                customViews: ["今日必做"],
                project: "work"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "回复紧急邮件",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "14:00-14:30",
            fields: {
                priority: "高",
                dueDate: "2025-01-20",
                tags: ["沟通", "紧急"],
                today: true,
                progressLog: [],
                customViews: ["今日必做"],
                project: "work"
            }
        });
        
        // KR2：优化用户体验
        const kr2 = {
            id: `task_${taskId++}`,
            type: "关键结果",
            status: "未开始",
            title: "提升插件易用性，减少用户学习成本",
            path: goalQ1.title,
            launchLink: "marginnote4app://note/kr2-ux",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-03-15",
                tags: ["用户体验", "易用性"],
                today: false,
                progressLog: [],
                customViews: ["Q1规划"],
                project: "okr"
            }
        };
        tasks.push(kr2);
        
        // 项目：UI改进计划
        const projectUI = {
            id: `task_${taskId++}`,
            type: "项目",
            status: "未开始",
            title: "焦点任务看板UI优化",
            path: `${goalQ1.title} >> ${kr2.title}`,
            launchLink: "marginnote4app://note/project-ui",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-02-28",
                tags: ["UI优化", "设计改进"],
                today: false,
                progressLog: [],
                customViews: ["本周重点"],
                project: "mntask"
            }
        };
        tasks.push(projectUI);
        
        // UI改进任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "实现项目名称自动补全功能",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-01-25",
                tags: ["功能开发", "自动补全"],
                today: false,
                progressLog: [],
                customViews: [],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "优化时间轴视图，支持任务嵌套显示",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "16:00-18:00",
            fields: {
                priority: "低",
                dueDate: "2025-01-26",
                tags: ["UI优化", "时间轴"],
                today: true,
                progressLog: [],
                customViews: [],
                project: "mntask"
            }
        });
        
        // 其他项目
        tasks.push({
            id: `task_${taskId++}`,
            type: "项目",
            status: "进行中",
            title: "个人知识管理系统优化",
            path: "",
            launchLink: "marginnote4app://note/project-pkm",
            currentFocus: true,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-02-15",
                tags: ["知识管理", "个人项目"],
                today: false,
                progressLog: [],
                customViews: ["个人项目"],
                project: "personal"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "暂停",
            title: "开发智能任务推荐功能",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "marginnote4app://note/paused-task-2",
            currentFocus: false,
            todayPlannedTime: "15:00-17:00",
            fields: {
                priority: "低",
                dueDate: "2025-02-05",
                tags: ["AI功能", "创新"],
                today: true,
                progressLog: [
                    {
                        date: "2025-01-20 15:00",
                        note: "开始研究机器学习算法"
                    },
                    {
                        date: "2025-01-20 16:00",
                        note: "发现需要更多数据样本，暂时暂停等待数据收集"
                    }
                ],
                customViews: ["暂停任务", "今日必做"],
                project: "mntask"
            }
        });
        
        // 添加更多并发任务示例（16:00-17:00时间段）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "代码评审：PR #123",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "16:00-17:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-20",
                tags: ["代码评审", "协作"],
                today: true,
                progressLog: [],
                customViews: ["今日必做"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "处理客户反馈问题",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "16:30-17:30",
            fields: {
                priority: "高",
                dueDate: "2025-01-20",
                tags: ["客户支持", "紧急"],
                today: true,
                progressLog: [],
                customViews: ["今日必做"],
                project: "work"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "整理本周学习笔记",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "20:00-21:00",
            fields: {
                priority: "低",
                dueDate: "2025-01-20",
                tags: ["学习", "笔记整理"],
                today: true,
                progressLog: [
                    {
                        date: "2025-01-20 20:00",
                        note: "开始整理JavaScript高级编程笔记"
                    }
                ],
                customViews: ["今日必做"],
                project: "personal"
            }
        });
        
        // 已完成的任务示例
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "完成MNTask插件需求文档编写",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/done-12340",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-01-19",
                tags: ["文档", "需求分析"],
                today: false,
                progressLog: [
                    {
                        date: "2025-01-19 14:00",
                        note: "完成需求文档初稿"
                    },
                    {
                        date: "2025-01-19 16:00",
                        note: "文档评审通过，准备开发"
                    }
                ],
                customViews: ["已完成任务"],
                project: "mntask"
            }
        });
        
        this.tasks = tasks;
        this.initialFocusTasks = focusTasks;
        
        return {
            tasks: tasks,
            focusTasks: focusTasks
        };
    }
};

// 如果在浏览器环境中，暴露到全局
if (typeof window !== 'undefined') {
    window.testTaskData = testTaskData;
}