import styles from "styles/Home.module.css";
import Header from "components/Header";
import axios from "axios";
import Footer from "components/Footer";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DisplayCard from "components/DisplayCard";
import NameCard from "components/NameCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Search from "components/Search";

export async function getServerSideProps() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DB_HOST}/affiliation?page=1&limit=10`
  );
  const data = await response.data;

  const response2 = await axios.get(
    `${process.env.NEXT_PUBLIC_DB_HOST}/institute`
  );
  const data2 = await response2.data;
  return {
    props: {
      universities: data.data,
      institutes:data2.data
    }
  };
}

export default function Home({ universities , institutes}) {
  console.log(institutes)
  const router = useRouter();
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1290 },
      items: 4
    },
    mini_desktop: {
      breakpoint: { max: 1290, min: 1090 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1090, min: 830 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 830, min: 0 },
      items: 2
    }
  };

  const [scrolled , setScrolled] = useState(false)

  useEffect(() => {
    if(typeof window !== "undefined"){
    window.addEventListener('scroll',()=> {
      window.scrollY > 80 ? setScrolled(true) : setScrolled(false)
    })}
  }, []);
  

  return (
    <div className={`${styles.container}`}>
    {scrolled ? <Header showSearch={"true"} sticky={"true"}/> : <Header showSearch={"false"} />}
      <div className={styles.banner}>
        <div className={styles.home_search}>
          <Search searchHeight={"50px"} searchWidth={"50px"}/>
        </div>
        <div className={styles.suggest_slider}>
          <h5 style={{ color: "white" }}>Recently Added</h5>
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={5000}
            infinite={true}
            arrows={false}
          >
            {institutes.items.map(item=>(
              <a key={item.id} onClick={()=>router.push(`/${item.affiliation?.slug}/${item.slug}`)}>
              <NameCard title={item.name} />
              </a>
            ))}
          </Carousel>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.body_container}>
          <div className={styles.boards_section}>
            <h3 className={styles.header_title}>Boards/Affiliations</h3>
            <div className={styles.body_columns}>
              <div className={styles.boards_display}>
                {universities.items.map((item) => (
                  <a
                    key={item.id}
                    onClick={() => {
                      router.push(`/${item.slug}`);
                    }}
                  >
                    <DisplayCard
                      title={item.name}
                      image={item.image}
                      desc={item.description}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
