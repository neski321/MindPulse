"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface FloatingShape {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  type: 'circle' | 'triangle' | 'square' | 'star' | 'hexagon' | 'diamond' | 'cross' | 'wave'
  rotation: number
}

export function BackgroundAnimation() {
  const [shapes, setShapes] = useState<FloatingShape[]>([])

  useEffect(() => {
    const colors = [
      "rgba(59, 130, 246, 0.2)", // blue
      "rgba(139, 92, 246, 0.2)", // purple
      "rgba(236, 72, 153, 0.15)", // pink
      "rgba(16, 185, 129, 0.15)", // emerald
      "rgba(245, 158, 11, 0.15)", // amber
      "rgba(239, 68, 68, 0.15)", // red
      "rgba(34, 197, 94, 0.15)", // green
      "rgba(168, 85, 247, 0.15)", // violet
    ]

    const shapeTypes: FloatingShape['type'][] = ['circle', 'triangle', 'square', 'star', 'hexagon', 'diamond', 'cross', 'wave']

    const newShapes: FloatingShape[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 10,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      rotation: Math.random() * 360,
    }))

    setShapes(newShapes)
  }, [])

  const renderShape = (shape: FloatingShape) => {
    const baseStyle = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: shape.size,
      height: shape.size,
      backgroundColor: shape.color,
      filter: "blur(0.5px)",
    }

    switch (shape.type) {
      case 'circle':
        return (
          <motion.div
            key={shape.id}
            className="absolute rounded-full"
            style={baseStyle}
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.7, 0.2, 0.3],
              rotate: [shape.rotation, shape.rotation + 180, shape.rotation + 360],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      case 'triangle':
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
            animate={{
              x: [0, -30, 40, 0],
              y: [0, 40, -20, 0],
              scale: [1, 1.3, 0.7, 1],
              opacity: [0.4, 0.8, 0.2, 0.4],
              rotate: [shape.rotation, shape.rotation + 120, shape.rotation + 240],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      case 'square':
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              ...baseStyle,
              borderRadius: "8px",
            }}
            animate={{
              x: [0, 50, -20, 0],
              y: [0, -40, 50, 0],
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.3, 0.6, 0.2, 0.3],
              rotate: [shape.rotation, shape.rotation + 90, shape.rotation + 180],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      case 'star':
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
            animate={{
              x: [0, 30, -40, 0],
              y: [0, -60, 20, 0],
              scale: [1, 1.4, 0.6, 1],
              opacity: [0.4, 0.9, 0.1, 0.4],
              rotate: [shape.rotation, shape.rotation + 144, shape.rotation + 288],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      case 'hexagon':
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            }}
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 30, -50, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.7, 0.2, 0.3],
              rotate: [shape.rotation, shape.rotation + 60, shape.rotation + 120],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      case 'diamond':
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -30, 40, 0],
              scale: [1, 1.3, 0.7, 1],
              opacity: [0.4, 0.8, 0.2, 0.4],
              rotate: [shape.rotation, shape.rotation + 45, shape.rotation + 90],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      case 'cross':
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: "polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)",
            }}
            animate={{
              x: [0, -20, 30, 0],
              y: [0, 40, -20, 0],
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.3, 0.6, 0.2, 0.3],
              rotate: [shape.rotation, shape.rotation + 90, shape.rotation + 180],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      case 'wave':
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: "polygon(0% 50%, 25% 30%, 50% 50%, 75% 70%, 100% 50%, 100% 100%, 0% 100%)",
            }}
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.7, 0.2, 0.3],
              rotate: [shape.rotation, shape.rotation + 180, shape.rotation + 360],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 60%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Floating shapes */}
      {shapes.map((shape) => renderShape(shape))}

      {/* Enhanced particle effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 1, 0],
              scale: [0.3, 1, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Breathing circles with different colors */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          border: "1px solid rgba(59, 130, 246, 0.1)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          border: "1px solid rgba(139, 92, 246, 0.1)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-2/3 left-1/2 w-28 h-28 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
          border: "1px solid rgba(236, 72, 153, 0.1)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.2, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Additional geometric shapes */}
      <motion.div
        className="absolute top-1/2 right-1/3 w-6 h-6 rotate-45"
        style={{
          backgroundColor: "rgba(16, 185, 129, 0.3)",
        }}
        animate={{
          rotate: [45, 225, 45],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full"
        style={{
          backgroundColor: "rgba(245, 158, 11, 0.4)",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 15, 0],
          scale: [1, 1.5, 0.8, 1],
          opacity: [0.4, 0.8, 0.2, 0.4],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* New geometric elements */}
      <motion.div
        className="absolute top-1/3 right-1/2 w-8 h-8"
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.3)",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <motion.div
        className="absolute bottom-1/2 left-1/4 w-5 h-5"
        style={{
          backgroundColor: "rgba(168, 85, 247, 0.4)",
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -20, 25, 0],
          rotate: [0, 60, 120, 180],
          scale: [1, 1.4, 0.9, 1],
          opacity: [0.4, 0.8, 0.2, 0.4],
        }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 7,
        }}
      />

      {/* Floating orbs with different colors */}
      <motion.div
        className="absolute top-3/4 right-1/5 w-3 h-3 rounded-full"
        style={{
          backgroundColor: "rgba(34, 197, 94, 0.5)",
          boxShadow: "0 0 10px rgba(34, 197, 94, 0.3)",
        }}
        animate={{
          y: [0, -50, 0],
          x: [0, 20, 0],
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 16,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 9,
        }}
      />

      <motion.div
        className="absolute top-1/5 right-1/3 w-2 h-2 rounded-full"
        style={{
          backgroundColor: "rgba(245, 158, 11, 0.6)",
          boxShadow: "0 0 8px rgba(245, 158, 11, 0.4)",
        }}
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 1.8, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 11,
        }}
      />
    </div>
  )
}
