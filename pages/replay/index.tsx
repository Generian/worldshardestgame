import { useRouter } from 'next/router'
import { useAsync } from 'react-async-hook'
import Game from '../../components/Game'
import { getLevel } from '../../lib/fetch'
import styles from '../../styles/Home.module.css'
import { getReplay } from '../api/replays/[rid]'

export default function Replay() {
  const router = useRouter()
  const { rid } = router.query
  const replay = useAsync(() => getReplay(rid), [router.query])
  const level = useAsync(() => getLevel(replay.result.levelId), [replay.result])

  
  return (
    <div className={styles.container}>
      {replay.result && level.result && <Game 
        levelData={level.result}
        replay={replay.result}
      />}
    </div>
  )
}
