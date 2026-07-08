import { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'gradient' | 'mesh' | 'waves'
  color?: string
  intensity?: number
}

export const AnimatedBackground = ({ 
  variant = 'gradient', 
  color = '#3b82f6',
  intensity = 0.2 
}: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (variant !== 'particles') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `${color}${Math.floor((1 - distance / 150) * intensity * 255).toString(16).padStart(2, '0')}`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [variant, color, intensity])

  if (variant === 'particles') {
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
    )
  }

  if (variant === 'gradient') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ 
            background: color,
            opacity: intensity
          }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ 
            background: color,
            opacity: intensity,
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse"
          style={{ 
            background: color,
            opacity: intensity * 0.5,
            animationDelay: '2s'
          }}
        />
      </div>
    )
  }

  if (variant === 'mesh') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${color}${Math.floor(intensity * 50).toString(16).padStart(2, '0')} 1px, transparent 1px),
              linear-gradient(90deg, ${color}${Math.floor(intensity * 50).toString(16).padStart(2, '0')} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'meshMove 20s linear infinite'
          }}
        />
      </div>
    )
  }

  if (variant === 'waves') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
          style={{
            background: `linear-gradient(180deg, transparent, ${color})`,
            animation: 'wave 10s ease-in-out infinite'
          }}
        />
      </div>
    )
  }

  return null
}
