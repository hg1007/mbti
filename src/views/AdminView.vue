<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/themeStore'
import type { Question, Chapter } from '../data/questions'
import type { Personality } from '../data/personalities'

const router = useRouter()
const themeStore = useThemeStore()

// ============ Data ============
const questions = ref<Question[]>([])
const chapters = ref<Chapter[]>([])
const personalities = ref<Record<string, Personality>>({})
const dataLoaded = ref(false)

// ============ UI State ============
const activeTab = ref<'questions' | 'personalities' | 'ai'>('questions')
const showQuestionModal = ref(false)
const showPersonalityModal = ref(false)
const editingQuestion = ref<Question | null>(null)
const isNewQuestion = ref(false)
const editingPersonality = ref<{ key: string; data: Personality } | null>(null)

// Question list controls
const filterDimension = ref<string>('all')
const searchQuery = ref('')
const showDeleteConfirm = ref<number | null>(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(5)

// Toast
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false, message: '', type: 'success'
})

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 2500)
}

// ============ Load Data ============
onMounted(async () => {
  await loadData()
})

async function loadData() {
  // Load questions
  const savedQ = localStorage.getItem('mbti-admin-questions')
  if (savedQ) {
    try { questions.value = JSON.parse(savedQ) } catch { /* fallback */ }
  }
  if (!questions.value.length) {
    const mod = await import('../data/questions')
    questions.value = JSON.parse(JSON.stringify(mod.questions))
  }

  // Load chapters
  const savedC = localStorage.getItem('mbti-admin-chapters')
  if (savedC) {
    try { chapters.value = JSON.parse(savedC) } catch { /* fallback */ }
  }
  if (!chapters.value.length) {
    const mod = await import('../data/questions')
    chapters.value = JSON.parse(JSON.stringify(mod.chapters))
  }

  // Load personalities
  const savedP = localStorage.getItem('mbti-admin-personalities')
  if (savedP) {
    try { personalities.value = JSON.parse(savedP) } catch { /* fallback */ }
  }
  if (!Object.keys(personalities.value).length) {
    const mod = await import('../data/personalities')
    personalities.value = JSON.parse(JSON.stringify(mod.personalities))
  }

  dataLoaded.value = true
}

function saveQuestions() {
  localStorage.setItem('mbti-admin-questions', JSON.stringify(questions.value))
}
function saveChapters() {
  localStorage.setItem('mbti-admin-chapters', JSON.stringify(chapters.value))
}
function savePersonalities() {
  localStorage.setItem('mbti-admin-personalities', JSON.stringify(personalities.value))
}
function saveAll() {
  saveQuestions()
  saveChapters()
  savePersonalities()
}

// ============ Question CRUD ============
function openNewQuestion() {
  const maxId = questions.value.reduce((max, q) => Math.max(max, q.id), 0)
  editingQuestion.value = {
    id: maxId + 1,
    text: '',
    dimension: 'EI',
    optionA: '',
    optionB: '',
    emoji: '🤔'
  }
  isNewQuestion.value = true
  showQuestionModal.value = true
}

function openEditQuestion(q: Question) {
  editingQuestion.value = JSON.parse(JSON.stringify(q))
  isNewQuestion.value = false
  showQuestionModal.value = true
}

function closeQuestionModal() {
  showQuestionModal.value = false
  editingQuestion.value = null
}

function saveQuestion() {
  if (!editingQuestion.value) return
  if (!editingQuestion.value.text.trim()) {
    showToast('题目文本不能为空', 'error')
    return
  }
  if (!editingQuestion.value.optionA.trim() || !editingQuestion.value.optionB.trim()) {
    showToast('选项 A 和 B 不能为空', 'error')
    return
  }

  if (isNewQuestion.value) {
    questions.value.push(JSON.parse(JSON.stringify(editingQuestion.value)))
    showToast('题目已添加')
  } else {
    const idx = questions.value.findIndex(q => q.id === editingQuestion.value!.id)
    if (idx >= 0) {
      questions.value[idx] = JSON.parse(JSON.stringify(editingQuestion.value))
      showToast('题目已保存')
    }
  }
  saveQuestions()
  closeQuestionModal()
}

function confirmDelete(id: number) {
  showDeleteConfirm.value = id
}

function doDelete() {
  if (showDeleteConfirm.value === null) return
  questions.value = questions.value.filter(q => q.id !== showDeleteConfirm.value)
  saveQuestions()
  showDeleteConfirm.value = null
  showToast('题目已删除')
}

function cancelDelete() {
  showDeleteConfirm.value = null
}

