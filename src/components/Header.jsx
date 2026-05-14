export default function Header() {
  return (
    <header style={{
      background: 'rgba(30, 0, 60, 0.5)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
    }} className="sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col items-center justify-center text-center gap-1.5">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span style={{
            fontFamily: '"Bubblicious", sans-serif',
            fontSize: 'clamp(24px, 5vw, 44px)',
            color: '#FF2D9B',
            textShadow: '0 2px 12px rgba(255,45,155,0.6)',
          }}>♥</span>
          <h1 style={{
            fontFamily: '"Bubblicious", sans-serif',
            fontSize: 'clamp(28px, 6vw, 52px)',
            color: 'white',
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(255,45,155,0.5), 0 0 40px rgba(124,58,237,0.4)',
          }}>
            Liv's Step Tracker
          </h1>
          <span style={{
            fontFamily: '"Bubblicious", sans-serif',
            fontSize: 'clamp(24px, 5vw, 44px)',
            color: '#FF2D9B',
            textShadow: '0 2px 12px rgba(255,45,155,0.6)',
          }}>♥</span>
        </div>
        <p style={{
          fontFamily: '"Bubblicious", sans-serif',
          fontSize: 'clamp(11px, 1.5vw, 14px)',
          color: 'rgba(221, 214, 254, 0.8)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          personal 10k steps dashboard · 2026
        </p>
      </div>
    </header>
  )
}