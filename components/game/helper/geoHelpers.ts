export const arePlayerAndEnemyColliding = (player: any, enemy: any) => {
    let areColliding = false
    let circleDistance = {x: 0, y: 0}
    circleDistance.x = Math.abs(enemy.x - player.x);
    circleDistance.y = Math.abs(enemy.y - player.y);

    if (circleDistance.x > (player.d/2 + enemy.r)) { return false; }
    if (circleDistance.y > (player.d/2 + enemy.r)) { return false; }

    if (circleDistance.x <= (player.d/2)) { 
      return true; 
    } 
    if (circleDistance.y <= (player.d/2)) { 
      areColliding = true
      return true; 
    }

    const cornerDistance_sq = Math.pow(circleDistance.x - player.d/2, 2) + Math.pow(circleDistance.y - player.d/2, 2);

    return cornerDistance_sq <= Math.pow(enemy.r, 2)
}