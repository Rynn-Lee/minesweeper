import Head from "next/head";
import styles from '@styles/applayout.module.sass'
import BottomBar from "@/components/BottomBar";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from 'react'
import { services } from "@/services";

export default function AppLayout({children, setParticles, particles, isDarkTheme, setIsDarkTheme}: any){
  const [openSettings, setOpenSettings] = useState(false)
  const [background, setBackground] = useState(true)
  
  useEffect(()=>{
    const isDark = services.localstorage.getItem('darkTheme')
    if(!isDark){
      setIsDarkTheme(true)
      services.localstorage.setItem('darkTheme', true)
      document.documentElement.setAttribute("dark-theme", 'true');
      return
    }
    services.localstorage.setItem('darkTheme',isDarkTheme)
    document.documentElement.setAttribute("dark-theme", `${isDarkTheme}`);
  }, [isDarkTheme])

  const setters = {setBackground, setOpenSettings, setParticles, setIsDarkTheme}
  const getters = {particles, background, openSettings, isDarkTheme}
  return(
    <>
      <Head>
        <title>Minesweeper Online</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {background ? <div className={styles.background}/> : <></>}
      <div className={styles.content}>
        <Sidebar
          setters={setters}
          getters={getters}/>
        {children}
        <BottomBar
          setters={setters}
          getters={getters}/>
      </div>
    </>
  )
}