'use client'
import React from 'react'
import {useRouter } from 'next/navigation'

function Home() {
  const router = useRouter()
  
  return (
    <div id="anime" className="container-block bgsize">
    <div className="content" id="anime-content">
      <video id="drawcards_mp4" autoPlay muted onEnded={()=>{router.push("/card_received")}}>
        <source src='./img/reveal.mp4' type='video/mp4' />
      </video>
    </div>
  </div>
  )
}

export default Home