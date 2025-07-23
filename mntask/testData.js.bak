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
                                progressLog: [
                    {
                        date: "2025-07-15 09:00",
                        note: "完成插件架构重构规划"
                    },
                    {
                        date: "2025-07-18 14:00",
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
                dueDate: "2025-07-31",
                plannedDate: "2025-07-15",
                startTime: "2025-07-15T09:00:00",
                tags: ["MNTask", "Bug修复", "紧急"],
                                progressLog: [
                    {
                        date: "2025-07-13 14:00",
                        note: "完成Bug收集和分类，共发现12个高优先级Bug"
                    },
                    {
                        date: "2025-07-15 10:00",
                        note: "建立Bug追踪系统，分配修复任务给团队成员"
                    },
                    {
                        date: "2025-07-17 16:00",
                        note: "已修复5个关键Bug，剩余7个正在处理中"
                    },
                    {
                        date: "2025-07-20 09:00",
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["MNTask", "Bug", "紧急", "方法名冲突"],
                                startTime: "2025-07-22T09:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 09:00",
                        note: "定位到问题原因：JavaScript不支持方法重载，同名方法被覆盖"
                    },
                    {
                        date: "2025-07-20 09:05",
                        note: "遇到点问题：需要找到所有使用该方法的地方"
                    },
                    {
                        date: "2025-07-20 09:10",
                        note: "解决问题：使用grep搜索找到了所有引用位置"
                    },
                    {
                        date: "2025-07-20 10:00",
                        note: "将getFieldContent重命名为extractFieldText，避免冲突"
                    },
                    {
                        date: "2025-07-20 10:30",
                        note: "完成代码修复，正在进行测试验证"
                    },
                    {
                        date: "2025-07-20 10:45",
                        note: "单元测试通过，开始集成测试"
                    },
                    {
                        date: "2025-07-20 11:00",
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["MNTask", "Bug", "链接管理"],
                                progressLog: [
                    {
                        date: "2025-07-20 11:05",
                        note: "开始分析问题：检查 linkParentTask 方法的实现"
                    },
                    {
                        date: "2025-07-20 11:15",
                        note: "找到原因：没有检查链接是否已存在就直接创建"
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
            title: "修复选择焦点任务后看板不更新的问题",
            path: `${goalQ1.title} >> ${kr1.title} >> ${projectBugFix.title}`,
            launchLink: "marginnote4app://note/bug-12347",
            currentFocus: false,
            todayPlannedTime: "14:00-15:00",
            fields: {
                priority: "中",
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["MNTask", "Bug", "UI更新"],
                                progressLog: [
                    {
                        date: "2025-07-20 14:05",
                        note: "检查渲染逻辑，发现是状态更新后没有调用渲染函数"
                    },
                    {
                        date: "2025-07-20 14:20",
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["会议", "团队协作"],
                                startTime: "2025-07-22T14:30:00",
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["沟通", "紧急"],
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
                                progressLog: [],
                customViews: ["本周重点"],
                project: "mntask"
            }
        };
        tasks.push(projectUI);
        
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
                dueDate: "2025-07-28",
                tags: ["MNTask", "重构", "架构"],
                                progressLog: [
                    {
                        date: "2025-07-18 09:00",
                        note: "开始分析现有架构的痛点和改进空间"
                    },
                    {
                        date: "2025-07-18 11:00",
                        note: "调研了Redux、MobX等状态管理方案"
                    },
                    {
                        date: "2025-07-18 15:00",
                        note: "绘制新架构的UML图和数据流图"
                    },
                    {
                        date: "2025-07-19 10:00",
                        note: "与架构师讨论设计方案，获得初步认可"
                    },
                    {
                        date: "2025-07-19 15:00",
                        note: "完成初步设计方案文档"
                    },
                    {
                        date: "2025-07-19 17:00",
                        note: "由于需要等待其他团队反馈，暂时暂停"
                    }
                ],
                customViews: ["暂停任务"],
                project: "mntask"
            }
        });
        
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
                dueDate: "2025-07-25",
                tags: ["功能开发", "自动补全"],
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
                dueDate: "2025-07-26",
                tags: ["UI优化", "时间轴"],
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
                dueDate: "2025-08-15",
                plannedDate: "2025-07-10",
                startTime: "2025-07-10T10:00:00",
                tags: ["知识管理", "个人项目"],
                                progressLog: [
                    {
                        date: "2025-07-10 10:00",
                        note: "完成需求分析，确定优化方向：标签系统、搜索功能、知识图谱"
                    },
                    {
                        date: "2025-07-12 14:00",
                        note: "设计新的知识分类体系和标签结构"
                    },
                    {
                        date: "2025-07-15 09:00",
                        note: "实现基础的标签管理功能"
                    },
                    {
                        date: "2025-07-18 16:00",
                        note: "完成全文搜索功能的开发"
                    },
                    {
                        date: "2025-07-20 11:00",
                        note: "开始开发知识图谱可视化功能"
                    }
                ],
                customViews: ["个人项目"],
                project: "personal"
            }
        });
        
        // ========================================
        // 软件开发项目完整生命周期
        // ========================================
        
        // Q1目标2：电商平台重构项目
        const goalEcommerce = {
            id: `task_${taskId++}`,
            type: "目标",
            status: "进行中",
            title: "Q1目标：完成电商平台2.0版本开发和上线",
            path: "",
            launchLink: "marginnote4app://note/goal-ecommerce-q1",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-03-31",
                tags: ["Q1目标", "电商平台", "重点项目"],
                progressLog: [
                    {
                        date: "2025-07-05 09:00",
                        note: "项目启动会议，确定技术栈和架构方案"
                    },
                    {
                        date: "2025-07-10 14:00",
                        note: "完成技术选型：React 18 + Node.js + MongoDB"
                    }
                ],
                customViews: ["Q1规划", "重点项目"],
                project: "ecommerce"
            }
        };
        tasks.push(goalEcommerce);
        
        // 电商项目 - 需求分析阶段
        const projectRequirement = {
            id: `task_${taskId++}`,
            type: "项目",
            status: "已完成",
            title: "需求分析和系统设计",
            path: goalEcommerce.title,
            launchLink: "marginnote4app://note/project-requirement",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-07-15",
                plannedDate: "2025-07-15",
                tags: ["需求分析", "系统设计", "架构"],
                startTime: "2025-07-15T09:00:00",
                endTime: "2025-07-15T17:00:00",
                progressLog: [
                    {
                        date: "2025-07-06 09:00",
                        note: "开始收集业务需求，与产品团队沟通"
                    },
                    {
                        date: "2025-07-08 14:00",
                        note: "完成用户故事编写，共计45个用户故事"
                    },
                    {
                        date: "2025-07-10 10:00",
                        note: "设计系统架构图，采用微服务架构"
                    },
                    {
                        date: "2025-07-12 16:00",
                        note: "完成数据库设计，共15个核心表"
                    },
                    {
                        date: "2025-07-15 17:00",
                        note: "需求评审通过，进入开发阶段"
                    }
                ],
                customViews: ["已完成任务", "电商项目"],
                project: "ecommerce"
            }
        };
        tasks.push(projectRequirement);
        
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
                                progressLog: [
                    {
                        date: "2025-07-20 15:00",
                        note: "开始研究机器学习算法"
                    },
                    {
                        date: "2025-07-20 16:00",
                        note: "发现需要更多数据样本，暂时暂停等待数据收集"
                    }
                ],
                customViews: ["暂停任务", "今日必做"],
                project: "mntask"
            }
        });
        
        // 电商项目 - 前端开发阶段
        const projectFrontend = {
            id: `task_${taskId++}`,
            type: "项目",
            status: "进行中",
            title: "前端开发 - React商城界面",
            path: goalEcommerce.title,
            launchLink: "marginnote4app://note/project-frontend",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-08-10",
                plannedDate: "2025-07-16",
                startTime: "2025-07-16T09:00:00",
                tags: ["前端开发", "React", "UI/UX"],
                progressLog: [
                    {
                        date: "2025-07-16 09:00",
                        note: "搭建React项目框架，配置Webpack和Babel"
                    },
                    {
                        date: "2025-07-17 10:00",
                        note: "完成组件库选型，决定使用Ant Design"
                    },
                    {
                        date: "2025-07-18 14:00",
                        note: "实现商品列表页面和详情页面"
                    },
                    {
                        date: "2025-07-19 16:00",
                        note: "完成购物车功能的前端实现"
                    }
                ],
                customViews: ["进行中项目", "前端开发"],
                project: "ecommerce"
            }
        };
        tasks.push(projectFrontend);
        
        // 前端开发具体任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "实现响应式设计，适配移动端",
            path: `${goalEcommerce.title} >> ${projectFrontend.title}`,
            launchLink: "marginnote4app://note/task-responsive",
            currentFocus: false,
            todayPlannedTime: "10:00-12:00",
            fields: {
                priority: "高",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["响应式", "移动端", "CSS"],
                startTime: "2025-07-20T10:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 10:00",
                        note: "开始分析现有页面的响应式需求"
                    },
                    {
                        date: "2025-07-20 10:30",
                        note: "使用CSS Grid和Flexbox重构布局系统"
                    },
                    {
                        date: "2025-07-20 11:00",
                        note: "添加媒体查询，处理不同屏幕尺寸"
                    },
                    {
                        date: "2025-07-20 11:30",
                        note: "遇到问题：导航菜单在小屏幕下显示异常"
                    },
                    {
                        date: "2025-07-20 11:45",
                        note: "解决方案：实现汉堡菜单和侧边栏导航"
                    }
                ],
                customViews: ["今日必做", "前端任务"],
                project: "ecommerce"
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
                dueDate: "2025-07-20",
                tags: ["代码评审", "协作"],
                                progressLog: [],
                customViews: ["今日必做"],
                project: "mntask"
            }
        });
        
        // 电商项目 - 后端开发任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "开发RESTful API - 用户认证模块",
            path: `${goalEcommerce.title} >> 后端开发`,
            launchLink: "marginnote4app://note/task-auth-api",
            currentFocus: false,
            todayPlannedTime: "14:00-16:00",
            fields: {
                priority: "高",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["API开发", "Node.js", "认证"],
                startTime: "2025-07-20T14:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 14:00",
                        note: "开始设计JWT认证方案"
                    },
                    {
                        date: "2025-07-20 14:30",
                        note: "实现用户注册和登录接口"
                    },
                    {
                        date: "2025-07-20 15:00",
                        note: "添加密码加密和验证逻辑"
                    },
                    {
                        date: "2025-07-20 15:30",
                        note: "遇到问题：Token刷新机制存在安全漏洞"
                    },
                    {
                        date: "2025-07-20 15:45",
                        note: "实现双 Token机制（Access Token + Refresh Token）"
                    }
                ],
                customViews: ["今日必做", "后端任务"],
                project: "ecommerce"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "数据库优化 - 添加索引和查询优化",
            path: `${goalEcommerce.title} >> 数据库优化`,
            launchLink: "marginnote4app://note/task-db-optimize",
            currentFocus: false,
            todayPlannedTime: "16:00-17:00",
            fields: {
                priority: "中",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["数据库", "性能优化", "MongoDB"],
                progressLog: [],
                customViews: ["今日必做", "数据库任务"],
                project: "ecommerce"
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
                dueDate: "2025-07-20",
                tags: ["客户支持", "紧急"],
                                progressLog: [],
                customViews: ["今日必做"],
                project: "work"
            }
        });
        
        // 电商项目 - 测试阶段
        const projectTesting = {
            id: `task_${taskId++}`,
            type: "项目",
            status: "未开始",
            title: "测试和质量保证",
            path: goalEcommerce.title,
            launchLink: "marginnote4app://note/project-testing",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-02-20",
                tags: ["测试", "QA", "质量保证"],
                progressLog: [],
                customViews: ["未来项目", "测试阶段"],
                project: "ecommerce"
            }
        };
        tasks.push(projectTesting);
        
        // 电商项目 - 测试任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "编写单元测试 - 购物车模块",
            path: `${goalEcommerce.title} >> ${projectTesting.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-02-01",
                plannedDate: "2025-02-01",
                tags: ["单元测试", "Jest", "TDD"],
                progressLog: [],
                customViews: ["下周任务", "测试任务"],
                project: "ecommerce"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "集成测试 - API接口测试",
            path: `${goalEcommerce.title} >> ${projectTesting.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-02-05",
                plannedDate: "2025-02-05",
                tags: ["集成测试", "API测试", "Postman"],
                progressLog: [],
                customViews: ["下周任务", "测试任务"],
                project: "ecommerce"
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
                dueDate: "2025-07-20",
                tags: ["学习", "笔记整理"],
                                progressLog: [
                    {
                        date: "2025-07-20 20:00",
                        note: "开始整理JavaScript高级编程笔记"
                    }
                ],
                customViews: ["今日必做"],
                project: "personal"
            }
        });
        
        // ========================================
        // 产品运营项目
        // ========================================
        
        // 用户增长项目
        const projectGrowth = {
            id: `task_${taskId++}`,
            type: "项目",
            status: "进行中",
            title: "用户增长计划 - Q1用户翻倍",
            path: "",
            launchLink: "marginnote4app://note/project-growth",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-03-31",
                tags: ["用户增长", "运营", "KPI"],
                progressLog: [
                    {
                        date: "2025-07-05 10:00",
                        note: "制定Q1用户增长策略，目标DAU翻倍"
                    },
                    {
                        date: "2025-07-10 14:00",
                        note: "完成用户画像分析，确定3类核心用户群体"
                    },
                    {
                        date: "2025-07-15 16:00",
                        note: "启动第一波增长活动，新用户注册增长30%"
                    }
                ],
                customViews: ["运营项目", "重点项目"],
                project: "growth"
            }
        };
        tasks.push(projectGrowth);
        
        // 用户研究任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "用户访谈 - 深度了解付费用户需求",
            path: `${projectGrowth.title}`,
            launchLink: "marginnote4app://note/task-user-interview",
            currentFocus: false,
            todayPlannedTime: "14:00-15:30",
            fields: {
                priority: "高",
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["用户研究", "访谈", "定性分析"],
                startTime: "2025-07-22T14:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 14:00",
                        note: "开始第1场用户访谈，用户背景：企业版大客户"
                    },
                    {
                        date: "2025-07-20 14:30",
                        note: "发现关键痛点：批量操作效率低，需要更好的团队协作功能"
                    },
                    {
                        date: "2025-07-20 15:00",
                        note: "第2场访谈，用户背景：个人高级用户"
                    },
                    {
                        date: "2025-07-20 15:20",
                        note: "用户希望有更多自定义选项和高级功能"
                    }
                ],
                customViews: ["今日必做", "用户研究"],
                project: "growth"
            }
        });
        
        // 数据分析任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "数据分析 - 用户留存率下降原因分析",
            path: `${projectGrowth.title}`,
            launchLink: "marginnote4app://note/task-data-analysis",
            currentFocus: false,
            todayPlannedTime: "16:00-17:30",
            fields: {
                priority: "高",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["数据分析", "留存率", "SQL"],
                progressLog: [],
                customViews: ["今日必做", "数据分析"],
                project: "growth"
            }
        });
        
        // 营销活动任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "策划春节营销活动方案",
            path: `${projectGrowth.title}`,
            launchLink: "marginnote4app://note/task-marketing-plan",
            currentFocus: false,
            todayPlannedTime: "09:00-10:30",
            fields: {
                priority: "高",
                dueDate: "2025-07-21",
                plannedDate: "2025-07-20",
                tags: ["营销活动", "策划", "春节"],
                startTime: "2025-07-20T09:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 09:00",
                        note: "开始研究竞品春节活动方案"
                    },
                    {
                        date: "2025-07-20 09:30",
                        note: "确定活动主题：‘龙年大吉，好运连连’"
                    },
                    {
                        date: "2025-07-20 10:00",
                        note: "设计活动玩法：集福卡、红包雨、限时折扣"
                    }
                ],
                customViews: ["今日必做", "营销活动"],
                project: "growth"
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
                dueDate: "2025-07-19",
                plannedDate: "2025-07-19",
                tags: ["文档", "需求分析"],
                startTime: "2025-07-19T14:00:00",
                endTime: "2025-07-19T16:00:00",
                                progressLog: [
                    {
                        date: "2025-07-19 14:00",
                        note: "完成需求文档初稿"
                    },
                    {
                        date: "2025-07-19 16:00",
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
        
        // 7月13日（周一）
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
                dueDate: "2025-07-13",
                plannedDate: "2025-07-13",
                tags: ["框架搭建", "基础设施"],
                                startTime: "2025-07-13T09:00:00",
                endTime: "2025-07-13T11:30:00",
                progressLog: [
                    {
                        date: "2025-07-13 09:00",
                        note: "开始创建项目目录结构"
                    },
                    {
                        date: "2025-07-13 10:00",
                        note: "完成基础代码框架，开始配置开发环境"
                    },
                    {
                        date: "2025-07-13 11:00",
                        note: "集成测试环境，调试基本功能"
                    },
                    {
                        date: "2025-07-13 11:30",
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
                dueDate: "2025-07-13",
                plannedDate: "2025-07-13",
                tags: ["学习", "API研究", "文档"],
                                startTime: "2025-07-13T14:00:00",
                endTime: "2025-07-13T16:45:00",
                progressLog: [
                    {
                        date: "2025-07-13 14:00",
                        note: "开始阅读官方API文档"
                    },
                    {
                        date: "2025-07-13 15:00",
                        note: "整理常用API列表，创建速查表"
                    },
                    {
                        date: "2025-07-13 16:00",
                        note: "编写API测试代码，验证功能"
                    },
                    {
                        date: "2025-07-13 16:45",
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
                dueDate: "2025-07-13",
                plannedDate: "2025-07-13",
                tags: ["会议", "需求评审"],
                                startTime: "2025-07-13T10:00:00",
                endTime: "2025-07-13T11:30:00",
                progressLog: [
                    {
                        date: "2025-07-13 10:00",
                        note: "会议开始，产品经理介绍新功能需求"
                    },
                    {
                        date: "2025-07-13 10:30",
                        note: "技术可行性讨论，提出几个关键问题"
                    },
                    {
                        date: "2025-07-13 11:00",
                        note: "达成共识，确定开发方案和时间表"
                    },
                    {
                        date: "2025-07-13 11:30",
                        note: "会议结束，整理会议纪要"
                    }
                ],
                customViews: ["已完成任务"],
                project: "work"
            }
        });
        
        // 7月14日（周二）
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
                dueDate: "2025-07-14",
                plannedDate: "2025-07-14",
                tags: ["UI开发", "组件", "前端"],
                                startTime: "2025-07-14T09:00:00",
                endTime: "2025-07-14T12:00:00",
                progressLog: [
                    {
                        date: "2025-07-14 09:00",
                        note: "设计任务卡片的UI原型"
                    },
                    {
                        date: "2025-07-14 10:00",
                        note: "开始编写React组件代码"
                    },
                    {
                        date: "2025-07-14 11:00",
                        note: "添加样式和动画效果"
                    },
                    {
                        date: "2025-07-14 11:45",
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
                dueDate: "2025-07-14",
                plannedDate: "2025-07-14",
                tags: ["Bug修复", "CSS", "紧急"],
                                startTime: "2025-07-14T14:00:00",
                endTime: "2025-07-14T15:20:00",
                progressLog: [
                    {
                        date: "2025-07-14 14:00",
                        note: "复现问题，定位到CSS冲突"
                    },
                    {
                        date: "2025-07-14 14:30",
                        note: "修改样式优先级，解决冲突"
                    },
                    {
                        date: "2025-07-14 15:00",
                        note: "测试各种浏览器兼容性"
                    },
                    {
                        date: "2025-07-14 15:20",
                        note: "修复完成，发布到测试环境"
                    }
                ],
                customViews: ["已完成任务", "Bug追踪"],
                project: "work"
            }
        });
        
        // 7月15日（周三）
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
                dueDate: "2025-07-15",
                plannedDate: "2025-07-15",
                tags: ["测试", "质量保证", "单元测试"],
                                startTime: "2025-07-15T10:00:00",
                endTime: "2025-07-15T12:00:00",
                progressLog: [
                    {
                        date: "2025-07-15 10:00",
                        note: "分析需要测试的核心功能模块"
                    },
                    {
                        date: "2025-07-15 10:30",
                        note: "编写任务管理模块的测试用例"
                    },
                    {
                        date: "2025-07-15 11:00",
                        note: "编写UI组件的测试用例"
                    },
                    {
                        date: "2025-07-15 11:45",
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
                dueDate: "2025-07-15",
                plannedDate: "2025-07-15",
                tags: ["性能优化", "数据库", "后端"],
                                startTime: "2025-07-15T14:00:00",
                endTime: "2025-07-15T17:00:00",
                progressLog: [
                    {
                        date: "2025-07-15 14:00",
                        note: "分析慢查询日志，找出性能瓶颈"
                    },
                    {
                        date: "2025-07-15 15:00",
                        note: "添加索引，优化查询语句"
                    },
                    {
                        date: "2025-07-15 16:00",
                        note: "实施查询缓存策略"
                    },
                    {
                        date: "2025-07-15 16:45",
                        note: "性能测试通过，查询速度提升80%"
                    }
                ],
                customViews: ["已完成任务", "性能优化"],
                project: "work"
            }
        });
        
        // 7月16日（周四）
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
                dueDate: "2025-07-16",
                plannedDate: "2025-07-16",
                tags: ["功能开发", "搜索", "筛选"],
                                startTime: "2025-07-16T09:00:00",
                endTime: "2025-07-16T11:30:00",
                progressLog: [
                    {
                        date: "2025-07-16 09:00",
                        note: "设计搜索和筛选的UI界面"
                    },
                    {
                        date: "2025-07-16 09:45",
                        note: "实现前端搜索逻辑"
                    },
                    {
                        date: "2025-07-16 10:30",
                        note: "添加多条件筛选功能"
                    },
                    {
                        date: "2025-07-16 11:15",
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
                dueDate: "2025-07-16",
                plannedDate: "2025-07-16",
                tags: ["周报", "文档", "例行"],
                                startTime: "2025-07-16T16:00:00",
                endTime: "2025-07-16T16:45:00",
                progressLog: [
                    {
                        date: "2025-07-16 16:00",
                        note: "整理本周完成的任务清单"
                    },
                    {
                        date: "2025-07-16 16:20",
                        note: "总结遇到的问题和解决方案"
                    },
                    {
                        date: "2025-07-16 16:40",
                        note: "规划下周工作重点，提交周报"
                    }
                ],
                customViews: ["已完成任务", "例行任务"],
                project: "work"
            }
        });
        
        // 7月17日（周五）
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
                dueDate: "2025-07-17",
                plannedDate: "2025-07-17",
                tags: ["重构", "代码优化", "架构"],
                                startTime: "2025-07-17T09:00:00",
                endTime: "2025-07-17T11:45:00",
                progressLog: [
                    {
                        date: "2025-07-17 09:00",
                        note: "分析现有状态管理的问题"
                    },
                    {
                        date: "2025-07-17 10:00",
                        note: "使用Redux重构状态管理"
                    },
                    {
                        date: "2025-07-17 11:00",
                        note: "迁移所有组件到新的状态管理方案"
                    },
                    {
                        date: "2025-07-17 11:45",
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
                dueDate: "2025-07-17",
                plannedDate: "2025-07-17",
                tags: ["学习", "技术分享", "架构"],
                                startTime: "2025-07-17T14:00:00",
                endTime: "2025-07-17T16:00:00",
                progressLog: [
                    {
                        date: "2025-07-17 14:00",
                        note: "分享会开始，了解微前端的基本概念"
                    },
                    {
                        date: "2025-07-17 15:00",
                        note: "学习qiankun框架的使用方法"
                    },
                    {
                        date: "2025-07-17 15:45",
                        note: "记录关键点，准备在项目中实践"
                    }
                ],
                customViews: ["已完成任务", "学习记录"],
                project: "personal"
            }
        });
        
        // 7月18日（周六）
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
                dueDate: "2025-07-18",
                plannedDate: "2025-07-18",
                tags: ["阅读", "学习", "最佳实践"],
                                startTime: "2025-07-18T09:00:00",
                endTime: "2025-07-18T11:00:00",
                progressLog: [
                    {
                        date: "2025-07-18 09:00",
                        note: "开始阅读第5章：格式"
                    },
                    {
                        date: "2025-07-18 09:45",
                        note: "第6章：对象和数据结构，理解数据抽象"
                    },
                    {
                        date: "2025-07-18 10:30",
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
                dueDate: "2025-07-18",
                plannedDate: "2025-07-18",
                tags: ["写作", "博客", "经验分享"],
                                startTime: "2025-07-18T14:00:00",
                endTime: "2025-07-18T16:30:00",
                progressLog: [
                    {
                        date: "2025-07-18 14:00",
                        note: "整理插件开发中遇到的问题和解决方案"
                    },
                    {
                        date: "2025-07-18 15:00",
                        note: "编写文章主体内容，添加代码示例"
                    },
                    {
                        date: "2025-07-18 16:00",
                        note: "文章校对和配图，发布到博客平台"
                    }
                ],
                customViews: ["已完成任务", "内容创作"],
                project: "personal"
            }
        });
        
        // 7月19日（周日）- 除了原有的一个，再添加几个
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
                dueDate: "2025-07-19",
                plannedDate: "2025-07-19",
                tags: ["笔记整理", "知识管理", "复盘"],
                                startTime: "2025-07-19T10:00:00",
                endTime: "2025-07-19T11:30:00",
                progressLog: [
                    {
                        date: "2025-07-19 10:00",
                        note: "汇总本周的技术学习要点"
                    },
                    {
                        date: "2025-07-19 10:30",
                        note: "整理代码片段和最佳实践"
                    },
                    {
                        date: "2025-07-19 11:00",
                        note: "创建知识图谱，建立概念联系"
                    },
                    {
                        date: "2025-07-19 11:30",
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
                dueDate: "2025-07-19",
                plannedDate: "2025-07-19",
                tags: ["规划", "工作安排"],
                                startTime: "2025-07-19T16:00:00",
                endTime: "2025-07-19T17:00:00",
                progressLog: [
                    {
                        date: "2025-07-19 16:00",
                        note: "回顾本周未完成的任务"
                    },
                    {
                        date: "2025-07-19 16:20",
                        note: "确定下周的优先级任务"
                    },
                    {
                        date: "2025-07-19 16:40",
                        note: "安排会议和协作时间"
                    },
                    {
                        date: "2025-07-19 17:00",
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["晨读", "学习", "习惯"],
                                startTime: "2025-07-22T06:30:00",
                endTime: "2025-07-22T07:30:00",
                progressLog: [
                    {
                        date: "2025-07-20 06:30",
                        note: "开始阅读Hacker News头条"
                    },
                    {
                        date: "2025-07-20 07:00",
                        note: "浏览Medium上的React最佳实践文章"
                    },
                    {
                        date: "2025-07-20 07:20",
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["运动", "健康", "习惯"],
                                startTime: "2025-07-22T07:30:00",
                endTime: "2025-07-22T08:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 07:30",
                        note: "开始晨跑，天气晴朗"
                    },
                    {
                        date: "2025-07-20 07:55",
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["规划", "工作", "每日例行"],
                                startTime: "2025-07-22T08:30:00",
                endTime: "2025-07-22T08:55:00",
                progressLog: [
                    {
                        date: "2025-07-22 08:30",
                        note: "查看日历和待办事项"
                    },
                    {
                        date: "2025-07-22 08:40",
                        note: "确定今日三个最重要的任务"
                    },
                    {
                        date: "2025-07-22 08:50",
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
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["会议", "敏捷", "每日例行"],
                                startTime: "2025-07-20T09:00:00",
                endTime: "2025-07-20T09:15:00",
                progressLog: [
                    {
                        date: "2025-07-20 09:00",
                        note: "团队成员同步昨日完成的工作"
                    },
                    {
                        date: "2025-07-20 09:10",
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
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["算法", "学习", "面试准备"],
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
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["总结", "反思", "每日例行"],
                                progressLog: [],
                customViews: ["今日必做", "个人成长"],
                project: "personal"
            }
        });
        
        // ========================================
        // 未来一周的计划任务
        // ========================================
        
        // 明天（7月21日）
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
                dueDate: "2025-07-21",
                plannedDate: "2025-07-21",
                tags: ["发布", "里程碑", "重要"],
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
                dueDate: "2025-07-21",
                plannedDate: "2025-07-21",
                tags: ["演示", "客户", "重要"],
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
                dueDate: "2025-07-21",
                plannedDate: "2025-07-21",
                tags: ["文档", "用户手册"],
                                progressLog: [],
                customViews: ["明日任务", "文档工作"],
                project: "mntask"
            }
        });
        
        // 7月22日（周三）
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["性能优化", "前端", "用户体验"],
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-22",
                tags: ["分享", "团队", "架构"],
                                progressLog: [],
                customViews: ["本周任务", "知识分享"],
                project: "work"
            }
        });
        
        // 7月23日（周四）
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
                dueDate: "2025-07-23",
                plannedDate: "2025-07-23",
                tags: ["测试", "CI/CD", "基础设施"],
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
                dueDate: "2025-07-23",
                plannedDate: "2025-07-23",
                tags: ["会议", "产品规划", "决策"],
                                progressLog: [],
                customViews: ["本周任务", "产品规划"],
                project: "work"
            }
        });
        
        // 7月24日（周五）
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
                dueDate: "2025-07-24",
                plannedDate: "2025-07-24",
                tags: ["代码审查", "质量", "协作"],
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
                dueDate: "2025-07-24",
                plannedDate: "2025-07-24",
                tags: ["周报", "总结", "例行"],
                                progressLog: [],
                customViews: ["本周任务", "例行任务"],
                project: "work"
            }
        });
        
        // 7月25日（周六）
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
                dueDate: "2025-07-25",
                plannedDate: "2025-07-25",
                tags: ["开源", "贡献", "学习"],
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
                plannedDate: "2025-07-27",
                tags: ["MNAI", "新项目", "AI"],
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
                dueDate: "2025-07-31",
                plannedDate: "2025-07-28",
                tags: ["绩效", "自评", "重要"],
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
                dueDate: "2025-07-22",
                plannedDate: "2025-07-20",
                tags: ["重构", "跨天任务", "架构"],
                                startTime: "2025-07-20T09:00:00",
                estimatedHours: 24,
                progressLog: [
                    {
                        date: "2025-07-20 09:00",
                        note: "开始分析现有数据访问层的问题"
                    },
                    {
                        date: "2025-07-20 12:00",
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
                dueDate: "2025-07-21",
                plannedDate: "2025-07-21",
                tags: ["会议", "每日例行", "敏捷"],
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
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["后台任务", "自动化", "持续运行"],
                                isBackground: true,
                startTime: "2025-07-20T00:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 00:00",
                        note: "数据同步服务启动"
                    },
                    {
                        date: "2025-07-20 06:00",
                        note: "已同步1000条记录"
                    },
                    {
                        date: "2025-07-20 12:00",
                        note: "已同步2500条记录"
                    }
                ],
                customViews: ["后台任务", "系统维护"],
                project: "work"
            }
        });
        
        // ========================================
        // 个人提升项目
        // ========================================
        
        // 健身目标
        const goalFitness = {
            id: `task_${taskId++}`,
            type: "目标",
            status: "进行中",
            title: "2025年健身目标：体脂率降至15%",
            path: "",
            launchLink: "marginnote4app://note/goal-fitness-2025",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-12-31",
                tags: ["健身", "健康", "长期目标"],
                progressLog: [
                    {
                        date: "2025-07-01 06:00",
                        note: "制定年度健身计划，目前体脂率：22%"
                    },
                    {
                        date: "2025-07-15 18:00",
                        note: "两周进展：体脂率降至21.5%，坚持每天运动"
                    }
                ],
                customViews: ["个人目标", "健康管理"],
                project: "fitness"
            }
        };
        tasks.push(goalFitness);
        
        // 健身任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "已完成",
            title: "力量训练 - 胸部和肩部",
            path: goalFitness.title,
            launchLink: "marginnote4app://note/task-workout-chest",
            currentFocus: false,
            todayPlannedTime: "06:00-07:00",
            fields: {
                priority: "中",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["力量训练", "健身", "习惯"],
                startTime: "2025-07-20T06:00:00",
                endTime: "2025-07-20T07:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 06:00",
                        note: "热身：5分钟跑步机"
                    },
                    {
                        date: "2025-07-20 06:10",
                        note: "卧推：4组x12次，重量60kg"
                    },
                    {
                        date: "2025-07-20 06:25",
                        note: "哑铃飞鸟：3组x15次"
                    },
                    {
                        date: "2025-07-20 06:40",
                        note: "肩部推举：4组x10次"
                    },
                    {
                        date: "2025-07-20 06:55",
                        note: "拉伸放松，补充蛋白质"
                    }
                ],
                customViews: ["今日必做", "健身记录"],
                project: "fitness"
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
                plannedDate: "2025-07-20",
                tags: ["学习", "长期目标", "AI"],
                                estimatedDays: 90,
                progressLog: [
                    {
                        date: "2025-07-15 20:00",
                        note: "完成Andrew Ng课程第1周内容"
                    },
                    {
                        date: "2025-07-20 20:00",
                        note: "开始学习第2周：线性回归"
                    }
                ],
                customViews: ["长期目标", "技能提升"],
                project: "personal"
            }
        });
        
        // 阅读计划
        const projectReading = {
            id: `task_${taskId++}`,
            type: "项目",
            status: "进行中",
            title: "2025年度阅读计划 - 每月至少2本书",
            path: "",
            launchLink: "marginnote4app://note/project-reading-2025",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-12-31",
                tags: ["阅读", "学习", "个人成长"],
                progressLog: [
                    {
                        date: "2025-07-01 20:00",
                        note: "制定年度阅读清单，包含技术、管理、人文等类别"
                    },
                    {
                        date: "2025-07-10 21:00",
                        note: "完成第1本：《第五项修炼》"
                    },
                    {
                        date: "2025-07-19 21:00",
                        note: "完成第2本：《代码整洁之道》"
                    }
                ],
                customViews: ["阅读计划", "个人成长"],
                project: "reading"
            }
        };
        tasks.push(projectReading);
        
        // 阅读任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "阅读《认知天性》 - 第5-6章",
            path: projectReading.title,
            launchLink: "marginnote4app://note/task-reading-cognitive",
            currentFocus: false,
            todayPlannedTime: "21:30-22:30",
            fields: {
                priority: "低",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["阅读", "心理学", "认知科学"],
                progressLog: [
                    {
                        date: "2025-07-19 21:30",
                        note: "完成前4章，理解了系统1和系统2的区别"
                    },
                    {
                        date: "2025-07-20 21:30",
                        note: "开始第5章：过度自信和专家判断"
                    }
                ],
                customViews: ["今日必做", "阅读进度"],
                project: "reading"
            }
        });
        
        // ========================================
        // 并发任务和时间冲突场景
        // ========================================
        
        // 同时间的多个会议冲突
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "重要会议：项目启动会",
            path: "工作项目",
            launchLink: "marginnote4app://note/meeting-kickoff",
            currentFocus: false,
            todayPlannedTime: "10:00-11:00",
            fields: {
                priority: "高",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["会议", "项目启动", "重要"],
                startTime: "2025-07-20T10:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 10:00",
                        note: "会议开始，20人参与"
                    },
                    {
                        date: "2025-07-20 10:15",
                        note: "介绍项目背景和目标"
                    },
                    {
                        date: "2025-07-20 10:30",
                        note: "讨论技术方案和时间表"
                    }
                ],
                customViews: ["今日必做", "会议安排"],
                project: "work"
            }
        });
        
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "未开始",
            title: "紧急会议：客户问题处理",
            path: "工作项目",
            launchLink: "marginnote4app://note/meeting-urgent",
            currentFocus: false,
            todayPlannedTime: "10:30-11:30",
            fields: {
                priority: "高",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["会议", "紧急", "客户"],
                progressLog: [],
                customViews: ["今日必做", "会议安排"],
                project: "work"
            }
        });
        
        // 多任务并行处理
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "后台渲染：视频处理任务",
            path: `${goalEcommerce.title}`,
            launchLink: "",
            currentFocus: false,
            todayPlannedTime: "00:00-23:59",
            fields: {
                priority: "低",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["后台任务", "视频处理", "自动化"],
                isBackground: true,
                startTime: "2025-07-20T08:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 08:00",
                        note: "开始处理10个视频文件"
                    },
                    {
                        date: "2025-07-20 12:00",
                        note: "已完成5个视频的渲染"
                    },
                    {
                        date: "2025-07-20 16:00",
                        note: "完成8个，预计18:00全部完成"
                    }
                ],
                customViews: ["后台任务"],
                project: "ecommerce"
            }
        });
        
        // 增加更多有详细进度记录的任务
        tasks.push({
            id: `task_${taskId++}`,
            type: "动作",
            status: "进行中",
            title: "调试生产环境的内存泄漏问题",
            path: `${goalEcommerce.title}`,
            launchLink: "marginnote4app://note/task-debug-memory",
            currentFocus: true,
            todayPlannedTime: "11:00-13:00",
            fields: {
                priority: "高",
                dueDate: "2025-07-20",
                plannedDate: "2025-07-20",
                tags: ["调试", "性能问题", "紧急"],
                startTime: "2025-07-20T11:00:00",
                progressLog: [
                    {
                        date: "2025-07-20 11:00",
                        note: "开始分析生产环境日志，发现内存使用持续增长"
                    },
                    {
                        date: "2025-07-20 11:15",
                        note: "使用Chrome DevTools进行堆内存快照分析"
                    },
                    {
                        date: "2025-07-20 11:30",
                        note: "发现问题：事件监听器未正确移除"
                    },
                    {
                        date: "2025-07-20 11:45",
                        note: "遇到新问题：循环引用导致的内存泄漏"
                    },
                    {
                        date: "2025-07-20 12:00",
                        note: "使用WeakMap替换Map解决循环引用问题"
                    },
                    {
                        date: "2025-07-20 12:15",
                        note: "修复代码已部署到测试环境，开始监控"
                    },
                    {
                        date: "2025-07-20 12:30",
                        note: "内存使用稳定，准备推送到生产环境"
                    }
                ],
                customViews: ["今日必做", "技术问题"],
                project: "ecommerce"
            }
        });
        focusTasks.push(`task_${taskId-1}`);
        
        // ========================================
        // 已完成的目标和关键结果
        // ========================================
        
        // 已完成的目标
        tasks.push({
            id: `task_${taskId++}`,
            type: "目标",
            status: "已完成",
            title: "2024年Q4目标：完成MarginNote插件平台MVP版本",
            path: "",
            launchLink: "marginnote4app://note/goal-2024-q4",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-07-31",
                tags: ["Q4目标", "已完成", "MVP"],
                progressLog: [
                    {
                        date: "2025-06-01 09:00",
                        note: "制定季度目标，确定核心功能范围"
                    },
                    {
                        date: "2025-06-15 14:00",
                        note: "完成基础架构搭建和核心功能开发"
                    },
                    {
                        date: "2025-07-20 16:00",
                        note: "MVP版本测试通过，准备发布"
                    },
                    {
                        date: "2025-07-28 18:00",
                        note: "成功发布MVP版本，目标完成！"
                    }
                ],
                customViews: ["已完成目标", "里程碑"],
                project: "platform"
            }
        });
        
        // 已完成的关键结果
        tasks.push({
            id: `task_${taskId++}`,
            type: "关键结果",
            status: "已完成",
            title: "获得100+用户的Beta测试反馈",
            path: "2024年Q4目标：完成MarginNote插件平台MVP版本",
            launchLink: "marginnote4app://note/kr-beta-feedback",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "高",
                dueDate: "2025-07-15",
                tags: ["用户反馈", "Beta测试", "已完成"],
                progressLog: [
                    {
                        date: "2025-06-20 10:00",
                        note: "启动Beta测试计划，邀请20位种子用户"
                    },
                    {
                        date: "2025-06-25 14:00",
                        note: "收到首批反馈，发现几个关键易用性问题"
                    },
                    {
                        date: "2025-07-05 16:00",
                        note: "扩大测试范围，累计获得80位用户反馈"
                    },
                    {
                        date: "2025-07-15 18:00",
                        note: "达成目标！共收集120位用户的详细反馈"
                    }
                ],
                customViews: ["已完成KR", "用户研究"],
                project: "platform"
            }
        });
        
        // 未开始的目标
        tasks.push({
            id: `task_${taskId++}`,
            type: "目标",
            status: "未开始",
            title: "Q2目标：构建插件开发者生态系统",
            path: "",
            launchLink: "marginnote4app://note/goal-q2-ecosystem",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "中",
                dueDate: "2025-06-30",
                tags: ["Q2目标", "生态系统", "未来规划"],
                progressLog: [],
                customViews: ["未来目标", "Q2规划"],
                project: "ecosystem"
            }
        });
        
        // 暂停的关键结果
        tasks.push({
            id: `task_${taskId++}`,
            type: "关键结果",
            status: "暂停",
            title: "建立插件评分和评论系统",
            path: goalQ1.title,
            launchLink: "marginnote4app://note/kr-rating-system",
            currentFocus: false,
            todayPlannedTime: "",
            fields: {
                priority: "低",
                dueDate: "2025-03-15",
                tags: ["评分系统", "社区功能", "暂停"],
                progressLog: [
                    {
                        date: "2025-07-10 14:00",
                        note: "开始设计评分系统架构"
                    },
                    {
                        date: "2025-07-12 16:00",
                        note: "因优先级调整，暂时搁置此任务"
                    }
                ],
                customViews: ["暂停任务", "Q1规划"],
                project: "platform"
            }
        });
        
        // ========================================
        // 总结和统计
        // ========================================
        
        // 统计任务数量
        const taskStats = {
            total: tasks.length,
            byType: {
                goal: tasks.filter(t => t.type === '目标').length,
                kr: tasks.filter(t => t.type === '关键结果').length,
                project: tasks.filter(t => t.type === '项目').length,
                action: tasks.filter(t => t.type === '动作').length
            },
            byStatus: {
                todo: tasks.filter(t => t.status === '未开始').length,
                inProgress: tasks.filter(t => t.status === '进行中').length,
                paused: tasks.filter(t => t.status === '暂停').length,
                done: tasks.filter(t => t.status === '已完成').length
            },
            byPriority: {
                high: tasks.filter(t => t.fields.priority === '高').length,
                medium: tasks.filter(t => t.fields.priority === '中').length,
                low: tasks.filter(t => t.fields.priority === '低').length
            }
        };
        
        console.log('📊 测试数据统计:', taskStats);
        
        // 验证所有类型和状态组合都有覆盖
        const typesStatusCoverage = {};
        const types = ['目标', '关键结果', '项目', '动作'];
        const statuses = ['未开始', '进行中', '暂停', '已完成'];
        
        types.forEach(type => {
            typesStatusCoverage[type] = {};
            statuses.forEach(status => {
                typesStatusCoverage[type][status] = tasks.filter(
                    t => t.type === type && t.status === status
                ).length;
            });
        });
        
        console.log('🎯 类型-状态覆盖情况:', typesStatusCoverage);
        
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