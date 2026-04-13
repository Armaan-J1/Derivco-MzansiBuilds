import { FC } from 'react'

interface DotGridProps {
  dotSize?: number
  gap?: number
  baseColor?: string
  activeColor?: string
  proximity?: number
  shockRadius?: number
  shockStrength?: number
  resistance?: number
  returnDuration?: number
  speedTrigger?: number
  maxSpeed?: number
}

declare const DotGrid: FC<DotGridProps>
export default DotGrid
