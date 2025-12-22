gsap.from("h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
  });
  
  gsap.from("h1 .h1-muziek", {
    y: 100,
    opacity: 0,
    delay: 0.2,
    duration: 0.8,
    ease: "power3.out",
  });
  
  gsap.from("h1 .h1-voor", {
    y: 50,
    opacity: 0,
    delay: 0.4,
    duration: 1,
    ease: "power3.out",
  });
  
  gsap.from("section:nth-of-type(3) p, a, h2", {
    scrollTrigger: {
      trigger: "section:nth-of-type(3) p",
      start: "top 80%", 
      toggleActions: "play none none none",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
  