"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, BookOpen, User, Calendar, Users, X, Plus } from "lucide-react"

// 增强的文献类型，包含完整的元数据信息
interface Literature {
  id: string
  title: string
  authors: string[] // 作者ID数组，支持多作者
  year: number
  type: "paper" | "book" | "conference" | "thesis" | "report" | "misc" // 扩展文献类型

  // 基本出版信息
  journal?: string // 期刊名称（论文用）
  publisher?: string // 出版社（书籍用）
  conference?: string // 会议名称（会议论文用）

  // 标识符
  doi?: string // DOI（论文用）
  isbn?: string // ISBN（书籍用）
  issn?: string // ISSN（期刊用）
  pmid?: string // PubMed ID
  arxivId?: string // arXiv ID
  bibKey?: string // BibTeX引用键

  // 页面和卷期信息
  pages?: string // 页码范围，如 "123-145" 或总页数
  volume?: string // 卷号
  issue?: string // 期号
  chapter?: string // 章节
  edition?: string // 版本

  // 详细信息
  abstract?: string // 摘要
  keywords?: string[] // 关键词
  language?: string // 语言
  url?: string // 网址链接

  // 地理和机构信息
  address?: string // 出版地址
  institution?: string // 机构（技术报告用）
  school?: string // 学校（学位论文用）

  // 编辑信息
  editor?: string[] // 编辑者
  series?: string // 丛书系列

  // 学术指标
  citationCount?: number // 被引用次数
  impactFactor?: number // 影响因子

  // 其他元数据
  note?: string // 备注
  tags?: string[] // 自定义标签
  addedDate?: string // 添加日期
  lastModified?: string // 最后修改日期

  // 文件信息
  pdfPath?: string // PDF文件路径
  fileSize?: number // 文件大小（字节）
}

interface Author {
  id: string
  name: string
  field: string
}

interface Journal {
  id: string
  name: string
  type: "journal" | "publisher" | "conference"
  issn?: string
}

// 重新设计的研究进展 - 支持多作者
interface Progress {
  id: string
  year: number
  description: string
  authors: string[] // 参与的作者ID数组
  relatedPaper?: string
  type: "individual" | "collaborative" // 个人研究还是合作研究
}

interface ReadingNote {
  id: string
  paperId: string
  paperTitle: string
  content: string
  page?: number
  timestamp: string
  tags: string[]
}