// ============ Personality CRUD ============
function openEditPersonality(key: string) {
  editingPersonality.value = {
    key,
    data: JSON.parse(JSON.stringify(personalities.value[key]))
  }
  showPersonalityModal.value = true
}

function closePersonalityModal() {
  showPersonalityModal.value = false
  editingPersonality.value = null
}

function savePersonality() {
  if (!editingPersonality.value) return
  personalities.value[editingPersonality.value.key] =
    JSON.parse(JSON.stringify(editingPersonality.value.data))
  savePersonalities()
  showToast(`${editingPersonality.value.key} 人格数据已保存`)
  closePersonalityModal()
}

// ============ Array field helpers for personality ============
function joinArr(arr: string[] | undefined): string {
  return Array.isArray(arr) ? arr.join('、') : ''
}
function splitArr(str: string): string[] {
  return str.split(/[、,，]/).map(s => s.trim()).filter(Boolean)
}

// Temp string refs for array fields in personality modal
const pStrengths = ref('')
const pWeaknesses = ref('')
const pGrowthTips = ref('')
const pCareers = ref('')
const pFamousPeople = ref('')
const pCompatibility = ref('')

watch(editingPersonality, (val) => {
  if (val) {
    pStrengths.value = joinArr(val.data.strengths)
    pWeaknesses.value = joinArr(val.data.weaknesses)
    pGrowthTips.value = joinArr(val.data.growthTips)
    pCareers.value = joinArr(val.data.careers)
    pFamousPeople.value = joinArr(val.data.famousPeople)
    pCompatibility.value = joinArr(val.data.compatibility)
  }
})

function syncPersonalityArrays() {
  if (!editingPersonality.value) return
  editingPersonality.value.data.strengths = splitArr(pStrengths.value)
  editingPersonality.value.data.weaknesses = splitArr(pWeaknesses.value)
  editingPersonality.value.data.growthTips = splitArr(pGrowthTips.value)
  editingPersonality.value.data.careers = splitArr(pCareers.value)
  editingPersonality.value.data.famousPeople = splitArr(pFamousPeople.value)
  editingPersonality.value.data.compatibility = splitArr(pCompatibility.value)
}

function savePersonalityWithArrays() {
  syncPersonalityArrays()
  savePersonality()
}

// ============ Import / Export ============
function exportData() {
  const data = {
    questions: questions.value,
    chapters: chapters.value,
    personalities: personalities.value,
    exportDate: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mbti-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast('数据已导出')
}

const fileInput = ref<HTMLInputElement | null>(null)
function triggerImport() {
  fileInput.value?.click()
}
function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.questions) questions.value = data.questions
      if (data.chapters) chapters.value = data.chapters
      if (data.personalities) personalities.value = data.personalities
      saveAll()
      showToast('数据导入成功！')
    } catch {
      showToast('导入失败：JSON 格式错误', 'error')
    }
    input.value = ''
  }
  reader.readAsText(file)
}

function resetToDefaults() {
  if (!confirm('确定要重置为默认数据？当前所有修改将丢失。')) return
  localStorage.removeItem('mbti-admin-questions')
  localStorage.removeItem('mbti-admin-chapters')
  localStorage.removeItem('mbti-admin-personalities')
  questions.value = []
  chapters.value = []
  personalities.value = {}
  loadData()
  showToast('已重置为默认数据')
}

// ============ Filtered questions ============
const filteredQuestions = computed(() => {
  let list = questions.value
  if (filterDimension.value !== 'all') {
    list = list.filter(q => q.dimension === filterDimension.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    list = list.filter(q =>
      q.text.toLowerCase().includes(query) ||
      q.optionA.toLowerCase().includes(query) ||
      q.optionB.toLowerCase().includes(query)
    )
  }
  return list
})

// Reset to page 1 when filter/search changes
watch([filterDimension, searchQuery], () => { currentPage.value = 1 })

// Paginated questions
const totalPages = computed(() => Math.max(1, Math.ceil(filteredQuestions.value.length / pageSize.value)))
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredQuestions.value.slice(start, start + pageSize.value)
})

// Visible page numbers for pagination
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: number[] = []
  const delta = 2
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// ============ Stats ============
const questionStats = computed(() => {
  const stats = { EI: 0, SN: 0, TF: 0, JP: 0, total: 0 }
  questions.value.forEach(q => {
    stats[q.dimension]++
    stats.total++
  })
  return stats
})

const personalityCount = computed(() => Object.keys(personalities.value).length)

