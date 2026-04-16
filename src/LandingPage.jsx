import { useState } from 'react'
import './LandingPage.css'

const FLOATING_CATS = ['🐾', '🐱', '🐾', '✨', '🐱', '🐾', '✨', '🐱', '🐾', '✨']

export default function LandingPage({ onButtonClick }) {
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    setPressed(true)
    setTimeout(onButtonClick, 200)
  }

  return (
    <div className="landing-root">
      {/* Floating background decorations */}
      {FLOATING_CATS.map((icon, i) => (
        <span
          key={i}
          className="floater"
          style={{
            left: `${(i * 11 + 5) % 95}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + (i % 3)}s`,
            fontSize: `${1.2 + (i % 3) * 0.4}rem`,
            opacity: 0.18 + (i % 4) * 0.07,
          }}
        >
          {icon}
        </span>
      ))}

      <div className="landing-card">
        {/* Decorative blob behind card */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="card-inner">
          <div className="cat-emoji-big">🐱</div>

          <h1 className="landing-title">Cute Cat Generator</h1>
          <p className="landing-subtitle">
            The internet's #1 source for adorable, freshly generated cat images.
            <br />
            <span className="landing-sub2">100% free &bull; No sign-up &bull; Totally harmless</span>
          </p>

          <div className="badge-row">
            <span className="badge">✅ Safe</span>
            <span className="badge">🎨 HD Quality</span>
            <span className="badge">⚡ Instant</span>
          </div>

          <button
            className={`generate-btn ${pressed ? 'pressed' : ''}`}
            onClick={handleClick}
            disabled={pressed}
          >
            <span className="btn-icon">🐾</span>
            Click this button to generate an image of a cute cat!
            <span className="btn-icon">🐾</span>
          </button>

          <p className="fine-print">
            By clicking you agree to our Terms of Service, Privacy Policy,<br />
            Cookie Policy, and Soul Harvesting Agreement (§14.b).
          </p>
        </div>
      </div>
    </div>
  )
}
