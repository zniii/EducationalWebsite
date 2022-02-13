import {Card , Row, Col} from 'react-bootstrap'
import styles from "../styles/Home.module.css"

function NameCard({title}) {
  return (
    <div className={styles.name_card}>
      {title}
    </div>
  );
}

export default NameCard;
