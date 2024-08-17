'use client'
import React from 'react'

function Home() {
  return (
    <div id="anime" className="container-block bgsize">
    <div className="content" id="anime-content">
      <video id="drawcards_mp4" autoPlay muted onEnded={()=>{}}>
        <source src='./img/reveal.mp4' type='video/mp4' />
      </video>
    </div>
  </div>
  )
}

export default Home