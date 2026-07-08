import { useState, useRef, useEffect } from 'react'
import { Upload, X, ZoomIn, ZoomOut } from 'lucide-react'

interface ProfilePictureEditorProps {
  currentImage?: string
  onSave: (imageData: string) => Promise<void>
  onCancel: () => void
  accentColor: string
}

export default function ProfilePictureEditor({
  currentImage,
  onSave,
  onCancel,
  accentColor
}: ProfilePictureEditorProps) {
  const [image, setImage] = useState<string | null>(currentImage || null)
  const [zoom, setZoom] = useState(100)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isSaving, setIsSaving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const CIRCLE_SIZE = 300

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result as string
        setImage(src)
        setZoom(100)
        setOffsetX(0)
        setOffsetY(0)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY })
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    setOffsetX(e.clientX - dragStart.x)
    setOffsetY(e.clientY - dragStart.y)
  }

  // Handle mouse up for dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Draw canvas with circular preview
  useEffect(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create image object
    const img = new Image()
    img.onload = () => {
      // Draw image with zoom and offset
      const scaleFactor = zoom / 100
      const scaledWidth = img.width * scaleFactor
      const scaledHeight = img.height * scaleFactor

      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight
      )

      // Draw circular clipping path preview
      ctx.strokeStyle = accentColor
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(CIRCLE_SIZE / 2, CIRCLE_SIZE / 2, CIRCLE_SIZE / 2 - 2, 0, Math.PI * 2)
      ctx.stroke()

      // Draw crosshair
      ctx.strokeStyle = `${accentColor}66`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(CIRCLE_SIZE / 2, CIRCLE_SIZE / 2 - 20)
      ctx.lineTo(CIRCLE_SIZE / 2, CIRCLE_SIZE / 2 + 20)
      ctx.moveTo(CIRCLE_SIZE / 2 - 20, CIRCLE_SIZE / 2)
      ctx.lineTo(CIRCLE_SIZE / 2 + 20, CIRCLE_SIZE / 2)
      ctx.stroke()
    }
    img.src = image
  }, [image, zoom, offsetX, offsetY, accentColor])

  // Handle save
  const handleSave = async () => {
    if (!canvasRef.current || !image) return

    try {
      setIsSaving(true)

      // Create a new canvas for the final circular image
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = CIRCLE_SIZE
      finalCanvas.height = CIRCLE_SIZE
      const finalCtx = finalCanvas.getContext('2d')
      if (!finalCtx) return

      // Draw the image
      const img = new Image()
      img.onload = async () => {
        const scaleFactor = zoom / 100
        const scaledWidth = img.width * scaleFactor
        const scaledHeight = img.height * scaleFactor

        finalCtx.drawImage(
          img,
          offsetX,
          offsetY,
          scaledWidth,
          scaledHeight
        )

        // Apply circular clipping
        finalCtx.globalCompositeOperation = 'destination-in'
        finalCtx.fillStyle = 'black'
        finalCtx.beginPath()
        finalCtx.arc(CIRCLE_SIZE / 2, CIRCLE_SIZE / 2, CIRCLE_SIZE / 2, 0, Math.PI * 2)
        finalCtx.fill()

        // Get the final image data
        const imageData = finalCanvas.toDataURL('image/png')
        await onSave(imageData)
      }
      img.src = image
    } catch (error) {
      console.error('Error saving profile picture:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-lg bg-gray-900 p-8 shadow-xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">Upload Profile Picture</h2>

        {!image ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 p-12 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload size={48} className="mb-4 text-gray-400" />
            <p className="text-lg text-gray-300 mb-2">Click to upload an image</p>
            <p className="text-sm text-gray-500">PNG, JPG, or GIF (max 5MB)</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Canvas Preview */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CIRCLE_SIZE}
                height={CIRCLE_SIZE}
                className="rounded-lg border-2 border-gray-700 cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            {/* Instructions */}
            <p className="text-center text-sm text-gray-400">
              Drag to reposition • Use zoom controls to resize
            </p>

            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ZoomOut size={20} className="text-gray-300" />
              </button>

              <div className="w-40 flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${
                      ((zoom - 50) / 250) * 100
                    }%, #374151 ${((zoom - 50) / 250) * 100}%, #374151 100%)`
                  }}
                />
              </div>

              <button
                onClick={() => setZoom(Math.min(300, zoom + 10))}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ZoomIn size={20} className="text-gray-300" />
              </button>

              <span className="text-sm text-gray-400 w-12 text-right">{zoom}%</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setImage(null)
                  setZoom(100)
                  setOffsetX(0)
                  setOffsetY(0)
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                Change Image
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{ backgroundColor: accentColor }}
                className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Picture'}
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
