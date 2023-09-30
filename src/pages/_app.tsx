import AppLayout from '@/layouts/AppLayout'
import { lightAssets, darkAssets } from '@/assets/assets'
import type { AppProps } from 'next/app'
import { MemoizedParticles } from '@/configs/ParticlesBG'
import { useRecorder } from '@/hooks/useRecorder'
import { useToggles } from '@/hooks/useToggles'
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { interfaces, dummyData } from '@interfaces/interfaces'
import '@/styles/index.sass'
import { useObserver } from '@/hooks/useObserver'
import { useGame } from '@/hooks/useGame'
import { CountExperience } from '@/utils/CountExperience'

export default function App({ Component, pageProps }: AppProps) {
  const [isSetup, setIsSetup] = useState(true)
  const [settings, setSettings] = useState<interfaces.settings>({})
  const [windows, setWindows] = useState<interfaces.windows>({})
  const [userData, setUserData] = useState<interfaces.userData>(dummyData.userData)
  const router = useRouter()
  const toggle: any = useToggles()

  const [toggles] = useState({
    toggleParticles: ()=>setSettings((prevSettings) => ({...prevSettings, particles: toggle.toggle(prevSettings.particles, 'particles')})),
    toggleTheme: ()=>setSettings((prevSettings) => ({...prevSettings, darkTheme: toggle.toggle(prevSettings.darkTheme, 'darkTheme', 'dark-theme')})),
    toggleBackground: ()=>setSettings((prevSettings) => ({...prevSettings, background: toggle.toggle(prevSettings.background, 'background')})),
    toggleTransparency: ()=>setSettings((prevSettings) => ({...prevSettings, transparency: toggle.toggle(prevSettings.transparency, 'transparency', 'transparency')})),
    toggleAnimations: ()=>setSettings((prevSettings) => ({...prevSettings, animations: toggle.toggle(prevSettings.animations, 'animations', 'animations')})),
    toggleSlidingField: ()=>setSettings((prevSettings) => ({...prevSettings, slidingField: toggle.toggle(prevSettings.slidingField, 'slidingField', 'slidingField')})),
    toggleFieldBouncing: (newValue: number)=>setSettings((prevSettings) => ({...prevSettings, fieldBouncing: toggle.update('fieldBouncing', newValue)})),
    addExperience: (value: number)=>setUserData((prevSettings: any) => ({...prevSettings, experience: prevSettings.experience + value, ...CountExperience(prevSettings.experience + value)}))
  })

  const game = useGame(toggles.addExperience)
  const getters = {windows, settings, userData, isSetup, game}
  const setters = {setWindows, toggles, setSettings, setIsSetup: ()=>setIsSetup(false), setUserData, game}
  const recorder = useRecorder(userData, "userData", true)
  const observer = useObserver(settings.darkTheme, ()=>setSettings((prevSettings) => ({...prevSettings, assets: settings.darkTheme ? lightAssets : darkAssets})))

  const variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0
    }
  }

  return(
    <div
    onContextMenu={(e: any)=>e.preventDefault()}>
      <AppLayout
        toggles={toggles}
        setters={setters}
        getters={getters}>
        {settings.particles ? <MemoizedParticles darkTheme={settings.darkTheme}/> : <></>}
        <AnimatePresence mode='wait' initial={false}>
            <motion.div
              transition={{duration: getters.settings.animations ? 0.1 : 0}}
              key={router.route}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}>
              <Component {...pageProps} getters={getters} setters={setters}/>
            </motion.div>
        </AnimatePresence>
      </AppLayout>
    </div>
  )
}
