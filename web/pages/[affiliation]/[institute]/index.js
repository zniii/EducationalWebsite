import NameCard from "components/NameCard";
import Header from "components/Header";
import Footer from "components/Footer";
import styles from "styles/CourseList.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import Pathprint from "components/Pathprint";
import ParentContainer from "components/ParentContainer";

export async function getServerSideProps(context) {
  const { institute } = context.query;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DB_HOST}/institute/${institute}`
  );
  const data = await response.data;
  return {
    props: {
      collegeInfo: data.data,
    },
  };
}

function CourseList({ collegeInfo }) {
  const router = useRouter();
  const meta = {
    name: "Pathshala-" + collegeInfo?.name,
    description: collegeInfo?.description,
  };
  return (
    <div>
      <Header meta={meta} />
      <div className={styles.parent_container}>
        <ParentContainer
          image={collegeInfo.image || "/default.jpg"}
          title={collegeInfo.name}
          desc={collegeInfo.description}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.foot_print}>
          <Pathprint name={"Home"} route={"/"} /> {">"}{" "}
          <Pathprint
            name={collegeInfo.affiliation.name}
            route={`/${collegeInfo.affiliation.slug}`}
          />{" "}
          {">"} <Pathprint name={collegeInfo.name} route={`${router.asPath}`} />
        </div>

        <h4 className={styles.header_title}>Courses/Faculty</h4>
        <div className={`row ${styles.courses_display}`}>
          {collegeInfo.faculty.map((item) => (
            <a
              key={item.id}
              className={styles.course_card}
              onClick={() => router.push(`${router.asPath}/${item.slug}`)}
            >
              <NameCard className="col-md-4" title={item.abbreviation} />
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CourseList;
