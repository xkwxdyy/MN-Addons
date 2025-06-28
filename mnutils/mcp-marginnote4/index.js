#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MarginNote4 开发助手 MCP 服务器
class MarginNote4DevServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mcp-marginnote4-dev',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'validate_plugin',
          description: '验证 MarginNote4 插件的文件结构和配置',
          inputSchema: {
            type: 'object',
            properties: {
              pluginPath: {
                type: 'string',
                description: '插件目录的绝对路径',
              },
            },
            required: ['pluginPath'],
          },
        },
        {
          name: 'generate_card_type',
          description: '生成新的知识卡片类型定义',
          inputSchema: {
            type: 'object',
            properties: {
              typeName: {
                type: 'string',
                description: '卡片类型名称（中文）',
              },
              englishName: {
                type: 'string',
                description: '卡片类型英文名',
              },
              colorIndex: {
                type: 'number',
                description: '颜色索引 (0-15)',
              },
              fields: {
                type: 'array',
                items: { type: 'string' },
                description: '字段列表',
              },
            },
            required: ['typeName', 'englishName', 'colorIndex', 'fields'],
          },
        },
        {
          name: 'format_chinese_text',
          description: '使用 Pangu.js 规则格式化中文文本',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: '需要格式化的文本',
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'build_plugin',
          description: '打包 MarginNote4 插件为 .mnaddon 文件',
          inputSchema: {
            type: 'object',
            properties: {
              pluginPath: {
                type: 'string',
                description: '插件目录的绝对路径',
              },
              outputName: {
                type: 'string',
                description: '输出文件名（不含扩展名）',
              },
            },
            required: ['pluginPath'],
          },
        },
        {
          name: 'analyze_note_structure',
          description: '分析笔记结构，识别字段和内容',
          inputSchema: {
            type: 'object',
            properties: {
              noteData: {
                type: 'string',
                description: '笔记数据（JSON 格式）',
              },
            },
            required: ['noteData'],
          },
        },
      ],
    }));

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'validate_plugin':
          return await this.validatePlugin(request.params.arguments);
        
        case 'generate_card_type':
          return await this.generateCardType(request.params.arguments);
        
        case 'format_chinese_text':
          return await this.formatChineseText(request.params.arguments);
        
        case 'build_plugin':
          return await this.buildPlugin(request.params.arguments);
        
        case 'analyze_note_structure':
          return await this.analyzeNoteStructure(request.params.arguments);
        
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  // 验证插件结构
  async validatePlugin({ pluginPath }) {
    const errors = [];
    const warnings = [];
    
    try {
      // 检查必需文件
      const requiredFiles = ['main.js', 'mnaddon.json'];
      for (const file of requiredFiles) {
        const filePath = path.join(pluginPath, file);
        try {
          await fs.access(filePath);
        } catch {
          errors.push(`缺少必需文件: ${file}`);
        }
      }

      // 检查 mnaddon.json
      try {
        const configPath = path.join(pluginPath, 'mnaddon.json');
        const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
        
        if (!config.addonid) errors.push('mnaddon.json 缺少 addonid');
        // 支持 MN3 的 title 字段和 MN4 的 name 字段
        if (!config.name && !config.title) errors.push('mnaddon.json 缺少 name 或 title');
        if (!config.version) errors.push('mnaddon.json 缺少 version');
        
        // 检查版本格式
        if (config.version && !/^\d+\.\d+\.\d+$/.test(config.version)) {
          warnings.push('版本号格式建议使用 x.y.z');
        }
      } catch (e) {
        errors.push('mnaddon.json 格式错误或无法读取');
      }

      // 检查核心库
      const corePath = path.join(pluginPath, 'mnutils.js');
      try {
        await fs.access(corePath);
      } catch {
        warnings.push('未找到 mnutils.js，请确保已包含核心库');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: errors.length === 0,
              errors,
              warnings,
              message: errors.length === 0 ? '插件结构验证通过' : '插件结构存在问题',
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `验证失败: ${error.message}`,
          },
        ],
      };
    }
  }

  // 生成卡片类型定义
  async generateCardType({ typeName, englishName, colorIndex, fields }) {
    const typeDefinition = {
      refName: typeName,
      prefixName: typeName,
      englishName: englishName,
      templateNoteId: "marginnote4app://note/[替换为模板ID]",
      ifIndependent: true,
      colorIndex: colorIndex,
      fields: fields,
    };

    const code = `// 在 MNMath.types 中添加以下定义
${typeName}: ${JSON.stringify(typeDefinition, null, 2).replace(/"([^"]+)":/g, '$1:')},`;

    return {
      content: [
        {
          type: 'text',
          text: code,
        },
      ],
    };
  }

  // 格式化中文文本
  async formatChineseText({ text }) {
    // 实现 Pangu.spacing 的核心规则
    let formatted = text;
    
    // 中英文之间加空格
    formatted = formatted.replace(/([\u4e00-\u9fa5])([\w])/g, '$1 $2');
    formatted = formatted.replace(/([\w])([\u4e00-\u9fa5])/g, '$1 $2');
    
    // 中文与数字之间加空格
    formatted = formatted.replace(/([\u4e00-\u9fa5])(\d)/g, '$1 $2');
    formatted = formatted.replace(/(\d)([\u4e00-\u9fa5])/g, '$1 $2');
    
    // 标点符号全角化
    formatted = formatted.replace(/,/g, '，');
    formatted = formatted.replace(/\./g, '。');
    formatted = formatted.replace(/!/g, '！');
    formatted = formatted.replace(/\?/g, '？');
    formatted = formatted.replace(/;/g, '；');
    formatted = formatted.replace(/:/g, '：');
    
    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }

  // 打包插件
  async buildPlugin({ pluginPath, outputName }) {
    try {
      const name = outputName || path.basename(pluginPath);
      const outputPath = path.join(pluginPath, `${name}.mnaddon`);
      
      // 使用 zip 命令打包（macOS 自带）
      const { stdout, stderr } = await execAsync(
        `cd "${pluginPath}" && zip -r "${outputPath}" . -x "*.mnaddon" -x ".*" -x "__MACOSX/*"`
      );
      
      if (stderr && !stderr.includes('warning')) {
        throw new Error(stderr);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `插件已打包到: ${outputPath}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `打包失败: ${error.message}`,
          },
        ],
      };
    }
  }

  // 分析笔记结构
  async analyzeNoteStructure({ noteData }) {
    try {
      const note = JSON.parse(noteData);
      const analysis = {
        title: note.title || '无标题',
        commentsCount: note.comments?.length || 0,
        fields: [],
        contentTypes: {},
      };

      // 分析评论类型
      if (note.comments) {
        note.comments.forEach((comment, index) => {
          const type = comment.type || 'unknown';
          analysis.contentTypes[type] = (analysis.contentTypes[type] || 0) + 1;
          
          // 识别 HTML 字段
          if (type === 'htmlComment' && comment.text?.includes('span')) {
            const match = comment.text.match(/>([^<]+)</);
            if (match) {
              analysis.fields.push({
                name: match[1].trim(),
                index: index,
                type: 'html_field',
              });
            }
          }
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `分析失败: ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MarginNote4 Dev MCP Server started');
  }
}

// 启动服务器
const server = new MarginNote4DevServer();
server.run().catch(console.error);