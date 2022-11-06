import { useRouter } from 'next/router'
import { useAsync } from 'react-async-hook'
import Game from '../../components/Game'
import styles from '../../styles/Home.module.css'
import { getLevel } from '../api/levels/[lid]'
import { getHighscores } from '../api/levels/[lid]/highscores'

export default function Play() {
  const router = useRouter()
  const { lid } = router.query
  const level = useAsync(() => getLevel(lid), [router.query])
  const highscores = useAsync(() => getHighscores(lid), [router.query])
  
  return (
    <div className={styles.container}>
      {level.result && <Game 
        levelData={level.result}
      />}
      {highscores.result && <div>
        <h2>Highscores</h2>
        {highscores.result.map(highscore => {
        return (
          <div>
            <a href={`/replay?rid=${highscore.id}`}>{`Player: ${highscore.author.name} Time: ${highscore.length}`}</a>
          </div>
        )
      })}
      </div>}
    </div>
  )
}
