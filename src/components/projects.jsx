import React, { useEffect } from "react";
import AOS from "aos";

function Projects() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    AOS.refresh();
  }, []);

  const projects = [
    {
      id: 1,
      title: "Country Cards",
      description: "An interactive application that fetches and displays country data with detailed information including flags, population, regions, and more with beautiful card layouts.",
      tags: ["JavaScript", "REST API", "react", "Responsive"],
      demoLink: "https://moazzam35.github.io/country-cards",
      codeLink: "https://github.com/moazzam35/country-cards",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "Pokemon Data Explorer",
      description: "A dynamic Pokemon database that fetches data from Pokemon API, displaying comprehensive Pokemon information with advanced search and filter functionality.",
      tags: ["JavaScript", "Pokemon API", "HTML5", "Dynamic"],
      demoLink: "https://moazzam35.github.io/pokemon-data/",
      codeLink: "https://github.com/moazzam35/pokemon-data",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    }
  ];

  return (
    <div className="projects-section" id="projects">
      <div className="projects-container">
        <div className="projects-header">
          <span className="projects-badge" data-aos="fade-down">
            <span className="badge-icon">💼</span>
            My Projects
          </span>
          <h2 data-aos="fade-up">
            Creative Projects that
            <br />
            <span className="gradient-text">Showcase Innovation</span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="100">
            Building interactive applications with real-time data fetching and modern design
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              className="project-card" 
              data-aos="fade-up" 
              data-aos-delay={index * 50}
              key={project.id}
            >
              <div className="card-glow" style={{ background: project.gradient }}></div>
              
              

              <div className="project-icon" style={{ background: project.gradient }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>

              <div className="project-content">
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span className="tag" key={i}>{tag}</span>
                  ))}
                </div>
                
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-links">
                  <a 
                    href={project.demoLink} 
                    className="project-link demo-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: project.gradient }}
                  >
                    <span>Live Demo</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  
                  <a 
                    href={project.codeLink} 
                    className="project-link code-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              <div className="card-decoration"></div>
            </div>
          ))}
        </div>
      
      </div>
    </div>
  );
}

export default Projects;