// Dimension labels
const dimLabels: Record<string, { short: string; full: string; color: string }> = {
  EI: { short: 'E/I', full: '外向 / 内向', color: '#7C6CF0' },
  SN: { short: 'S/N', full: '感觉 / 直觉', color: '#34C759' },
  TF: { short: 'T/F', full: '思考 / 情感', color: '#FF6B6B' },
  JP: { short: 'J/P', full: '判断 / 知觉', color: '#FF9F0A' }
}

// Keyboard shortcut: Escape to close modals
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showDeleteConfirm.value !== null) { cancelDelete(); return }
    if (showQuestionModal.value) { closeQuestionModal(); return }
    if (showPersonalityModal.value) { closePersonalityModal(); return }
  }
}
onMounted(() => { document.addEventListener('keydown', handleKeydown) })
</script>

<template>
  <div class="admin">
    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" :class="['toast', toast.type]">
        <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M20 6L9 17l-5-5"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
        {{ toast.message }}
      </div>
    </transition>

    <!-- Delete Confirm -->
    <transition name="overlay">
      <div v-if="showDeleteConfirm !== null" class="overlay" @click.self="cancelDelete">
        <div class="confirm-dialog">
          <div class="confirm-icon">🗑️</div>
          <h3>确认删除</h3>
          <p>这道题目将被永久删除，无法恢复。</p>
          <div class="confirm-actions">
            <button type="button" class="btn ghost" @click="cancelDelete">取消</button>
            <button type="button" class="btn danger" @click="doDelete">删除</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Question Edit Modal -->
    <transition name="overlay">
      <div v-if="showQuestionModal && editingQuestion" class="overlay" @click.self="closeQuestionModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ isNewQuestion ? '添加新题目' : `编辑题目 #${editingQuestion.id}` }}</h2>
            <button type="button" class="modal-close" @click="closeQuestionModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="field">
              <label>题目文本 <span class="required">*</span></label>
              <textarea v-model="editingQuestion.text" rows="3" placeholder="输入题目内容…" />
            </div>
            <div class="field-row">
              <div class="field">
                <label>维度</label>
                <div class="dimension-picker">
                  <button
                    v-for="(info, dim) in dimLabels" :key="dim"
                    type="button"
                    :class="['dim-btn', { active: editingQuestion.dimension === dim }]"
                    :style="editingQuestion.dimension === dim ? { background: info.color, borderColor: info.color } : {}"
                    @click="editingQuestion.dimension = dim as any"
                  >
                    {{ info.short }}
                  </button>
                </div>
              </div>
              <div class="field" style="max-width: 100px">
                <label>Emoji</label>
                <input v-model="editingQuestion.emoji" type="text" class="center" />
              </div>
            </div>
            <div class="field">
              <label>选项 A <span class="required">*</span> <span class="hint">{{ dimLabels[editingQuestion.dimension]?.short?.charAt(0) }} 倾向</span></label>
              <textarea v-model="editingQuestion.optionA" rows="2" placeholder="选项 A 的内容…" />
            </div>
            <div class="field">
              <label>选项 B <span class="required">*</span> <span class="hint">{{ dimLabels[editingQuestion.dimension]?.short?.charAt(2) }} 倾向</span></label>
              <textarea v-model="editingQuestion.optionB" rows="2" placeholder="选项 B 的内容…" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn ghost" @click="closeQuestionModal">取消</button>
            <button type="button" class="btn primary" @click="saveQuestion">保存</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Personality Edit Modal -->
    <transition name="overlay">
      <div v-if="showPersonalityModal && editingPersonality" class="overlay" @click.self="closePersonalityModal">
        <div class="modal modal-lg">
          <div class="modal-header">
            <h2>
              <span class="modal-emoji">{{ editingPersonality.data.emoji }}</span>
              {{ editingPersonality.data.nameCn }}
              <span class="code-badge">{{ editingPersonality.key }}</span>
            </h2>
            <button type="button" class="modal-close" @click="closePersonalityModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="section-title">基本信息</div>
            <div class="field-grid">
              <div class="field">
                <label>代码</label>
                <input v-model="editingPersonality.data.code" type="text" readonly class="readonly" />
              </div>
              <div class="field">
                <label>Emoji</label>
                <input v-model="editingPersonality.data.emoji" type="text" />
              </div>
              <div class="field">
                <label>中文名</label>
                <input v-model="editingPersonality.data.nameCn" type="text" />
              </div>
              <div class="field">
                <label>英文名</label>
                <input v-model="editingPersonality.data.nameEn" type="text" />
              </div>
              <div class="field">
                <label>昵称</label>
                <input v-model="editingPersonality.data.nickname" type="text" />
              </div>
              <div class="field">
                <label>强调色</label>
                <input v-model="editingPersonality.data.accentColor" type="text" />
              </div>
            </div>
            <div class="field">
              <label>座右铭</label>
              <textarea v-model="editingPersonality.data.motto" rows="2" />
            </div>
            <div class="field">
              <label>一句话描述</label>
              <textarea v-model="editingPersonality.data.tagline" rows="2" />
            </div>
            <div class="field">
              <label>详细描述</label>
              <textarea v-model="editingPersonality.data.description" rows="4" />
            </div>

            <div class="section-title">特质</div>
            <div class="field">
              <label>优势 <span class="hint">用「、」分隔</span></label>
              <textarea v-model="pStrengths" rows="2" placeholder="善于倾听、有同理心、创造力强" />
            </div>
            <div class="field">
              <label>劣势 <span class="hint">用「、」分隔</span></label>
              <textarea v-model="pWeaknesses" rows="2" placeholder="过于理想化、容易自责" />
            </div>
            <div class="field">
              <label>成长建议 <span class="hint">用「、」分隔</span></label>
              <textarea v-model="pGrowthTips" rows="2" />
            </div>

            <div class="section-title">应用</div>
            <div class="field">
              <label>适合职业 <span class="hint">用「、」分隔</span></label>
              <textarea v-model="pCareers" rows="2" placeholder="心理咨询师、作家、教师" />
            </div>
            <div class="field">
              <label>著名人物 <span class="hint">用「、」分隔</span></label>
              <textarea v-model="pFamousPeople" rows="2" placeholder="莎士比亚、托尔金" />
            </div>
            <div class="field">
              <label>最佳兼容类型 <span class="hint">用「、」分隔</span></label>
              <textarea v-model="pCompatibility" rows="1" placeholder="ENFJ、ENTJ" />
            </div>

            <div class="section-title">风格</div>
            <div class="field">
              <label>工作风格</label>
              <textarea v-model="editingPersonality.data.workStyle" rows="2" />
            </div>
            <div class="field">
              <label>学习偏好</label>
              <textarea v-model="editingPersonality.data.learningStyle" rows="2" />
            </div>
            <div class="field">
              <label>人际关系</label>
              <textarea v-model="editingPersonality.data.relationships" rows="3" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn ghost" @click="closePersonalityModal">取消</button>
            <button type="button" class="btn primary" @click="savePersonalityWithArrays">保存</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== Main Content ===== -->
    <header class="admin-header">
      <button type="button" class="back-btn" @click="router.push('/')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div class="header-title">
        <h1>数据管理</h1>
        <span v-if="dataLoaded" class="header-badge">
          {{ questionStats.total }} 题 · {{ personalityCount }} 人格
        </span>
      </div>
      <div class="header-actions">
        <button type="button" class="btn ghost" @click="resetToDefaults" title="重置为默认数据">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
          重置
        </button>
        <button type="button" class="btn ghost" @click="exportData">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          导出
        </button>
        <button type="button" class="btn ghost" @click="triggerImport">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          导入
        </button>
        <input ref="fileInput" type="file" accept=".json" @change="handleImport" style="display:none" />
      </div>
    </header>

    <!-- Tabs -->
    <div class="tab-bar">
      <button
        type="button"
        :class="['tab-btn', { active: activeTab === 'questions' }]"
        @click="activeTab = 'questions'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        题目管理
        <span class="tab-count">{{ questionStats.total }}</span>
      </button>
      <button
        type="button"
        :class="['tab-btn', { active: activeTab === 'personalities' }]"
        @click="activeTab = 'personalities'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        人格数据
        <span class="tab-count">{{ personalityCount }}</span>
      </button>
      <button
        type="button"
        :class="['tab-btn', { active: activeTab === 'ai' }]"
        @click="activeTab = 'ai'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        AI 生成
      </button>
    </div>

    <!-- ===== Questions Tab ===== -->
    <div v-if="activeTab === 'questions'" class="panel">
      <!-- Stats row -->
      <div class="stat-row">
        <div v-for="(info, dim) in dimLabels" :key="dim" class="stat-pill" :style="{ '--accent': info.color }">
          <span class="stat-pill-label">{{ info.full }}</span>
          <span class="stat-pill-value">{{ questionStats[dim as keyof typeof questionStats] }}</span>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input v-model="searchQuery" type="text" placeholder="搜索题目…" />
        </div>
        <div class="filter-group">
          <button
            type="button"
            :class="['filter-btn', { active: filterDimension === 'all' }]"
            @click="filterDimension = 'all'"
          >全部</button>
          <button
            v-for="(info, dim) in dimLabels" :key="dim"
            type="button"
            :class="['filter-btn', { active: filterDimension === dim }]"
            :style="filterDimension === dim ? { background: info.color, color: '#fff', borderColor: info.color } : {}"
            @click="filterDimension = dim as string"
          >{{ info.short }}</button>
        </div>
        <button type="button" class="btn primary add-btn" @click="openNewQuestion">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M12 5v14M5 12h14"/></svg>
          添加题目
        </button>
      </div>

      <!-- Question list -->
      <div class="q-list">
        <transition-group name="list">
          <div v-for="q in paginatedQuestions" :key="q.id" class="q-card">
            <div class="q-top">
              <span class="q-num">#{{ q.id }}</span>
              <span class="q-dim-badge" :style="{ background: dimLabels[q.dimension]?.color + '18', color: dimLabels[q.dimension]?.color }">
                {{ dimLabels[q.dimension]?.short }}
              </span>
              <span class="q-emoji">{{ q.emoji }}</span>
              <div class="q-spacer" />
              <button type="button" class="q-action edit" @click="openEditQuestion(q)" title="编辑">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button type="button" class="q-action delete" @click="confirmDelete(q.id)" title="删除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
            <div class="q-text">{{ q.text }}</div>
            <div class="q-opts">
              <div class="q-opt"><span class="opt-label">A</span>{{ q.optionA }}</div>
              <div class="q-opt"><span class="opt-label">B</span>{{ q.optionB }}</div>
            </div>
          </div>
        </transition-group>

        <div v-if="filteredQuestions.length === 0 && dataLoaded" class="empty-state">
          <div class="empty-icon">📝</div>
          <p v-if="searchQuery || filterDimension !== 'all'">没有找到匹配的题目</p>
          <p v-else>还没有题目，点击"添加题目"开始</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          type="button"
          class="page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          v-if="visiblePages[0] > 1"
          type="button"
          class="page-btn"
          @click="goToPage(1)"
        >1</button>
        <span v-if="visiblePages[0] > 2" class="page-ellipsis">…</span>
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          :class="['page-btn', { active: currentPage === page }]"
          @click="goToPage(page)"
        >{{ page }}</button>
        <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="page-ellipsis">…</span>
        <button
          v-if="visiblePages[visiblePages.length - 1] < totalPages"
          type="button"
          class="page-btn"
          @click="goToPage(totalPages)"
        >{{ totalPages }}</button>
        <button
          type="button"
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页 · 共 {{ filteredQuestions.length }} 题</span>
      </div>
    </div>

    <!-- ===== Personalities Tab ===== -->
    <div v-if="activeTab === 'personalities'" class="panel">
      <div class="p-grid">
        <div
          v-for="(p, key) in personalities" :key="key"
          class="p-card"
          @click="openEditPersonality(key as string)"
        >
          <div class="p-card-emoji">{{ p.emoji }}</div>
          <div class="p-card-code">{{ p.code }}</div>
          <div class="p-card-name">{{ p.nameCn }}</div>
          <div class="p-card-sub">{{ p.nickname }}</div>
          <div class="p-card-tagline">{{ p.tagline }}</div>
          <div class="p-card-edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            编辑
          </div>
        </div>
      </div>
    </div>


    <!-- ===== AI Generation Tab ===== -->
    <div v-if="activeTab === 'ai'" class="panel">
      <div class="info-section">
        <h2 class="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          AI 题目生成
        </h2>
        <p class="section-desc">使用 AI 大模型 API 按 4 个维度（EI / SN / TF / JP）自动生成 MBTI 测试题目。</p>

        <div class="info-card">
          <h3>使用步骤</h3>
          <ol class="step-list">
            <li>
              <span class="step-num">1</span>
              <div class="step-content">
                <strong>获取 API Key</strong>
                <p>访问 <code>https://token.longshine.com</code> 创建账户并获取 API Key</p>
              </div>
            </li>
            <li>
              <span class="step-num">2</span>
              <div class="step-content">
                <strong>配置环境变量</strong>
                <p>编辑 <code>.env</code> 文件，填入以下配置：</p>
                <p><code>API_URL=https://token.longshine.com/v1/chat/completions</code></p>
                <p><code>API_KEY=sk-xxx</code></p>
                <p><code>MODEL=qwen3.7-max</code></p>
              </div>
            </li>
            <li>
              <span class="step-num">3</span>
              <div class="step-content">
                <strong>运行生成脚本</strong>
                <p>在命令行执行：<code>node scripts/ai-generator.cjs</code></p>
              </div>
            </li>
            <li>
              <span class="step-num">4</span>
              <div class="step-content">
                <strong>调整生成参数</strong>
                <p>编辑 <code>scripts/ai-config.json</code> 自定义每维度题目数量、难度等</p>
                <p>默认每维度 10 题 × 4 维度 = 40 道题</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="info-card">
          <h3>生成选项</h3>
          <div class="option-grid">
            <div class="option-item">
              <span class="option-label">题目数量</span>
              <span class="option-value">每维度 5-50 题</span>
            </div>
            <div class="option-item">
              <span class="option-label">难度级别</span>
              <span class="option-value">简单 / 中等 / 困难</span>
            </div>
            <div class="option-item">
              <span class="option-label">题目类型</span>
              <span class="option-value">行为描述 / 情境选择 / 自我评估</span>
            </div>
            <div class="option-item">
              <span class="option-label">覆盖维度</span>
              <span class="option-value">全部 / 指定维度</span>
            </div>
          </div>
        </div>

        <div class="info-card warning">
          <h3>⚠️ API 费用说明</h3>
          <ul class="tip-list">
            <li>AI 按 4 个维度各生成 N 道题，默认每维度 10 题共 40 道</li>
            <li>建议在测试阶段使用少量题目验证效果</li>
            <li>生成的题目需要人工审核，确保质量符合要求</li>
            <li>API Key 请妥善保管，不要提交到代码仓库</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>脚本文件位置</h3>
          <p>生成脚本：<code>scripts/ai-generator.cjs</code></p>
          <p>配置文件：<code>scripts/ai-config.json</code></p>
          <p>输出文件：<code>scripts/ai-generated-questions.json</code></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Layout ===== */
