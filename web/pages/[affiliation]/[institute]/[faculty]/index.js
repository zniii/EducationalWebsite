import Header from "components/Header";
import Footer from "components/Footer";
import styles from "styles/SemesterList.module.css";
import { useRouter } from "next/router";
import { Accordion, Table, Button } from "react-bootstrap";
import axios from "axios";
import Pathprint from "components/Pathprint";
import ParentContainer from "components/ParentContainer";

export async function getServerSideProps(context) {
  const { faculty } = context.query;
  const { institute } = context.query;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DB_HOST}/faculty/${faculty}/subject?institute=${institute}`
  );
  const data = await response.data;
  return {
    props: {
      facultyInfo: data.data,
    },
  };
}

function SemestersList({ facultyInfo }) {
  const router = useRouter();
  const meta = {
    name: "Pathshala-" + facultyInfo?.faculty?.abbreviation,
    description: facultyInfo?.faculty?.description,
  };

  return (
    <div>
      <Header meta={meta} />
      <div className={styles.parent_container}>
        <ParentContainer
          title={
            facultyInfo.faculty?.name.charAt(0).toUpperCase() +
            facultyInfo.faculty?.name.slice(1) +
            " " +
            "(" +
            facultyInfo.faculty?.abbreviation +
            ")"
          }
          desc={facultyInfo.faculty.description}
        />
      </div>
      <div className={styles.semesters_body}>
        {facultyInfo && facultyInfo.affiliation && facultyInfo.institute ? (
          <div className={styles.foot_print}>
            <Pathprint name={"Home"} route={"/"} /> {">"}{" "}
            <Pathprint
              name={facultyInfo.affiliation?.name}
              route={`/${facultyInfo?.affiliation?.slug}`}
            />{" "}
            {">"}
            <Pathprint
              name={facultyInfo?.faculty.institute.name}
              route={`/${facultyInfo?.affiliation?.slug}/${facultyInfo?.faculty.institute.slug}`}
            />{" "}
            {">"}{" "}
            <Pathprint
              name={facultyInfo?.faculty?.abbreviation}
              route={`${router.asPath}`}
            />
          </div>
        ) : (
          ""
        )}

        <h4 className={styles.header_title}>Curriculum</h4>

        <div className={styles.accordian}>
          <Accordion flush>
            {facultyInfo &&
            facultyInfo.level &&
            facultyInfo.level.length !== 0 ? (
              <>
                {facultyInfo.level.map((item, i) => (
                  <Accordion.Item key={i} eventKey={i}>
                    <Accordion.Header>
                      {" "}
                      <div className={styles.semester_title}>
                        {" "}
                        {item.level.title}{" "}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Table striped hover bordered className={styles.table}>
                        <tbody>
                          {item.level.subjects.length !== 0 ? (
                            <>
                              {item.level.subjects.map((obj) => (
                                <tr key={obj._id}>
                                  <td className={styles.table_data}>
                                    <div>{obj.name} </div>
                                    <div>
                                      <button
                                        className={styles.option_btn}
                                        onClick={() =>
                                          router.push(
                                            `${router.asPath}/notes/${obj.slug}`
                                          )
                                        }
                                      >
                                        Notes
                                      </button>{" "}
                                      <button
                                        className={styles.option_btn}
                                        onClick={() =>
                                          router.push(
                                            `${router.asPath}/old-questions/${obj.slug}`
                                          )
                                        }
                                      >
                                        Old Questions
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            "No items to show !"
                          )}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </>
            ) : (
              <>No items to show</>
            )}
          </Accordion>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SemestersList;
