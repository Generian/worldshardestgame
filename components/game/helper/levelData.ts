export interface Enemy {
  x: number
  y: number
  movementType?: 'STATIC' | 'LINEAR'
  speed?: {x: number, y: number}
  cycleLength?: number
}

export interface Area {
  x: number
  y: number
  width: number
  height: number
  isStart?: boolean
  isExit?: boolean
}

export interface SetupInstructions {
  enemies: Enemy[],
  areas: Area[]
}

const exampleLevel: SetupInstructions = {
    enemies: [
      {
        x: 270,
        y: 240,
        movementType: 'LINEAR',
        speed: {x: 5, y: 0},
        cycleLength: 72
      },
      {
        x: 270,
        y: 320,
        movementType: 'LINEAR',
        speed: {x: 5, y: 0},
        cycleLength: 72
      },
      {
        x: 630,
        y: 280,
        movementType: 'LINEAR',
        speed: {x: -5, y: 0},
        cycleLength: 72
      },
      {
        x: 630,
        y: 360,
        movementType: 'LINEAR',
        speed: {x: -5, y: 0},
        cycleLength: 72
      }
    ],
    areas: [
      {
        x: 100,
        y: 180,
        width: 120,
        height: 240,
        isStart: true,
      },
      {
        x: 680,
        y: 180,
        width: 120,
        height: 240,
        isExit: true,
      },
      {
        x: 220,
        y: 380,
        width: 80,
        height: 40,
      },
      {
        x: 600,
        y: 180,
        width: 80,
        height: 40,
      },
      {
        x: 260,
        y: 220,
        width: 380,
        height: 160,
      }
    ]
  }