export default function LiteratureManagement() {
  // 状态管理
  const [activeMainTab, setActiveMainTab] = useState("management")
  const [activeSubTab, setActiveSubTab] = useState("literature")
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)

  // 在其他状态变量后添加
  const [editingLiterature, setEditingLiterature] = useState<Literature | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false)
  const [isAddLiteratureModalOpen, setIsAddLiteratureModalOpen] = useState(false)
  const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState(false)
  const [isAddProgressModalOpen, setIsAddProgressModalOpen] = useState(false)

  // 文献管理数据 - 增加更多作者用于测试
  const [authors, setAuthors] = useState<Author[]>([
    { id: "1", name: "Bill Gates", field: "Computer Science, Philanthropy" },
    { id: "2", name: "Paul Allen", field: "Computer Science, Software Development" },
    { id: "3", name: "Thomas S. Kuhn", field: "History of Science, Philosophy" },
    { id: "4", name: "Albert Einstein", field: "Theoretical Physics" },
    { id: "5", name: "Isaac Newton", field: "Physics, Mathematics" },
    { id: "6", name: "Charles Darwin", field: "Biology, Evolution" },
    { id: "7", name: "Marie Curie", field: "Physics, Chemistry" },
    { id: "8", name: "Stephen Hawking", field: "Theoretical Physics, Cosmology" },
    { id: "9", name: "Alan Turing", field: "Computer Science, Mathematics" },
    { id: "10", name: "Nikola Tesla", field: "Electrical Engineering, Physics" },
    { id: "11", name: "Leonardo da Vinci", field: "Art, Engineering, Science" },
    { id: "12", name: "Galileo Galilei", field: "Astronomy, Physics" },
    { id: "13", name: "James Watson", field: "Molecular Biology, Genetics" },
    { id: "14", name: "Francis Crick", field: "Molecular Biology, Biophysics" },
    { id: "15", name: "Rosalind Franklin", field: "X-ray Crystallography, Chemistry" },
  ])

  // 期刊/出版社数据
  const [journals, setJournals] = useState<Journal[]>([
    { id: "1", name: "Nature", type: "journal", issn: "0028-0836" },
    { id: "2", name: "Science", type: "journal", issn: "0036-8075" },
    { id: "3", name: "University of Chicago Press", type: "publisher" },
    { id: "4", name: "Methuen & Co.", type: "publisher" },
    { id: "5", name: "Cambridge University Press", type: "publisher" },
    { id: "6", name: "Oxford University Press", type: "publisher" },
    { id: "7", name: "Physical Review Letters", type: "journal", issn: "0031-9007" },
    { id: "8", name: "Journal of Computer Science", type: "journal" },
    { id: "9", name: "IEEE Transactions", type: "journal" },
    { id: "10", name: "ACM Computing Surveys", type: "journal" },
  ])

  const [literatures, setLiteratures] = useState<Literature[]>([
    {
      id: "1",
      title: "The Structure of Scientific Revolutions",
      authors: ["3"], // Thomas S. Kuhn
      year: 1962,
      type: "book",
      publisher: "University of Chicago Press",
      isbn: "978-0226458083",
      pages: "264",
      edition: "1st",
      address: "Chicago",
      language: "en",
      abstract:
        "A landmark work in the history and philosophy of science, introducing the concept of paradigm shifts in scientific progress.",
      keywords: ["philosophy of science", "paradigm shift", "scientific revolution", "history of science"],
      bibKey: "kuhn1962structure",
      citationCount: 15420,
      tags: ["classic", "philosophy"],
      addedDate: "2024-01-01",
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      title: "Relativity: The Special and General Theory",
      authors: ["4"], // Albert Einstein
      year: 1916,
      type: "book",
      publisher: "Methuen & Co.",
      isbn: "978-0486600819",
      pages: "188",
      address: "London",
      language: "en",
      abstract: "Einstein's own popular exposition of his theories of special and general relativity.",
      keywords: ["relativity", "physics", "spacetime", "gravity"],
      bibKey: "einstein1916relativity",
      citationCount: 8934,
      tags: ["physics", "classic"],
      addedDate: "2024-01-02",
      lastModified: "2024-01-16",
    },
    {
      id: "3",
      title: "Molecular Structure of Nucleic Acids: A Structure for Deoxyribose Nucleic Acid",
      authors: ["13", "14"], // James Watson 和 Francis Crick
      year: 1953,
      type: "paper",
      journal: "Nature",
      volume: "171",
      issue: "4356",
      pages: "737-738",
      doi: "10.1038/171737a0",
      pmid: "13054692",
      language: "en",
      abstract:
        "We wish to suggest a structure for the salt of deoxyribose nucleic acid (D.N.A.). This structure has novel features which are of considerable biological interest.",
      keywords: ["DNA", "double helix", "molecular biology", "genetics"],
      bibKey: "watson1953molecular",
      citationCount: 12567,
      impactFactor: 49.962,
      tags: ["breakthrough", "biology"],
      addedDate: "2024-01-03",
      lastModified: "2024-01-17",
    },
    {
      id: "4",
      title: "On the Origin of Species",
      authors: ["6"], // Charles Darwin
      year: 1859,
      type: "book",
      publisher: "John Murray",
      isbn: "978-0486450063",
      pages: "502",
      address: "London",
      language: "en",
      abstract:
        "Darwin's theory of evolution through natural selection, one of the most important scientific works ever published.",
      keywords: ["evolution", "natural selection", "biology", "species"],
      bibKey: "darwin1859origin",
      citationCount: 25678,
      tags: ["evolution", "classic", "biology"],
      addedDate: "2024-01-04",
      lastModified: "2024-01-18",
    },
    {
      id: "5",
      title: "A Brief History of Time",
      authors: ["8"], // Stephen Hawking
      year: 1988,
      type: "book",
      publisher: "Bantam Books",
      isbn: "978-0553380163",
      pages: "256",
      address: "New York",
      language: "en",
      abstract:
        "A popular science book that discusses the fundamental questions about the universe and our existence within it.",
      keywords: ["cosmology", "black holes", "time", "universe", "physics"],
      bibKey: "hawking1988brief",
      citationCount: 4521,
      tags: ["popular science", "cosmology"],
      addedDate: "2024-01-05",
      lastModified: "2024-01-19",
    },
  ])

  // 独立的研究进展数据 - 支持多作者
  const [progressList, setProgressList] = useState<Progress[]>([
    {
      id: "1",
      year: 1978,
      description:
        "与 Paul Allen 共同创立了 Microsoft，并发布了 Microsoft FORTRAN，这是公司为微型计算机开发的第一个高级语言。",
      authors: ["1", "2"], // Bill Gates 和 Paul Allen
      type: "collaborative",
    },
    {
      id: "2",
      year: 1981,
      description: "推出 MS-DOS 操作系统，为个人计算机奠定了基础。",
      authors: ["1", "2"], // Bill Gates 和 Paul Allen
      type: "collaborative",
    },
    {
      id: "3",
      year: 1962,
      description: '出版了《科学革命的结构》，提出了"范式转移"（paradigm shift）的概念，深刻影响了科学史和科学哲学。',
      authors: ["3"], // Thomas S. Kuhn
      type: "individual",
    },
    {
      id: "4",
      year: 1905,
      description: "发表狭义相对论，提出了时空的新概念。",
      authors: ["4"], // Albert Einstein
      type: "individual",
    },
    {
      id: "5",
      year: 1915,
      description: "完成广义相对论，重新定义了引力的本质。",
      authors: ["4"], // Albert Einstein
      type: "individual",
    },
  ])

  // 文献阅读数据
  const [readingNotes, setReadingNotes] = useState<ReadingNote[]>([
    {
      id: "1",
      paperId: "1",
      paperTitle: "The Structure of Scientific Revolutions",
      content: "范式转移的概念非常重要，它解释了科学革命是如何发生的。",
      page: 23,
      timestamp: "2024-01-15 14:30",
      tags: ["范式转移", "科学革命"],
    },
    {
      id: "2",
      paperId: "2",
      paperTitle: "Relativity: The Special and General Theory",
      content: "时间和空间不是绝对的，而是相对的概念。这个观点彻底改变了我们对宇宙的理解。",
      page: 45,
      timestamp: "2024-01-16 09:15",
      tags: ["相对论", "时空"],
    },
  ])

  // 表单状态
  const [newAuthor, setNewAuthor] = useState({ name: "", field: "" })
  const [newJournal, setNewJournal] = useState({
    name: "",
    type: "journal" as "journal" | "publisher" | "conference",
    issn: "",
  })
  const [newLiterature, setNewLiterature] = useState({
    title: "",
    selectedAuthors: [] as string[],
    year: "",
    type: "paper" as "paper" | "book" | "conference" | "thesis" | "report" | "misc",
    journal: "",
    publisher: "",
    conference: "",
    isbn: "",
    issn: "",
    doi: "",
    pmid: "",
    arxivId: "",
    bibKey: "",
    pages: "",
    volume: "",
    issue: "",
    chapter: "",
    edition: "",
    abstract: "",
    keywords: [] as string[],
    language: "zh-CN",
    url: "",
    address: "",
    institution: "",
    school: "",
    editor: [] as string[],
    series: "",
    citationCount: "",
    impactFactor: "",
    note: "",
    tags: [] as string[],
  })
  const [newProgress, setNewProgress] = useState({
    year: "",
    description: "",
    relatedPaper: "",
    selectedAuthors: [] as string[],
    type: "individual" as "individual" | "collaborative",
  })
  const [newNote, setNewNote] = useState({ paperId: "", paperTitle: "", content: "", page: "", tags: "" })

  // 论文表单的搜索状态
  const [literatureSearch, setLiteratureSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "paper" | "book">("all")
  const [paperAuthorSearch, setPaperAuthorSearch] = useState("")
  const [paperJournalSearch, setPaperJournalSearch] = useState("")
  const [showPaperAuthorDropdown, setShowPaperAuthorDropdown] = useState(false)
  const [showPaperJournalDropdown, setShowPaperJournalDropdown] = useState(false)
  const [filteredPaperAuthors, setFilteredPaperAuthors] = useState<Author[]>([])
  const [filteredPaperJournals, setFilteredPaperJournals] = useState<Journal[]>([])

  // 研究进展的作者搜索相关状态
  const [progressAuthorSearchTerm, setProgressAuthorSearchTerm] = useState("")
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false)
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([])

  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [authorFilters, setAuthorFilters] = useState<string[]>([]) // 改为数组支持多选
  const [authorLibrarySearchTerm, setAuthorLibrarySearchTerm] = useState("") // 作者库搜索状态
  const [progressAuthorFilterSearchTerm, setProgressAuthorFilterSearchTerm] = useState("") // 研究进展作者筛选搜索状态

  // 添加作者筛选相关状态
  const [showAuthorFilterDropdown, setShowAuthorFilterDropdown] = useState(false)
  const [filteredAuthorFilters, setFilteredAuthorFilters] = useState<Author[]>([])

  // 引用
  const paperAuthorInputRef = useRef<HTMLInputElement>(null)
  const paperJournalInputRef = useRef<HTMLInputElement>(null)
  const paperAuthorDropdownRef = useRef<HTMLDivElement>(null)
  const paperJournalDropdownRef = useRef<HTMLDivElement>(null)
  const authorInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  // 添加作者筛选下拉框的引用
  const authorFilterInputRef = useRef<HTMLInputElement>(null)
  const authorFilterDropdownRef = useRef<HTMLDivElement>(null)

  // 处理论文作者搜索
  useEffect(() => {
    if (paperAuthorSearch.trim()) {
      const filtered = authors.filter(
        (author) =>
          author.name.toLowerCase().includes(paperAuthorSearch.toLowerCase()) &&
          !newLiterature.selectedAuthors.includes(author.id),
      )
      setFilteredPaperAuthors(filtered)
      setShowPaperAuthorDropdown(filtered.length > 0)
    } else {
      setFilteredPaperAuthors([])
      setShowPaperAuthorDropdown(false)
    }
  }, [paperAuthorSearch, authors, newLiterature.selectedAuthors])

  // 处理论文期刊搜索
  useEffect(() => {
    if (paperJournalSearch.trim()) {
      const filtered = journals.filter((journal) =>
        journal.name.toLowerCase().includes(paperJournalSearch.toLowerCase()),
      )
      setFilteredPaperJournals(filtered)
      setShowPaperJournalDropdown(filtered.length > 0)
    } else {
      setFilteredPaperJournals([])
      setShowPaperJournalDropdown(false)
    }
  }, [paperJournalSearch, journals])

  // 处理研究进展作者搜索
  useEffect(() => {
    if (progressAuthorSearchTerm.trim()) {
      const filtered = authors.filter(
        (author) =>
          author.name.toLowerCase().includes(progressAuthorSearchTerm.toLowerCase()) &&
          !newProgress.selectedAuthors.includes(author.id),
      )
      setFilteredAuthors(filtered)
      setShowAuthorDropdown(filtered.length > 0)
    } else {
      setFilteredAuthors([])
      setShowAuthorDropdown(false)
    }
  }, [progressAuthorSearchTerm, authors, newProgress.selectedAuthors])

  // 处理作者筛选搜索
  useEffect(() => {
    if (progressAuthorFilterSearchTerm.trim()) {
      const filtered = authors.filter(
        (author) =>
          author.name.toLowerCase().includes(progressAuthorFilterSearchTerm.toLowerCase()) &&
          !authorFilters.includes(author.id),
      )
      setFilteredAuthorFilters(filtered)
      setShowAuthorFilterDropdown(filtered.length > 0)
    } else {
      setFilteredAuthorFilters([])
      setShowAuthorFilterDropdown(false)
    }
  }, [progressAuthorFilterSearchTerm, authors, authorFilters])

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 论文作者下拉框
      if (
        paperAuthorDropdownRef.current &&
        !paperAuthorDropdownRef.current.contains(event.target as Node) &&
        paperAuthorInputRef.current &&
        !paperAuthorInputRef.current.contains(event.target as Node)
      ) {
        setShowPaperAuthorDropdown(false)
      }

      // 论文期刊下拉框
      if (
        paperJournalDropdownRef.current &&
        !paperJournalDropdownRef.current.contains(event.target as Node) &&
        paperJournalInputRef.current &&
        !paperJournalInputRef.current.contains(event.target as Node)
      ) {
        setShowPaperJournalDropdown(false)
      }

      // 研究进展作者下拉框
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        authorInputRef.current &&
        !authorInputRef.current.contains(event.target as Node)
      ) {
        setShowAuthorDropdown(false)
      }

      // 作者筛选下拉框
      if (
        authorFilterDropdownRef.current &&
        !authorFilterDropdownRef.current.contains(event.target as Node) &&
        authorFilterInputRef.current &&
        !authorFilterInputRef.current.contains(event.target as Node)
      ) {
        setShowAuthorFilterDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 获取作者姓名
  const getAuthorName = (authorId: string) => {
    const author = authors.find((a) => a.id === authorId)
    return author ? author.name : "未知作者"
  }

  // 获取论文作者列表字符串
  const getPaperAuthorsString = (authorIds: string[]) => {
    return authorIds.map((id) => getAuthorName(id)).join(", ")
  }

  // 获取期刊类型标签
  const getJournalTypeLabel = (type: string) => {
    switch (type) {
      case "journal":
        return "期刊"
      case "publisher":
        return "出版社"
      case "conference":
        return "会议"
      default:
        return "其他"
    }
  }

  // 添加作者
  const addAuthor = () => {
    if (newAuthor.name && newAuthor.field) {
      setAuthors([
        ...authors,
        {
          id: Date.now().toString(),
          name: newAuthor.name,
          field: newAuthor.field,
        },
      ])
      setNewAuthor({ name: "", field: "" })
      setIsAddAuthorModalOpen(false)
    }
  }

  // 添加期刊/出版社
  const addJournal = () => {
    if (newJournal.name) {
      setJournals([
        ...journals,
        {
          id: Date.now().toString(),
          name: newJournal.name,
          type: newJournal.type,
          issn: newJournal.issn || undefined,
        },
      ])
      setIsAddJournalModalOpen(false)
      setNewJournal({ name: "", type: "journal", issn: "" })
    }
  }

  // 添加作者到论文
  const addAuthorToLiterature = (authorId: string) => {
    if (!newLiterature.selectedAuthors.includes(authorId)) {
      setNewLiterature({
        ...newLiterature,
        selectedAuthors: [...newLiterature.selectedAuthors, authorId],
      })
    }
    setPaperAuthorSearch("")
    setShowPaperAuthorDropdown(false)
    // 重新聚焦到输入框
    setTimeout(() => {
      paperAuthorInputRef.current?.focus()
    }, 100)
  }

  // 从论文中移除作者
  const removeAuthorFromLiterature = (authorId: string) => {
    setNewLiterature({
      ...newLiterature,
      selectedAuthors: newLiterature.selectedAuthors.filter((id) => id !== authorId),
    })
  }

  // 选择论文期刊
  const selectPaperJournal = (journalName: string) => {
    setNewLiterature({ ...newLiterature, journal: journalName })
    setPaperJournalSearch(journalName)
    setShowPaperJournalDropdown(false)
  }

  // 添加论文
  const addLiterature = () => {
    if (newLiterature.title && newLiterature.selectedAuthors.length > 0 && newLiterature.year) {
      setLiteratures([
        ...literatures,
        {
          id: Date.now().toString(),
          title: newLiterature.title,
          authors: newLiterature.selectedAuthors,
          year: Number.parseInt(newLiterature.year),
          type: newLiterature.type,
          journal: newLiterature.type === "paper" ? newLiterature.journal : undefined,
          publisher: newLiterature.type === "book" ? newLiterature.publisher : undefined,
          isbn: newLiterature.type === "book" ? newLiterature.isbn : undefined,
          pages:
            newLiterature.type === "book" && newLiterature.pages ? Number.parseInt(newLiterature.pages) : undefined,
          doi: newLiterature.type === "paper" ? newLiterature.doi : undefined,
        },
      ])
      setIsAddLiteratureModalOpen(false)
      setNewLiterature({
        title: "",
        selectedAuthors: [],
        year: "",
        type: "paper",
        journal: "",
        publisher: "",
        isbn: "",
        pages: "",
        doi: "",
      })
      setPaperAuthorSearch("")
      setPaperJournalSearch("")
    }
  }

  // 开始编辑文献
  const startEditLiterature = (literature: Literature) => {
    setEditingLiterature(literature)
    setNewLiterature({
      title: literature.title,
      selectedAuthors: literature.authors,
      year: literature.year.toString(),
      type: literature.type,
      journal: literature.journal || "",
      publisher: literature.publisher || "",
      isbn: literature.isbn || "",
      pages: literature.pages?.toString() || "",
      doi: literature.doi || "",
    })
    // 移除这行，避免自动触发下拉框
    // setPaperJournalSearch(literature.type === "paper" ? literature.journal || "" : literature.publisher || "")
    setIsEditModalOpen(true)
  }

  // 保存编辑的文献
  const saveEditedLiterature = () => {
    if (editingLiterature && newLiterature.title && newLiterature.selectedAuthors.length > 0 && newLiterature.year) {
      setLiteratures(
        literatures.map((lit) =>
          lit.id === editingLiterature.id
            ? {
                ...lit,
                title: newLiterature.title,
                authors: newLiterature.selectedAuthors,
                year: Number.parseInt(newLiterature.year),
                type: newLiterature.type,
                journal: newLiterature.type === "paper" ? newLiterature.journal : undefined,
                publisher: newLiterature.type === "book" ? newLiterature.publisher : undefined,
                isbn: newLiterature.type === "book" ? newLiterature.isbn : undefined,
                pages:
                  newLiterature.type === "book" && newLiterature.pages
                    ? Number.parseInt(newLiterature.pages)
                    : undefined,
                doi: newLiterature.type === "paper" ? newLiterature.doi : undefined,
              }
            : lit,
        ),
      )
      cancelEdit()
    }
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingLiterature(null)
    setIsEditModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
      journal: "",
      publisher: "",
      isbn: "",
      pages: "",
      doi: "",
    })
    setPaperAuthorSearch("")
    setPaperJournalSearch("")
  }

  // 取消添加作者
  const cancelAddAuthor = () => {
    setIsAddAuthorModalOpen(false)
    setNewAuthor({ name: "", field: "" })
  }

  // 添加作者到进展
  const addAuthorToProgress = (authorId: string) => {
    if (!newProgress.selectedAuthors.includes(authorId)) {
      setNewProgress({
        ...newProgress,
        selectedAuthors: [...newProgress.selectedAuthors, authorId],
      })
    }
    setProgressAuthorSearchTerm("")
    setShowAuthorDropdown(false)
    // 重新聚焦到输入框
    setTimeout(() => {
      authorInputRef.current?.focus()
    }, 100)
  }

  // 从进展中移除作者
  const removeAuthorFromProgress = (authorId: string) => {
    setNewProgress({
      ...newProgress,
      selectedAuthors: newProgress.selectedAuthors.filter((id) => id !== authorId),
    })
  }

  // 添加研究进展
  const addProgress = () => {
    if (newProgress.year && newProgress.description && newProgress.selectedAuthors.length > 0) {
      const progressType = newProgress.selectedAuthors.length > 1 ? "collaborative" : "individual"
      setProgressList([
        ...progressList,
        {
          id: Date.now().toString(),
          year: Number.parseInt(newProgress.year),
          description: newProgress.description,
          authors: newProgress.selectedAuthors,
          relatedPaper: newProgress.relatedPaper,
          type: progressType,
        },
      ])
      setIsAddProgressModalOpen(false)
      setNewProgress({
        year: "",
        description: "",
        relatedPaper: "",
        selectedAuthors: [],
        type: "individual",
      })
      setProgressAuthorSearchTerm("")
    }
  }

  // 添加阅读笔记
  const addReadingNote = () => {
    if (newNote.paperId && newNote.content) {
      setReadingNotes([
        ...readingNotes,
        {
          id: Date.now().toString(),
          paperId: newNote.paperId,
          paperTitle: newNote.paperTitle,
          content: newNote.content,
          page: newNote.page ? Number.parseInt(newNote.page) : undefined,
          timestamp: new Date().toLocaleString(),
          tags: newNote.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
      ])
      setNewNote({ paperId: "", paperTitle: "", content: "", page: "", tags: "" })
    }
  }

  // 删除功能
  const deleteAuthor = (id: string) => {
    setAuthors(authors.filter((author) => author.id !== id))
    // 同时从所有进展中移除该作者
    setProgressList(
      progressList
        .map((progress) => ({
          ...progress,
          authors: progress.authors.filter((authorId) => authorId !== id),
        }))
        .filter((progress) => progress.authors.length > 0),
    )
    // 同时从所有论文中移除该作者
    setLiteratures(
      literatures
        .map((literature) => ({
          ...literature,
          authors: literature.authors.filter((authorId) => authorId !== id),
        }))
        .filter((literature) => literature.authors.length > 0),
    )
  }

  // 取消添加文献
  const cancelAddLiterature = () => {
    setIsAddLiteratureModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
      journal: "",
      publisher: "",
      isbn: "",
      pages: "",
      doi: "",
    })
    setPaperAuthorSearch("")
    setPaperJournalSearch("")
  }

  const deleteJournal = (id: string) => {
    setJournals(journals.filter((journal) => journal.id !== id))
  }

  const deleteLiterature = (id: string) => {
    setLiteratures(literatures.filter((literature) => literature.id !== id))
  }

  const deleteProgress = (progressId: string) => {
    setProgressList(progressList.filter((progress) => progress.id !== progressId))
  }

  const deleteNote = (id: string) => {
    setReadingNotes(readingNotes.filter((note) => note.id !== id))
  }

  // 获取某个作者的相关进展
  const getAuthorProgress = (authorId: string) => {
    return progressList.filter((progress) => progress.authors.includes(authorId))
  }

  // 筛选研究进展
  const filteredProgress = progressList.filter((progress) => {
    const matchesSearch =
      progress.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      progress.authors.some((authorId) => getAuthorName(authorId).toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesYear = !yearFilter || progress.year.toString() === yearFilter
    const matchesAuthor =
      authorFilters.length === 0 || progress.authors.some((authorId) => authorFilters.includes(authorId))
    return matchesSearch && matchesYear && matchesAuthor
  })

  // 获取某个作者的相关文献
  const getAuthorLiteratures = (authorId: string) => {
    return literatures.filter((literature) => literature.authors.includes(authorId))
  }

  // 筛选文献
  const filteredLiteratures = literatures.filter((literature) => {
    const matchesSearch = literature.title.toLowerCase().includes(literatureSearch.toLowerCase())
    const matchesType = typeFilter === "all" || literature.type === typeFilter
    return matchesSearch && matchesType
  })

  // 取消添加期刊
  const cancelAddJournal = () => {
    setIsAddJournalModalOpen(false)
    setNewJournal({ name: "", type: "journal", issn: "" })
  }

  // 添加取消添加进展函数
  const cancelAddProgress = () => {
    setIsAddProgressModalOpen(false)
    setNewProgress({
      year: "",
      description: "",
      relatedPaper: "",
      selectedAuthors: [],
      type: "individual",
    })
    setProgressAuthorSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            文献管理与阅读系统
          </h1>
          <p className="text-gray-600 text-lg">专业的学术文献管理平台</p>
        </div>

        {/* Enhanced Main Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveMainTab("management")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeMainTab === "management"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>文献管理</span>
                </button>
                <button
                  onClick={() => setActiveMainTab("reading")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeMainTab === "reading"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>文献阅读</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sub Tabs for Management */}
        {activeMainTab === "management" && (
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-1.5 shadow-md border border-gray-100">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveSubTab("literature")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeSubTab === "literature"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>文献库</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("authors")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeSubTab === "authors"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>作者</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("journals")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeSubTab === "journals"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>期刊出版社</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("keywords")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeSubTab === "keywords"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span>关键词</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 文献管理面板 */}
        {activeMainTab === "management" && (
          <div className="space-y-6">
            {/* 论文管理 */}
            {activeSubTab === "literature" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        文献库
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => setIsAddLiteratureModalOpen(true)} className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          添加文献
                        </Button>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="搜索文献..."
                            value={literatureSearch}
                            onChange={(e) => setLiteratureSearch(e.target.value)}
                            className="pl-10 w-48"
                          />
                        </div>
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value as "all" | "paper" | "book")}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="all">所有类型</option>
                          <option value="paper">论文</option>
                          <option value="book">书籍</option>
                        </select>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredLiteratures.map((literature) => (
                        <div key={literature.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold">{literature.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600">{getPaperAuthorsString(literature.authors)}</span>
                              {literature.authors.length > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  {literature.authors.length} 位作者
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>{literature.year}</span>
                                {literature.type === "paper" && literature.journal && (
                                  <>
                                    <span>•</span>
                                    <span>{literature.journal}</span>
                                    {literature.volume && <span>Vol. {literature.volume}</span>}
                                    {literature.issue && <span>({literature.issue})</span>}
                                  </>
                                )}
                                {literature.type === "book" && literature.publisher && (
                                  <>
                                    <span>•</span>
                                    <span>{literature.publisher}</span>
                                  </>
                                )}
                                {literature.type === "conference" && literature.conference && (
                                  <>
                                    <span>•</span>
                                    <span>{literature.conference}</span>
                                  </>
                                )}
                                {literature.pages && (
                                  <>
                                    <span>•</span>
                                    <span>pp. {literature.pages}</span>
                                  </>
                                )}
                              </div>
                              {literature.doi && (
                                <div className="text-xs text-blue-600 mt-1">DOI: {literature.doi}</div>
                              )}
                              {literature.citationCount && (
                                <div className="text-xs text-green-600 mt-1">被引用: {literature.citationCount} 次</div>
                              )}
                              {literature.keywords && literature.keywords.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {literature.keywords.slice(0, 3).map((keyword, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                  {literature.keywords.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{literature.keywords.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditLiterature(literature)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteLiterature(literature.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 添加论文表单 - 支持多作者 */}

                {/* 编辑文献模态框 */}
                {isEditModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">编辑文献</h3>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">文献标题 *</label>
                          <Input
                            placeholder="请输入文献标题"
                            value={newLiterature.title}
                            onChange={(e) => setNewLiterature({ ...newLiterature, title: e.target.value })}
                          />
                        </div>

                        {/* 多作者选择 */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">作者 *</label>
                          {/* 已选择的作者 */}
                          {newLiterature.selectedAuthors.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {newLiterature.selectedAuthors.map((authorId, index) => (
                                <Badge key={authorId} variant="secondary" className="flex items-center gap-1">
                                  {index === 0 && <span className="text-xs">第一作者:</span>}
                                  {getAuthorName(authorId)}
                                  <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                    onClick={() => removeAuthorFromLiterature(authorId)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* 作者搜索输入框 */}
                          <div className="relative">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  ref={paperAuthorInputRef}
                                  placeholder="搜索并添加作者..."
                                  value={paperAuthorSearch}
                                  onChange={(e) => setPaperAuthorSearch(e.target.value)}
                                  onFocus={() => {
                                    if (filteredPaperAuthors.length > 0) {
                                      setShowPaperAuthorDropdown(true)
                                    }
                                  }}
                                  className="pl-10"
                                />
                              </div>
                            </div>

                            {/* 作者下拉列表 */}
                            {showPaperAuthorDropdown && (
                              <div
                                ref={paperAuthorDropdownRef}
                                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                              >
                                {filteredPaperAuthors.length > 0 ? (
                                  filteredPaperAuthors.map((author) => (
                                    <div
                                      key={author.id}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onClick={() => addAuthorToLiterature(author.id)}
                                    >
                                      <div className="font-medium">{author.name}</div>
                                      <div className="text-sm text-gray-600">{author.field}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-2 text-gray-500 text-sm">
                                    {paperAuthorSearch ? "未找到匹配的作者" : "开始输入以搜索作者"}
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              从 {authors.length} 位作者中搜索。第一个添加的作者将作为第一作者。
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">发表年份 *</label>
                            <Input
                              placeholder="如：2024"
                              type="number"
                              value={newLiterature.year}
                              onChange={(e) => setNewLiterature({ ...newLiterature, year: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">文献类型 *</label>
                            <select
                              value={newLiterature.type}
                              onChange={(e) =>
                                setNewLiterature({
                                  ...newLiterature,
                                  type: e.target.value as
                                    | "paper"
                                    | "book"
                                    | "conference"
                                    | "thesis"
                                    | "report"
                                    | "misc",
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="paper">学术论文</option>
                              <option value="book">图书</option>
                              <option value="conference">会议论文</option>
                              <option value="thesis">学位论文</option>
                              <option value="report">技术报告</option>
                              <option value="misc">其他</option>
                            </select>
                          </div>
                        </div>

                        {/* 根据文献类型显示不同字段 */}
                        {newLiterature.type === "paper" && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">发表期刊</label>
                            <div className="relative">
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    ref={paperJournalInputRef}
                                    placeholder="搜索期刊..."
                                    value={newLiterature.journal}
                                    onChange={(e) => {
                                      setPaperJournalSearch(e.target.value)
                                      setNewLiterature({ ...newLiterature, journal: e.target.value })
                                    }}
                                    onFocus={() => {
                                      if (filteredPaperJournals.length > 0) {
                                        setShowPaperJournalDropdown(true)
                                      }
                                    }}
                                    className="pl-10"
                                  />
                                </div>
                              </div>

                              {/* 期刊下拉列表 */}
                              {showPaperJournalDropdown && (
                                <div
                                  ref={paperJournalDropdownRef}
                                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                                >
                                  {filteredPaperJournals.length > 0 ? (
                                    filteredPaperJournals.map((journal) => (
                                      <div
                                        key={journal.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => selectPaperJournal(journal.name)}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">{journal.name}</div>
                                          <Badge variant="outline" className="text-xs">
                                            {getJournalTypeLabel(journal.type)}
                                          </Badge>
                                        </div>
                                        {journal.issn && (
                                          <div className="text-sm text-gray-600">ISSN: {journal.issn}</div>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="px-4 py-2 text-gray-500 text-sm">
                                      {paperJournalSearch ? "未找到匹配的期刊" : "开始输入以搜索"}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {newLiterature.type === "book" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">出版社</label>
                              <Input
                                placeholder="如：清华大学出版社"
                                value={newLiterature.publisher}
                                onChange={(e) => setNewLiterature({ ...newLiterature, publisher: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">ISBN</label>
                              <Input
                                placeholder="如：978-7-302-12345-6"
                                value={newLiterature.isbn}
                                onChange={(e) => setNewLiterature({ ...newLiterature, isbn: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">页码/页数</label>
                            <Input
                              placeholder={newLiterature.type === "paper" ? "如：123-145" : "如：264"}
                              value={newLiterature.pages}
                              onChange={(e) => setNewLiterature({ ...newLiterature, pages: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">DOI</label>
                            <Input
                              placeholder="如：10.1038/171737a0"
                              value={newLiterature.doi}
                              onChange={(e) => setNewLiterature({ ...newLiterature, doi: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={saveEditedLiterature}
                            className="flex-1"
                            disabled={
                              newLiterature.selectedAuthors.length === 0 || !newLiterature.title || !newLiterature.year
                            }
                          >
                            保存修改
                          </Button>
                          <Button variant="outline" onClick={cancelEdit} className="flex-1 bg-transparent">
                            取消
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 添加文献模态框 */}
                {isAddLiteratureModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">添加新文献</h3>
                        <Button variant="ghost" size="sm" onClick={cancelAddLiterature}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">文献标题 *</label>
                          <Input
                            placeholder="请输入文献标题"
                            value={newLiterature.title}
                            onChange={(e) => setNewLiterature({ ...newLiterature, title: e.target.value })}
                          />
                        </div>

                        {/* 多作者选择 */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">作者 *</label>
                          {/* 已选择的作者 */}
                          {newLiterature.selectedAuthors.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {newLiterature.selectedAuthors.map((authorId, index) => (
                                <Badge key={authorId} variant="secondary" className="flex items-center gap-1">
                                  {index === 0 && <span className="text-xs">第一作者:</span>}
                                  {getAuthorName(authorId)}
                                  <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                    onClick={() => removeAuthorFromLiterature(authorId)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* 作者搜索输入框 */}
                          <div className="relative">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  ref={paperAuthorInputRef}
                                  placeholder="搜索并添加作者..."
                                  value={paperAuthorSearch}
                                  onChange={(e) => setPaperAuthorSearch(e.target.value)}
                                  onFocus={() => {
                                    if (filteredPaperAuthors.length > 0) {
                                      setShowPaperAuthorDropdown(true)
                                    }
                                  }}
                                  className="pl-10"
                                />
                              </div>
                            </div>

                            {/* 作者下拉列表 */}
                            {showPaperAuthorDropdown && (
                              <div
                                ref={paperAuthorDropdownRef}
                                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                              >
                                {filteredPaperAuthors.length > 0 ? (
                                  filteredPaperAuthors.map((author) => (
                                    <div
                                      key={author.id}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onClick={() => addAuthorToLiterature(author.id)}
                                    >
                                      <div className="font-medium">{author.name}</div>
                                      <div className="text-sm text-gray-600">{author.field}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-2 text-gray-500 text-sm">
                                    {paperAuthorSearch ? "未找到匹配的作者" : "开始输入以搜索作者"}
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              从 {authors.length} 位作者中搜索。第一个添加的作者将作为第一作者。
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">发表年份 *</label>
                            <Input
                              placeholder="如：2024"
                              type="number"
                              value={newLiterature.year}
                              onChange={(e) => setNewLiterature({ ...newLiterature, year: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">文献类型 *</label>
                            <select
                              value={newLiterature.type}
                              onChange={(e) =>
                                setNewLiterature({
                                  ...newLiterature,
                                  type: e.target.value as
                                    | "paper"
                                    | "book"
                                    | "conference"
                                    | "thesis"
                                    | "report"
                                    | "misc",
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="paper">学术论文</option>
                              <option value="book">图书</option>
                              <option value="conference">会议论文</option>
                              <option value="thesis">学位论文</option>
                              <option value="report">技术报告</option>
                              <option value="misc">其他</option>
                            </select>
                          </div>
                        </div>

                        {/* 根据文献类型显示不同字段 */}
                        {newLiterature.type === "paper" && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">发表期刊</label>
                            <div className="relative">
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    ref={paperJournalInputRef}
                                    placeholder="搜索期刊..."
                                    value={newLiterature.journal}
                                    onChange={(e) => {
                                      setPaperJournalSearch(e.target.value)
                                      setNewLiterature({ ...newLiterature, journal: e.target.value })
                                    }}
                                    onFocus={() => {
                                      if (filteredPaperJournals.length > 0) {
                                        setShowPaperJournalDropdown(true)
                                      }
                                    }}
                                    className="pl-10"
                                  />
                                </div>
                              </div>

                              {/* 期刊下拉列表 */}
                              {showPaperJournalDropdown && (
                                <div
                                  ref={paperJournalDropdownRef}
                                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                                >
                                  {filteredPaperJournals.length > 0 ? (
                                    filteredPaperJournals.map((journal) => (
                                      <div
                                        key={journal.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => selectPaperJournal(journal.name)}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">{journal.name}</div>
                                          <Badge variant="outline" className="text-xs">
                                            {getJournalTypeLabel(journal.type)}
                                          </Badge>
                                        </div>
                                        {journal.issn && (
                                          <div className="text-sm text-gray-600">ISSN: {journal.issn}</div>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="px-4 py-2 text-gray-500 text-sm">
                                      {paperJournalSearch ? "未找到匹配的期刊" : "开始输入以搜索"}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {newLiterature.type === "book" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">出版社</label>
                              <Input
                                placeholder="如：清华大学出版社"
                                value={newLiterature.publisher}
                                onChange={(e) => setNewLiterature({ ...newLiterature, publisher: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">ISBN</label>
                              <Input
                                placeholder="如：978-7-302-12345-6"
                                value={newLiterature.isbn}
                                onChange={(e) => setNewLiterature({ ...newLiterature, isbn: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">页码/页数</label>
                            <Input
                              placeholder={newLiterature.type === "paper" ? "如：123-145" : "如：264"}
                              value={newLiterature.pages}
                              onChange={(e) => setNewLiterature({ ...newLiterature, pages: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">DOI</label>
                            <Input
                              placeholder="如：10.1038/171737a0"
                              value={newLiterature.doi}
                              onChange={(e) => setNewLiterature({ ...newLiterature, doi: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={addLiterature}
                            className="flex-1"
                            disabled={newLiterature.selectedAuthors.length === 0}
                          >
                            添加文献
                          </Button>
                          <Button variant="outline" onClick={cancelAddLiterature} className="flex-1 bg-transparent">
                            取消
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 作者库 */}
            {activeSubTab === "authors" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 作者列表 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        作者库 ({authors.length} 位作者)
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => setIsAddAuthorModalOpen(true)} className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          添加作者
                        </Button>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="搜索作者..."
                            value={authorLibrarySearchTerm}
                            onChange={(e) => setAuthorLibrarySearchTerm(e.target.value)}
                            className="pl-10 w-48"
                          />
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {authors
                        .filter((author) => {
                          const matchesSearch =
                            author.name.toLowerCase().includes(authorLibrarySearchTerm.toLowerCase()) ||
                            author.field.toLowerCase().includes(authorLibrarySearchTerm.toLowerCase())
                          return matchesSearch
                        })
                        .map((author) => {
                          const authorProgress = getAuthorProgress(author.id)
                          const authorLiteratures = getAuthorLiteratures(author.id)
                          return (
                            <div key={author.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{author.name}</h3>
                                  <p className="text-sm text-gray-600">{author.field}</p>
                                  <div className="flex gap-4 text-xs text-blue-600 mt-1">
                                    <span>{authorProgress.length} 个研究进展</span>
                                    <span>{authorLiteratures.length} 篇文献</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedAuthor(selectedAuthor === author.id ? null : author.id)}
                                  >
                                    {selectedAuthor === author.id ? "收起" : "展开"}
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => deleteAuthor(author.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* 作者的相关信息 */}
                              {selectedAuthor === author.id && (
                                <div className="mt-4 space-y-4 border-t pt-4">
                                  {/* 相关论文 */}
                                  {authorLiteratures.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                                        <BookOpen className="w-4 h-4" />
                                        相关文献
                                      </h4>
                                      {authorLiteratures.map((literature) => (
                                        <div key={literature.id} className="bg-blue-50 p-3 rounded text-sm mb-2">
                                          <div className="font-medium">{literature.title}</div>
                                          <div className="text-xs text-gray-600 mt-1">
                                            {getPaperAuthorsString(literature.authors)} • {literature.year}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* 研究进展 */}
                                  <div>
                                    <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                                      <Calendar className="w-4 h-4" />
                                      研究进展
                                    </h4>
                                    {authorProgress.map((progress) => (
                                      <div key={progress.id} className="bg-gray-50 p-3 rounded text-sm mb-2">
                                        <div className="flex items-center justify-between mb-1">
                                          <Badge variant="outline">{progress.year}</Badge>
                                          {progress.type === "collaborative" && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                              <Users className="w-3 h-3" />
                                              合作研究
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-gray-700 mb-2">{progress.description}</p>
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-gray-500">参与者:</span>
                                          {progress.authors.map((authorId) => (
                                            <Badge key={authorId} variant="outline" className="text-xs">
                                              {getAuthorName(authorId)}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>

                {/* 研究进展记录 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        研究进展记录
                      </div>
                      <Button onClick={() => setIsAddProgressModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        记录进展
                      </Button>
                    </CardTitle>

                    {/* 重新设计的筛选区域 */}
                    <div className="space-y-3">
                      {/* 第一行：搜索和年份筛选 */}
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="搜索进展..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Input
                          placeholder="年份"
                          type="number"
                          value={yearFilter}
                          onChange={(e) => setYearFilter(e.target.value)}
                          className="w-24"
                        />
                      </div>

                      {/* 第二行：作者筛选 */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              ref={authorFilterInputRef}
                              placeholder="添加作者筛选..."
                              value={progressAuthorFilterSearchTerm}
                              onChange={(e) => setProgressAuthorFilterSearchTerm(e.target.value)}
                              onFocus={() => {
                                if (filteredAuthorFilters.length > 0) {
                                  setShowAuthorFilterDropdown(true)
                                }
                              }}
                              className="pl-10"
                            />
                          </div>
                          {authorFilters.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAuthorFilters([])
                                setProgressAuthorFilterSearchTerm("")
                              }}
                              className="px-3"
                            >
                              清空筛选
                            </Button>
                          )}
                        </div>

                        {/* 已选择的作者筛选标签 */}
                        {authorFilters.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {authorFilters.map((authorId) => (
                              <Badge key={authorId} variant="secondary" className="flex items-center gap-1 text-xs">
                                {getAuthorName(authorId)}
                                <X
                                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                                  onClick={() => setAuthorFilters(authorFilters.filter((id) => id !== authorId))}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* 作者筛选下拉列表 */}
                        {showAuthorFilterDropdown && (
                          <div ref={authorFilterDropdownRef} className="relative z-20">
                            <div className="absolute top-0 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {filteredAuthorFilters.length > 0 ? (
                                filteredAuthorFilters.map((author) => (
                                  <div
                                    key={author.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => {
                                      setAuthorFilters([...authorFilters, author.id])
                                      setProgressAuthorFilterSearchTerm("")
                                      setShowAuthorFilterDropdown(false)
                                    }}
                                  >
                                    <div className="font-medium">{author.name}</div>
                                    <div className="text-sm text-gray-600">{author.field}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500 text-sm">
                                  {progressAuthorFilterSearchTerm ? "未找到匹配的作者" : "开始输入以搜索作者"}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredProgress.map((progress) => (
                        <div key={progress.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{progress.year}</Badge>
                              {progress.type === "collaborative" && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  合作研究
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteProgress(progress.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{progress.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">参与者:</span>
                            {progress.authors.map((authorId) => (
                              <Badge key={authorId} variant="outline" className="text-xs">
                                {getAuthorName(authorId)}
                              </Badge>
                            ))}
                          </div>
                          {progress.relatedPaper && (
                            <p className="text-xs text-blue-600 mt-2">关联文献: {progress.relatedPaper}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 添加研究进展模态框 */}
            {isAddProgressModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">记录研究进展</h3>
                    <Button variant="ghost" size="sm" onClick={cancelAddProgress}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="年份"
                        type="number"
                        value={newProgress.year}
                        onChange={(e) => setNewProgress({ ...newProgress, year: e.target.value })}
                      />
                      <Input
                        placeholder="关联文献 (可选)"
                        value={newProgress.relatedPaper}
                        onChange={(e) => setNewProgress({ ...newProgress, relatedPaper: e.target.value })}
                      />
                    </div>

                    {/* 改进的作者选择 */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">参与作者</label>

                      {/* 已选择的作者 */}
                      {newProgress.selectedAuthors.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {newProgress.selectedAuthors.map((authorId) => (
                            <Badge key={authorId} variant="secondary" className="flex items-center gap-1">
                              {getAuthorName(authorId)}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeAuthorFromProgress(authorId)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* 作者搜索输入框 */}
                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              ref={authorInputRef}
                              placeholder="搜索并添加作者..."
                              value={progressAuthorSearchTerm}
                              onChange={(e) => setProgressAuthorSearchTerm(e.target.value)}
                              onFocus={() => {
                                if (filteredAuthors.length > 0) {
                                  setShowAuthorDropdown(true)
                                }
                              }}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        {/* 作者下拉列表 */}
                        {showAuthorDropdown && (
                          <div
                            ref={dropdownRef}
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                          >
                            {filteredAuthors.length > 0 ? (
                              filteredAuthors.map((author) => (
                                <div
                                  key={author.id}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => addAuthorToProgress(author.id)}
                                >
                                  <div className="font-medium">{author.name}</div>
                                  <div className="text-sm text-gray-600">{author.field}</div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500 text-sm">
                                {progressAuthorSearchTerm ? "未找到匹配的作者" : "开始输入以搜索作者"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 提示信息 */}
                      <p className="text-xs text-gray-500 mt-1">
                        输入作者姓名进行搜索，点击选择。当前作者库有 {authors.length} 位作者。
                      </p>
                    </div>

                    <Textarea
                      placeholder="研究进展描述"
                      value={newProgress.description}
                      onChange={(e) => setNewProgress({ ...newProgress, description: e.target.value })}
                      rows={4}
                    />

                    <Button
                      onClick={addProgress}
                      className="w-full"
                      disabled={newProgress.selectedAuthors.length === 0}
                    >
                      记录进展{" "}
                      {newProgress.selectedAuthors.length > 0 && `(${newProgress.selectedAuthors.length} 位作者)`}
                    </Button>
                  </CardContent>
                </div>
              </div>
            )}

            {/* 添加作者模态框 */}
            {isAddAuthorModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">添加新作者</h3>
                    <Button variant="ghost" size="sm" onClick={cancelAddAuthor}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">作者姓名</label>
                      <Input
                        placeholder="请输入作者姓名"
                        value={newAuthor.name}
                        onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">研究领域</label>
                      <Input
                        placeholder="请输入研究领域"
                        value={newAuthor.field}
                        onChange={(e) => setNewAuthor({ ...newAuthor, field: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addAuthor} className="flex-1" disabled={!newAuthor.name || !newAuthor.field}>
                        添加作者
                      </Button>
                      <Button variant="outline" onClick={cancelAddAuthor} className="flex-1 bg-transparent">
                        取消
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 期刊管理 */}
        {activeSubTab === "journals" && (
          <div className="space-y-4">
            {/* 期刊列表 - 全宽显示 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    期刊出版社管理 ({journals.length} 个)
                  </div>
                  <Button onClick={() => setIsAddJournalModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    添加期刊/出版社
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {journals.map((journal) => (
                    <div key={journal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{journal.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {getJournalTypeLabel(journal.type)}
                            </Badge>
                          </div>
                          {journal.issn && <p className="text-sm text-gray-600">ISSN: {journal.issn}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteJournal(journal.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 添加期刊模态框 */}
            {isAddJournalModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">添加新期刊/出版社</h3>
                    <Button variant="ghost" size="sm" onClick={cancelAddJournal}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">名称</label>
                      <Input
                        placeholder="请输入期刊/出版社名称"
                        value={newJournal.name}
                        onChange={(e) => setNewJournal({ ...newJournal, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">类型</label>
                        <select
                          value={newJournal.type}
                          onChange={(e) =>
                            setNewJournal({
                              ...newJournal,
                              type: e.target.value as "journal" | "publisher" | "conference",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="journal">期刊</option>
                          <option value="publisher">出版社</option>
                          <option value="conference">会议</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">ISSN (可选)</label>
                        <Input
                          placeholder="如：0028-0836"
                          value={newJournal.issn}
                          onChange={(e) => setNewJournal({ ...newJournal, issn: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addJournal} className="flex-1" disabled={!newJournal.name}>
                        添加期刊/出版社
                      </Button>
                      <Button variant="outline" onClick={cancelAddJournal} className="flex-1 bg-transparent">
                        取消
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "keywords" && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">关键词管理功能开发中...</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 文献阅读面板 */}
      {activeMainTab === "reading" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 添加阅读笔记 */}
            <Card>
              <CardHeader>
                <CardTitle>添加阅读笔记</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="文献ID"
                    value={newNote.paperId}
                    onChange={(e) => setNewNote({ ...newNote, paperId: e.target.value })}
                  />
                  <Input
                    placeholder="页码 (可选)"
                    type="number"
                    value={newNote.page}
                    onChange={(e) => setNewNote({ ...newNote, page: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="文献标题"
                  value={newNote.paperTitle}
                  onChange={(e) => setNewNote({ ...newNote, paperTitle: e.target.value })}
                />
                <Textarea
                  placeholder="笔记内容"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4}
                />
                <Input
                  placeholder="标签 (用逗号分隔)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                />
                <Button onClick={addReadingNote} className="w-full">
                  添加笔记
                </Button>
              </CardContent>
            </Card>

            {/* 阅读笔记列表 */}
            <Card>
              <CardHeader>
                <CardTitle>阅读笔记</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {readingNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{note.paperTitle}</Badge>
                          {note.page && <Badge variant="outline">第 {note.page} 页</Badge>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{note.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
