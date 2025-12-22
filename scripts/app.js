gsap.from("h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
  });
  
  gsap.from("h1 .h1-muziek", {
    y: 100,
    opacity: 0,
    delay: .2,
    duration: 0.8,
    ease: "power3.out",
  });
  
  gsap.from("h1 .h1-voor", {
    y: 50,
    opacity: 0,
    delay: .4,
    duration: 1,
    ease: "power3.out",
  });