.admin {
  height: 100dvh;
  background: var(--canvas);
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== Toast ===== */
.toast {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  backdrop-filter: blur(12px);
}
.toast.success { background: rgba(52, 199, 89, 0.95); color: #fff; }
.toast.error { background: rgba(255, 59, 48, 0.95); color: #fff; }
.toast-enter-active { animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { animation: toastOut 0.25s ease-in; }
@keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(-1rem) scale(0.9); } to { opacity:1; transform: translateX(-50%) translateY(0) scale(1); } }
@keyframes toastOut { from { opacity:1; transform: translateX(-50%); } to { opacity:0; transform: translateX(-50%) translateY(-0.5rem); } }

/* ===== Overlay ===== */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1500;
  padding: 1rem;
}
.overlay-enter-active { transition: opacity 0.2s ease; }
.overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

/* ===== Confirm Dialog ===== */
.confirm-dialog {
  background: var(--canvas);
  border-radius: 20px;
  padding: 2rem;
  max-width: 340px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 80px rgba(0,0,0,0.25);
}
.confirm-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.confirm-dialog h3 { font-size: 1.125rem; font-weight: 600; color: var(--ink); margin-bottom: 0.5rem; }
.confirm-dialog p { font-size: 0.875rem; color: var(--ink-muted); margin-bottom: 1.5rem; }
.confirm-actions { display: flex; gap: 0.75rem; justify-content: center; }

/* ===== Modal ===== */
.modal {
  background: var(--canvas);
  border-radius: 20px;
  max-width: 540px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.25);
  overflow: hidden;
}
.modal-lg { max-width: 780px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--hairline);
}
.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}
.modal-emoji { font-size: 1.5rem; }
.code-badge {
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--surface-2);
  color: var(--ink-muted);
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
}
.modal-close {
  width: 2rem; height: 2rem;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-muted);
  transition: all 0.15s;
}
.modal-close:hover { background: var(--surface-2); color: var(--ink); }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--hairline);
}

