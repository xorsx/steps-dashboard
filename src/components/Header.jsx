export default function Header() {
  return (
    <header style={{
      background: 'rgba(30, 0, 60, 0.5)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
    }} className="sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center gap-4">

        {/* Swoll Hello Kitty */}
        <img
          src="/swoll_hello_kitty.jpg"
          alt="swoll hello kitty"
          style={{
            width: '64px',
            height: '64px',
            objectFit: 'cover',
            borderRadius: '999px',
            border: '2px solid #FF2D9B',
            boxShadow: '0 0 16px rgba(255,45,155,0.5)',
            flexShrink: 0,
          }}
        />

        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">♥</span>
            <h1 style={{
              fontFamily: '"Bubblicious", sans-serif',
              fontSize: 'clamp(22px, 5vw, 42px)',
              color: 'white',
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(255,45,155,0.5), 0 0 40px rgba(124,58,237,0.4)',
            }}>
              Liv's Step Tracker
            </h1>
            <span style={{
              fontFamily: '"Bubblicious", sans-serif',
              fontSize: 'clamp(18px, 3vw, 36px)',
              color: '#FF2D9B',
              textShadow: '0 2px 12px rgba(255,45,155,0.6)',
            }}>♥</span>
          </div>
     
        </div>

        {/* Swoll Hello Kitty mirrored on right for symmetry */}
        <img
          src="/treadmill_hello_kitty.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width: '64px',
            height: '64px',
            objectFit: 'cover',
            borderRadius: '999px',
            border: '2px solid #FF2D9B',
            boxShadow: '0 0 16px rgba(255,45,155,0.5)',
            flexShrink: 0,
            transform: 'scaleX(-1)',
          }}
        />

      </div>
    </header>
  )
}