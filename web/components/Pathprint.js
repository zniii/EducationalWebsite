import {useRouter} from 'next/router'
import styles from 'styles/Home.module.css'

function Pathprint({name , route}) {
    const router = useRouter()
    return (
        <a className={styles.path_link} onClick={()=>router.push(`${route}`)}> {name} </a>
    )
}

export default Pathprint
