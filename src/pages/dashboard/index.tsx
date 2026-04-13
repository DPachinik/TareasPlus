import { GetServerSideProps } from 'next'
import Head from "next/head";
import styles from './dashboard.module.css'

import { getSession } from 'next-auth/react'
import { TextArea } from '@/components/textarea';
import { FiShare2, FiTrash } from 'react-icons/fi';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import Link from 'next/link';



interface DashboardProps {
    user:{
        email:string;
    }
}

interface TaskProps{
    id:string;
    user:string;
    created:Date;
    tarea:string;
    public:boolean;
}

export default function Dashboard({user}:DashboardProps) {

    const [input, setInput] = useState('');
    const [publicTask, setPublicTask]= useState(false);
    const [tasks, setTasks] = useState<TaskProps[]>([])

    useEffect(()=>{
        async function handleLoadTask (){
            const taskRef = collection(db, 'tareas')
            const q = query( taskRef,
                orderBy('created', 'desc'),
                where('user', '==', user?.email)
            )
            const unsub = onSnapshot(q, (snaphot)=>{
                let lista = [] as TaskProps[];

                snaphot.forEach((doc)=>{
                    lista.push({
                        id:doc.id,
                        user:doc.data().user,
                        created:doc.data().created,
                        tarea:doc.data().tarea,
                        public:doc.data().public,
                    })
                })

                setTasks(lista);
            })
            
            return () => unsub();
        }
        
        handleLoadTask();

    },[user?.email])

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>){
        setPublicTask(event.target.checked)
    }

    async function handleRegister(e:FormEvent){
        e.preventDefault();

        if( input === '') return;
        try{
            
            await addDoc(collection(db,'tareas'),{
                tarea:input,
                public:publicTask,
                user:user?.email,
                created: new Date(),
            })

            setInput('');
            setPublicTask(false);
        }catch(error){
            console.log('Error al crear la tarea:' + error);
        }

    }

    async function handleShare(id: string){
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`)
    }

    async function handleDeleteTask(id:string) {
        const docRef = doc(db, 'tareas', id)
        await deleteDoc(docRef)
    }

    return(
        <div className={styles.container}>
            <Head>
                <title>Mi panel de tareas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>

                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Cuál es tu tarea?</h1>

                        <form onSubmit={handleRegister}>
                            <TextArea
                            placeholder='Describa una tarea...'
                            value={input}
                            onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setInput(e.target.value)}
                            />
                            
                            <div className={styles.checkboxArea}>
                                <input 
                                type='checkbox'
                                className={styles.checkbox}
                                checked={publicTask}
                                onChange ={handleChangePublic}
                                />
                                <label >Marcar tarea como pública</label>
                            </div>

                            <button className={styles.button} type='submit'>Registrar</button>
                        </form>

                    </div>

                </section>

                <section className={styles.taskContainer}>
                    <h1>Mis Tareas</h1>

                    {tasks.map((item)=>(
                        <article key={item.id} className={styles.task}>

                            {item.public && (
                                <div className={styles.tagContainer}>
                                    <label className={styles.tag}> PÚBLICO</label>
                                    <button className={styles.shareButton} onClick={()=>handleShare(item.id)}>
                                        <FiShare2
                                        size={22}
                                        color='#3183ff'
                                        />
                                    </button>
                                </div>
                            )}

                            <div className={styles.taskContent}>

                                   {item?.public?
                                   (
                                    <Link href={`/task/${item.id}`}>
                                         <p>{item.tarea}</p>
                                    </Link>
                                   ):( <p>{item.tarea}</p>)}

                                    <button className={styles.trashButton} onClick={()=>handleDeleteTask(item.id)}>
                                        <FiTrash
                                        size={24}
                                        color='#ea3140'
                                        />
                                    </button>
                            </div>
                        </article>
                    )) }
                </section>

            </main>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) =>{

    const session =await getSession({req})

    if(!session?.user){
        return{
            redirect:{
                destination:"/",
                permanent:false,
            }
        }
    }

    return{
        props:{
            user:{
                email:session?.user?.email
            }
        },
    };

};