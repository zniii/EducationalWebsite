import styles from "../../styles/DisplayList.module.css";
import Header from "../../components/Header";
import axios from "axios";
import Footer from "../../components/Footer";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DisplayCard from "components/DisplayCard";
import NameCard from "components/NameCard";
import Pathprint from "components/Pathprint";
import ParentContainer from "components/ParentContainer";

export async function getServerSideProps(context) {
  const { affiliation } = context.query;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DB_HOST}/affiliation/${affiliation}/institute`
  );
  const data = await response.data;
  return {
    props: {
      colleges: data.data,
    },
  };
}

function CollegeList({ colleges }) {
  const router = useRouter();
  const meta = {
    name: "Pathshala-" + colleges?.items.affiliation.name,
    description: colleges?.items.affiliation.description,
  };
  return (
    <div>
      <Header meta={meta} />
      <div className={styles.parent_container}>
        <ParentContainer
          image={colleges.items.affiliation.image || "/default.jpg"}
          title={colleges.items.affiliation.name}
          desc={colleges.items.affiliation.description}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.foot_print}>
          <Pathprint name={"Home"} route={"/"} /> {">"}{" "}
          <Pathprint
            name={colleges.items.affiliation?.name}
            route={`${router.asPath}`}
          />
        </div>
        <h4 className={styles.header_title}>Schools/Colleges</h4>
        {colleges.items.institute.length !== 0 ? (
          <>
            <div className={styles.display_colleges}>
              {colleges.items.institute.map((item) => (
                <a
                  key={item.id}
                  onClick={() => router.push(`${router.asPath}/${item.slug}`)}
                >
                  <DisplayCard
                    image={item.image}
                    title={item.name}
                    desc={item.description}
                  />
                </a>
              ))}
            </div>
          </>
        ) : (
          "No items to show !"
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CollegeList;