/* ===== Form Fields ===== */
.field { margin-bottom: 1.25rem; }
.field label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-secondary);
  margin-bottom: 0.375rem;
}
.required { color: #ff3b30; }
.hint { font-weight: 400; color: var(--ink-muted); font-size: 0.75rem; }

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid var(--hairline);
  border-radius: 10px;
  background: var(--surface-1);
  color: var(--ink);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: #7C6CF0;
  box-shadow: 0 0 0 3px rgba(124,108,240,0.12);
}
.field input.readonly { opacity: 0.5; pointer-events: none; }
.field input.center { text-align: center; font-size: 1.25rem; }
.field textarea { resize: vertical; line-height: 1.5; }

.field-row {
  display: flex;
  gap: 1rem;
}
.field-row > .field { flex: 1; }

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1rem;
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--hairline);
}

/* Dimension picker */
.dimension-picker { display: flex; gap: 0.5rem; }
.dim-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1.5px solid var(--hairline);
  background: var(--surface-1);
  color: var(--ink-secondary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.dim-btn.active { color: #fff; }

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  white-space: nowrap;
}
.btn:active { transform: scale(0.97); }

.btn.primary { background: #7C6CF0; color: #fff; }
.btn.primary:hover { background: #6B5CE7; }
.btn.ghost { background: var(--surface-1); color: var(--ink-secondary); }
.btn.ghost:hover { background: var(--surface-2); }
.btn.danger { background: #ff3b30; color: #fff; }
.btn.danger:hover { background: #e6352b; }

/* ===== Header ===== */
.admin-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.back-btn {
  width: 2.5rem; height: 2.5rem;
  border-radius: 50%;
  background: var(--surface-1);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink);
  transition: all 0.15s;
  flex-shrink: 0;
}
.back-btn:hover { background: var(--surface-2); }

.header-title { flex: 1; min-width: 0; }
.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}
.header-badge {
  font-size: 0.75rem;
  color: var(--ink-muted);
  font-weight: 500;
}

.header-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }

/* ===== Tabs ===== */
.tab-bar {
  display: flex;
  gap: 0.25rem;
  background: var(--surface-1);
  padding: 0.25rem;
  border-radius: 14px;
  margin-bottom: 1.5rem;
}
.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 11px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: var(--canvas);
  color: var(--ink);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.tab-count {
  font-size: 0.6875rem;
  font-weight: 700;
  background: var(--surface-2);
  color: var(--ink-muted);
  padding: 0.125rem 0.5rem;
  border-radius: 8px;
}
.tab-btn.active .tab-count {
  background: #7C6CF0;
  color: #fff;
}

/* ===== Panel ===== */
.panel {
  animation: fadeUp 0.3s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(0.5rem); } to { opacity: 1; transform: translateY(0); } }

/* ===== Stat Row ===== */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.stat-pill {
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.stat-pill-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ink-muted);
}
.stat-pill-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent, var(--ink));
}

