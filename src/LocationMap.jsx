import { useEffect, useRef } from 'react'
import L from 'leaflet'

// Fix default marker icon paths broken by Vite's asset bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const EVIL_RED_ICON = L.divIcon({
  className: '',
  html: `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 18px; height: 18px;
        background: #ff2222;
        border: 3px solid #ff6666;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(255,30,30,0.25), 0 0 20px rgba(255,0,0,0.7);
        animation: pulseRed 1.2s ease-in-out infinite;
      "></div>
    </div>
    <style>
      @keyframes pulseRed {
        0%, 100% { box-shadow: 0 0 0 4px rgba(255,30,30,0.25), 0 0 20px rgba(255,0,0,0.7); }
        50%       { box-shadow: 0 0 0 12px rgba(255,30,30,0.0), 0 0 35px rgba(255,0,0,0.9); }
      }
    </style>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export default function LocationMap({ lat, lon }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)
    if (isNaN(parsedLat) || isNaN(parsedLon)) return

    // Start zoomed out for dramatic effect
    const map = L.map(containerRef.current, {
      center: [parsedLat, parsedLon],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
    })

    // CartoDB Dark Matter — perfectly sinister
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 19 }
    ).addTo(map)

    L.control.attribution({ prefix: false })
      .addTo(map)

    mapRef.current = map

    // Dramatic zoom-in sequence
    setTimeout(() => {
      map.flyTo([parsedLat, parsedLon], 6, { duration: 1.8, easeLinearity: 0.1 })
    }, 400)

    setTimeout(() => {
      map.flyTo([parsedLat, parsedLon], 12, { duration: 2.2, easeLinearity: 0.15 })
      L.marker([parsedLat, parsedLon], { icon: EVIL_RED_ICON })
        .addTo(map)
        .bindPopup(
          `<b style="color:#ff3333;font-family:monospace">🎯 LOCATED</b><br/>
           <span style="font-family:monospace;font-size:11px">${parsedLat.toFixed(4)}, ${parsedLon.toFixed(4)}</span>`,
          { className: 'evil-popup' }
        )
        .openPopup()
    }, 2600)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [lat, lon])

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '320px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 50, 50, 0.5)',
          boxShadow: '0 0 30px rgba(255, 30, 30, 0.15)',
          overflow: 'hidden',
        }}
      />
      {/* Overlay label */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(8, 12, 8, 0.85)',
        border: '1px solid rgba(255,50,50,0.6)',
        borderRadius: '3px',
        padding: '4px 10px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.72rem',
        color: '#ff4444',
        letterSpacing: '2px',
        zIndex: 1000,
        textShadow: '0 0 8px rgba(255,50,50,0.8)',
      }}>
        ⊕ TRACKING TARGET
      </div>
      {/* Corner crosshair decorations */}
      {['top-left','top-right','bottom-left','bottom-right'].map(pos => (
        <div key={pos} style={{
          position: 'absolute',
          width: '16px', height: '16px',
          borderColor: 'rgba(255,50,50,0.7)',
          borderStyle: 'solid',
          borderWidth: pos.includes('top') && pos.includes('left')    ? '2px 0 0 2px'
                      : pos.includes('top') && pos.includes('right')  ? '2px 2px 0 0'
                      : pos.includes('bottom') && pos.includes('left') ? '0 0 2px 2px'
                      :                                                   '0 2px 2px 0',
          top:    pos.includes('top')    ? '6px' : 'auto',
          bottom: pos.includes('bottom') ? '6px' : 'auto',
          left:   pos.includes('left')  ? '6px' : 'auto',
          right:  pos.includes('right') ? '6px' : 'auto',
          zIndex: 1000,
          pointerEvents: 'none',
        }} />
      ))}
    </div>
  )
}
