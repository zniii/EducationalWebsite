import Header from "components/Header";
import Footer from "components/Footer";
import styles from "styles/GetAllPage.module.css";
import ParentContainer from "components/ParentContainer";
import axios from "axios";
import DisplayCard from "components/DisplayCard";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { subject } = context.query;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_DB_HOST}/subject/${subject}/affiliation`
  );

  const data = await response.data;
  return {
    props: {
      affiliationInfo: data.data,
    },
  };
}

export default function Subject({ affiliationInfo }) {
  const router = useRouter();
  return (
    <div>
      <Header />
      <ParentContainer
        title={
          affiliationInfo[0].subject?.name.charAt(0).toUpperCase() +
          affiliationInfo[0].subject?.name.slice(1)
        }
      />
      <div className={styles.body}>
        <h4 className={styles.header_title}>Boards/Affiliations with {affiliationInfo[0].subject?.name.charAt(0).toUpperCase() + affiliationInfo[0].subject?.name.slice(1)}</h4>
        <div className={styles.boards_display}>
          {affiliationInfo[0].affiliation?.map((item) => (
            <a
              key={item._id}
              onClick={() => {
                router.push(`${router.asPath}/${item.slug}`);
              }}
            >
              <DisplayCard
                key={item._id}
                title={item.name}
                image={item.image}
                desc={item.description}
              />
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
