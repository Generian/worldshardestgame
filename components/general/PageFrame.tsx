import styles from '../../styles/PageFrame.module.css'
import Header from './Header'

export default function PageFrame({ children }) {

  return (
    <div className={styles.container}>
      <Header/>
      <div className={styles.contentContainer}>
        {children}
      </div>
    </div>
  )
}
