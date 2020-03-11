import React, { useEffect, useRef } from 'react';
import '../styles/fonts.style.css';
import '../styles/home.style.css';

// Components
import ScrollingText from '../components/scrollingText.component';
import Showcase from '../components/showcase.component';

function Home() {

    return (
        <div id="home">
            <Showcase />
            <ScrollingText />
        </div>
    )
  
}

export default Home;