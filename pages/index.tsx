import { Typography } from '@mui/material'
import Link from 'next/link'
import { useAsync } from 'react-async-hook'
import PageFrame from '../components/general/PageFrame'
import CollectionCard from '../components/home/CollectionCard'
import LevelCard from '../components/home/LevelCard'
import styles from '../styles/Home.module.css'
import { getCollections } from './api/collections'
import { getLevels } from './api/levels'

export default function Home() {
  const levels = useAsync(() => getLevels(), [])
  const collections = useAsync(() => getCollections(), [])

  return (
    <PageFrame>
      <div className={styles.container}>
        <div className={styles.groupContainer}>
          <Typography variant="h5">
            Collections
          </Typography>
          <div className={styles.cardContainer}>
            {collections.result && collections.result.map(collection => {
              return (
                <CollectionCard
                  collection={collection}
                />
              )
            })}
          </div>
        </div>
        <div>
          <Typography variant="h5">
            Levels
          </Typography>
          <div className={styles.cardContainer}>
            {levels.result && levels.result.map(level => {
              return (
                <LevelCard
                  level={level}
                />
              )
            })}
          </div>
        </div>
      </div>
    </PageFrame>
  )
}