/* ===== Toolbar ===== */
.toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-1);
  border: 1.5px solid var(--hairline);
  border-radius: 10px;
  padding: 0 0.75rem;
  flex: 1;
  min-width: 160px;
  max-width: 280px;
  transition: border-color 0.15s;
}
.search-box:focus-within { border-color: #7C6CF0; }
.search-box svg { color: var(--ink-muted); flex-shrink: 0; }
.search-box input {
  border: none;
  background: transparent;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: var(--ink);
  outline: none;
  width: 100%;
  font-family: inherit;
}

.filter-group { display: flex; gap: 0.25rem; }
.filter-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1.5px solid var(--hairline);
  background: transparent;
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.filter-btn.active { background: var(--ink); color: var(--canvas); border-color: var(--ink); }

.add-btn { flex-shrink: 0; }

/* ===== Question List ===== */
.q-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.q-list::-webkit-scrollbar {
  display: none;
}

.q-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 0.875rem 1rem;
  transition: box-shadow 0.15s;
}
.q-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

.q-top {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.5rem;
}
.q-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink-muted);
  font-variant-numeric: tabular-nums;
}
.q-dim-badge {
  padding: 0.125rem 0.625rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
}
.q-emoji { font-size: 1.125rem; }
.q-spacer { flex: 1; }

