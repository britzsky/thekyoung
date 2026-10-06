import { Fragment, useEffect, useRef, useState } from 'react'
import { LANGS, useLang } from './i18n/index.js'
import ext06 from '../assert/images/main/KakaoTalk_20261002_111913256_12.jpg'
import ext04 from '../assert/images/main/KakaoTalk_20261002_111247636_04.jpg'
import ext05 from '../assert/images/main/KakaoTalk_20260922_170145376.png'
import doctorPhoto from '../assert/images/main/KakaoTalk_20261002_142920340.png'

//const exterior = [ext06, ext04]
const exterior = [ext05]

// 공간 갤러리에 보여줄 사진 (적힌 순서대로, 여기 없는 사진은 표시 안 함)
// 모든 사진은 같은 크기의 칸(3열, 세로 2:3)으로 표시됨 (wideImages만 예외)
const galleryImages = [
  'KakaoTalk_20261002_111913256_14.jpg',
  'KakaoTalk_20261002_111913256_13.jpg',
  'KakaoTalk_20261002_111913256_17.jpg',
  'KakaoTalk_20261002_111913256_12.jpg',
  'KakaoTalk_20261002_111913256.jpg',
  'KakaoTalk_20261002_111913256_15.jpg',
  'KakaoTalk_20261002_111913256_02.jpg',
  'KakaoTalk_20261002_111913256_05.jpg',
  'KakaoTalk_20261002_111913256_07.jpg',
  'KakaoTalk_20261002_111913256_06.jpg',
  'KakaoTalk_20261002_111913256_04.jpg',
  'KakaoTalk_20261002_111913256_18.jpg',
  'KakaoTalk_20261002_111913256_20.jpg',
  'KakaoTalk_20261002_111913256_19.jpg',
  'KakaoTalk_20261002_111913256_08.jpg',
  'KakaoTalk_20261002_111913256_09.jpg',
  'KakaoTalk_20261002_111253946_01.jpg',
  'KakaoTalk_20261002_111913256_03.jpg',
  'KakaoTalk_20261002_111913256_11.jpg',
]

// inner 폴더의 사진 파일들 (파일명 → 주소)
const innerFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assert/images/inner/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
  ).map(([path, src]) => [path.split('/').pop(), src])
)

// 가로로 두 칸 늘릴 사진: left = 왼쪽 끝~가운데, right = 가운데~오른쪽 끝
// 예: 'KakaoTalk_20261002_111913256_14.jpg': 'left',
const wideImages = {}

// 목록에 적었는데 inner 폴더에 없는 파일은 개발 중 브라우저 콘솔에 경고
if (import.meta.env.DEV) {
  const missing = galleryImages.filter((name) => !innerFiles[name])
  if (missing.length) console.warn('[공간 갤러리] inner 폴더에 없는 파일:', missing)
}

// 실제로 화면에 그릴 목록 (폴더에 없는 파일명은 건너뜀)
const innerImages = galleryImages
  .filter((name) => innerFiles[name])
  .map((name) => ({ name, src: innerFiles[name] }))

// 병원 위치 (지도 핀 좌표) — 모두 인증키 없이 쓰는 공개 링크
const LAT = 37.5239868789549
const LNG = 127.039912145449

// 페이지에 넣는 구글 지도 (hl: 지도 글자 언어)
const mapEmbedUrl = (hl) => `https://maps.google.com/maps?q=${LAT},${LNG}&z=17&hl=${hl}&output=embed`

// 네이버 플레이스 (병원 ID) — 예약 버튼과 지도 버튼에서 사용
const NAVER_PLACE = 'https://map.naver.com/p/entry/place/2069245162'
// PC는 네이버 지도 안의 예약 화면 — {DATE} 자리에 누르는 순간의 한국 날짜(오늘)가 들어감
// (현재 네이버는 이 날짜와 상관없이 항상 오늘로 열지만, 바뀌어도 오늘로 열리도록 넣어 둠)
const BOOKING_URL_PC =
  `${NAVER_PLACE}?placePath=%2Fbooking%3FbookingRedirectUrl%3Dhttps%253A%252F%252Fm.booking.naver.com%252Fbooking%252F16%252Fbizes%252F1743429%252Fitems%252F8081298%253Farea%253Dpll%2526lang%253Dko%2526map-search%253D1%2526service-target%253Dmap-pc%2526startDate%253D{DATE}%2526theme%253Dplace&placeSearchOption=entry%3Dpll%26fromNxList%3Dtrue&searchType=place&c=15.00,0,0,0,dh`
