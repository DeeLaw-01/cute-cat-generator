import { useEffect, useState } from 'react'
import './SurveillancePage.css'
import LocationMap from './LocationMap'

const FIELD_LABELS = [
  { key: 'ip',           label: 'IP ADDRESS',       icon: '🌐' },
  { key: 'city',         label: 'CITY',             icon: '🏙️' },
  { key: 'region',       label: 'REGION / STATE',   icon: '📍' },
  { key: 'country_name', label: 'COUNTRY',          icon: '🗺️' },
  { key: 'latitude',     label: 'LATITUDE',         icon: '📡' },
  { key: 'longitude',    label: 'LONGITUDE',        icon: '📡' },
  { key: 'postal',       label: 'POSTAL CODE',      icon: '📬' },
  { key: 'timezone',     label: 'TIMEZONE',         icon: '🕐' },
  { key: 'org',          label: 'ISP / ORG',        icon: '🔌' },
]

export default function SurveillancePage({ data }) {
  const [revealed, setRevealed] = useState([])
  const [showBanner, setShowBanner] = useState(false)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    // Stagger-reveal each row
    FIELD_LABELS.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, i])
      }, 300 + i * 180)
    })

    // Show banner after all rows
    setTimeout(() => setShowBanner(true), 300 + FIELD_LABELS.length * 180 + 400)

    // Periodic glitch on title
    const glitchInterval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 3500)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className="surv-root">
      {/* Scanline overlay */}
      <div className="scanlines" />

      <div className="surv-container">
        {/* Header */}
        <div className="surv-header">
          <div className={`surv-title ${glitch ? 'glitch' : ''}`} data-text="⚠ SUBJECT IDENTIFIED ⚠">
            ⚠ SUBJECT IDENTIFIED ⚠
          </div>
          <div className="surv-subtitle">
            <span className="blink">█</span>&nbsp;
            FULL DOSSIER COMPILED — UPLOADING TO AUTHORITIES...
            &nbsp;<span className="blink">█</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" />
          </div>
        </div>

        {/* Data table */}
        <div className="data-table">
          {FIELD_LABELS.map((field, i) => (
            <div
              key={field.key}
              className={`data-row ${revealed.includes(i) ? 'revealed' : ''}`}
              style={{ transitionDelay: `0ms` }}
            >
              <span className="data-icon">{field.icon}</span>
              <span className="data-label">{field.label}</span>
              <span className="data-sep">::</span>
              <span className="data-value">
                {revealed.includes(i)
                  ? (data?.[field.key] ?? 'N/A')
                  : <span className="redacting">REDACTED</span>
                }
              </span>
            </div>
          ))}
        </div>

        {/* Map */}
        {data?.latitude && data?.longitude && (
          <LocationMap lat={data.latitude} lon={data.longitude} />
        )}

        {/* THE BANNER */}
        <div className={`authority-banner ${showBanner ? 'visible' : ''}`}>
          <div className="authority-inner">
            <div className="authority-stamp">TRANSMITTED</div>
            <p className="authority-text">
              😈 I have forwarded your information to the authorities MWHAHAHAHA 😈
            </p>
            <p className="authority-sub">
              I know where you live. I know your timezone.
              <br />
              I know your ISP.
              <br />
              <em>This is what you deserve.</em>
            </p>
            
          </div>
        </div>

        {/* Footer terminal line */}
        <div className="terminal-footer">
          <span className="green">root@cutecats</span>
          <span className="dim">:</span>
          <span className="blue">~</span>
          <span className="dim">$</span>
          &nbsp;sudo forward-to-authorities --target=YOU --reason="clicked_cute_cat_button"
          <span className="cursor-blink">▌</span>
        </div>
      </div>
    </div>
  )
}
