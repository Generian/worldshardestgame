import { Paper } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import Game from '../../components/Game'
import PageFrame from '../../components/general/PageFrame'
import { navigateToHome } from '../../lib/navigation'
import styles from '../../styles/Play.module.css'
import { saveCollectionReplay } from '../api/collectionreplays'
import { getCollection } from '../api/collections/[cid]'
import { getLevel } from '../api/levels/[lid]'
import { getHighscores } from '../api/levels/[lid]/highscores'

export default function Play() {
  const router = useRouter()
  const { lid, cid } = router.query

  const [deaths, setDeaths] = useState(0)

  const collection = useAsync(() => getCollection(cid), [cid])
  const level = useAsync(() => getLevel(lid ? lid : collection?.result[0]?.levelId), [lid, collection.result])
  const highscores = useAsync(() => getHighscores(lid), [lid])

  useEffect(() => {
    cid && collection.result && router.push(`/play?cid=${cid}&lid=${collection.result[0]?.levelId}`, undefined, { shallow: true })
  }, [collection.result])

  useEffect(() => {
    if (router.isReady && !lid && !cid) {
      console.log('home:', lid, cid)
      navigateToHome(router)
    }
  }, [lid, cid])

  const handleLevelComplete = () => {
    const col = collection.result

    if (col) {
      const currentIndex = col.findIndex(l => l.levelId == Number(lid))

      if (typeof currentIndex === 'number') {

        if (currentIndex + 1 == col.length) {
          // Submit collection results
          console.log('Collection complete. Deaths:', deaths)
          saveCollectionReplay(cid, 1, deaths) // TODO: Update authorId
        } else if (currentIndex + 1 < col.length) {

          router.push(`/play?cid=${cid}&lid=${col[currentIndex + 1].levelId}`, undefined, { shallow: true })
        } else {
          console.error('Error routing to next level')
          navigateToHome(router)
        }
      }
    }
  }

  return (
    <PageFrame>
      <div className={styles.container}>
        <Paper elevation={2}>
          <div className={styles.gameContainer}>
            {<Game
              levelData={level.result}
              setDeaths={setDeaths}
              handleLevelComplete={cid && handleLevelComplete}
            />}
            <div className={styles.statsContainer}>
              <span>{deaths}</span>
              <h2>Highscores</h2>
              {highscores.result && <div>
                {highscores.result.map(highscore => {
                  return (
                    <div key={`highscore_${highscore.id}`}>
                      <Link href={`/replay?rid=${highscore.id}`}>{`Player: ${highscore.author.name} Time: ${highscore.length}`}</Link>
                    </div>
                  )
                })}
              </div>}
            </div>
          </div>
        </Paper>
      </div>
    </PageFrame>
  )
}
