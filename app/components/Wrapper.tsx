import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import RequestForm from './RequestForm';
import Head from 'next/head';

const SiteGPT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [siteContent, setSiteContent] = useState<{url: string; content: string}>({url: '', content: ''});

  // Create animated stars background
  useEffect(() => {
    const createStars = () => {
      const container = document.querySelector('.stars-container');
      if (!container) return;

      container.innerHTML = '';
      const starsCount = 150;
      const colors = ['#ffffff', '#ffe9c5', '#d4fbff', '#a6d8ff'];

      for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.opacity = `${Math.random()}`;
        star.style.animationDuration = `${5 + Math.random() * 20}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(star);
      }
    };

    createStars();

    return () => {
      const container = document.querySelector('.stars-container');
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="site-gpt-container">
      <Head>
        <title>SiteGPT - Chat with any website</title>
        <meta name="description" content="Chat with any website using AI" />
      </Head>

      {/* Background elements */}
      <div className="stars-container" aria-hidden="true"></div>
      <div className="nebula-background" aria-hidden="true">
        <div className="nebula-purple"></div>
        <div className="nebula-blue"></div>
        <div className="nebula-amber"></div>
      </div>

      {/* Main content */}
      <main className="main-content">
        <header className="header">
          <h1 className="title">
            Site<span className="title-highlight">GPT</span>
          </h1>
          <p className="subtitle">
            {siteContent.content 
              ? `Chatting with: ${siteContent.url}` 
              : 'Upload a website URL to start chatting with its content'}
          </p>
        </header>
        
        <div className="chat-container">
          {siteContent.content ? (
            <div className="chat-wrapper">
              <div className="chat-header">
                <h2 className="chat-title">
                  Chat about {new URL(siteContent.url).hostname}
                </h2>
                <button
                  onClick={() => setSiteContent({url: '', content: ''})}
                  className="new-site-button"
                  aria-label="Start new chat"
                >
                  New Site
                </button>
              </div>
              <Chat siteContent={siteContent} />
            </div>
          ) : (
            <div className="request-form-wrapper">
              <RequestForm 
                setIsLoading={setIsLoading} 
                setSiteContent={setSiteContent} 
                isLoading={isLoading} 
              />
            </div>
          )}
        </div>
        
        <footer className="footer">
          <p>SiteGPT uses AI to analyze website content. Results may vary based on website structure.</p>
        </footer>
      </main>
    </div>
  );
};

export default SiteGPT;