// app/components/Carousel.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  children: React.ReactNode[]
  showCount: number
}

export default function Carousel({ children, showCount }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const totalItems = React.Children.count(children)
  const maxIndex = Math.max(0, totalItems - showCount)

  const next = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))
  }

  const prev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * (100 / showCount)}%)`
    }
  }, [currentIndex, showCount])

  return (
    <div className="relative overflow-hidden">
      <div
        ref={carouselRef}
        className="flex transition-transform duration-300 ease-in-out"
        style={{ width: `${(totalItems / showCount) * 100}%` }}
      >
        {React.Children.map(children, (child) => (
          <div style={{ flex: `0 0 ${100 / showCount}%` }}>{child}</div>
        ))}
      </div>
      {currentIndex > 0 && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentIndex < maxIndex && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}