// 휴대폰·태블릿(터치 화면)은 네이버 모바일 예약 페이지로 바로 연결
// startDate는 누르는 순간의 한국 날짜(오늘)로 채움 (예: 2026-10-06)
const BOOKING_URL_MOBILE = 'https://m.booking.naver.com/booking/16/bizes/1743429/items/8081298?entry=pll&lang=ko&theme=place'
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
const todayInKorea = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())
const bookingUrl = () =>
  isTouchDevice
    ? `${BOOKING_URL_MOBILE}&startDate=${todayInKorea()}`
    : BOOKING_URL_PC.replaceAll('{DATE}', todayInKorea())

// 지도 아래 버튼이 여는 주소 (휴대폰에선 앱이 있으면 앱으로 열림)
const MAP_LINKS = {
  naver: NAVER_PLACE,
  kakao: `https://map.kakao.com/link/map/${encodeURIComponent('더 경의원')},${LAT},${LNG}`,
  google: `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`,
}

// 배열로 된 문구를 줄바꿈(<br />)으로 이어 붙임
function Lines({ lines }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ))
}

// 문구 속 '炅'만 로고의 '의원'과 같은 금색으로 표시
function GoldMark({ text }) {
  return text.split('炅').map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <span className="mark">炅</span>}
      {part}
    </Fragment>
  ))
}

// 클립보드에 복사 (https가 아닌 주소에서도 되도록 예전 방식으로 한 번 더 시도)
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.cssText = 'position:fixed;top:0;opacity:0'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  ta.remove()
  return ok ? Promise.resolve() : Promise.reject()
}

// 휴대폰은 길게(0.5초) 눌렀다 떼면, PC는 클릭하면 복사
// 브라우저가 복사를 허용하는 '손을 뗀 순간'에 복사함
const HOLD_MS = 500
function CopyOnHold({ text, hint, onCopied, children }) {
  const [pressing, setPressing] = useState(false)
  const pressedAt = useRef(0)
  const pointer = useRef('mouse')
  const copy = () => copyText(text).then(onCopied, () => {})

  return (
    <span
      className={`copy-hold${pressing ? ' pressing' : ''}`}
      role="button"
      tabIndex={0}
      title={hint}
      onPointerDown={(e) => {
        pointer.current = e.pointerType
        if (e.pointerType === 'mouse') return
        pressedAt.current = Date.now()
        setPressing(true)
      }}
      onPointerUp={(e) => {
        if (e.pointerType === 'mouse') return
        setPressing(false)
        if (Date.now() - pressedAt.current >= HOLD_MS) {
          navigator.vibrate?.(15)
          copy()
        }
      }}
      onPointerCancel={() => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => pointer.current === 'mouse' && copy()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), copy())}
    >
      {children}
    </span>
  )
}

