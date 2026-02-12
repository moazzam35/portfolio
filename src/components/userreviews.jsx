import React, { useState } from 'react';

const UserChatsAndReviews = () => {
  const [activeTab, setActiveTab] = useState('chats');

  const chats = [
    {
      id: 1,
      user: 'Alex Morrison',
      avatar: 'AM',
      message: 'Hey! I absolutely love your work. The attention to detail is incredible!',
      timestamp: '2 hours ago',
      unread: true,
      likes: 12
    },
    {
      id: 2,
      user: 'Sarah Chen',
      avatar: 'SC',
      message: 'Can we discuss a potential collaboration? I have an exciting project in mind.',
      timestamp: '5 hours ago',
      unread: true,
      likes: 8
    },
    {
      id: 3,
      user: 'Marcus Johnson',
      avatar: 'MJ',
      message: 'Your latest project inspired me to try something new. Thank you!',
      timestamp: '1 day ago',
      unread: false,
      likes: 15
    },
    {
      id: 4,
      user: 'Emily Rodriguez',
      avatar: 'ER',
      message: 'The design principles you shared were game-changing for our team.',
      timestamp: '2 days ago',
      unread: false,
      likes: 23
    }
  ];

  const reviews = [
    {
      id: 1,
      user: 'David Kim',
      avatar: 'DK',
      rating: 5,
      title: 'Outstanding Work Quality',
      content: 'Working with this developer was an absolute pleasure. The code quality is exceptional, and the communication throughout the project was stellar. Highly recommend!',
      date: 'Jan 15, 2026',
      project: 'E-commerce Platform'
    },
    {
      id: 2,
      user: 'Jennifer Walsh',
      avatar: 'JW',
      rating: 5,
      title: 'Exceeded Expectations',
      content: 'Not only did they deliver on time, but the final product surpassed what we initially envisioned. Creative problem-solving and attention to detail throughout.',
      date: 'Jan 10, 2026',
      project: 'Mobile App Redesign'
    },
    {
      id: 3,
      user: 'Ryan Patel',
      avatar: 'RP',
      rating: 5,
      title: 'Professional & Skilled',
      content: 'Excellent technical skills combined with great design sense. The portfolio piece they created has become one of our most visited pages.',
      date: 'Dec 28, 2025',
      project: 'Portfolio Website'
    },
    {
      id: 4,
      user: 'Lisa Anderson',
      avatar: 'LA',
      rating: 5,
      title: 'Brilliant Collaboration',
      content: 'Their ability to understand complex requirements and translate them into elegant solutions is remarkable. Will definitely work together again.',
      date: 'Dec 20, 2025',
      project: 'Dashboard Analytics'
    }
  ];


  return (
    <div className='main-reviews'>

    <div className="container">
      <div className="max-width">
        
        <div className="header-reviews">
          <h1 className="subtitle">Real conversations. Real feedback. Real results.</h1>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Messages
            </button>
            <button
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Reviews
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="content-grid">
          {activeTab === 'chats' && chats.map((chat) => (
            <div key={chat.id} className="card">
              {chat.unread && <div className="unread-indicator" />}
              
              <div className="card-content">
                <div className="avatar">{chat.avatar}</div>
                
                <div className="card-body">
                  <div className="card-header">
                    <h3 className="user-name">{chat.user}</h3>
                    <span className="timestamp">{chat.timestamp}</span>
                  </div>
                  
                  <p className="message">{chat.message}</p>
                  
                  <button className="like-button">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {chat.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'reviews' && reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="card-content">
                <div className="avatar">{review.avatar}</div>
                
                <div className="card-body">
                  <div className="card-header">
                    <div>
                      <h3 className="user-name">{review.user}</h3>
                      <div className="stars">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="star" fill="#ff3333" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="timestamp">{review.date}</span>
                  </div>
                  
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-content">{review.content}</p>
                  
                  <div className="project-tag">
                    <span className="project-dot" />
                    {review.project}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    </div>

  );
};

export default UserChatsAndReviews;