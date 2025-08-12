"use client"

import { useState, useRef, useEffect } from "react"

// 参考文献引用接口
interface Reference {
  id: string
  literatureId: string // 引用的文献ID
  citationKey: string // 引用词，如 "1", "Bill 1", "Einstein2016" 等
  citations: Citation[] // 具体的引用内容列表
}

// 具体引用内容接口
interface Citation {
  id: string
  content: string // 引用的具体内容，如"参考了第23页的理论框架"
  page?: number // 引用的页码
  note?: string // 引用备注
  timestamp: string // 添加时间
}

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

  // 参考文献列表
  references?: Reference[] // 参考文献列表
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

  // 参考文献相关状态
  const [isAddReferenceModalOpen, setIsAddReferenceModalOpen] = useState(false)
  const [currentLiteratureId, setCurrentLiteratureId] = useState<string | null>(null)
  const [referenceSearch, setReferenceSearch] = useState("")
  const [showReferenceDropdown, setShowReferenceDropdown] = useState(false)
  const [filteredReferences, setFilteredReferences] = useState<Literature[]>([])
  const [newReference, setNewReference] = useState({
    literatureId: "",
    citationKey: "",
    citations: [],
  })

  // 引用内容相关状态
  const [isAddCitationModalOpen, setIsAddCitationModalOpen] = useState(false)
  const [currentReferenceId, setCurrentReferenceId] = useState<string | null>(null)
  const [newCitation, setNewCitation] = useState({
    content: "",
    page: "",
    note: "",
  })

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
      references: [
        {
          id: "ref1",
          literatureId: "2",
          citationKey: "Einstein1916",
          citations: [
            {
              id: "cit1",
              content: "引用了相对论的基本概念",
              page: 45,
              note: "用于支持范式转移理论",
              timestamp: "2024-01-15 14:30",
            },
            {
              id: "cit2",
              content: "参考了时空概念的革命性变化",
              page: 67,
              timestamp: "2024-01-15 15:20",
            },
          ],
        },
      ],
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
      references: [],
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
      references: [
        {
          id: "ref2",
          literatureId: "4",
          citationKey: "1",
          citations: [],
        },
      ],
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
      references: [],
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
      references: [
        {
          id: "ref3",
          literatureId: "2",
          citationKey: "Einstein",
          citations: [],
        },
      ],
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
  // 参考文献搜索引用
  const referenceInputRef = useRef<HTMLInputElement>(null)
  const referenceDropdownRef = useRef<HTMLDivElement>(null)

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

  // 处理参考文献搜索
  useEffect(() => {
    if (referenceSearch.trim() && currentLiteratureId) {
      const filtered = literatures.filter(
        (lit) =>
          lit.id !== currentLiteratureId && // 不能引用自己
          (lit.title.toLowerCase().includes(referenceSearch.toLowerCase()) ||
            getPaperAuthorsString(lit.authors).toLowerCase().includes(referenceSearch.toLowerCase())),
      )
      setFilteredReferences(filtered)
      setShowReferenceDropdown(filtered.length > 0)
    } else {
      setFilteredReferences([])
      setShowReferenceDropdown(false)
    }
  }, [referenceSearch, literatures, currentLiteratureId])

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

      // 参考文献搜索下拉框
      if (
        referenceDropdownRef.current &&
        !referenceDropdownRef.current.contains(event.target as Node) &&
        referenceInputRef.current &&
        !referenceInputRef.current.contains(event.target as Node)
      ) {
        setShowReferenceDropdown(false)
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

  // 获取文献信息
  const getLiteratureById = (id: string) => {
    return literatures.find((lit) => lit.id === id)
  }

  // 添加参考文献
  const addReference = () => {
    if (newReference.literatureId && newReference.citationKey && currentLiteratureId) {
      const reference: Reference = {
        id: Date.now().toString(),
        literatureId: newReference.literatureId,
        citationKey: newReference.citationKey,
        citations: [],
      }

      setLiteratures(
        literatures.map((lit) =>
          lit.id === currentLiteratureId ? { ...lit, references: [...(lit.references || []), reference] } : lit,
        ),
      )

      setNewReference({ literatureId: "", citationKey: "", citations: [] })
      setReferenceSearch("")
      setIsAddReferenceModalOpen(false)
    }
  }

  // 删除参考文献
  const deleteReference = (literatureId: string, referenceId: string) => {
    setLiteratures(
      literatures.map((lit) =>
        lit.id === literatureId ? { ...lit, references: lit.references?.filter((ref) => ref.id !== referenceId) } : lit,
      ),
    )
  }

  // 选择参考文献
  const selectReference = (literatureId: string) => {
    setNewReference({ ...newReference, literatureId })
    setReferenceSearch("")
    setShowReferenceDropdown(false)
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
          references: [], // 初始化空的参考文献列表
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

  // 添加引用内容
  const addCitation = () => {
    if (newCitation.content && currentReferenceId) {
      const citation: Citation = {
        id: Date.now().toString(),
        content: newCitation.content,
        page: newCitation.page ? Number.parseInt(newCitation.page) : undefined,
        note: newCitation.note,
        timestamp: new Date().toISOString(),
      }

      setLiteratures(
        literatures.map((lit) =>
          lit.id === currentLiteratureId
            ? {
                ...lit,
                references: lit.references?.map((ref) =>
                  ref.id === currentReferenceId ? { ...ref, citations: [...ref.citations, citation] } : ref,
                ),
              }
            : lit,
        ),
      )

      setNewCitation({ content: "", page: "", note: "" })
      setIsAddCitationModalOpen(false)
    }
  }

  // 删除引用内容
  const deleteCitation = (literatureId: string, referenceId: string, citationId: string) => {
    setLiteratures(
      literatures.map((lit) =>
        lit.id === literatureId
          ? {
              ...lit,
              references: lit.references?.map((ref) =>
                ref.id === referenceId
                  ? { ...ref, citations: ref.citations.filter((cit) => cit.id !== citationId) }
                  : ref,
              ),
            }
          : lit,
      ),
    )
  }

  // 选择引用内容
  const selectCitation = (citation: Citation) => {
    setNewCitation({ ...newCitation, content: citation.content, page: citation.page?.toString() || "", note: citation.note || "" })
    setIsAddCitationModalOpen(true)
  }

  // 添加研究进展
  const addProgress = () => {
    if (newProgress.description && newProgress.selectedAuthors.length > 0 && newProgress.year) {
      setProgressList([
        ...progressList,
        {
          id: Date.now().toString(),
          year: Number.parseInt(newProgress.year),
          description: newProgress.description,
          authors: newProgress.selectedAuthors,
          relatedPaper: newProgress.relatedPaper,
          type: newProgress.type,
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
    }
  }

  // 取消添加研究进展
  const cancelAddProgress = () => {
    setIsAddProgressModalOpen(false)
    setNewProgress({
      year: "",
      description: "",
      relatedPaper: "",
      selectedAuthors: [],
      type: "individual",
    })
  }

  // 取消添加引用内容
  const cancelAddCitation = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 取消添加参考文献
  const cancelAddReference = () => {
    setIsAddReferenceModalOpen(false)
    setNewReference({ literatureId: "", citationKey: "", citations: [] })
  }

  // 取消添加阅读笔记
  const cancelAddNote = () => {
    setNewNote({ paperId: "", paperTitle: "", content: "", page: "", tags: "" })
  }

  // 添加阅读笔记
  const addNote = () => {
    if (newNote.content && newNote.paperId) {
      setReadingNotes([
        ...readingNotes,
        {
          id: Date.now().toString(),
          paperId: newNote.paperId,
          paperTitle: newNote.paperTitle,
          content: newNote.content,
          page: newNote.page ? Number.parseInt(newNote.page) : undefined,
          timestamp: new Date().toISOString(),
          tags: newNote.tags.split(", ").filter(tag => tag.trim() !== ""),
        },
      ])
      cancelAddNote()
    }
  }

  // 删除阅读笔记
  const deleteNote = (noteId: string) => {
    setReadingNotes(readingNotes.filter((note) => note.id !== noteId))
  }

  // 选择阅读笔记
  const selectNote = (note: ReadingNote) => {
    setNewNote({ ...note, tags: note.tags.join(", ") })
    setIsAddNoteModalOpen(true)
  }

  // 添加作者筛选
  const addAuthorFilter = (authorId: string) => {
    if (!authorFilters.includes(authorId)) {
      setAuthorFilters([...authorFilters, authorId])
    }
    setProgressAuthorFilterSearchTerm("")
    setShowAuthorFilterDropdown(false)
    // 重新聚焦到输入框
    setTimeout(() => {
      authorFilterInputRef.current?.focus()
    }, 100)
  }

  // 移除作者筛选
  const removeAuthorFilter = (authorId: string) => {
    setAuthorFilters(authorFilters.filter((id) => id !== authorId))
  }

  // 取消添加作者筛选
  const cancelAddAuthorFilter = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框状态
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false)
  const [isAddAuthorFilterModalOpen, setIsAddAuthorFilterModalOpen] = useState(false)

  // 添加作者筛选模态框
  const handleAddAuthorFilter = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilter = () => {
    cancelAddAuthorFilter()
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilter()
  }

  // 添加阅读笔记模态框状态
  const handleAddNote = () => {
    setIsAddNoteModalOpen(true)
  }

  // 取消添加阅读笔记模态框
  const handleCancelAddNote = () => {
    cancelAddNote()
  }

  // 添加阅读笔记模态框提交
  const handleAddNoteSubmit = () => {
    addNote()
  }

  // 添加研究进展模态框状态
  const handleAddProgress = () => {
    setIsAddProgressModalOpen(true)
  }

  // 取消添加研究进展模态框
  const handleCancelAddProgress = () => {
    cancelAddProgress()
  }

  // 添加研究进展模态框提交
  const handleAddProgressSubmit = () => {
    addProgress()
  }

  // 添加参考文献模态框状态
  const handleAddReference = () => {
    setIsAddReferenceModalOpen(true)
  }

  // 取消添加参考文献模态框
  const handleCancelAddReference = () => {
    cancelAddReference()
  }

  // 添加参考文献模态框提交
  const handleAddReferenceSubmit = () => {
    addReference()
  }

  // 添加引用内容模态框状态
  const handleAddCitation = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitation = () => {
    cancelAddCitation()
  }

  // 添加引用内容模态框提交
  const handleAddCitationSubmit = () => {
    addCitation()
  }

  // 编辑文献模态框状态
  const handleEditLiterature = (literature: Literature) => {
    startEditLiterature(literature)
  }

  // 取消编辑文献模态框
  const handleCancelEditLiterature = () => {
    cancelEdit()
  }

  // 编辑文献模态框提交
  const handleEditLiteratureSubmit = () => {
    saveEditedLiterature()
  }

  // 添加作者模态框状态
  const handleAddAuthor = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者模态框
  const handleCancelAddAuthor = () => {
    cancelAddAuthor()
  }

  // 添加作者模态框提交
  const handleAddAuthorSubmit = () => {
    addAuthor()
  }

  // 添加期刊/出版社模态框状态
  const handleAddJournal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊/出版社模态框
  const handleCancelAddJournal = () => {
    setIsAddJournalModalOpen(false)
    setNewJournal({ name: "", type: "journal", issn: "" })
  }

  // 添加期刊/出版社模态框提交
  const handleAddJournalSubmit = () => {
    addJournal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgress = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgress = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgress()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiterature = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiterature = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiterature()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiterature = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiterature = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiterature()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReference = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReference = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitation = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReference = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNote = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReference = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitation = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgress = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgress = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgress()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加作者到论文模态框提交
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加期刊模态框状态
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(true)
  }

  // 取消添加期刊模态框
  const handleCancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddJournalModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",
      address: "",
      institution: "",
      school: "",
      editor: [],
      series: "",
      citationCount: "",
      impactFactor: "",
      note: "",
      tags: [],
    })
  }

  // 添加期刊模态框提交
  const handleAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddJournalToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加引用内容模态框状态
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(true)
  }

  // 取消添加引用内容模态框
  const handleCancelAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddCitationModalOpen(false)
    setNewCitation({ content: "", page: "", note: "" })
  }

  // 添加引用内容模态框提交
  const handleAddCitationToReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    addCitation()
  }

  // 删除引用内容模态框状态
  const handleDeleteCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string, citationId: string) => {
    deleteCitation(literatureId, referenceId, citationId)
  }

  // 删除参考文献模态框状态
  const handleDeleteReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string, referenceId: string) => {
    deleteReference(literatureId, referenceId)
  }

  // 删除阅读笔记模态框状态
  const handleDeleteNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (noteId: string) => {
    deleteNote(noteId)
  }

  // 选择阅读笔记模态框状态
  const handleSelectNoteModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (note: ReadingNote) => {
    selectNote(note)
  }

  // 选择参考文献模态框状态
  const handleSelectReferenceModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (literatureId: string) => {
    selectReference(literatureId)
  }

  // 选择引用内容模态框状态
  const handleSelectCitationModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = (citation: Citation) => {
    selectCitation(citation)
  }

  // 添加作者筛选模态框状态
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(true)
  }

  // 取消添加作者筛选模态框
  const handleCancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorFilterModalOpen(false)
    setAuthorFilters([])
  }

  // 添加作者筛选模态框提交
  const handleAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorFilterToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到进展模态框状态
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到进展模态框
  const handleCancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewProgress({ year: "", description: "", relatedPaper: "", selectedAuthors: [], type: "individual" })
  }

  // 添加作者到进展模态框提交
  const handleAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalSubmit = () => {
    // 这里可以添加提交逻辑
    cancelAddAuthorToProgressModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal()
  }

  // 添加作者到论文模态框状态
  const handleAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(true)
  }

  // 取消添加作者到论文模态框
  const handleCancelAddAuthorToLiteratureModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModalModal = () => {
    setIsAddAuthorModalOpen(false)
    setNewLiterature({
      title: "",
      selectedAuthors: [],
      year: "",
      type: "paper",
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
      keywords: [],
      language: "zh-CN",
      url: "",\
