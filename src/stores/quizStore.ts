import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getQuestions, getChapters, getQuestionsByChapter, type Question } from '../data/dataLoader'

// Re-export Question type for consumers
export type { Question }

export interface DimensionScores {
  E: number
  I: number
  S: number
  N: number
  T: number
  F: number
  J: number
  P: number
}

export type QuizMode = 'full' | 'quick'

// Shuffle array helper
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Pick random questions with balanced dimension coverage
function pickRandomQuestions(perDim: number): Question[] {
  const dims: ('EI' | 'SN' | 'TF' | 'JP')[] = ['EI', 'SN', 'TF', 'JP']
  const picked: Question[] = []

  dims.forEach((dim) => {
    const dimQs = getQuestions().filter(q => q.dimension === dim)
    const shuffled = shuffle(dimQs)
    picked.push(...shuffled.slice(0, perDim))
  })

  // Final shuffle so dimensions are mixed
  return shuffle(picked)
}

export const useQuizStore = defineStore('quiz', () => {
  // Mode
  const mode = ref<QuizMode>('full')

  // Quick mode: random question pool
  const quickQuestions = ref<Question[]>([])

  // Navigation state
  const currentChapter = ref(0)
  const currentIndexInChapter = ref(0)
  const currentIndexInQuick = ref(0)
  const answers = ref<Record<number, 'A' | 'B'>>({})
  const isComplete = ref(false)

  // Computed based on mode
  const activeQuestions = computed(() => {
    if (mode.value === 'quick') return quickQuestions.value
    return getQuestionsByChapter(currentChapter.value)
  })

  const currentQuestion = computed(() => {
    if (mode.value === 'quick') {
      return quickQuestions.value[currentIndexInQuick.value]
    }
    return getQuestionsByChapter(currentChapter.value)[currentIndexInChapter.value]
  })

  const totalQuestions = computed(() => {
    if (mode.value === 'quick') return quickQuestions.value.length
    return getQuestions().length
  })

  const totalChapters = computed(() => getChapters().length)
  const currentChapterData = computed(() => getChapters()[currentChapter.value])
  const chapterQuestions = computed(() => getQuestionsByChapter(currentChapter.value))

  const overallProgress = computed(() => {
    const answered = Object.keys(answers.value).length
    const total = mode.value === 'quick' ? quickQuestions.value.length : getQuestions().length
    return (answered / total) * 100
  })

  const chapterProgress = computed(() => {
    if (mode.value === 'quick') {
      return ((currentIndexInQuick.value + 1) / quickQuestions.value.length) * 100
    }
    return ((currentIndexInChapter.value + 1) / chapterQuestions.value.length) * 100
  })

  const isLastQuestionInChapter = computed(() => {
    if (mode.value === 'quick') {
      return currentIndexInQuick.value === quickQuestions.value.length - 1
    }
    return currentIndexInChapter.value === chapterQuestions.value.length - 1
  })

  const isLastChapter = computed(() => {
    if (mode.value === 'quick') return true // quick mode has no chapters
    return currentChapter.value === totalChapters.value - 1
  })

  function startQuiz(selectedMode: QuizMode) {
    mode.value = selectedMode
    if (selectedMode === 'quick') {
      quickQuestions.value = pickRandomQuestions(3) // 3 per dimension = 12 total
    }
    currentIndexInQuick.value = 0
    currentChapter.value = 0
    currentIndexInChapter.value = 0
    answers.value = {}
    isComplete.value = false
  }

  function answer(choice: 'A' | 'B') {
    if (currentQuestion.value) {
      answers.value[currentQuestion.value.id] = choice
    }
  }

  function nextQuestion() {
    if (mode.value === 'quick') {
      if (currentIndexInQuick.value < quickQuestions.value.length - 1) {
        currentIndexInQuick.value++
      }
    } else {
      if (currentIndexInChapter.value < chapterQuestions.value.length - 1) {
        currentIndexInChapter.value++
      } else if (currentChapter.value < totalChapters.value - 1) {
        currentChapter.value++
        currentIndexInChapter.value = 0
      }
    }
  }

  function prevQuestion() {
    if (mode.value === 'quick') {
      if (currentIndexInQuick.value > 0) {
        currentIndexInQuick.value--
      }
    } else {
      if (currentIndexInChapter.value > 0) {
        currentIndexInChapter.value--
      } else if (currentChapter.value > 0) {
        currentChapter.value--
        currentIndexInChapter.value = getQuestionsByChapter(currentChapter.value).length - 1
      }
    }
  }

  function calculateResult(): { type: string; scores: DimensionScores; percentages: Record<string, number> } {
    const scores: DimensionScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

    // Use all questions (for full) or quick questions (for quick mode)
    const qsToScore = mode.value === 'quick' ? quickQuestions.value : getQuestions()

    for (const q of qsToScore) {
      const choice = answers.value[q.id]
      if (!choice) continue

      const dim = q.dimension
      if (choice === 'A') {
        scores[dim[0] as keyof DimensionScores]++
      } else {
        scores[dim[1] as keyof DimensionScores]++
      }
    }

    const percentages: Record<string, number> = {}
    const eiTotal = scores.E + scores.I
    const snTotal = scores.S + scores.N
    const tfTotal = scores.T + scores.F
    const jpTotal = scores.J + scores.P

    percentages.E = eiTotal ? Math.round((scores.E / eiTotal) * 100) : 50
    percentages.I = eiTotal ? 100 - percentages.E : 50
    percentages.S = snTotal ? Math.round((scores.S / snTotal) * 100) : 50
    percentages.N = snTotal ? 100 - percentages.S : 50
    percentages.T = tfTotal ? Math.round((scores.T / tfTotal) * 100) : 50
    percentages.F = tfTotal ? 100 - percentages.T : 50
    percentages.J = jpTotal ? Math.round((scores.J / jpTotal) * 100) : 50
    percentages.P = jpTotal ? 100 - percentages.J : 50

    const type =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P')

    return { type, scores, percentages }
  }

  function reset() {
    currentChapter.value = 0
    currentIndexInChapter.value = 0
    currentIndexInQuick.value = 0
    answers.value = {}
    isComplete.value = false
    quickQuestions.value = []
    mode.value = 'full'
  }

  return {
    mode,
    quickQuestions,
    currentChapter,
    currentIndexInChapter,
    currentIndexInQuick,
    answers,
    isComplete,
    totalChapters,
    currentChapterData,
    chapterQuestions,
    currentQuestion,
    activeQuestions,
    totalQuestions,
    overallProgress,
    chapterProgress,
    isLastQuestionInChapter,
    isLastChapter,
    startQuiz,
    answer,
    nextQuestion,
    prevQuestion,
    calculateResult,
    reset
  }
})
