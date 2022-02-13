import styles from "../styles/DisplayList.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DisplayCard({image,title,desc}) {
  return (
     <div className={`card ${styles.college_card}`}>
          <img className={`col-md-2  ${styles.card_img}`} src={image} alt="img"/>

          <div className={`col-md-10 ${styles.card_body}`}>
            <h5 className={`card-title ${styles.card_title}`}>{title}</h5>
            <p className={`card-text ${styles.card_desc}`}>
               {desc}
            </p>
          </div>
    </div>
  );
}
