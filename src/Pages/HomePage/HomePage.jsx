import React, { useState, useEffect, useRef } from "react";
import target from "../../assets/target.svg";
import targetBlack from "../../assets/targetBlack.svg";
import skill from "../../assets/Skill.svg";
import Code from "../../assets/Code.svg";
import Circle from "../../assets/Circle.svg";
import Squigle from "../../assets/Squigle.svg";
import Semicircle from "../../assets/Semicircle.svg";
import Land from "../../assets/Land.svg";
import podium from "../../assets/podium.png";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import Picture_Angad from "../../assets/Picture_Angad.jpg";
import Picture_Aarav from "../../assets/Picture_Aarav1.jpg";
import Picture_Aayush from "../../assets/Picture_Aayush.jpg";
import SvgAnimator from "../../Components/SvgAnimator/SvgAnimator";
import "./HomePage.css";
import MovableDiv from "./MovableDiv";
import FAQs from "../../Components/FAQ/FAQs";
import Footer from "../../Components/Footer/Footer";
import CreateGroup from "../CreateGroup/CreateGroup";
import JoinGroup from "../JoinGroup/JoinGroup";
import "../CreateGroup/CreateGroup.css";
import ChatBot from "../../Components/ChatBot/ChatBot";

const HomePage = ({ theme, scrollToAbout, setScrollToAbout }) => {

  const parentRef = useRef(null);
  const [flippedCards, setFlippedCards] = useState([false, false, false]);

  const cardWidth = 600;
  const movableWidth = 50;

  const handleMovableMove = (pos) => {
    const parentRect = parentRef.current.getBoundingClientRect();
    const movableCenter = pos.x + movableWidth / 2;

    // Card positions (adjust offsets according to your layout)
    const leftSmall = 50 / 2;
    const leftBig = 50 + cardWidth / 2;
    const rightBig = 50 + cardWidth + 20 + cardWidth / 2; // 20 = gap

    setFlippedCards([
      movableCenter >= leftSmall,
      movableCenter >= leftBig,
      movableCenter >= rightBig,
    ]);
  };

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);

  const aboutUsRef = useRef(null);

  const scrollToAboutUs = () => {
    aboutUsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

useEffect(() => {
  if (scrollToAbout) {
    scrollToAboutUs();
    setScrollToAbout(false); // reset the trigger
  }
}, [scrollToAbout, setScrollToAbout]);



  return (
    <div className="min-h-screen">
      {/* Animated SVGs */}
      <div className="absolute top-0 right-0 w-[600px] h-[270px] overflow-hidden">
        <img
          className="w-xl right-[-100px] top-[-300px] relative animate-infinite-hover"
          src={Circle}
          alt="Circle"
        />
      </div>
      <div className="absolute right-0 top-[660px] w-[300px] h-[640px] overflow-clip">
        <img
          className="w-xs relative animate-slide-in-right"
          src={Semicircle}
          alt="Semicircle"
        />
      </div>
      <img
        className="w-3xs left-[100px] top-[100px] absolute animate-infinite-hover"
        src={Squigle}
        alt="Squigle"
      />
      <img className="w-md absolute top-[1200px] left-0" src={Land} alt="" />

      <div className="max-w-screen-2xl mx-auto flex gap-5 relative">
        {/* Left Section */}
        <div className="relative w-fit h-fit">
          <div className="relative top-50 left-20">
            <h1
              className={
                theme === "light"
                  ? "fjalla text-6xl text-black"
                  : "fjalla text-6xl text-[#F8FAFC]"
              }
            >
              BATTLE YOUR FRIENDS AND
              <br />
              LEARN SIMULTANEOUSLY
            </h1>

            <div className="flex gap-9 relative top-7 left-4">
              <button
                onClick={() => {
                  setShowCreateGroup(true);
                }}
                className={
                  theme === "light"
                    ? "transform-transition hover:scale-110 duration-300 text-white p-2 px-4 bg-black fjalla text-lg"
                    : "transform-transition hover:scale-110 duration-300 text-white p-2 px-4 bg-orange-400 fjalla text-lg"
                }
              >
                Create Group
              </button>

              <div className="transform-transition hover:scale-110 duration-300 flex gap-2 justify-center items-center">
                <img
                  src={theme === "light" ? target : targetBlack}
                  alt="target img"
                  className="h-5"
                />
                <button
                  onClick={() => {
                    setShowJoinGroup(true);
                  }}
                  className="underline text-lg fjalla"
                >
                  Join Group
                </button>
              </div>
            </div>

            <div onClick={scrollToAboutUs}
              className="cursor-pointer relative top-22 left-8 bg-gradient-to-br from-[#a8927d] to-[#5b4a3a] rounded-xl w-80 hover:scale-105 transform transition-all duration-300 active:scale-95 active:brightness-90">
              <h1 className="text-2xl fjalla pr-17 pl-7 py-2">
                Know more About Us!
              </h1>
            </div>

            {/* SVGs and ProfileCards */}
            <div ref={aboutUsRef} className="relative top-22 left-16 min-h-[400px] z-50">
              <SvgAnimator
                pathData="M3.9998 0.960349 L12.0295 810.96"
                stroke={theme === "light" ? "black" : "white"}
                strokeWidth={8}
                viewBox="0 0 17 811"
                className="absolute w-3 left-150 top-40 h-270"
              />
              <SvgAnimator
                pathData="M220.964 5.99983 L0.963631 3.99983"
                stroke={theme === "light" ? "black" : "white"}
                strokeWidth={6}
                viewBox="0 0 221 10"
                className="absolute  top-80 -right-4"
              />
              <div className="absolute top-48 left-3 autoShow">
                <ProfileCard />
              </div>
              <SvgAnimator
                pathData="M0.964914 6.00015 L228.965 4.00015"
                stroke={theme === "light" ? "black" : "white"}
                strokeWidth={6}
                viewBox="0 0 229 10"
                className="absolute top-140 -right-80"
              />
              <div className="absolute top-98 -right-150 autoShow">
                <ProfileCard
                  ProfilePicture={Picture_Angad}
                  Name="Angadveer Singh"
                  role="UX/UI"
                  github_id="Angadveer185"
                  linkedinUrl="https://www.linkedin.com/in/angadveer-singh-1751842b2/"
                  description="I am a passionate developer with a strong interest in technology, web development, and problem-solving. I'm continuously building his skills through projects, coding challenges, and creative pursuits."
                />
              </div>
              <div id="NavigationPoint"></div>
              <SvgAnimator
                pathData="M217 4 L0 4"
                stroke={theme === "light" ? "black" : "white"}
                strokeWidth={6}
                viewBox="0 0 217 8"
                className="absolute top-200 -right-5"
              />
              <div className="absolute top-168 left-3 autoShow">
                <ProfileCard
                  ProfilePicture={Picture_Aarav}
                  Name="Aarav Goyal"
                  role="Frontend Dev"
                  github_id="aaravg192"
                  linkedinUrl="https://www.linkedin.com/in/aarav-goyal-b8b35a307"
                  description="I’m Aarav, a curious learner passionate about building clean, functional, and creative digital experiences. Always experimenting, always growing."
                />
              </div>
              <SvgAnimator
                pathData="M0.947373 7.00035 L228.947 4.00035"
                stroke={theme === "light" ? "black" : "white"}
                strokeWidth={6}
                viewBox="0 0 229 11"
                className="absolute top-250 -right-80"
              />
              <div className="absolute top-218 -right-150 autoShow">
                <ProfileCard
                  ProfilePicture={Picture_Aayush}
                  Name="Aayush Verma"
                  role="Backend"
                  github_id="aaravg192"
                  linkedinUrl="https://www.linkedin.com/in/aarav-goyal-b8b35a307"
                  description="FullStack Developer of this project with expertise in React and Express."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="h-fit relative left-60 top-27 flex">
          <div className="h-fit z-20">
            <img
              src={skill}
              alt="skill"
              className={
                theme === "light"
                  ? "h-50 p-3 bg-[#f2ece8] rounded-xl -rotate-20 transform transition-all duration-300 hover:scale-110 hover:rotate-8 hover:shadow-2xl "
                  : "h-50 p-3 bg-[#708993] rounded-xl -rotate-20 transform transition-all duration-300 hover:scale-110 hover:rotate-8 hover:shadow-2xl "
              }
            />
            <img
              src={podium}
              alt="podium"
              className={theme === "light" ? "relative h-60 w-50 p-3 bg-orange-400 rounded-xl transform transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-2xl" : "relative h-60 w-50 p-3 bg-[#E7F2EF] rounded-xl transform transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-2xl"}
            />
          </div>
          <div className="h-fit">
            {/* Grow */}
            <div className="flex">
              <div
                className={
                  theme === "light"
                    ? "h-1 relative top-4 -left-6 w-30 bg-black z-10"
                    : "h-1 relative top-4 -left-6 w-30 bg-white z-10"
                }
              ></div>
              <img
                src={theme === "light" ? target : targetBlack}
                alt="target"
                className="h-5 top-2 -left-6 relative"
              />
              <h1 className="fjalla text-2xl relative top-1 -left-3 underline">
                {" "}
                Grow{" "}
              </h1>
            </div>
            <div className="relative top-2 left-17">
              <h1 className="fjalla text-lg">
                Grow and improve your skills
                <br /> along with others.
              </h1>
            </div>
            {/* Learn portion */}
            <div className="flex">
              <div className="relative top-10 left-10">
                <div className="relative z-20">
                  <img
                    src={Code}
                    alt="code"
                    className={
                      theme === "light"
                        ? "h-45 bg-white border-15 rounded-xl rotate-20 p-3 transition-transform duration-500 hover:[transform:rotateX(15deg)rotateY(15deg)scale(1.1)] hover:shadow-2xl"
                        : "h-45 bg-white border-15 border-[#A1C2BD] rounded-xl rotate-20 p-3 transition-transform duration-500 hover:[transform:rotateX(15deg)rotateY(15deg)scale(1.1)] hover:shadow-2xl"
                    }
                  />
                </div>
                <div
                  className={
                    theme === "light"
                      ? "h-1 absolute top-10 left-30 w-40 bg-black z-10"
                      : "h-1 absolute top-10 left-30 w-40 bg-white z-10"
                  }
                ></div>
              </div>
              <div>
                <div
                  className={
                    theme === "light"
                      ? "w-1 h-6 bg-black relative left-35 top-20"
                      : "w-1 h-6 bg-white relative left-35 top-20"
                  }
                ></div>
                <img
                  src={theme === "light" ? target : targetBlack}
                  alt="target"
                  className="h-5 relative left-33 top-20"
                />
                <h1 className="fjalla relative left-30 top-20 text-2xl underline">
                  {" "}
                  Learn{" "}
                </h1>
                <h1 className="fjalla text-lg relative top-22 left-19">
                  Learn new concepts
                  <br />
                  you are interested in.
                </h1>
              </div>
            </div>
            {/* Compete Portion */}
            <div className="flex">
              <div
                className={
                  theme === "light"
                    ? "h-1 relative top-35 -left-6 w-35 bg-black"
                    : "h-1 relative top-35 -left-6 w-35 bg-white"
                }
              ></div>
              <img
                src={theme === "light" ? target : targetBlack}
                alt="target"
                className="h-5 relative -left-6 top-33"
              />
              <h1 className="fjalla relative top-32 underline -left-4 text-2xl">
                {" "}
                Compete{" "}
              </h1>
            </div>
            <div>
              <h1 className="relative fjalla text-lg top-34 left-7">
                Share your progress with friends and compete
                <br />
                to stay on top of the leaderboard.
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* Flippable Cards with MovableDiv */}
      {/* <div
        ref={parentRef}
        className="flex absolute w-full mt-285 gap-10 p-25 autoShow"
      > */}
      {/* <MovableDiv
          parentRef={parentRef}
          onMove={handleMovableMove}
          width={movableWidth}
          height={550}
        /> */}

      {/* Left Big Card */}
      {/* <div
          className="relative w-[600px] h-[550px] border-2 mx-5"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            transform: flippedCards[1] ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className="absolute w-full h-full bg-red-400 flex items-center justify-center backface-hidden">
            Front Content
          </div>
          <div
            className="absolute w-full h-full bg-green-400 flex items-center justify-center backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            Back Content
          </div>
        </div> */}

      {/* Right Big Card */}
      {/* <div
          className="relative w-[600px] h-[550px] border-2 mx-5"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            transform: flippedCards[2] ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className="absolute w-full h-full bg-orange-500 flex items-center justify-center backface-hidden">
            Front Content
          </div>
          <div
            className="absolute w-full h-full bg-blue-500 flex items-center justify-center backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            Back Content
          </div>
        </div> */}
      {/* </div> */}
      <div className="relative top-300">
        <FAQs theme={theme} />
      </div>
      <div className="relative top-300">
        <Footer theme={theme} />
      </div>

      {showCreateGroup && (
        <div className="overlay">
          <CreateGroup close3={() => setShowCreateGroup(false)} theme={theme} />
        </div>
      )}
      {showJoinGroup && (
        <div className="overlay">
          <JoinGroup close4={() => setShowJoinGroup(false)} theme={theme} />
        </div>
      )}

      <ChatBot />
    </div>
  );
};

export default HomePage;
