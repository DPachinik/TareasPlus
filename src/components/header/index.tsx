import Link from 'next/link'
import styles from './header.module.css'

export function Header(){
    return(
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href='/'>
                        <h1 className={styles.logo}>
                            Tareas<span>+</span>
                        </h1>
                        
                    </Link>

                    <Link href='/dashboard' className={styles.link}>
                        Mi panel
                    </Link>

                </nav>

                <button className={styles.loginButton}>Acceder</button>
            </section>
        </header>
    );
}