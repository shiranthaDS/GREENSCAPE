import React from 'react';
import './home.css';
import Header from '../header/header';
import logo from '../header/images/home.png'

function Home() {
    return (
        <div>
            <Header/>
            <section className="urban-home-hero">
                <div className="urban-home-description">
                <img src={logo}  img style={{ width: "1150px", height: "400px" }} alt="City Infrastructure" />
                    <h1>Welcome to GreenScape</h1>
                    <p>Your gateway to managing the urban landscape. .</p>
                    <p>Hello</p>
                </div>
            </section>

            

            <footer className="greenscape-home-footer">
                <p>&copy; 2025 GreenScape. All rights reserved.</p>
                
                
            </footer>
        </div>
    );
};

export default Home;
