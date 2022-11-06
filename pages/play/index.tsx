import { useRouter } from 'next/router'
import { useAsync } from 'react-async-hook'
import Game from '../../components/Game'
import { getLevel } from '../../lib/fetch'
import styles from '../../styles/Home.module.css'

export default function Play() {
  const router = useRouter()
  const { lid } = router.query
  const level = useAsync(() => getLevel(lid), [router.query])
  
  return (
    <div className={styles.container}>
      {level.result && <Game 
        levelData={level.result}
      />}
    </div>
  )
}
