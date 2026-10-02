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

export default function App() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">더 경<span className="mark">의원</span></div>
          <ul className="nav-links">
            <li><a href="#about">소개</a></li>
            <li><a href="#treatments">진료 안내</a></li>
            <li><a href="#doctor">원장 소개</a></li>
            <li><a href="#space">공간</a></li>
            <li><a href="#location">오시는 길</a></li>
          </ul>
          <button className="nav-cta">예약 문의</button>
        </div>
      </nav>

      <header className="hero">
        <p className="hero-intro">청담동, THE 炅 CLINIC</p>
        <h1 className="serif">
          피부가 본래 가진 빛을,
          <br />
          서두르지 않고 찾아갑니다.
        </h1>
        <div className="hero-meta">
          <div>
            <strong>2015</strong>
            개원
          </div>
          <div>
            <strong>청담동</strong>
            도산대로 인근
          </div>
          <div>
            <strong>예약제</strong>
            평일 · 토요일 진료
          </div>
        </div>
      </header>

      <div className="hero-image">
        {exterior.map((src) => (
          <img key={src} src={src} alt="더 경의원 외관" />
        ))}
      </div>

      <section className="section" id="about">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">소개</div>
            <h2>진료는 정확하게, 태도는 다정하게 — 두 가지를 함께 지키는 일이 저희의 기준입니다.</h2>
          </div>
          <div className="about-grid">
            <div>
              <p>
                더 경의원은 청담동에서 피부와 미용 진료를 이어온 병원입니다. 화려한 결과보다 오래
                지속되는 변화를 우선으로 두고, 시술 전후의 상담 시간을 충분히 확보해 왔습니다.
              </p>
              <p>
                모든 처방은 원장이 직접 피부 상태를 확인한 뒤 결정됩니다. 유행하는 시술을
                권하기보다, 지금 이 피부에 필요한 것이 무엇인지를 먼저 묻습니다.
              </p>
            </div>
            <div className="about-quote serif">
              “빛날 경(炅), 밝음이란 감추는 것이 아니라 본래의 것을 드러내는 일이라 믿습니다.”
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="treatments">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">진료 안내</div>
            <h2>피부 결을 정돈하는 일부터 근본적인 변화까지, 단계별로 안내합니다.</h2>
          </div>
          <div className="treat-list">
            <div className="treat-row">
              <div className="num serif">01</div>
              <h3 className="serif">피부 재생 관리</h3>
              <p>레이저와 재생 시술을 병행해 피부결과 탄력을 개선합니다. 첫 상담에서 피부 타입을 진단한 뒤 개인별 주기를 정합니다.</p>
            </div>
            <div className="treat-row">
              <div className="num serif">02</div>
              <h3 className="serif">색소 · 톤 케어</h3>
              <p>기미, 잡티, 홍조 등 색소성 고민을 원인별로 구분해 접근합니다. 무리한 자극보다 단계적인 회복을 우선합니다.</p>
            </div>
            <div className="treat-row">
              <div className="num serif">03</div>
              <h3 className="serif">리프팅 · 탄력</h3>
              <p>고주파, 실리프팅 등 처짐과 탄력 저하를 위한 시술을 상태에 맞게 조합해 자연스러운 변화를 만듭니다.</p>
            </div>
            <div className="treat-row">
              <div className="num serif">04</div>
              <h3 className="serif">홈케어 처방</h3>
              <p>시술 이후의 관리도 진료의 일부라고 생각합니다. 개인 피부에 맞춘 홈케어 루틴을 함께 설계합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="doctor">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">원장 소개</div>
            <h2>진료실에서는 결과보다 먼저, 지금의 피부 상태를 이야기합니다.</h2>
          </div>
          <div className="doctor-grid">
            <div className="doctor-photo">
              <img src={doctorPhoto} alt="김 경 원장" />
            </div>
            <div className="doctor-copy">
              <h3 className="serif">김 경 원장</h3>
              <div className="role serif">더 경의원 대표원장</div>
              <p>
                피부과 전문의로서 십수 년간 청담동에서 진료해 왔습니다. 유행보다 근거를,
                속도보다 회복을 중요하게 여기는 진료 방식을 지켜오고 있습니다.
              </p>
              <p>
                환자와의 대화를 진료의 시작으로 삼습니다. 무엇이 불편했고, 무엇을 기대하는지를
                먼저 듣고 나서야 시술을 설명합니다.
              </p>
              <ul>
                <li>대한피부과학회 정회원</li>
                <li>전 OO대학병원 피부과 임상강사</li>
                <li>레이저 및 리프팅 시술 다수 진행</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="space">
        <div className="wrap">
          <div className="section-head">
            <div className="label serif">공간</div>
            <h2>한 사람의 진료를 위해 비워둔 자리들입니다.</h2>
          </div>
          <div className="gallery">
            {innerImages.map(({ name, src }) => (
              <img
                key={src}
                src={src}
                alt="더 경의원 내부"
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
            <div className="label serif">오시는 길</div>
            <h2>청담동, 도산대로의 조용한 자리에 있습니다.</h2>
          </div>
          <div className="loc-grid">
            <div className="loc-map">지도 영역</div>
            <dl className="loc-info">
              <dt>주소</dt>
              <dd>서울 강남구 선릉로152길 6 1, 2, 3층</dd>
              <dt>진료 시간</dt>
              <dd>
                평일 11:00 – 19:00
                <br />
                토요일 11:00 – 19:00 (목·일·공휴일 휴진)
                <br />
                매주 목, 일 정기휴무
              </dd>
              <dt>대중교통</dt>
              <dd>
                압구정로데오역 4번 출구 도보 3분 버거킹 맞은편
                <br />
                건물 앞 주차가능
                <br />
                발렛가능 (5,000원)
              </dd>
              <dt>문의</dt>
              <dd>02-000-0000</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2 className="serif">지금의 피부 상태부터, 편하게 이야기 나눠보세요.</h2>
        <button className="cta-btn">상담 예약하기</button>
      </section>

      <footer>
        <div className="footer-inner">
          <span>© 더 경의원 THE 炅 CLINIC</span>
          <span>서울 강남구 도산대로 OO길 OO · 02-000-0000</span>
        </div>
      </footer>
    </>
  )
}