// 화면 아래에 잠깐 떴다 사라지는 안내
function useToast() {
  const [message, setMessage] = useState('')
  const [shown, setShown] = useState(false)
  const timer = useRef()
  const show = (text) => {
    setMessage(text)
    setShown(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShown(false), 1800)
  }
  const toast = (
    <div className={`toast${shown ? ' shown' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  )
  return [toast, show]
}

// 페이지 맨 위로 부드럽게 이동 (로고, 위로 가기 버튼에서 사용)
const scrollToTop = (e) => {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 오른쪽 아래 위로 가기 버튼 — 조금 내려왔을 때만 나타남
function ToTop({ label }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`to-top${shown ? ' shown' : ''}`}
      aria-label={label}
      title={label}
      tabIndex={shown ? 0 : -1}
      onClick={scrollToTop}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
      </svg>
    </button>
  )
}

// KO · EN · 中文 · 日本語 전환 버튼 (각국 대표색은 index.css의 .lang-ko 등에서 지정)
function LangSwitch({ lang, onChange }) {
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LANGS.map(({ code, label, name }) => (
        <button
          key={code}
          type="button"
          className={`lang-btn lang-${code}`}
          aria-pressed={lang === code}
          title={name}
          onClick={() => onChange(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const { lang, t, choose } = useLang()
  const [toast, showToast] = useToast()

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a className="logo" href="#" onClick={scrollToTop}>{t.logo.name}<span className="mark">{t.logo.mark}</span></a>
          <ul className="nav-links">
            <li><a href="#about">{t.nav.about}</a></li>
            <li><a href="#treatments">{t.nav.treatments}</a></li>
            <li><a href="#doctor">{t.nav.doctor}</a></li>
            <li><a href="#space">{t.nav.space}</a></li>
            <li><a href="#location">{t.nav.location}</a></li>
          </ul>
          {/* <button className="nav-cta">예약 문의</button> */}
          <LangSwitch lang={lang} onChange={choose} />
        </div>
      </nav>

      <header className="hero">
        <p className="hero-intro"><GoldMark text={t.hero.intro} /></p>
        <h1 className="serif">
          <Lines lines={t.hero.title} />
        </h1>
        <div className="hero-meta">
          {t.hero.meta.map(({ strong, text }) => (
            <div key={strong}>
              <strong>{strong}</strong>
              {text}
            </div>
          ))}
        </div>
      </header>

      <div className="hero-image">
        {exterior.map((src) => (
          <img key={src} src={src} alt={t.hero.imageAlt} />
        ))}
      </div>

      <section className="section" id="about">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">{t.about.label}</div>
            <h2>{t.about.heading}</h2>
          </div>
          <div className="about-grid">
            <div>
              {t.about.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="about-quote serif">{t.about.quote}</div>
          </div>
        </div>
      </section>

      <section className="section" id="treatments">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">{t.treatments.label}</div>
            <h2>{t.treatments.heading}</h2>
          </div>
          <div className="treat-list">
            {t.treatments.items.map(({ title, desc }, i) => (
              <div className="treat-row" key={title}>
                <div className="num serif">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="serif">{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="doctor">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">{t.doctor.label}</div>
            <h2>{t.doctor.heading}</h2>
          </div>
          <div className="doctor-grid">
            <div className="doctor-photo">
              <img src={doctorPhoto} alt={t.doctor.name} />
            </div>
            <div className="doctor-copy">
              <h3 className="serif">{t.doctor.name}</h3>
              <div className="role serif">{t.doctor.role}</div>
              {t.doctor.paragraphs.map((p) => <p key={p}>{p}</p>)}
              <ul>
                {t.doctor.credentials.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="space">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">{t.space.label}</div>
            <h2>{t.space.heading}</h2>
          </div>
          <div className="gallery">
            {innerImages.map(({ name, src }) => (
              <img
                key={src}
                src={src}
                alt={t.space.imageAlt}
                loading="lazy"
                className={wideImages[name] && `wide-${wideImages[name]}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="location">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">{t.location.label}</div>
            <h2>{t.location.heading}</h2>
          </div>
          <div className="loc-grid">
            <div>
              <div className="loc-map">
                <iframe
                  key={lang}
                  src={mapEmbedUrl(t.htmlLang)}
                  title={t.location.map.title}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="map-links">
                {t.location.map.apps.map(({ app, label }) => (
                  <a
                    key={app}
                    className={`map-link map-${app}`}
                    href={MAP_LINKS[app]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <dl className="loc-info">
              {t.location.info.map(({ term, lines, tel, copy }) => (
                <Fragment key={term}>
                  <dt>{term}</dt>
                  <dd>
                    {/* tel이 있는 항목(문의)은 누르면 전화 걸기, copy 항목(메일)은 복사 */}
                    {tel ? (
                      <a className="tel-link" href={`tel:${tel}`}><Lines lines={lines} /></a>
                    ) : copy ? (
                      <>
                        <CopyOnHold text={lines.join(' ')} hint={t.copy.mouse} onCopied={() => showToast(t.copy.done)}>
                          <Lines lines={lines} />
                        </CopyOnHold>
                        <span className="copy-hint">{t.copy.touch}</span>
                      </>
                    ) : (
                      <Lines lines={lines} />
                    )}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2 className="serif">{t.cta}</h2>
        {/* <button className="cta-btn">상담 예약하기</button> */}
      </section>

      <footer>
        <div className="footer-inner">
          <span>{t.footer.name}</span>
          <span><Lines lines={t.footer.address} /></span>
        </div>
      </footer>

      {/* 오른쪽 아래, 위로 가기 버튼 위에 항상 떠 있는 예약 버튼 */}
      <a
        className="booking-btn"
        href={bookingUrl()}
        // 페이지를 띄워둔 채 날짜가 바뀌어도 누르는 순간 오늘 날짜로 다시 맞춤
        onClick={(e) => { e.currentTarget.href = bookingUrl() }}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.booking}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
          <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
        </svg>
        {/* 평소엔 숨어 있다가 마우스를 올리면 펼쳐짐 */}
        <span className="booking-label">{t.booking}</span>
      </a>
      <ToTop label={t.toTop} />
      {toast}
    </>
  )
}
