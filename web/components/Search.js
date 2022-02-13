import styles from "../styles/Home.module.css";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";

function Search({ searchHeight, searchWidth }) {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DB_HOST}/search?search=${searchText}`
      );
      const data = response.data.data;
      setSearchResults(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchText.length > 0) {
      fetchData();
    } else setSearchResults([]);
  }, [searchText]);

  return (
    <div>
      <Form className="d-flex">
        <FormControl
          type="search"
          placeholder="Search for Universities,Faculties or Subjects..."
          className={`me-2 ${styles.search_field}`}
          style={{ height: searchHeight || "40px" }}
          aria-label="Search"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          value={searchText}
        />
        <Button
          className={styles.search_button}
          style={{
            height: searchHeight || "40px",
            width: searchWidth || "40px",
          }}
        >
          <BsSearch />
        </Button>
      </Form>
      <div>
        {searchResults?.affiliation?.length > 0 ||
        searchResults?.institute?.length > 0 ||
        searchResults?.faculty?.length > 0 ||
        searchResults?.subject?.length > 0 ? (
          <div className={styles.search_results}>
            {searchResults.affiliation?.length > 0 ? (
              <>
                <h6 className={styles.obj_title}>Affiliation</h6>
                {searchResults.affiliation?.map((item) => (
                  <a
                    href={`/${item.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <li className={styles.search_list} key={item._id}>
                      {item.name}
                    </li>
                  </a>
                ))}
              </>
            ) : null}
            {searchResults.institute?.length > 0 ? (
              <>
                <h6 className={styles.obj_title}>Institute</h6>
                {searchResults.institute?.map((item) => (
                  <a
                  href={`/${item.affiliation.slug}/${item.slug}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <li className={styles.search_list} key={item._id}>
                    {item.name}
                  </li>
                  </a>
                ))}
              </>
            ) : null}
            {searchResults.faculty?.length > 0 ? (
              <>
                <h6 className={styles.obj_title}>Faculty</h6>
                {searchResults.faculty?.map((item) => (
                  <a
                    href={`/faculty/${item.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <li className={styles.search_list} key={item._id}>
                      {item.name}
                    </li>
                  </a>
                ))}
              </>
            ) : null}
            {searchResults.subject?.length > 0 ? (
              <>
                <h6 className={styles.obj_title}>Subject</h6>
                {searchResults.subject?.map((item) => (
                  <a
                    href={`/subject/${item.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <li className={styles.search_list} key={item._id}>
                      {item.name}
                    </li>
                  </a>
                ))}
              </>
            ) : null}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Search;
