import styles from "../styles/Home.module.css";
import Link from "next/link";
import Head from "next/head";
import { useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button
} from "react-bootstrap";
import {BsSearch} from 'react-icons/bs'
import { useRouter } from "next/router";
import Search from './Search'

function Header({ meta ,showSearch , sticky}) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{meta?.name || "Pathshala"}</title>
        <meta
          name="description"
          content={
            meta?.description ||
            "Pathshala- This is a site that provides all the required study resources to students."
          }
        />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7009704046916548"
          crossOrigin="anonymous"
        ></script>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-110777705-1"
        ></script>
      </Head>

      <Navbar  className={sticky==="true" ? styles.sticky_header : styles.header} bg="dark" expand="lg">
        <Container>
          <div className={`${styles.brand}`} onClick={() => router.push("/")}>
            Pathshala
          </div>
          {showSearch==="false"?"":
          <div>
          <Navbar.Toggle aria-controls="navbarScroll" style={{borderColor:"white"}}/>
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className={`me-auto my-2 my-lg-0 ${styles.nav_items}`}
              navbarScroll
            >
            <Search/>
              
            </Nav>
          </Navbar.Collapse>
          </div>}
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
