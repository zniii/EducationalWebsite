import Header from "components/Header";
import Footer from "components/Footer";
import styles from "styles/SubjectOptions.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { Accordion } from "react-bootstrap";
import Pathprint from "components/Pathprint";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import { BsDownload } from "react-icons/bs";
import ParentContainer from "components/ParentContainer";

export async function getServerSideProps(context) {
  const { subject } = context.query;
  const { institute } = context.query;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DB_HOST}/subject/${subject}/note?institute=${institute}`
  );

  const data = await response.data;
  return {
    props: {
      notes: data.data,
    },
  };
}

function Notes({ notes }) {
  const router = useRouter();
  const meta = {
    name: "Pathshala-" + notes?.items.subject.name + " notes",
    description: notes?.items.subject.description,
  };

  const [show, setShow] = useState(false);
  const [filepath, setFilepath] = useState("");
  const [filename, setFilename] = useState("");

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, [filepath, show]);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Header meta={meta} />
      <ParentContainer title={`${notes?.items.subject.name}`} />
      <div className={styles.body}>
        <div className={styles.foot_print}>
          <Pathprint name={"Home"} route={"/"} /> {">"}{" "}
          <Pathprint
            name={notes?.items.subject.affiliation?.name}
            route={`/${notes.items.subject.affiliation?.slug}`}
          />{" "}
          {">"}{" "}
          <Pathprint
            name={notes?.items.subject.institute.name}
            route={`/${notes.items.subject.affiliation?.slug}/${notes?.items.subject.institute.slug}`}
          />{" "}
          {">"}{" "}
          <Pathprint
            name={notes?.items.subject.faculty?.abbreviation}
            route={`/${notes.items.subject.affiliation?.slug}/${notes?.items.subject.institute.slug}/${notes?.items.subject.faculty?.slug}`}
          />{" "}
          {">"}
          <Pathprint
            name={notes?.items.subject.name}
            route={`${router.asPath}`}
          />
        </div>
        <h4 className={styles.header_title}>Notes</h4>
        <div className={styles.list}>
          <div className={styles.list}>
            <Accordion alwaysOpen>
              {notes.items.note.length !== 0 ? (
                <>
                  {notes.items.note.map((item, i) => (
                    <Accordion.Item key={item.id} eventKey={i}>
                      <Accordion.Header>
                        {" "}
                        {item.name} ({item.year})
                      </Accordion.Header>
                      <Accordion.Body>
                        {item.resource.length !== 0 ? (
                          <>
                            {item.resource.map((obj) => (
                              <li key={obj.id} className={styles.list_item}>
                                <a
                                  onClick={() => {
                                    setShow(true);
                                    setFilepath(obj.path);
                                    setFilename(
                                      obj.name +
                                        "." +
                                        obj.resourceType.toLowerCase()
                                    );
                                  }}
                                >
                                  {obj.name}.{obj.resourceType.toLowerCase()}
                                </a>
                              </li>
                            ))}
                          </>
                        ) : (
                          <>No files to show</>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </>
              ) : (
                <>No items to show !</>
              )}
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          setFilepath("");
          setFilename("");
        }}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className={styles.modal_header}>
            <p>{filename}</p>
            <a
              href={`${process.env.NEXT_PUBLIC_DB_HOST}/${filepath}`}
              style={{ color: "inherit" }}
            >
              <BsDownload className={styles.download} />{" "}
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Document
            file={{ url: `${process.env.NEXT_PUBLIC_DB_HOST}/${filepath}` }}
            onLoadSuccess={onDocumentLoadSuccess}
            className={styles.modal_page}
          >
            {" "}
            {Array.apply(null, Array(numPages))
              .map((x, i) => i + 1)
              .map((page) => (
                <Page pageNumber={page} className={styles.pdf_page} />
              ))}
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Notes;