.q-action {
  width: 1.75rem; height: 1.75rem;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  opacity: 0;
}
.q-card:hover .q-action { opacity: 1; }
.q-action.edit { color: #7C6CF0; }
.q-action.edit:hover { background: rgba(124,108,240,0.1); }
.q-action.delete { color: #ff3b30; }
.q-action.delete:hover { background: rgba(255,59,48,0.1); }

.q-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.45;
  margin-bottom: 0.625rem;
}

.q-opts { display: flex; gap: 0.5rem; }
.q-opt {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--surface-2);
  border-radius: 8px;
  font-size: 0.8125rem;
  color: var(--ink-secondary);
  line-height: 1.45;
}
.opt-label {
  font-weight: 700;
  color: var(--ink-muted);
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 4px;
  background: var(--surface-3, var(--hairline));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  margin-top: 0.1rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--ink-muted);
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-state p { font-size: 0.9375rem; }

/* List transition */
.list-enter-active { transition: all 0.3s ease; }
.list-leave-active { transition: all 0.2s ease; }
.list-enter-from { opacity: 0; transform: translateY(-0.5rem); }
.list-leave-to { opacity: 0; transform: translateX(1rem); }

/* ===== Pagination ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: auto;
  padding: 1rem 0 0;
  flex-shrink: 0;
}
.page-btn {
  min-width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1.5px solid var(--hairline);
  background: var(--surface-1);
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.15s;
  padding: 0 0.5rem;
}
.page-btn:hover:not(:disabled) {
  background: var(--surface-2);
  border-color: var(--surface-3, var(--ink-muted));
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-btn.active {
  background: #7C6CF0;
  border-color: #7C6CF0;
  color: #fff;
}
.page-ellipsis {
  color: var(--ink-muted);
  padding: 0 0.25rem;
  font-weight: 600;
}
.page-info {
  margin-left: 1rem;
  font-size: 0.75rem;
  color: var(--ink-muted);
  font-weight: 500;
}

/* ===== Personality Grid ===== */
.p-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.875rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding-bottom: 1rem;
}

