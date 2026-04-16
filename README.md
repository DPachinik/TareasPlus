# 🚀 Tareas Plus

Aplicación web para la gestión de tareas construida con **Next.js**, que permite a los usuarios crear, compartir y comentar tareas en tiempo real.

---

## 🌐 Demo
👉 https://tareas-plus.vercel.app

---

## 📌 Características

- 🔐 Autenticación con Google (NextAuth)
- 📝 Crear, listar y eliminar tareas
- 🌍 Tareas públicas y privadas
- 🔗 Compartir tareas mediante enlace
- 💬 Sistema de comentarios por tarea
- ⚡ Actualización en tiempo real con Firebase
- 📊 Conteo de tareas y comentarios en la home (SSG + ISR)
- 🛡️ Rutas protegidas con sesión

---

## 🛠️ Tecnologías utilizadas

- **Next.js** (Pages Router)
- **TypeScript**
- **NextAuth.js** (autenticación)
- **Firebase Firestore** (base de datos)
- **Vercel** (deploy)
- **React Icons**

---

## 🔐 Autenticación

Se implementa usando **NextAuth + Google Provider**.

- Inicio de sesión con cuenta de Google
- Manejo de sesión global con `SessionProvider`
- Protección de rutas mediante `getServerSideProps`

---

## 🧠 Renderizado

El proyecto utiliza diferentes estrategias de renderizado:

### 🟢 SSG + ISR (Home)
- Se obtienen métricas de tareas y comentarios
- Revalidación cada 60 segundos

### 🔵 SSR (Dashboard y Task)
- Protección de rutas con sesión
- Carga dinámica de datos por usuario o tarea

---

## 📸 Funcionalidades principales

### 🧾 Dashboard
- Crear tareas  
- Marcar como públicas  
- Eliminar tareas  
- Compartir enlaces  

### 📄 Detalle de tarea
- Ver contenido  
- Agregar comentarios  
- Eliminar comentarios propios  

---

## 📌 Notas técnicas

- Uso de `onSnapshot` para tiempo real en tareas  
- Uso de `getDocs` para renderizado SSR/SSG  
- Manejo de sesión con `useSession`  
- Uso de rutas dinámicas (`task/[id]`)  

---

## 🧑‍💻 Autor

Desarrollado por **David Pachinik**

