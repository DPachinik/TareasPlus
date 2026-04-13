import Link from 'next/link'
import styles from './header.module.css'
import {useSession, signIn, signOut } from 'next-auth/react'

export function Header(){

    const {data: sesion, status} = useSession();
    return(
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href='/'>
                        <h1 className={styles.logo}>
                            Tareas<span>+</span>
                        </h1>
                        
                    </Link>

                    { sesion?.user && (
                        <Link href='/dashboard' className={styles.link}>
                            Mi panel
                        </Link>
                    )}

                </nav>

                {status === 'loading'?(
                <></>
                ) : sesion?(
                    <button className={styles.loginButton} onClick={()=>signOut()}> 
                    Hola,{sesion?.user?.name}</button>)
                :(
                    <button className={styles.loginButton} onClick={()=>signIn('google')}> 
                    Acceder</button>
                )}
            </section>
        </header>
    );
}