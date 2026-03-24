import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import heroImg from '../../public/assets/header.png'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tareas+ | organiza tus tareas de forma fácil</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
          className={styles.hero}
          src={heroImg}
          alt="Logo TareasPlus"
          priority
          />
        </div>

        <h1 className={styles.title}>
          Sistema moderno para organizar <br/>
          tus estudios y tareas
        </h1>

        <div className={styles.infoContent}>

          <section className={styles.box}>
            <span>+150post</span>
          </section>

          <section className={styles.box}>
            <span>+80 comentarios</span>
          </section>

        </div>

      </main>
    </div>
  );
}