/* Custom scrollbar for personality grid */
.p-grid::-webkit-scrollbar {
  width: 6px;
}
.p-grid::-webkit-scrollbar-track {
  background: transparent;
}
.p-grid::-webkit-scrollbar-thumb {
  background: var(--surface-3, var(--ink-muted));
  border-radius: 3px;
}
.p-grid::-webkit-scrollbar-thumb:hover {
  background: var(--ink-muted);
}
.p-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  padding: 1.25rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.p-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.p-card-emoji { font-size: 2rem; margin-bottom: 0.25rem; }
.p-card-code {
  font-size: 1.125rem;
  font-weight: 800;
  color: #7C6CF0;
  letter-spacing: 1px;
}
.p-card-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0.125rem 0;
}
.p-card-sub {
  font-size: 0.75rem;
  color: var(--ink-muted);
  margin-bottom: 0.5rem;
}
.p-card-tagline {
  font-size: 0.75rem;
  color: var(--ink-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.p-card-edit {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #7C6CF0;
  opacity: 0;
  transition: opacity 0.15s;
}
.p-card:hover .p-card-edit { opacity: 1; }

/* ===== Info Section ===== */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  scrollbar-width: thin;
}

.info-section::-webkit-scrollbar {
  width: 6px;
}

.info-section::-webkit-scrollbar-track {
  background: transparent;
}

.info-section::-webkit-scrollbar-thumb {
  background: var(--surface-3);
  border-radius: 3px;
}

.info-section::-webkit-scrollbar-thumb:hover {
  background: var(--ink-muted);
}

.info-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 1.5rem;
}

.info-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.75rem;
}

.info-card p {
  font-size: 0.875rem;
  color: var(--ink-secondary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.info-card p:last-child {
  margin-bottom: 0;
}

.info-card code {
  background: var(--surface-2);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-family: 'SF Mono', Monaco, monospace;
  color: var(--ink);
}

.info-card.warning {
  border-left: 3px solid #FF9F0A;
}

.info-card.warning h3 {
  color: #FF9F0A;
}

.step-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step-counter;
}

.step-list li {
  position: relative;
  padding-left: 2.5rem;
  margin-bottom: 1rem;
  counter-increment: step-counter;
}

.step-list li:last-child {
  margin-bottom: 0;
}

.step-list li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 1.75rem;
  height: 1.75rem;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-content strong {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
}

.step-content p {
  font-size: 0.8125rem;
  color: var(--ink-muted);
  margin: 0;
}

.tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-list li {
  position: relative;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  color: var(--ink-secondary);
  line-height: 1.6;
}

.tip-list li:last-child {
  margin-bottom: 0;
}

.tip-list li::before {
  content: '⚠️';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-value {
  font-size: 0.875rem;
  color: var(--ink);
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .admin { padding: 1rem; }
  .stat-row { grid-template-columns: 1fr 1fr; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .search-box { max-width: none; }
  .filter-group { justify-content: center; }
  .field-grid { grid-template-columns: 1fr; }
  .q-action { opacity: 1; }
  .p-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.625rem; }
  .header-actions { width: 100%; justify-content: flex-end; }
  .field-row { flex-direction: column; gap: 0; }
  .pagination { flex-wrap: wrap; }
}

@media (max-height: 700px) {
  .stat-pill { padding: 0.5rem 0.75rem; }
  .stat-pill-value { font-size: 1.25rem; }
  .q-card { padding: 0.75rem 0.875rem; }
  .q-text { font-size: 0.8125rem; margin-bottom: 0.5rem; }
  .q-opts { gap: 0.375rem; }
  .q-opt { padding: 0.375rem 0.625rem; font-size: 0.75rem; }
}
</style>
