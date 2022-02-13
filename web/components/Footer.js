import styles from '../styles/Home.module.css'
function Footer() {
    const date = new Date();
    const currentYear = date.getYear()+1900
    return (
        <footer className={`${styles.footer} page-footer`}>
            <div className={styles.footer1}>
                <a target= "_blank" rel="noreferrer" href="https://listnepal.com/contact-us/" style={{textDecoration:"none" , color:"black"}}>Contact </a>
                <a target= "_blank" rel="noreferrer"  href="https://listnepal.com/privacy-policy/" style={{textDecoration:"none" , color:"black"}}>Privacy</a>
            </div>
            <div className={`${styles.footer2}`}>
                ListNepal © {currentYear}. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer
