import styles from "styles/ParentContainer.module.css";

function ParentContainer({ image, title, desc }) {
  return (
    <div className={styles.container}>
      {image && desc ? (
        <>
          <div className={styles.row}>
            <img
              className={styles.image}
              src={image || "/default.jpg"}
              alt="#"
            />
            <h1 className={styles.title}> {title} </h1>
          </div>
          <p className={styles.description}>{desc}</p>
        </>
      ) : (
        <>
          <h1 className={styles.title2}> {title} </h1>
        </>
      )}
    </div>
  );
}

export default ParentContainer;
