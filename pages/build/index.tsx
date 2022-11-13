import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import Game from '../../components/Game'
import styles from '../../styles/Home.module.css'
import { createLevel } from '../api/levels'
import { getLevel } from '../api/levels/[lid]'

export default function Play() { 
  const [levelData, setLevelData] = useState({
    title: 'test',
    setupInstructions: {},
    published: false,
    authorId: 1
  })

  const onChange = async (e) => {
    let d = await JSON.parse(e.target.value)
    console.log(d?.enemies?.length, d)
    setLevelData({
      ...levelData,
      setupInstructions: d
    })
  }

  const onSubmit = async () => {
    const newLevel = await createLevel(levelData)
    return newLevel
  }
  
  return (
    <div className={styles.container}>
      {<Game 
        levelData={{
          id: 0,
          ...levelData
        }}
      />}
      <textarea onChange={e => onChange(e)}></textarea>
      <button onClick={onSubmit}>Submit new level</button>
    </div>
  )
}
