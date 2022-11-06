import { useAsync } from 'react-async-hook'
import styles from '../styles/Home.module.css'
import { getLevels } from './api/levels'

export default function Home() {
  const levels = useAsync(() => getLevels(), [])

  return (
    <div className={styles.container}>
      <h2>Levels</h2>
      {levels.result && levels.result.map(level => {
        return (
          <div>
            <a href={`/play?lid=${level.id}`}>{level.title}</a>
          </div>
        )
      })
      }
    </div>
  )
}
