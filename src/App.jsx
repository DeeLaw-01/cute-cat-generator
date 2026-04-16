import { useState } from 'react'
import LandingPage from './LandingPage'
import SurveillancePage from './SurveillancePage'

export default function App() {
  const [phase, setPhase] = useState('landing') // 'landing' | 'loading' | 'busted'
  const [ipData, setIpData] = useState(null)

  const handleButtonClick = async () => {
    setPhase('loading')
    try {
      const res = await fetch(
        'http://ip-api.com/json/?fields=status,query,city,regionName,country,lat,lon,zip,timezone,isp,org'
      )
      const raw = await res.json()
      if (raw.status !== 'success') throw new Error('API returned failure status')
      setIpData({
        ip:           raw.query,
        city:         raw.city,
        region:       raw.regionName,
        country_name: raw.country,
        latitude:     raw.lat,
        longitude:    raw.lon,
        postal:       raw.zip,
        timezone:     raw.timezone,
        org:          raw.org || raw.isp,
      })
    } catch (err) {
      // Second attempt via ipinfo.io
      try {
        const res2 = await fetch('https://ipinfo.io/json')
        const raw2 = await res2.json()
        const [lat, lon] = (raw2.loc || '0,0').split(',')
        setIpData({
          ip:           raw2.ip,
          city:         raw2.city,
          region:       raw2.region,
          country_name: raw2.country,
          latitude:     lat,
          longitude:    lon,
          postal:       raw2.postal,
          timezone:     raw2.timezone,
          org:          raw2.org,
        })
      } catch {
        setIpData({ ip: 'Unavailable', city: 'N/A', region: 'N/A', country_name: 'N/A',
          latitude: 'N/A', longitude: 'N/A', postal: 'N/A', timezone: 'N/A', org: 'N/A' })
      }
    }
    setTimeout(() => setPhase('busted'), 800)
  }

  if (phase === 'landing') return <LandingPage onButtonClick={handleButtonClick} />
  if (phase === 'loading') return <LoadingScreen />
  return <SurveillancePage data={ipData} />
}

function LoadingScreen() {
  return (
    <div style={{
      height: '100vh',
      background: '#fff5f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      fontFamily: "'Fredoka', sans-serif",
    }}>
      <div style={{ fontSize: '4rem', animation: 'spin 0.6s linear infinite' }}>🐱</div>
      <p style={{ fontSize: '1.4rem', color: '#d97b6c', fontWeight: 600 }}>
        Generating cute cat...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
