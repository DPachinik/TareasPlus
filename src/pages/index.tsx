import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import heroImg from '../../public/assets/header.png'
import { GetStaticProps } from "next";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";

interface HomeProps{
  posts:number;
  comments:number;
}

export default function Home({posts, comments}:HomeProps) {
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
          Organiza tus estudios y <br/>
          Simplifica tus tareas
        </h1>

        <div className={styles.infoContent}>

          <section className={styles.box}>
            <span>+{posts} post</span>
          </section>

          <section className={styles.box}>
            <span>+{comments} comentarios</span>
          </section>

        </div>

      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ()=>{

  const taskRef = collection(db, 'tareas');
  const tasks = await getDocs(taskRef);
  
  const commentsRef = collection(db, 'comments')
  const comments = await getDocs(commentsRef);

  return{
    props:{
      posts:tasks.size || 0,
      comments:comments.size ||0,
    },
    revalidate: 60,
  }
}