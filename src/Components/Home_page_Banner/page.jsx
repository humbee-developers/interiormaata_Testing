import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import MusicPlayer from "@/Components/musicPlayer/page";
import styles from "@/Components/Home_page_Banner/Banner.module.css";
import "./banner.css"
gsap.registerPlugin(ScrollTrigger);

const Animation = ({ loadImage, counter }) => {
  const [animationEnded, setAnimationEnded] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const contextRef = useRef(null);
  const imagesRef = useRef([]);
  const airpodsRef = useRef({ frame: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingCounter, setLoadingCounter] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const text = textRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      const originalWidth = 1632;
      const originalHeight = 918;
      const aspectRatio = originalWidth / originalHeight;

      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight;
      const heightByWidth = availableWidth / aspectRatio;

      if (availableWidth < 1024) {
        // For screens below 1024px width
        canvas.style.width = "1301px"; // Set canvas width to 1301px
        canvas.style.height = "100vh"; // Set canvas height to window height
      } else {
        // For screens 1024px width and above
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        canvas.style.width = "100%"; // Set canvas width to 100% of container
        canvas.style.height = "100vh"; // Allow canvas to maintain aspect ratio
      }
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const frameCount = 280;
    const currentFrame = (index) =>
      `https://interiormaata.humbeestudio.xyz/assets/frames/newfinal/${(
        index + 1
      )
        .toString()
        .padStart(4, "0")}.jpg`;

    let imgL = [];
    for (let i = 0; i < frameCount; i++) {
      let img = new Image();
      img.src = currentFrame(i);
      imagesRef.current.push(img);
      imgL.push(img.src);
    }

    const loadImages = async () => {
      try {
        const loadImagePromises = imgL.map((imageUrl, index) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
              setLoadingCounter(index + 1);
              resolve();
            };
          });
        });

        await Promise.all(loadImagePromises);

        setLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    loadImages();

    const animationTimeline = gsap.timeline({
      onUpdate: render,
      onComplete: () => setAnimationEnded(true), // Set animationEnded to true when animation completes
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: true,
        end: "+=1400%",
      },
    });

    animationTimeline.to(airpodsRef.current, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 1,
    });

    imagesRef.current[0].onload = render;

    function render() {
      const context = contextRef.current;
      const canvas = canvasRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        imagesRef.current[airpodsRef.current.frame],
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [loadingCounter]);

  useEffect(() => {
    // Function to handle scroll direction and video visibility
    const handleScroll = () => {
      const video = document.querySelector(`.${styles.videoBg}`);
      if (window.scrollY > 0) {
        // Check if window has scrolled down
        video.style.visibility = "hidden";
      } else {
        video.style.visibility = "visible";
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove scroll event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);




  const [refButton, inViewButton] = useInView({
    triggerOnce: false,
  });
  const controlsx = useAnimation();

  const variants = {
    hidden: { opacity: 0, y: 5 }, // Move the button down initially
    visible: { opacity: 1, y: -130 }, // Move the button up to its original position
  };

  useEffect(() => {
    if (inViewButton) {
      controlsx.start("visible");
    }
  }, [inViewButton, controlsx]);






  return (
    <section>
      <section ref={sectionRef}>
        <canvas
          className={styles.canvas_factory_settings}
          ref={canvasRef}
          style={{
            width: "100%", // Set canvas width to 100% initially
            height: "100vh" // Allow canvas to maintain aspect ratio
          }}
        ></canvas>
      </section>
      <video
        className={styles.videoBg}
        width="750"
        height="500"
        autoPlay
        loop
        muted
      >
        <source src="./video/testing2.mp4" type="video/mp4" />
      </video>

      <motion.div
        ref={refButton}
        initial="hidden"
        animate={inViewButton ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, delay: 0 }}
        // className={styles.buttonOuter}
      >
        <button className={styles.buttonX} role="button">
        <a href="tel:+917404040286" className={styles.textX}>Contact Us | +917404040286</a>
      </button>
      </motion.div>


      <MusicPlayer />
    </section>
  );
};
export default Animation;
