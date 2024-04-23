import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import ScrollTrigger from "gsap/ScrollTrigger";
import  HeadingTextAnimation from "@/Common/AnimatedText/HeadingTextAnimation"
import { useInView } from "react-intersection-observer";
import MusicPlayer from "@/Components/musicPlayer/page";
import styles from "@/Components/Home_page_Banner/Banner.module.css";
gsap.registerPlugin(ScrollTrigger);

const Animation = ({ loadImage, counter }) => {
  const router = useRouter();
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

//     canvas.width = 1632;
// canvas.height = 918;

const setCanvasSize = () => {
  const canvas = canvasRef.current;
  const originalWidth = 1632;
  const originalHeight = 918;
  const aspectRatio = originalWidth / originalHeight;

  // Compute the available width and height by window size or a container
  const availableWidth = window.innerWidth;
  const availableHeight = window.innerHeight;

  // Calculate the canvas dimensions based on the aspect ratio and available space
  const heightByWidth = availableWidth / aspectRatio;
  const widthByHeight = availableHeight * aspectRatio;

  if (heightByWidth <= availableHeight) {
    canvas.width = availableWidth;
    canvas.height = heightByWidth;
  } else {
    canvas.width = widthByHeight;
    canvas.height = availableHeight;
  }
};

  

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

     const frameCount = 280;
    const currentFrame = (index) =>
    `https://interiormaata.humbeestudio.xyz/assets/frames/newfinal/${(index + 1)
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
        scrub: 0.1,
        end: "+=1800%",
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
      // window.removeEventListener("resize", setCanvasSize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loadingCounter]);


  const [ref, inView] = useInView({
    triggerOnce: false,
  });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  useEffect(() => {
    // Function to handle scroll direction and video visibility
    const handleScroll = () => {
      const video = document.querySelector(`.${styles.videoBg}`);
      if (window.scrollY > 0) { // Check if window has scrolled down
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
    visible: { opacity: 1, y: -210 }, // Move the button up to its original position
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
        ></canvas>
      </section>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.9 }}
        className={styles.text1}
      >
        <HeadingTextAnimation
          heading={"Where Tradition find"}
          justifyContent={"center"}
        />
        <HeadingTextAnimation
          heading={" it’s modern muse"}
          justifyContent={"left"}
        />
      </motion.div>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.9 }}
        className={styles.interiormaata}
      >
      <HeadingTextAnimation
          heading={"interiorमाता"}
          justifyContent={"center"}
        />
      </motion.div>
      <video className={styles.videoBg}  width="750" height="500"  autoPlay loop muted>
      <source src="./video/testing2.mp4" type="video/mp4"/>
     </video>
      <MusicPlayer />

     
      <motion.div
        ref={refButton}
        initial="hidden"
        animate={inViewButton ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, delay: 0 }}
        // className={styles.buttonOuter}
      >
        <button onClick={() => router.push("/Consultancy")} className={styles.buttonX} role="button">
        <span className={styles.textX}>Contact Us | 123456789</span>
      </button>
      </motion.div>
     

    </section>
  );
};
export default Animation;
