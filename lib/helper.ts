import { FPS } from "../components/game/gameVariables"

export const formatFrameCountToTime = (length: number) => {
  const partial = length % FPS
  const secs = (length - (length % FPS)) / FPS
  const min = secs - (secs % 60)

  return `${min ? `${min}:` : ''}${secs % 60 < 10 && min? '0' : ''}${secs % 60}.${Math.round(100 * partial/FPS)}s`
}