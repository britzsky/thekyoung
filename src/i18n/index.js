import { useEffect, useState } from 'react'
import ko from './ko.js'
import en from './en.js'
import zh from './zh.js'
import ja from './ja.js'

// 전환 버튼에 표시되는 순서대로
export const LANGS = [
  { code: 'ko', label: 'KO', name: '한국어' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh', label: '中文', name: '简体中文' },
  { code: 'ja', label: '日本語', name: '日本語' },
]

const dicts = { ko, en, zh, ja }
const STORAGE_KEY = 'lang'

// 'zh-CN', 'ja-JP' 같은 값을 지원하는 언어 코드로 바꿈 (없으면 undefined)
const match = (value) => {
  const v = (value || '').toLowerCase()
  return Object.keys(dicts).find((code) => v.startsWith(code))
}

// 처음 언어 결정: 주소의 ?lang= → 이전에 고른 언어 → 브라우저 언어 → 영어
function initialLang() {
  const fromUrl = match(new URLSearchParams(window.location.search).get('lang'))
  if (fromUrl) return fromUrl
  try {
    const saved = match(localStorage.getItem(STORAGE_KEY))
    if (saved) return saved
  } catch {}
  for (const l of navigator.languages || [navigator.language]) {
    const found = match(l)
    if (found) return found
  }
  return 'en'
}

export function useLang() {
  const [lang, setLang] = useState(initialLang)
  const t = dicts[lang]

  useEffect(() => {
    document.documentElement.lang = t.htmlLang
    document.title = t.title
    // 지금 언어를 주소에 남겨서 링크를 공유해도 같은 언어로 열리게 (한국어는 기본이라 생략)
    const url = new URL(window.location.href)
    if (lang === 'ko') url.searchParams.delete('lang')
    else url.searchParams.set('lang', lang)
    window.history.replaceState(null, '', url)
  }, [lang, t])

  // 사용자가 직접 고른 언어만 저장
  const choose = (code) => {
    setLang(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {}
  }

  return { lang, t, choose }
}
