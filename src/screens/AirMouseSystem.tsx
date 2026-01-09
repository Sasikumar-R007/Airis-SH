import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const AirMouseSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    cubeGroup: THREE.Group | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    cubeGroup: null
  })

  const [hudData, setHudData] = useState({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    speed: 0,
    status: 'Active'
  })
  const [keypadOpen, setKeypadOpen] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([])

  const pxRef = useRef(0)
  const pyRef = useRef(0)
  const lastMouseXRef = useRef(0)
  const lastMouseYRef = useRef(0)
  const trailRef = useRef<Array<{ x: number; y: number; time: number }>>([])
  const isWarpSpeedRef = useRef(false)
  const mouseOverWindowRef = useRef(true)
  const animationFrameRef = useRef<number>()

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    
    const updateSize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      return { width, height }
    }
    
    const { width, height } = updateSize()
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)
    renderer.setClearColor(0x050508, 1)

    // Lights
    scene.add(new THREE.AmbientLight(0x444444))
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Cube grid
    const cubeGroup = new THREE.Group()
    scene.add(cubeGroup)

    const cubeSize = 1.8
    const spacing = 0.2
    const count = 10

    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const material = new THREE.MeshPhongMaterial({
      color: 0x333333,
      specular: 0x888888,
      shininess: 30,
      emissive: 0x002233,
      emissiveIntensity: 0.8
    })

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = (x - count / 2 + 0.5) * (cubeSize + spacing)
        mesh.position.y = (y - count / 2 + 0.5) * (cubeSize + spacing)
        mesh.position.z = Math.random() * 4 - 2
        mesh.userData.initialZ = mesh.position.z
        mesh.userData.speed = Math.random() * 0.05 + 0.01
        mesh.userData.offset = Math.random() * Math.PI * 2
        cubeGroup.add(mesh)
      }
    }

    camera.position.z = 18

    sceneRef.current = { scene, camera, renderer, cubeGroup }

    // Animation loop
    const animate = () => {
      if (!sceneRef.current.cubeGroup) return

      const time = Date.now() * 0.001
      sceneRef.current.cubeGroup.children.forEach((mesh: any) => {
        mesh.position.z =
          mesh.userData.initialZ +
          Math.sin(time * mesh.userData.speed + mesh.userData.offset) * 0.5
        mesh.rotation.x += 0.0005
        mesh.rotation.y += 0.001
      })

      sceneRef.current.cubeGroup.rotation.y += 0.0003

      if (sceneRef.current.renderer && sceneRef.current.camera) {
        sceneRef.current.renderer.render(scene, sceneRef.current.camera)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current.camera || !sceneRef.current.renderer || !containerRef.current) return
      const { width, height } = updateSize()
      sceneRef.current.camera.aspect = width / height
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(width, height)
      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !containerRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      if (!containerRef.current) return
      canvas.width = containerRef.current.clientWidth
      canvas.height = containerRef.current.clientHeight
    }
    
    updateCanvasSize()
    
    const handleResize = () => {
      updateCanvasSize()
    }
    window.addEventListener('resize', handleResize)

    const renderMain = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (mouseOverWindowRef.current) {
        // Trail
        for (let i = 0; i < trailRef.current.length; i++) {
          const { x, y, time } = trailRef.current[i]
          const age = Date.now() - time
          const maxAge = isWarpSpeedRef.current ? 200 : 600
          const alpha = Math.max(0, 1 - age / maxAge)

          const radius = isWarpSpeedRef.current ? 2 + i / 5 : 4
          const color = isWarpSpeedRef.current
            ? `rgba(255,100,255,${alpha})`
            : `rgba(0,255,255,${alpha})`

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Holographic Cursor
        const cursorColor = isWarpSpeedRef.current ? '#ff64ff' : '#00ffff'
        const glowColor = isWarpSpeedRef.current
          ? 'rgba(255, 0, 255, 0.8)'
          : 'rgba(0, 255, 255, 0.8)'

        // Outer Pulsing Ring
        const pulse = Math.sin(Date.now() * 0.005) * 2 + 10
        ctx.shadowBlur = 20
        ctx.shadowColor = glowColor
        ctx.strokeStyle = cursorColor
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(pxRef.current, pyRef.current, pulse, 0, Math.PI * 2)
        ctx.stroke()

        // Inner Core
        const coreSize = 4 + Math.sin(Date.now() * 0.01) * 1.5
        ctx.fillStyle = cursorColor
        ctx.beginPath()
        ctx.arc(pxRef.current, pyRef.current, coreSize, 0, Math.PI * 2)
        ctx.fill()

        // Orbiter
        const orbiterRadius = 18
        const orbiterSpeed = isWarpSpeedRef.current ? 0.05 : 0.02
        const angle = Date.now() * orbiterSpeed
        const orbiterX = pxRef.current + orbiterRadius * Math.cos(angle)
        const orbiterY = pyRef.current + orbiterRadius * Math.sin(angle)
        ctx.fillStyle = isWarpSpeedRef.current
          ? 'rgba(255, 150, 255, 0.9)'
          : 'rgba(0, 255, 255, 0.9)'
        ctx.beginPath()
        ctx.arc(orbiterX, orbiterY, 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.shadowBlur = 0
      }

      requestAnimationFrame(renderMain)
    }
    renderMain()
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Initialize cursor position
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      pxRef.current = rect.width / 2
      pyRef.current = rect.height / 2
      lastMouseXRef.current = pxRef.current
      lastMouseYRef.current = pyRef.current
      setHudData(prev => ({
        ...prev,
        x: Math.round(pxRef.current),
        y: Math.round(pyRef.current)
      }))
    }
  }, [])

  // Mouse handlers
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const currentMouseX = e.clientX - rect.left
      const currentMouseY = e.clientY - rect.top

      const dx = currentMouseX - lastMouseXRef.current
      const dy = currentMouseY - lastMouseYRef.current
      const speed = Math.sqrt(dx * dx + dy * dy)

      pxRef.current = currentMouseX
      pyRef.current = currentMouseY

      lastMouseXRef.current = currentMouseX
      lastMouseYRef.current = currentMouseY

      setHudData({
        x: Math.round(pxRef.current),
        y: Math.round(pyRef.current),
        dx: parseFloat(dx.toFixed(2)),
        dy: parseFloat(dy.toFixed(2)),
        speed: parseFloat(speed.toFixed(2)),
        status: 'Active'
      })

      // Update cube rotation
      if (sceneRef.current.cubeGroup) {
        sceneRef.current.cubeGroup.rotation.x += dy * 0.0001
        sceneRef.current.cubeGroup.rotation.y += dx * 0.0001
      }

      // Trail
      const trailDensity = isWarpSpeedRef.current ? 3 : 1
      for (let i = 0; i < trailDensity; i++) {
        trailRef.current.push({ x: pxRef.current, y: pyRef.current, time: Date.now() })
      }
      const maxTrailLength = isWarpSpeedRef.current ? 120 : 40
      while (trailRef.current.length > maxTrailLength) trailRef.current.shift()
    }

    const handleMouseEnter = (e: MouseEvent) => {
      if (!mouseOverWindowRef.current && container) {
        const rect = container.getBoundingClientRect()
        pxRef.current = e.clientX - rect.left
        pyRef.current = e.clientY - rect.top
        lastMouseXRef.current = pxRef.current
        lastMouseYRef.current = pyRef.current
        mouseOverWindowRef.current = true
        trailRef.current = []
      }
    }

    const handleMouseLeave = () => {
      mouseOverWindowRef.current = false
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      if (e.button === 0) {
        addToast('💥 Activation Pulse Sent (L-Click)')
        createRipple(x, y)
      }
      if (e.button === 2) {
        addToast('⚡ Engaging Warp Trail (R-Click)')
        isWarpSpeedRef.current = true
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        isWarpSpeedRef.current = false
      }
    }

    const handleContextMenu = (e: Event) => {
      e.preventDefault()
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('contextmenu', handleContextMenu)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  const addToast = (message: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3400)
  }

  const createRipple = (x: number, y: number) => {
    // Ripple effect would be implemented with CSS animations
    // For now, we'll just show a toast
  }

  const recenterCursor = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    pxRef.current = centerX
    pyRef.current = centerY
    lastMouseXRef.current = centerX
    lastMouseYRef.current = centerY
    trailRef.current = []

    addToast('⌖ Cursor Position Recalibrated')

    setHudData(prev => ({
      ...prev,
      x: Math.round(pxRef.current),
      y: Math.round(pyRef.current)
    }))
  }

  const handleKeypadKey = (key: string) => {
    if (key === 'BACK') {
      setCurrentText(prev => prev.slice(0, -1))
      addToast('⌨️ Backspace')
    } else if (key === 'ENTER') {
      addToast(`✅ Command Sent: "${currentText.trim()}"`)
      setCurrentText('')
    } else if (key === 'CLOSE') {
      setKeypadOpen(false)
    } else if (currentText.length < 30) {
      setCurrentText(prev => prev + key)
      addToast(`⌨️ Typed: ${key}`)
    }
  }

  const keypadKeys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '"',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', ',', '?'
  ]

  return (
    <div 
      className="relative w-full h-screen overflow-hidden" 
      style={{ 
        background: '#050508',
        height: '100vh',
        width: '100%'
      }}
    >
      {/* 3D Background Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, cursor: 'crosshair', background: 'transparent', pointerEvents: 'auto' }}
      />

      {/* HUD Panel */}
      <div
        className="fixed top-5 left-4 lg:left-[300px] p-4 lg:p-5 rounded-xl border"
        style={{
          background: 'rgba(10, 25, 40, 0.9)',
          borderColor: 'rgba(0, 255, 255, 0.4)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#e0e0e0',
          fontSize: '14px',
          zIndex: 100,
          fontFamily: '"Share Tech Mono", monospace',
          minWidth: '200px',
          maxWidth: 'calc(100vw - 2rem)'
        }}
      >
        <h2
          className="m-0 mb-3 text-2xl"
          style={{
            color: '#00ffff',
            textShadow: '0 0 8px rgba(0, 255, 255, 0.9)'
          }}
        >
          Air Mouse H-System
        </h2>
        <div className="flex justify-between mt-1.5">
          <span style={{ color: '#aaaaaa' }}>X:</span>
          <span>{hudData.x}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span style={{ color: '#aaaaaa' }}>Y:</span>
          <span>{hudData.y}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span style={{ color: '#aaaaaa' }}>ΔX:</span>
          <span>{hudData.dx}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span style={{ color: '#aaaaaa' }}>ΔY:</span>
          <span>{hudData.dy}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span style={{ color: '#aaaaaa' }}>Speed:</span>
          <span>{hudData.speed.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span style={{ color: '#aaaaaa' }}>Status:</span>
          <span>{hudData.status}</span>
        </div>
        <button
          onClick={recenterCursor}
          className="w-full mt-4 p-2 rounded-md cursor-pointer transition-all"
          style={{
            background: 'rgba(255, 255, 0, 0.2)',
            color: '#ffff00',
            border: '1px solid #ffff00'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 0, 0.4)'
            e.currentTarget.style.boxShadow = '0 0 10px #ffff00'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 0, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ⌖ Recenter Cursor
        </button>
      </div>

      {/* Keypad Button */}
      <button
        onClick={() => setKeypadOpen(true)}
        className="fixed top-5 right-4 lg:right-5 p-2.5 rounded-lg cursor-pointer transition-all z-[100]"
        style={{
          background: 'rgba(0, 255, 255, 0.2)',
          color: '#00ffff',
          border: '1px solid #00ffff'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 255, 0.4)'
          e.currentTarget.style.boxShadow = '0 0 15px #00ffff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 255, 0.2)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        Open Keypad
      </button>

      {/* Keypad Monitor */}
      {keypadOpen && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] p-5 rounded-2xl border z-50"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            borderColor: '#00ffff',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)'
          }}
        >
          <div
            className="bg-[#0d0d1a] text-[#00ff7f] border border-[#00ffff] p-4 h-[60px] mb-4 text-xl font-mono overflow-x-hidden whitespace-nowrap rounded"
            style={{
              fontFamily: 'Consolas, monospace'
            }}
          >
            {currentText || '_'}
            {currentText.length > 0 && (
              <span style={{ animation: 'blink 1s step-start 0s infinite' }}>|</span>
            )}
          </div>
          <div className="grid grid-cols-10 gap-2">
            {keypadKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleKeypadKey(key)}
                className="bg-[#223344] text-[#00ffff] border border-[#00ffff55] py-2.5 text-center cursor-pointer rounded transition-all select-none hover:bg-[#334455] hover:shadow-[0_0_10px_#00ffff] active:scale-95 active:bg-[#00ffff] active:text-black"
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => handleKeypadKey('BACK')}
              className="bg-[#552222] text-[#00ffff] border border-[#00ffff55] py-2.5 text-center cursor-pointer rounded transition-all select-none hover:bg-[#334455] hover:shadow-[0_0_10px_#00ffff] active:scale-95 active:bg-[#00ffff] active:text-black col-span-2"
            >
              BACK
            </button>
            <button
              onClick={() => handleKeypadKey(' ')}
              className="bg-[#223344] text-[#00ffff] border border-[#00ffff55] py-2.5 text-center cursor-pointer rounded transition-all select-none hover:bg-[#334455] hover:shadow-[0_0_10px_#00ffff] active:scale-95 active:bg-[#00ffff] active:text-black col-span-4"
            >
              SPACE
            </button>
            <button
              onClick={() => handleKeypadKey('ENTER')}
              className="bg-[#440055] text-[#00ffff] border border-[#00ffff55] py-2.5 text-center cursor-pointer rounded transition-all select-none hover:bg-[#660088] hover:shadow-[0_0_10px_#00ffff] active:scale-95 active:bg-[#00ffff] active:text-black"
            >
              ENTER
            </button>
            <button
              onClick={() => handleKeypadKey('CLOSE')}
              className="bg-[#440055] text-[#00ffff] border border-[#00ffff55] py-2.5 text-center cursor-pointer rounded transition-all select-none hover:bg-[#660088] hover:shadow-[0_0_10px_#00ffff] active:scale-95 active:bg-[#00ffff] active:text-black"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-[200]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[rgba(20,35,50,0.98)] text-[#e0e0e0] p-4 rounded-lg border-l-4 border-[#00ffff] text-base shadow-lg"
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              animation: 'slideIn 0.4s ease, fadeOut 0.4s ease 3s forwards'
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Activity Bar */}
      <div
        className="fixed top-0 left-0 lg:left-[288px] h-1 z-[150] transition-all"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00ffff 100%)',
          boxShadow: '0 0 12px #00ffff',
          width: '100%',
          maxWidth: `${Math.min(hudData.speed * 8, 100)}%`
        }}
      />
    </div>
  )
}

export default AirMouseSystem

