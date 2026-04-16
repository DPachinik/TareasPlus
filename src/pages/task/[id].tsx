import Head from 'next/head'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '@/services/firebaseConnection'
import { TextArea } from '@/components/textarea'
import { useSession } from 'next-auth/react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { FaTrash } from 'react-icons/fa'

interface TaskProps{
    item:{
    user:string;
    tarea:string;
    created:string;
    public:boolean;
    taskId:string;
    }
    allComments:CommentsProps[]

}

interface CommentsProps{
    comment:string;
    user:string;
    name:string;
    taskId:string;
    id:string;
}

export default  function Task ({item, allComments}:TaskProps){

    const {data:session} = useSession();

    const [input, setInput] = useState('');
    const [comments, setComments] = useState<CommentsProps[]>(allComments || []);

    

    async function handleSubmit(e:FormEvent){
        e.preventDefault()

        if(input === '') return;

        if(!session?.user?.email || !session.user?.name) return;


        try{
           const docRef= await addDoc(collection(db, 'comments'),{
            comment:input,
            user:session?.user?.email,
            name:session?.user?.name,
            created: new Date(),
            taskId:item?.taskId
           });

           const data = {
            comment:input,
            user:session?.user?.email,
            name:session?.user?.name,
            taskId:item?.taskId,
            id:docRef.id,
           }

           setComments((prev)=> [...prev, data]);
           setInput('')
        }catch(err){
            console.log(err)
        }
    }

    async function handleDeleteComments(id:string){
        const commentRef = doc(db,'comments', id)
        try{
            await deleteDoc(commentRef);

            const commentsList = comments.filter((item)=> item.id !== id)
            setComments(commentsList)
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div className={styles.container}>
            <Head>
                <title>Detalle de la tarea</title>
            </Head>

            <main className={styles.main}>
                <h1>Tareas</h1>
                <article className={styles.task}>
                    <p>{item.tarea}</p>
                </article>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Agregar comentario</h2>

                <form onSubmit={handleSubmit} >
                    <TextArea
                    placeholder='comentario...'
                    value={input}
                    onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setInput(e.target.value)}
                    />
                    <button 
                    type='submit'
                    className={styles.button}
                    disabled={!session?.user}
                    >Enviar comentario
                    </button>
                </form>
            </section>
            <section className={styles.commentsContainer}>
                <h2>Comentarios de la tarea</h2>
   
                {comments.length === 0 && (
                    <span>tarea sin comentarios...</span>
                )}

                {comments.map((item)=>(
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{item.name}</label>
                            {item.user === session?.user?.email && (
                                <button className={styles.buttonTrash} onClick={()=>handleDeleteComments(item.id)}>
                                    <FaTrash size={18} color='#EA3140' />
                                </button>
                            )}
                        </div>
                        <p>{item.comment}</p>
                    </article>
                ))}
                

            </section>

        </div>
    )
}


export const getServerSideProps:GetServerSideProps=async({params})=>{

    const id = params?.id as string;

        const commentsRef = collection(db,'comments')
        const q = query(commentsRef, where('taskId','==', id))

        const snapshotComments = await getDocs(q)
        let allComments: CommentsProps[] = [];
        snapshotComments.forEach((item)=>{
            allComments.push({
                comment:item.data()?.comment,
                user:item.data()?.user,
                name:item.data()?.name,
                taskId:item.data()?.taskId,
                id:item.id
            });
        });


    const docRef = doc(db,'tareas', id)
    const snaphot =await getDoc(docRef)

    if(snaphot.data() === undefined ){
        return{
            redirect:{
                destination: '/',
                permanent: false,
            }
        }

    }

    if(!snaphot.data()?.public){
        return{
            redirect:{
                destination:'/',
                permanent:false
            }
        }
    }


    const miliseconds = snaphot.data()?.created?.second *1000;

    const task={
        user: snaphot.data()?.user,
        tarea: snaphot.data()?.tarea,
        public: snaphot.data()?.public,
        created: new Date(miliseconds).toLocaleString(),
        taskId: id,
    }

    return{
        props:{
            item:task,
            allComments: allComments,
        }
    }
}