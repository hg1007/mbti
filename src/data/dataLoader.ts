/**
 * 统一数据层
 * C 端优先读 localStorage（管理后台修改的数据），没有则用默认数据
 */
import { questions as defaultQuestions, chapters as defaultChapters, type Question, type Chapter } from './questions'
import { personalities as defaultPersonalities, type Personality } from './personalities'

const STORAGE_KEYS = {
  questions: 'mbti-admin-questions',
  chapters: 'mbti-admin-chapters',
  personalities: 'mbti-admin-personalities'
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // localStorage 数据损坏，用默认值
  }
  return fallback
}

export function getQuestions(): Question[] {
  return loadFromStorage(STORAGE_KEYS.questions, defaultQuestions)
}

export function getChapters(): Chapter[] {
  return loadFromStorage(STORAGE_KEYS.chapters, defaultChapters)
}

export function getPersonalities(): Record<string, Personality> {
  return loadFromStorage(STORAGE_KEYS.personalities, defaultPersonalities)
}

/** 按章节获取题目 */
export function getQuestionsByChapter(chapterIndex: number): Question[] {
  const chs = getChapters()
  const qs = getQuestions()
  if (chapterIndex < 0 || chapterIndex >= chs.length) return []
  const dim = chs[chapterIndex].dimension
  return qs.filter(q => q.dimension === dim)
}
