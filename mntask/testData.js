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
                progressLog: [
                    {
                        date: "2025-01-13 14:00",
                        note: "完成Bug收集和分类，共发现12个高优先级Bug"
                    },
                    {
                        date: "2025-01-15 10:00",
                        note: "建立Bug追踪系统，分配修复任务给团队成员"
                    },
                    {
                        date: "2025-01-17 16:00",
                        note: "已修复5个关键Bug，剩余7个正在处理中"
                    },
                    {
                        date: "2025-01-20 09:00",
                        note: "进行中期评审，调整修复优先级"
                    }
                ],
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
                    },
                    {
                        date: "2025-01-20 10:45",
                        note: "单元测试通过，开始集成测试"
                    },
                    {
                        date: "2025-01-20 11:00",
                        note: "发现一个边缘情况，需要额外处理"
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
                        date: "2025-01-18 09:00",
                        note: "开始分析现有架构的痛点和改进空间"
                    },
                    {
                        date: "2025-01-18 11:00",
                        note: "调研了Redux、MobX等状态管理方案"
                    },
                    {
                        date: "2025-01-18 15:00",
                        note: "绘制新架构的UML图和数据流图"
                    },
                    {
                        date: "2025-01-19 10:00",
                        note: "与架构师讨论设计方案，获得初步认可"
                    },
                    {
                        date: "2025-01-19 15:00",
                        note: "完成初步设计方案文档"
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
                progressLog: [
                    {
                        date: "2025-01-10 10:00",
                        note: "完成需求分析，确定优化方向：标签系统、搜索功能、知识图谱"
                    },
                    {
                        date: "2025-01-12 14:00",
                        note: "设计新的知识分类体系和标签结构"
                    },
                    {
                        date: "2025-01-15 09:00",
                        note: "实现基础的标签管理功能"
                    },
                    {
                        date: "2025-01-18 16:00",
                        note: "完成全文搜索功能的开发"
                    },
                    {
                        date: "2025-01-20 11:00",
                        note: "开始开发知识图谱可视化功能"
                    }
                ],
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
        
        // ========================================
        // 过去一周的已完成任务（测试历史时间轴）
        // ========================================
        
        // 1月13日（周一）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "搭建MNTask项目基础框架",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/done-framework",
            currentFocus: false,
            todayPlannedTime: "09:00-12:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-13",
                plannedDate: "2025-01-13",
                tags: ["框架搭建", "基础设施"],
                today: false,
                startTime: "2025-01-13T09:00:00",
                endTime: "2025-01-13T11:30:00",
                progressLog: [
                    {
                        date: "2025-01-13 09:00",
                        note: "开始创建项目目录结构"
                    },
                    {
                        date: "2025-01-13 10:00",
                        note: "完成基础代码框架，开始配置开发环境"
                    },
                    {
                        date: "2025-01-13 11:00",
                        note: "集成测试环境，调试基本功能"
                    },
                    {
                        date: "2025-01-13 11:30",
                        note: "框架搭建完成，所有基础功能正常运行"
                    }
                ],
                customViews: ["已完成任务", "项目里程碑"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "研究MarginNote插件API文档",
            path: "个人知识管理系统优化",
            launchLink: "marginnote4app://note/done-api-research",
            currentFocus: false,
            todayPlannedTime: "14:00-17:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-13",
                plannedDate: "2025-01-13",
                tags: ["学习", "API研究", "文档"],
                today: false,
                startTime: "2025-01-13T14:00:00",
                endTime: "2025-01-13T16:45:00",
                progressLog: [
                    {
                        date: "2025-01-13 14:00",
                        note: "开始阅读官方API文档"
                    },
                    {
                        date: "2025-01-13 15:00",
                        note: "整理常用API列表，创建速查表"
                    },
                    {
                        date: "2025-01-13 16:00",
                        note: "编写API测试代码，验证功能"
                    },
                    {
                        date: "2025-01-13 16:45",
                        note: "完成API研究，形成开发指南文档"
                    }
                ],
                customViews: ["已完成任务", "学习记录"],
                project: "personal"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "参加产品需求评审会",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "10:00-11:30",
            fields: {
                priority: "高",
                dueDate: "2025-01-13",
                plannedDate: "2025-01-13",
                tags: ["会议", "需求评审"],
                today: false,
                startTime: "2025-01-13T10:00:00",
                endTime: "2025-01-13T11:30:00",
                progressLog: [
                    {
                        date: "2025-01-13 10:00",
                        note: "会议开始，产品经理介绍新功能需求"
                    },
                    {
                        date: "2025-01-13 10:30",
                        note: "技术可行性讨论，提出几个关键问题"
                    },
                    {
                        date: "2025-01-13 11:00",
                        note: "达成共识，确定开发方案和时间表"
                    },
                    {
                        date: "2025-01-13 11:30",
                        note: "会议结束，整理会议纪要"
                    }
                ],
                customViews: ["已完成任务"],
                project: "work"
            }
        });
        
        // 1月14日（周二）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "实现任务卡片基础UI组件",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "marginnote4app://note/done-ui-components",
            currentFocus: false,
            todayPlannedTime: "09:00-12:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-14",
                plannedDate: "2025-01-14",
                tags: ["UI开发", "组件", "前端"],
                today: false,
                startTime: "2025-01-14T09:00:00",
                endTime: "2025-01-14T12:00:00",
                progressLog: [
                    {
                        date: "2025-01-14 09:00",
                        note: "设计任务卡片的UI原型"
                    },
                    {
                        date: "2025-01-14 10:00",
                        note: "开始编写React组件代码"
                    },
                    {
                        date: "2025-01-14 11:00",
                        note: "添加样式和动画效果"
                    },
                    {
                        date: "2025-01-14 11:45",
                        note: "完成组件开发，通过所有UI测试"
                    }
                ],
                customViews: ["已完成任务", "UI组件库"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "修复登录页面样式错乱问题",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "14:00-15:30",
            fields: {
                priority: "中",
                dueDate: "2025-01-14",
                plannedDate: "2025-01-14",
                tags: ["Bug修复", "CSS", "紧急"],
                today: false,
                startTime: "2025-01-14T14:00:00",
                endTime: "2025-01-14T15:20:00",
                progressLog: [
                    {
                        date: "2025-01-14 14:00",
                        note: "复现问题，定位到CSS冲突"
                    },
                    {
                        date: "2025-01-14 14:30",
                        note: "修改样式优先级，解决冲突"
                    },
                    {
                        date: "2025-01-14 15:00",
                        note: "测试各种浏览器兼容性"
                    },
                    {
                        date: "2025-01-14 15:20",
                        note: "修复完成，发布到测试环境"
                    }
                ],
                customViews: ["已完成任务", "Bug追踪"],
                project: "work"
            }
        });
        
        // 1月15日（周三）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "编写单元测试用例",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/done-unit-tests",
            currentFocus: false,
            todayPlannedTime: "10:00-12:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-15",
                plannedDate: "2025-01-15",
                tags: ["测试", "质量保证", "单元测试"],
                today: false,
                startTime: "2025-01-15T10:00:00",
                endTime: "2025-01-15T12:00:00",
                progressLog: [
                    {
                        date: "2025-01-15 10:00",
                        note: "分析需要测试的核心功能模块"
                    },
                    {
                        date: "2025-01-15 10:30",
                        note: "编写任务管理模块的测试用例"
                    },
                    {
                        date: "2025-01-15 11:00",
                        note: "编写UI组件的测试用例"
                    },
                    {
                        date: "2025-01-15 11:45",
                        note: "所有测试通过，代码覆盖率达到85%"
                    }
                ],
                customViews: ["已完成任务", "质量保证"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "优化数据库查询性能",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "14:00-17:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-15",
                plannedDate: "2025-01-15",
                tags: ["性能优化", "数据库", "后端"],
                today: false,
                startTime: "2025-01-15T14:00:00",
                endTime: "2025-01-15T17:00:00",
                progressLog: [
                    {
                        date: "2025-01-15 14:00",
                        note: "分析慢查询日志，找出性能瓶颈"
                    },
                    {
                        date: "2025-01-15 15:00",
                        note: "添加索引，优化查询语句"
                    },
                    {
                        date: "2025-01-15 16:00",
                        note: "实施查询缓存策略"
                    },
                    {
                        date: "2025-01-15 16:45",
                        note: "性能测试通过，查询速度提升80%"
                    }
                ],
                customViews: ["已完成任务", "性能优化"],
                project: "work"
            }
        });
        
        // 1月16日（周四）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "实现任务筛选和搜索功能",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "marginnote4app://note/done-search-filter",
            currentFocus: false,
            todayPlannedTime: "09:00-11:30",
            fields: {
                priority: "中",
                dueDate: "2025-01-16",
                plannedDate: "2025-01-16",
                tags: ["功能开发", "搜索", "筛选"],
                today: false,
                startTime: "2025-01-16T09:00:00",
                endTime: "2025-01-16T11:30:00",
                progressLog: [
                    {
                        date: "2025-01-16 09:00",
                        note: "设计搜索和筛选的UI界面"
                    },
                    {
                        date: "2025-01-16 09:45",
                        note: "实现前端搜索逻辑"
                    },
                    {
                        date: "2025-01-16 10:30",
                        note: "添加多条件筛选功能"
                    },
                    {
                        date: "2025-01-16 11:15",
                        note: "功能测试完成，用户体验良好"
                    }
                ],
                customViews: ["已完成任务", "功能开发"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "完成周报撰写",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "16:00-17:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-16",
                plannedDate: "2025-01-16",
                tags: ["周报", "文档", "例行"],
                today: false,
                startTime: "2025-01-16T16:00:00",
                endTime: "2025-01-16T16:45:00",
                progressLog: [
                    {
                        date: "2025-01-16 16:00",
                        note: "整理本周完成的任务清单"
                    },
                    {
                        date: "2025-01-16 16:20",
                        note: "总结遇到的问题和解决方案"
                    },
                    {
                        date: "2025-01-16 16:40",
                        note: "规划下周工作重点，提交周报"
                    }
                ],
                customViews: ["已完成任务", "例行任务"],
                project: "work"
            }
        });
        
        // 1月17日（周五）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "代码重构：优化任务状态管理",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/done-refactor",
            currentFocus: false,
            todayPlannedTime: "09:00-12:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-17",
                plannedDate: "2025-01-17",
                tags: ["重构", "代码优化", "架构"],
                today: false,
                startTime: "2025-01-17T09:00:00",
                endTime: "2025-01-17T11:45:00",
                progressLog: [
                    {
                        date: "2025-01-17 09:00",
                        note: "分析现有状态管理的问题"
                    },
                    {
                        date: "2025-01-17 10:00",
                        note: "使用Redux重构状态管理"
                    },
                    {
                        date: "2025-01-17 11:00",
                        note: "迁移所有组件到新的状态管理方案"
                    },
                    {
                        date: "2025-01-17 11:45",
                        note: "重构完成，代码更加清晰可维护"
                    }
                ],
                customViews: ["已完成任务", "技术债务"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "参加技术分享会：微前端架构",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "14:00-16:00",
            fields: {
                priority: "低",
                dueDate: "2025-01-17",
                plannedDate: "2025-01-17",
                tags: ["学习", "技术分享", "架构"],
                today: false,
                startTime: "2025-01-17T14:00:00",
                endTime: "2025-01-17T16:00:00",
                progressLog: [
                    {
                        date: "2025-01-17 14:00",
                        note: "分享会开始，了解微前端的基本概念"
                    },
                    {
                        date: "2025-01-17 15:00",
                        note: "学习qiankun框架的使用方法"
                    },
                    {
                        date: "2025-01-17 15:45",
                        note: "记录关键点，准备在项目中实践"
                    }
                ],
                customViews: ["已完成任务", "学习记录"],
                project: "personal"
            }
        });
        
        // 1月18日（周六）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "阅读《代码整洁之道》第5-8章",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "09:00-11:00",
            fields: {
                priority: "低",
                dueDate: "2025-01-18",
                plannedDate: "2025-01-18",
                tags: ["阅读", "学习", "最佳实践"],
                today: false,
                startTime: "2025-01-18T09:00:00",
                endTime: "2025-01-18T11:00:00",
                progressLog: [
                    {
                        date: "2025-01-18 09:00",
                        note: "开始阅读第5章：格式"
                    },
                    {
                        date: "2025-01-18 09:45",
                        note: "第6章：对象和数据结构，理解数据抽象"
                    },
                    {
                        date: "2025-01-18 10:30",
                        note: "第7-8章：错误处理和边界，总结要点"
                    }
                ],
                customViews: ["已完成任务", "学习记录"],
                project: "personal"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "完成个人博客文章：MN插件开发经验",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "14:00-17:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-18",
                plannedDate: "2025-01-18",
                tags: ["写作", "博客", "经验分享"],
                today: false,
                startTime: "2025-01-18T14:00:00",
                endTime: "2025-01-18T16:30:00",
                progressLog: [
                    {
                        date: "2025-01-18 14:00",
                        note: "整理插件开发中遇到的问题和解决方案"
                    },
                    {
                        date: "2025-01-18 15:00",
                        note: "编写文章主体内容，添加代码示例"
                    },
                    {
                        date: "2025-01-18 16:00",
                        note: "文章校对和配图，发布到博客平台"
                    }
                ],
                customViews: ["已完成任务", "内容创作"],
                project: "personal"
            }
        });
        
        // 1月19日（周日）- 除了原有的一个，再添加几个
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "整理一周的学习笔记",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "10:00-11:30",
            fields: {
                priority: "中",
                dueDate: "2025-01-19",
                plannedDate: "2025-01-19",
                tags: ["笔记整理", "知识管理", "复盘"],
                today: false,
                startTime: "2025-01-19T10:00:00",
                endTime: "2025-01-19T11:30:00",
                progressLog: [
                    {
                        date: "2025-01-19 10:00",
                        note: "汇总本周的技术学习要点"
                    },
                    {
                        date: "2025-01-19 10:30",
                        note: "整理代码片段和最佳实践"
                    },
                    {
                        date: "2025-01-19 11:00",
                        note: "创建知识图谱，建立概念联系"
                    },
                    {
                        date: "2025-01-19 11:30",
                        note: "完成整理，同步到Notion"
                    }
                ],
                customViews: ["已完成任务", "知识管理"],
                project: "personal"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "规划下周工作重点",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "16:00-17:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-19",
                plannedDate: "2025-01-19",
                tags: ["规划", "工作安排"],
                today: false,
                startTime: "2025-01-19T16:00:00",
                endTime: "2025-01-19T17:00:00",
                progressLog: [
                    {
                        date: "2025-01-19 16:00",
                        note: "回顾本周未完成的任务"
                    },
                    {
                        date: "2025-01-19 16:20",
                        note: "确定下周的优先级任务"
                    },
                    {
                        date: "2025-01-19 16:40",
                        note: "安排会议和协作时间"
                    },
                    {
                        date: "2025-01-19 17:00",
                        note: "完成下周计划，同步到日历"
                    }
                ],
                customViews: ["已完成任务", "工作规划"],
                project: "work"
            }
        });
        
        // ========================================
        // 今天的更多任务（不同时间段）
        // ========================================
        
        // 早晨任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "晨读：阅读技术博客和新闻",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "06:30-07:30",
            fields: {
                priority: "低",
                dueDate: "2025-01-20",
                plannedDate: "2025-01-20",
                tags: ["晨读", "学习", "习惯"],
                today: true,
                startTime: "2025-01-20T06:30:00",
                endTime: "2025-01-20T07:30:00",
                progressLog: [
                    {
                        date: "2025-01-20 06:30",
                        note: "开始阅读Hacker News头条"
                    },
                    {
                        date: "2025-01-20 07:00",
                        note: "浏览Medium上的React最佳实践文章"
                    },
                    {
                        date: "2025-01-20 07:20",
                        note: "记录有价值的技术点到笔记本"
                    }
                ],
                customViews: ["今日必做", "晨间例行"],
                project: "personal"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "晨间运动：跑步5公里",
            path: "个人项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "07:30-08:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-20",
                plannedDate: "2025-01-20",
                tags: ["运动", "健康", "习惯"],
                today: true,
                startTime: "2025-01-20T07:30:00",
                endTime: "2025-01-20T08:00:00",
                progressLog: [
                    {
                        date: "2025-01-20 07:30",
                        note: "开始晨跑，天气晴朗"
                    },
                    {
                        date: "2025-01-20 07:55",
                        note: "完成5公里，用时28分钟"
                    }
                ],
                customViews: ["今日必做", "运动记录"],
                project: "personal"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "制定今日工作计划",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "08:30-09:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-20",
                plannedDate: "2025-01-20",
                tags: ["规划", "工作", "每日例行"],
                today: true,
                startTime: "2025-01-20T08:30:00",
                endTime: "2025-01-20T08:55:00",
                progressLog: [
                    {
                        date: "2025-01-20 08:30",
                        note: "查看日历和待办事项"
                    },
                    {
                        date: "2025-01-20 08:40",
                        note: "确定今日三个最重要的任务"
                    },
                    {
                        date: "2025-01-20 08:50",
                        note: "分配时间块，设置提醒"
                    }
                ],
                customViews: ["今日必做", "工作规划"],
                project: "work"
            }
        });
        
        // 上午任务（除了已有的）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "日站会：同步项目进度",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "09:00-09:15",
            fields: {
                priority: "高",
                dueDate: "2025-01-20",
                plannedDate: "2025-01-20",
                tags: ["会议", "敏捷", "每日例行"],
                today: true,
                startTime: "2025-01-20T09:00:00",
                endTime: "2025-01-20T09:15:00",
                progressLog: [
                    {
                        date: "2025-01-20 09:00",
                        note: "团队成员同步昨日完成的工作"
                    },
                    {
                        date: "2025-01-20 09:10",
                        note: "讨论今日计划和潜在障碍"
                    }
                ],
                customViews: ["今日必做", "团队协作"],
                project: "work"
            }
        });
        
        // 晚上任务（除了已有的）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "复习算法：动态规划专题",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "21:00-22:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-20",
                plannedDate: "2025-01-20",
                tags: ["算法", "学习", "面试准备"],
                today: true,
                progressLog: [],
                customViews: ["今日必做", "技术提升"],
                project: "personal"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "睡前总结：记录今日收获",
            path: "个人项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "22:00-22:30",
            fields: {
                priority: "低",
                dueDate: "2025-01-20",
                plannedDate: "2025-01-20",
                tags: ["总结", "反思", "每日例行"],
                today: true,
                progressLog: [],
                customViews: ["今日必做", "个人成长"],
                project: "personal"
            }
        });
        
        // ========================================
        // 未来一周的计划任务
        // ========================================
        
        // 明天（1月21日）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "发布MNTask v1.0版本",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/release-v1",
            currentFocus: false,
            todayPlannedTime: "10:00-12:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-21",
                plannedDate: "2025-01-21",
                tags: ["发布", "里程碑", "重要"],
                today: false,
                progressLog: [],
                customViews: ["明日任务", "项目里程碑"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "客户演示：新功能展示",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "14:00-15:30",
            fields: {
                priority: "高",
                dueDate: "2025-01-21",
                plannedDate: "2025-01-21",
                tags: ["演示", "客户", "重要"],
                today: false,
                progressLog: [],
                customViews: ["明日任务", "客户相关"],
                project: "work"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "编写用户使用手册",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "16:00-18:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-21",
                plannedDate: "2025-01-21",
                tags: ["文档", "用户手册"],
                today: false,
                progressLog: [],
                customViews: ["明日任务", "文档工作"],
                project: "mntask"
            }
        });
        
        // 1月22日（周三）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "性能优化：首屏加载速度",
            path: `${goalQ1.title} >> ${kr2.title} >> ${projectUI.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "09:00-12:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-22",
                plannedDate: "2025-01-22",
                tags: ["性能优化", "前端", "用户体验"],
                today: false,
                progressLog: [],
                customViews: ["本周任务", "技术优化"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "团队技术分享：MNTask架构设计",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "15:00-16:30",
            fields: {
                priority: "中",
                dueDate: "2025-01-22",
                plannedDate: "2025-01-22",
                tags: ["分享", "团队", "架构"],
                today: false,
                progressLog: [],
                customViews: ["本周任务", "知识分享"],
                project: "work"
            }
        });
        
        // 1月23日（周四）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "集成自动化测试框架",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "09:00-17:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-23",
                plannedDate: "2025-01-23",
                tags: ["测试", "CI/CD", "基础设施"],
                today: false,
                progressLog: [],
                customViews: ["本周任务", "质量保证"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "参加产品路线图评审",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "14:00-16:00",
            fields: {
                priority: "高",
                dueDate: "2025-01-23",
                plannedDate: "2025-01-23",
                tags: ["会议", "产品规划", "决策"],
                today: false,
                progressLog: [],
                customViews: ["本周任务", "产品规划"],
                project: "work"
            }
        });
        
        // 1月24日（周五）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "代码审查：本周合并请求",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "10:00-12:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-24",
                plannedDate: "2025-01-24",
                tags: ["代码审查", "质量", "协作"],
                today: false,
                progressLog: [],
                customViews: ["本周任务", "代码质量"],
                project: "mntask"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "撰写本周工作总结",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "16:00-17:00",
            fields: {
                priority: "中",
                dueDate: "2025-01-24",
                plannedDate: "2025-01-24",
                tags: ["周报", "总结", "例行"],
                today: false,
                progressLog: [],
                customViews: ["本周任务", "例行任务"],
                project: "work"
            }
        });
        
        // 1月25日（周六）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "开源项目贡献：提交PR",
            path: "个人知识管理系统优化",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "10:00-12:00",
            fields: {
                priority: "低",
                dueDate: "2025-01-25",
                plannedDate: "2025-01-25",
                tags: ["开源", "贡献", "学习"],
                today: false,
                progressLog: [],
                customViews: ["周末任务", "技术成长"],
                project: "personal"
            }
        });
        
        // 下周任务示例
        tasks.push({
            id: `task_${taskId++}`,
            type: "项目",
            status: "未开始",
            title: "MNAI插件开发启动",
            path: goalQ1.title,
            launchLink: "marginnote4app://note/project-mnai",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-02-01",
                plannedDate: "2025-01-27",
                tags: ["MNAI", "新项目", "AI"],
                today: false,
                progressLog: [],
                customViews: ["下周任务", "新项目"],
                project: "mnai"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "年度绩效自评准备",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-01-31",
                plannedDate: "2025-01-28",
                tags: ["绩效", "自评", "重要"],
                today: false,
                progressLog: [],
                customViews: ["下周任务", "职业发展"],
                project: "work"
            }
        });
        
        // ========================================
        // 特殊类型任务
        // ========================================
        
        // 跨天任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "项目",
            status: "进行中",
            title: "重构数据访问层（3天工作量）",
            path: `${goalQ1.title} >> ${kr1.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-01-22",
                plannedDate: "2025-01-20",
                tags: ["重构", "跨天任务", "架构"],
                today: false,
                startTime: "2025-01-20T09:00:00",
                estimatedHours: 24,
                progressLog: [
                    {
                        date: "2025-01-20 09:00",
                        note: "开始分析现有数据访问层的问题"
                    },
                    {
                        date: "2025-01-20 12:00",
                        note: "完成新架构设计方案"
                    }
                ],
                customViews: ["进行中任务", "技术债务"],
                project: "mntask"
            }
        });
        
        // 重复任务（每日站会）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "每日站会（周一至周五）",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "09:00-09:15",
            fields: {
                priority: "高",
                dueDate: "2025-01-21",
                plannedDate: "2025-01-21",
                tags: ["会议", "每日例行", "敏捷"],
                today: false,
                isRecurring: true,
                recurringPattern: "weekdays",
                progressLog: [],
                customViews: ["例行任务", "团队协作"],
                project: "work"
            }
        });
        
        // 并发任务（同时间段）
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "后台任务：数据同步服务",
            path: "工作项目",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "00:00-23:59",
            fields: {
                priority: "中",
                dueDate: "2025-01-20",
                plannedDate: "2025-01-20",
                tags: ["后台任务", "自动化", "持续运行"],
                today: true,
                isBackground: true,
                startTime: "2025-01-20T00:00:00",
                progressLog: [
                    {
                        date: "2025-01-20 00:00",
                        note: "数据同步服务启动"
                    },
                    {
                        date: "2025-01-20 06:00",
                        note: "已同步1000条记录"
                    },
                    {
                        date: "2025-01-20 12:00",
                        note: "已同步2500条记录"
                    }
                ],
                customViews: ["后台任务", "系统维护"],
                project: "work"
            }
        });
        
        // 长期任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "目标",
            status: "进行中",
            title: "学习机器学习基础（3个月计划）",
            path: "",
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-04-20",
                plannedDate: "2025-01-20",
                tags: ["学习", "长期目标", "AI"],
                today: false,
                estimatedDays: 90,
                progressLog: [
                    {
                        date: "2025-01-15 20:00",
                        note: "完成Andrew Ng课程第1周内容"
                    },
                    {
                        date: "2025-01-20 20:00",
                        note: "开始学习第2周：线性回归"
                    }
                ],
                customViews: ["长期目标", "技能提升"],
                project: "personal"
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