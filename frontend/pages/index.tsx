import type { NextPage } from "next";
import { callCloudFunction } from "../functions/callCloudFunction";
import styles from "./Home.module.scss";

const Home: NextPage = () => {
  async function handleTest() {
    callCloudFunction({ name: "testFunction" });
  }

  return (
    <main className={styles.container}>
      <button
        style={{
          padding: "1rem",
          backgroundColor: "green",
          width: "fit-content",
          height: "fit-content",
          color: "white",
          cursor: "pointer",
        }}
        onClick={handleTest}
      >
        Test
      </button>
    </main>
  );
};

export default Home;
