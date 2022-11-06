import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import type p5Type from 'p5'
import useWindowDimensions from './game/helper/useWindowDimensions';
import { arePlayerAndEnemyColliding } from './game/helper/geoHelpers';
import { styles } from './game/helper/styling';
import { Level, Replay } from '@prisma/client';
import { SetupInstructions } from './game/helper/levelData';
import { saveReplay } from '../pages/api/replays';

interface Coords {
  x: number
  y: number
}

export interface ReplayData {
  LEFT_ARROW: boolean
  RIGHT_ARROW: boolean
  UP_ARROW: boolean
  DOWN_ARROW: boolean
  player: {
    x: number
    y: number
  }
}

interface GameProps {
  levelData: Level
  replay?: Replay
}

const Game = ({ levelData, replay }: GameProps) => {

  // Development mode
  let debugMode = false

  // Game variables

  const speed = 2.5

  // const { height, width } = useWindowDimensions();
  let width = 900
  let height = 600

  let frame = 0
  let replayMode = replay ? true : false
  let replayData = replayMode ? replay.replayInstructions as unknown as ReplayData[] : []

  const level = levelData.setupInstructions as unknown as SetupInstructions

  let player: any
  let enemies: any[] = []
  let playableAreas: any[] = []
  let exitArea: any
  let areasTouched = []
  let gameFont: p5Type.Font

  let gameOver = false


  const Sketch = dynamic(import('react-p5'), { ssr: false })
  
  const preload = (p5: p5Type): void => {
    // gameFont = p5.loadFont('/game.ttf')
  }

  const setup = (p5: p5Type, canvasParentRef: Element): void => {
    p5.frameRate(60)
    p5.createCanvas(width, height).parent(canvasParentRef)
  }

  const draw = (p5: p5Type): Promise<void> => {
    p5.background(styles.general.backgroundColor)

    if (!level?.enemies || !level.areas) return

    class Player {
      x: number
      y: number
      d: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.d = styles.player.size
      }

      cornerInside(
        corner: number,
        coordinates: Coords = this,
        getArea: boolean = false,
      ) {
        switch (corner) {
          case 1:
            for (let area of playableAreas) {
              if (area.coordinateInside(this.getCornerCoords(corner, coordinates))) {
                return getArea ? area : true
              }
            }          
            break;

          case 2:
            for (let area of playableAreas) {
              if (area.coordinateInside(this.getCornerCoords(corner, coordinates))) {
                return getArea ? area : true
              }
            }          
            break;

          case 3:
            for (let area of playableAreas) {
              if (area.coordinateInside(this.getCornerCoords(corner, coordinates))) {
                return getArea ? area : true
              }
            }          
            break;

          case 4:
            for (let area of playableAreas) {
              if (area.coordinateInside(this.getCornerCoords(corner, coordinates))) {
                return getArea ? area : true
              }
            }          
            break;
        
          default:
            return getArea ? null : false
        }
        return getArea ? null : false
      }

      allCornersInsidePlayableArea(
        coordinates: {x: number, y: number} = {x: this.x, y: this.y}
      ) {
        let isInside = true
        for (let corner = 1; corner <= 4; corner++) {
          if (!this.cornerInside(corner, coordinates)) {
            isInside = false
          }          
        }
        return isInside
      }

      getCornerCoords(corner: number, coordinates: Coords = this) {
        switch (corner) {
          case 1:
            return {
              x: coordinates.x - this.d/2,
              y: coordinates.y - this.d/2
            }
          case 2:
            return {
              x: coordinates.x + this.d/2,
              y: coordinates.y - this.d/2
            }
            
          case 3:
            return {
              x: coordinates.x - this.d/2,
              y: coordinates.y + this.d/2
            }

          case 4:
            return {
              x: coordinates.x + this.d/2,
              y: coordinates.y + this.d/2
            }

          default:
            return null
        }
      }

      update() {
        // Re-play replay
        if (replayMode) {
          this.x = replayData[frame]?.player.x || this.x
          this.y = replayData[frame]?.player.y || this.y
          return
        }

        // Replay data
        let replayInstruction = {
          LEFT_ARROW: false,
          RIGHT_ARROW: false,
          UP_ARROW: false,
          DOWN_ARROW: false,
          player: {
            x: this.x,
            y: this.y
          }
        }

        // Determine areas currently touched
        areasTouched = []
        for (let corner = 1; corner <= 4; corner++) {
          let area = this.cornerInside(corner, this, true)
          if (area) {
            areasTouched.push(area)
          }          
        }

        // Move player
        let newCoords = {x: this.x, y: this.y}

        // Update x and y directions
        if (!replayMode) {
          if (p5.keyIsDown(p5.LEFT_ARROW)) {
            newCoords.x -= speed
            replayInstruction.LEFT_ARROW = true
          }
          if (p5.keyIsDown(p5.RIGHT_ARROW)) {
            newCoords.x += speed
            replayInstruction.RIGHT_ARROW = true
          }
          if (p5.keyIsDown(p5.UP_ARROW)) {
            newCoords.y -= speed
            replayInstruction.UP_ARROW = true
          } 
          if (p5.keyIsDown(p5.DOWN_ARROW)) {
            newCoords.y += speed
            replayInstruction.DOWN_ARROW = true
          }
        }
        
        let canMoveInXDirection = this.allCornersInsidePlayableArea({x: newCoords.x, y: this.y})

        let canMoveInYDirection = this.allCornersInsidePlayableArea({x: this.x, y: newCoords.y})

        let canMoveinBothDirections = this.allCornersInsidePlayableArea(newCoords)

        if (!canMoveinBothDirections) {

          if (!canMoveInXDirection) {
            let tempX = newCoords.x

            for (let area of areasTouched) {
              if (newCoords.x - this.d/2 < area.x) {
                let newX = area.x + this.d/2
                tempX = newX > tempX ? newX : tempX
              } else if (newCoords.x + this.d/2 > area.x + area.width) {
                let newX = area.x + area.width - this.d/2
                tempX = newX < tempX ? newX : tempX
              }
            }
            newCoords = {
              x: tempX,
              y: newCoords.y
            }
          }

          if (!canMoveInYDirection) {
            let tempY = newCoords.y

            for (let area of areasTouched) {
              if (newCoords.y - this.d/2 < area.y) {
                let newY = area.y + this.d/2
                tempY = newY > tempY ? newY : tempY
              } else if (newCoords.y + this.d/2 > area.y + area.height) {
                let newY = area.y + area.height - this.d/2
                tempY = newY < tempY ? newY : tempY
              }
            }
            newCoords = {
              x: newCoords.x,
              y: tempY
            }
          }
        }

        this.x = newCoords.x
        this.y = newCoords.y
        replayInstruction.player = newCoords

        // Save replay data
        replayData[frame] = replayInstruction
      }

      show() {
        p5.rectMode(p5.CENTER)
        p5.fill(styles.player.strokeColor)
        p5.rect(this.x, this.y, this.d, this.d)
        p5.fill(styles.player.fillColor)
        p5.rect(this.x, this.y, this.d - 2*styles.player.strokeWeight, this.d - 2*styles.player.strokeWeight)
      }
    }

    class Area {
      x: number
      y: number
      width: number
      height: number
      isStart: boolean
      isExit: boolean
      isTouched: boolean

      constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        isStart: boolean = false,
        isExit: boolean = false
      ) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.isStart = isStart
        this.isExit = isExit
        this.isTouched = false
      }

      playerInside(player: any) {
        return player.x - player.d/2 >= this.x && player.x + player.d/2 <= this.x + this.width && player.y - player.d/2 >= this.y && player.y + player.d/2 <= this.y + this.height
      }

      coordinateInside(coordinate: Coords) {
        return coordinate.x >= this.x && 
        coordinate.x <= this.x + this.width && 
        coordinate.y >= this.y && 
        coordinate.y <= this.y + this.height
      }

      checkWinCriteria() {
        if (this.isExit) {
          return this.playerInside(player)
        }
      }

      update() {
        if (debugMode) {
          // Check if touched
          let isTouched = false
          for (let corner = 1; corner <= 4; corner++) {
            if (this.coordinateInside(player.getCornerCoords(corner))) {
              isTouched = true
            }            
          }
          this.isTouched = isTouched
        }
      }

      show() {
        if (this.isTouched) {
          p5.strokeWeight(1);
          p5.stroke(styles.area.strokeColor);
        } else {
          p5.noStroke();
        }
        p5.fill(this.isStart || this.isExit ? 
          styles.area.startAndExitBackgroundColor : 
          styles.area.defaultBackgroundColor)
        p5.rectMode(p5.CORNER)
        p5.rect(this.x, this.y, this.width, this.height)
      }
    }

    class Enemy {
      x: number
      y: number
      r: number
      movementType: 'STATIC' | 'LINEAR'
      speed: {x: number, y: number}
      cycleLength: number
      cycleFrameCount: number

      constructor(
        x: number, 
        y: number, 
        movementType: 'STATIC' | 'LINEAR' = 'STATIC',
        speed: {x: number, y: number} = {x: 0, y: 0},
        cycleLength: number = 1
      ) {
        this.x = x
        this.y = y
        this.r = styles.enemy.radius
        this.movementType = movementType
        this.speed = speed
        this.cycleLength = cycleLength
        this.cycleFrameCount = 0
      }

      update() {
        if (arePlayerAndEnemyColliding(player, this)) {
          gameOver = true
        }

        switch (this.movementType) {
          case 'STATIC':
            break;

          case 'LINEAR':
            if (this.cycleFrameCount === this.cycleLength) {
              this.speed = {x: -this.speed.x, y: -this.speed.y}
              this.cycleFrameCount = 0
            }

            this.x += this.speed.x
            this.y += this.speed.y

            this.cycleFrameCount = this.cycleFrameCount + 1
            break;
        
          default:
            break;
        }

      }

      show() {
        p5.noStroke()
        p5.fill(styles.enemy.strokeColor)
        p5.circle(this.x, this.y, this.r * 2)
        p5.fill(styles.enemy.fillColor)
        p5.circle(this.x, this.y, this.r * 2 - styles.enemy.strokeWeight * 2)
      }
    }

    if (frame === 0) {
      for (let enemy of level.enemies) {
        enemies.push(new Enemy(
          enemy.x,
          enemy.y,
          enemy.movementType,
          enemy.speed,
          enemy.cycleLength 
        ))
      }
      for (let area of level.areas) {
        let a = new Area(
          area.x,
          area.y,
          area.width,
          area.height,
          area.isStart,
          area.isExit
        )
        playableAreas.push(a)
        if (a.isStart) {
          player = new Player(a.x + a.width/2, a.y + a.height/2)
        } else if (a.isExit) {
          exitArea = a
        }
      }
    } else {
      if (!gameOver) {
        // Update
        player.update()

        for (let enemy of enemies) {
          enemy.update()
        }

        for (let area of playableAreas) {
          area.update()
        }
      }

      // Check gameOver criteria & save replay
      if (!gameOver && exitArea.playerInside(player)) {

        gameOver = true
        console.log(player)

        if (!replayMode && replayData.length) {
          saveReplay(replayData, 1, levelData.id)
        }
      }

      // Render
      for (let area of playableAreas) {
        area.show()
      }

      player.show()

      for (let enemy of enemies) {
        enemy.show()
      }
    }

    frame++
  }

  const keyPressed = (p5: p5Type): void => {
    if (p5.keyCode === p5.ENTER) {
      if (gameOver) {
        resetGame()
      } else {
        gameOver = true
      }
    } else {
    }
  }

  const resetGame = () => {
    frame = 0
    player = null
    enemies = []
    gameOver = false
    replayData = []
  }


  return <Sketch
    preload={preload}
    setup={setup}
    draw={draw}
    keyPressed={keyPressed}
  />
}

export default Game