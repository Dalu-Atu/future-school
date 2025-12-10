import { Link } from "react-router-dom";
import waves from "../assets/hero-bg.svg";
import shapeOne from "../assets/hero-shape-1.svg";
import shapeTwo from "../assets/hero-shape-2.png";
import svgOne from "../assets/category-1.svg";
import svgTwo from "../assets/category-2.svg";
import svgThree from "../assets/category-3.svg";
import svgFour from "../assets/category-4.svg";
import musicClass from "../assets/music.jpeg";
import aboutShapeTwo from "../assets/about-shape-2.svg";
import aboutShapeThree from "../assets/about-shape-3.png";
import videoShapeTwo from "../assets/video-shape-1.png";
import videoShapeOne from "../assets/video-shape-2.png";
import video from "../assets/video-bg.png";
import blog from "../assets/blog-bg.svg";
import blogShape from "../assets/blog-shape.png";
import footerBg from "../assets/footer-bg.png";

import one from "../assets/empress.jpeg";
import two from "../assets/daniel.jpeg";
import {
  BsBookmarkCheck,
  BsCardChecklist,
  BsFilePlay,
  BsFillBookFill,
  BsFillStarFill,
  BsPeople,
} from "react-icons/bs";
import { useTheme } from "../services/ThemeContext";
import "../styles/homepage.css";

function Header() {
  const { currSettings } = useTheme();
  return (
    <header className="header" data-header="">
      <div className="container" style={{ height: "5rem", paddingTop: "1rem" }}>
        <div className="logo" style={{ display: "flex" }}>
          <img
            style={{
              transform: "scale(0.5)",
              position: "relative",
              left: "-4rem",
            }}
            alt="ois logo"
            src={currSettings.images?.logo}
          />
        </div>

        <nav className="navbar" data-navbar="">
          <div className="wrapper">
            <div className="logo" href="#">
              <img
                alt="ois logo"
                height="50"
                src={currSettings.images?.logo}
                width="162"
              />
            </div>
            <button>
              <BsCardChecklist />
            </button>
          </div>
          <ul className="navbar-list">
            <li className="navbar-item">
              <a className="navbar-link" data-nav-link="" href="#home">
                Home
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" data-nav-link="" href="#about">
                About
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" data-nav-link="" href="#courses">
                Courses
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" data-nav-link="" href="#blog">
                Blog
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" data-nav-link="" href="#">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "12rem",
              position: "relative",
              left: "1rem",
            }}
          >
            <Link to={"/login"}>
              <button className="btn-small-screen">Login</button>
            </Link>

            {/* <Link to={"student-portal"}>
              <button className="btn-small-screen">Portal</button>
            </Link> */}
          </div>
        </div>
        <div className="overlay" data-nav-toggler="" data-overlay="" />
      </div>
    </header>
  );
}
function FirstSection() {
  const { currSettings } = useTheme();
  const words = currSettings.title.split(" "); // Split sentence into words
  const lastWord = words.pop(); // Extract the last word
  const restOfSentence = words.join(" "); // Join the rest of the sentence back together

  return (
    <section
      className="section hero has-bg-image"
      style={{ backgroundImage: `url(${""})` }}
    >
      <div className="container first-sec">
        <div className="hero-content">
          <h1 className="h1 section-title">
            {restOfSentence} <span className="span">{lastWord}</span>
          </h1>

          <p className="hero-text">{currSettings.slogan}</p>

          <a href="#about" className="btn has-before">
            <span className="span"> {currSettings.button}</span>

            <ion-icon
              name="arrow-forward-outline"
              aria-hidden="true"
            ></ion-icon>
          </a>
        </div>

        <figure className="hero-banner">
          <div
            className="img-holder one"
            style={{
              "--height": "370",
              "--width": "270",
            }}
          >
            <img
              alt="hero banner"
              className="img-cover"
              height="300"
              src={one}
              width="270"
            />
          </div>
          <div
            className="img-holder two"
            style={{
              "--height": "370",
              "--width": "240",
            }}
          >
            <img
              alt="hero banner"
              className="img-cover"
              height="370"
              src={two}
              width="240"
            />
          </div>
          <img
            alt=""
            className="shape hero-shape-1"
            height="190"
            src={shapeOne}
            width="380"
          />
          <img
            alt=""
            className={"shape hero-shape-2"}
            height="551"
            src={shapeTwo}
            width="622"
          />
        </figure>
      </div>
    </section>
  );
}

function SecondSection() {
  return (
    <section className="section category" aria-label="category">
      <div className="container ">
        <p className="section-subtitle">Categories</p>
        <h2 className="h2 section-title">
          World-Class <span className="span">School Facilities</span> and
          Resources for Learning
        </h2>
        <p className="section-text">
          Explore our top-tier resources and facilities that enrich your
          learning and support your academic journey.
        </p>
        <ul className="grid-list">
          <li>
            <div
              className="category-card"
              style={{
                "--color": "170, 75%, 41%",
              }}
            >
              <div className="card-icon">
                <img
                  alt="Online Degree Programs"
                  className="img"
                  height="40"
                  loading="lazy"
                  src={svgOne}
                  width="40"
                />
              </div>
              <h3 className="h3">
                <a className="card-title" href="#">
                  All Science Laboratories
                </a>
              </h3>
              <p className="card-text">
                Equipped with modern tools and technology, our labs offer
                hands-on experience in biology, chemistry, and physics,
                fostering a practical understanding of scientific concepts.
              </p>
              <span className="card-badge">7 Courses</span>
            </div>
          </li>
          <li>
            <div
              className="category-card"
              style={{
                "--color": "351, 83%, 61%",
              }}
            >
              <div className="card-icon">
                <img
                  alt="Non-Degree Programs"
                  className="img"
                  height="40"
                  loading="lazy"
                  src={svgTwo}
                  width="40"
                />
              </div>
              <h3 className="h3">
                <a className="card-title" href="#">
                  Library
                </a>
              </h3>
              <p className="card-text">
                A comprehensive resource center providing students access to
                books, journals, and digital media to support their academic
                studies and research.
              </p>
              <span className="card-badge">4 Courses</span>
            </div>
          </li>
          <li>
            <div
              className="category-card"
              style={{
                "--color": "229, 75%, 58%",
              }}
            >
              <div className="card-icon">
                <img
                  alt="Off-Campus Programs"
                  className="img"
                  height="40"
                  loading="lazy"
                  src={svgThree}
                  width="40"
                />
              </div>
              <h3 className="h3">
                <a className="card-title" href="#">
                  Sports Facilities
                </a>
              </h3>
              <p className="card-text">
                State-of-the-art gyms, fields, and courts for various sports,
                encouraging physical fitness and team spirit among students{" "}
              </p>
              <span className="card-badge">8 Courses</span>
            </div>
          </li>
          <li>
            <div
              className="category-card"
              style={{
                "--color": "42, 94%, 55%",
              }}
            >
              <div className="card-icon">
                <img
                  alt="Hybrid Distance Programs"
                  className="img"
                  height="40"
                  loading="lazy"
                  src={svgFour}
                  width="40"
                />
              </div>
              <h3 className="h3">
                <a className="card-title" href="#">
                  Full Tech Computer Labs
                </a>
              </h3>
              <p className="card-text">
                Advanced computer labs with up-to-date software and high-speed
                internet, supporting students in technology-driven projects and
                learning.
              </p>
              <span className="card-badge">8 Courses</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
function ThirdSection() {
  const { currSettings } = useTheme();
  return (
    <section aria-label="about" className="section about" id="about">
      <div className="container">
        <figure className="about-banner">
          <div
            className="img-holder"
            style={{
              "--height": "370",
              "--width": "520",
            }}
          >
            <img
              alt="about banner"
              className="img-cover"
              height="370"
              loading="lazy"
              src={currSettings.images.image3}
              width="520"
            />
          </div>

          <img
            alt=""
            className="shape about-shape-2"
            height="220"
            loading="lazy"
            src={aboutShapeTwo}
            width="371"
          />
          <img
            alt=""
            className="shape about-shape-3"
            height="528"
            loading="lazy"
            src={aboutShapeThree}
            width="722"
          />
        </figure>
        <div className="about-content">
          <p className="section-subtitle">About Us</p>
          <h2 className="h2 section-title">
            Over 6 Years in <span className="span">Distant learning</span> for
            Skill and Academic Development
          </h2>
          <p className="section-text">
            6+ Years of Learning Excellence. Elevating skills and academics with
            a decade of expertise. Tailored education for your success.
          </p>
          <ul className="about-list">
            <li className="about-item">
              <BsBookmarkCheck style={{ color: "red" }} />
              <span className="span">Quality Teachers</span>
            </li>
            <li className="about-item">
              <BsBookmarkCheck style={{ color: "red" }} />
              <span className="span"> Remote Learning</span>
            </li>
            <li className="about-item">
              <BsBookmarkCheck style={{ color: "red" }} />
              <span className="span">Quality facilities</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
function FourthSection() {
  const { currSettings } = useTheme();
  return (
    <section aria-label="course" className="section course" id="courses">
      <div className="container">
        <p className="section-subtitle">All Courses and Subjects</p>
        <h2 className="h2 section-title">Pick A Course To Get Started</h2>
        <ul className="grid-list">
          <li>
            <div className="course-card">
              <figure
                className="card-banner img-holder"
                style={{
                  "--height": "220",
                  "--width": "370",
                }}
              >
                <img
                  alt="Build Responsive Real- World Websites with HTML and CSS"
                  className="img-cover"
                  height="220"
                  loading="lazy"
                  src={currSettings.images.image4}
                  width="370"
                />
              </figure>
              <div className="abs-badge">
                <ion-icon aria-hidden="true" name="time-outline" />
                <span className="span">3 Weeks</span>
              </div>
              <div className="card-content">
                <span className="badge">Advanced</span>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    Learn the Basics of Computer Programming from Beginner to
                    Advance
                  </a>
                </h3>
                <div className="wrapper">
                  <div className="rating-wrapper">
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                  </div>
                  <p className="rating-text">(5.0/7 Rating)</p>
                </div>
                <data className="price" value="29">
                  Available
                </data>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <BsFillBookFill style={{ color: "gray" }} />
                    <span className="span">12 Week Lessons</span>
                  </li>
                  <li className="card-meta-item">
                    <BsPeople style={{ color: "gray" }} />
                    <span className="span">320 Students</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <div className="course-card">
              <figure
                className="card-banner img-holder"
                style={{
                  "--height": "220",
                  "--width": "370",
                }}
              >
                <img
                  alt="The Complete Camtasia Course for Content Creators"
                  className="img-cover"
                  height="220"
                  loading="lazy"
                  src={currSettings.images.image6}
                  width="370"
                />
              </figure>
              <div className="abs-badge">
                <ion-icon aria-hidden="true" name="time-outline" />
                <span className="span">3 Weeks</span>
              </div>
              <div className="card-content">
                <span className="badge">Advanced</span>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    State-of-the-Art Laboratory Facilities
                  </a>
                </h3>
                <div className="wrapper">
                  <div className="rating-wrapper">
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                  </div>
                  <p className="rating-text">(4.9 /7 Rating)</p>
                </div>
                <data className="price" value="35">
                  Available
                </data>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <BsFillBookFill style={{ color: "gray" }} />
                    <span className="span">12 Week Lessons</span>
                  </li>
                  <li className="card-meta-item">
                    <BsPeople style={{ color: "gray" }} />
                    <span className="span">320 Students</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div className="course-card">
              <figure
                className="card-banner img-holder"
                style={{
                  "--height": "220",
                  "--width": "370",
                }}
              >
                <img
                  alt="Java Programming Masterclass for Software Developers"
                  className="img-cover"
                  height="220"
                  loading="lazy"
                  src={currSettings.images.image3}
                  width="370"
                />
              </figure>
              <div className="abs-badge">
                <ion-icon aria-hidden="true" name="time-outline" />
                <span className="span">8 Weeks</span>
              </div>
              <div className="card-content">
                <span className="badge">Advanced</span>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    Familiar Yourself With Our Extensive Library Resources
                  </a>
                </h3>
                <div className="wrapper">
                  <div className="rating-wrapper">
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                  </div>
                  <p className="rating-text">(4.5 /9 Rating)</p>
                </div>
                <data className="price" value="49">
                  Available
                </data>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <BsFillBookFill style={{ color: "gray" }} />
                    <span className="span">12 Week Lessons</span>
                  </li>
                  <li className="card-meta-item">
                    <BsPeople style={{ color: "gray" }} />
                    <span className="span">120 Students</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div className="course-card">
              <figure
                className="card-banner img-holder"
                style={{
                  "--height": "220",
                  "--width": "370",
                }}
              >
                <img
                  alt="The Complete Camtasia Course for Content Creators"
                  className="img-cover"
                  height="220"
                  loading="lazy"
                  src={musicClass}
                  width="370"
                />
              </figure>
              <div className="abs-badge">
                <ion-icon aria-hidden="true" name="time-outline" />
                <span className="span">3 Weeks</span>
              </div>
              <div className="card-content">
                <span className="badge">Advanced</span>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    Fully Equipped Music Class
                  </a>
                </h3>
                <div className="wrapper">
                  <div className="rating-wrapper">
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                  </div>
                  <p className="rating-text">(4.9 /7 Rating)</p>
                </div>
                <data className="price" value="35">
                  Available
                </data>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <BsFillBookFill style={{ color: "gray" }} />
                    <span className="span">12 Week Lessons</span>
                  </li>
                  <li className="card-meta-item">
                    <BsPeople style={{ color: "gray" }} />
                    <span className="span">320 Students</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div className="course-card">
              <figure
                className="card-banner img-holder"
                style={{
                  "--height": "220",
                  "--width": "370",
                }}
              >
                <img
                  alt="The Complete Camtasia Course for Content Creators"
                  className="img-cover"
                  height="220"
                  loading="lazy"
                  src={currSettings.images.image6}
                  width="370"
                />
              </figure>
              <div className="abs-badge">
                <ion-icon aria-hidden="true" name="time-outline" />
                <span className="span">3 Weeks</span>
              </div>
              <div className="card-content">
                <span className="badge">Advanced</span>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    Multilingual Class (Language Class)
                  </a>
                </h3>
                <div className="wrapper">
                  <div className="rating-wrapper">
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                    <BsFillStarFill name="star" style={{ color: "gold" }} />
                  </div>
                  <p className="rating-text">(4.9 /7 Rating)</p>
                </div>
                <data className="price" value="35">
                  Available
                </data>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <BsFillBookFill style={{ color: "gray" }} />
                    <span className="span">12 Week Lessons</span>
                  </li>
                  <li className="card-meta-item">
                    <BsPeople style={{ color: "gray" }} />
                    <span className="span">320 Students</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
function FifthSection() {
  const { currSettings } = useTheme();

  return (
    <section
      aria-label="video"
      className="video has-bg-image"
      style={{
        backgroundImage: `url(${video})`,
      }}
    >
      <div className="container">
        <div className="video-card">
          <div className="video-banner img-holder has-after" style={{}}>
            <img
              alt="video banner"
              className="img-cover"
              height="550"
              loading="lazy"
              src={currSettings.images.image7}
              width="970"
            />
            <button aria-label="play video" className="play-btn">
              <BsFilePlay />
            </button>
          </div>

          <img
            alt=""
            className="shape video-shape-2"
            height="174"
            loading="lazy"
            src={videoShapeTwo}
            width="100"
          />
        </div>
      </div>
    </section>
  );
}
function SixthSection() {
  const { currSettings } = useTheme();
  return (
    <section aria-label="stats" className="section stats">
      <div className="container">
        <ul className="grid-list">
          <li>
            <div
              className="stats-card"
              style={{
                "--color": "170, 75%, 41%",
              }}
            >
              <h3 className="card-title">29.3k</h3>
              <p className="card-text">Student Enrolled</p>
            </div>
          </li>
          <li>
            <div
              className="stats-card"
              style={{
                "--color": "351, 83%, 61%",
              }}
            >
              <h3 className="card-title">32.4K</h3>
              <p className="card-text">Class Completed</p>
            </div>
          </li>
          <li>
            <div
              className="stats-card"
              style={{
                "--color": "260, 100%, 67%",
              }}
            >
              <h3 className="card-title">100%</h3>
              <p className="card-text">Satisfaction Rate</p>
            </div>
          </li>
          <li>
            <div
              className="stats-card"
              style={{
                "--color": "42, 94%, 55%",
              }}
            >
              <h3 className="card-title">354+</h3>
              <p className="card-text">Top Instructors</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function SeventhSection() {
  const { currSettings } = useTheme();
  return (
    <section
      aria-label="blog"
      className="section blog has-bg-image"
      id="blog"
      style={{
        backgroundImage: `url(${blog})`,
      }}
    >
      <div className="container">
        <p className="section-subtitle">Latest Articles</p>
        <h2 className="h2 section-title">
          Get News With {currSettings.schoolName}
        </h2>
        <ul className="grid-list">
          <li>
            <div className="blog-card">
              <figure
                className="card-banner img-holder has-after"
                style={{
                  "--height": "370",
                  "--width": "370",
                }}
              >
                <img
                  alt="Enhanced Learning Environments: Curriculum Integration"
                  className="img-cover"
                  height="370"
                  loading="lazy"
                  src={currSettings.images.image8}
                  width="370"
                />
              </figure>
              <div className="card-content">
                <a aria-label="read more" className="card-btn" href="#">
                  <ion-icon aria-hidden="true" name="arrow-forward-outline" />
                </a>
                <a className="card-subtitle" href="#">
                  Online
                </a>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    Enhanced Learning Environments: Curriculum Integration
                  </a>
                </h3>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <ion-icon aria-hidden="true" name="calendar-outline" />
                    <span className="span">Oct 10, 2025</span>
                  </li>
                  <li className="card-meta-item">
                    <ion-icon aria-hidden="true" name="chatbubbles-outline" />
                    <span className="span">Com 09</span>
                  </li>
                </ul>
                <p className="card-text"></p>
              </div>
            </div>
          </li>
          <li>
            <div className="blog-card">
              <figure
                className="card-banner img-holder has-after"
                style={{
                  "--height": "370",
                  "--width": "370",
                }}
              >
                <img
                  alt="Become A Better Blogger: Content Planning"
                  className="img-cover"
                  height="370"
                  loading="lazy"
                  src={currSettings.images.image9}
                  width="370"
                />
              </figure>
              <div className="card-content">
                <a aria-label="read more" className="card-btn" href="#">
                  <ion-icon aria-hidden="true" name="arrow-forward-outline" />
                </a>
                <a className="card-subtitle" href="#">
                  Online
                </a>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    Comprehensive Support Services: Student Success
                  </a>
                </h3>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <ion-icon aria-hidden="true" name="calendar-outline" />
                    <span className="span">Oct 10, 2025</span>
                  </li>
                  <li className="card-meta-item">
                    <ion-icon aria-hidden="true" name="chatbubbles-outline" />
                    <span className="span">Com 09</span>
                  </li>
                </ul>
                <p className="card-text"></p>
              </div>
            </div>
          </li>
          <li>
            <div className="blog-card">
              <figure
                className="card-banner img-holder has-after"
                style={{
                  "--height": "370",
                  "--width": "370",
                }}
              >
                <img
                  alt="Become A Better Blogger: Content Planning"
                  className="img-cover"
                  height="370"
                  loading="lazy"
                  src={currSettings.images.image10}
                  width="370"
                />
              </figure>
              <div className="card-content">
                <a aria-label="read more" className="card-btn" href="#">
                  <ion-icon aria-hidden="true" name="arrow-forward-outline" />
                </a>
                <a className="card-subtitle" href="#">
                  Online
                </a>
                <h3 className="h3">
                  <a className="card-title" href="#">
                    Global Perspectives: International Programs Comming Soon...
                  </a>
                </h3>
                <ul className="card-meta-list">
                  <li className="card-meta-item">
                    <ion-icon aria-hidden="true" name="calendar-outline" />
                    <span className="span">Oct 10, 2025</span>
                  </li>
                  <li className="card-meta-item">
                    <ion-icon aria-hidden="true" name="chatbubbles-outline" />
                    <span className="span">Com 09</span>
                  </li>
                </ul>
                <p className="card-text"></p>
              </div>
            </div>
          </li>
        </ul>
        <img
          alt=""
          className="shape blog-shape"
          height="186"
          loading="lazy"
          src={blogShape}
          width="186"
        />
      </div>
    </section>
  );
}
function Footer() {
  const { currSettings } = useTheme();
  return (
    <footer
      className="footer"
      style={{
        color: "white",
        backgroundImage: `url(${footerBg})`,
        backgroundAttachment: "none",
        backgroundSize: "cover",
      }}
    >
      <div className="footer-top section ">
        <div className="container grid-list " style={{ color: "lightgrey" }}>
          <div className="footer-brand">
            <a className="logo" href="#">
              <img
                alt="ois logo"
                height="200"
                src={currSettings.images.logo}
                width="150"
              />
            </a>
            <p className="footer-brand-text">
              Education makes the Difference. Empowering Young Minds to Shape a
              Brighter Future
            </p>
            <div className="wrapper">
              <span className="span">Add:</span>
              <address className="address">11 Boyo Road Sapele</address>
            </div>
            <div className="wrapper">
              <span className="span">Call:</span>
              <a className="footer-link" href="tel:+2349012720764">
                +2349012720764
              </a>
            </div>
            <div className="wrapper">
              <span className="span">Email:</span>
              <a className="footer-link" href="mailto: info@oisportal.com">
                info@oisportal.com
              </a>
            </div>
          </div>
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">School Platform</p>
            </li>
            <li>
              <a className="footer-link" href="#">
                About
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Courses
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Instructor
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Events
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Instructor Profile
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Purchase Guide
              </a>
            </li>
          </ul>
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Links</p>
            </li>
            <li>
              <a className="footer-link" href="#">
                Contact Us
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Gallery
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                News & Articles
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                FAQs
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Sign In/Registration
              </a>
            </li>
            <li>
              <a className="footer-link" href="#">
                Coming Soon
              </a>
            </li>
          </ul>
          <div className="footer-list">
            <p className="footer-list-title">Contacts</p>
            <p className="footer-list-text">
              Enter your email address to register to our newsletter
              subscription
            </p>
            <form action="" className="newsletter-form">
              <input
                className="input-field"
                name="email_address"
                placeholder="Your email"
                required
                type="email"
              />
              <button className="btn has-before" type="submit">
                <span className="span">Subscribe</span>
                <ion-icon aria-hidden="true" name="arrow-forward-outline" />
              </button>
            </form>
            <ul className="social-list">
              <li>
                <a className="social-link" href="#">
                  <ion-icon name="logo-facebook" />
                </a>
              </li>
              <li>
                <a className="social-link" href="#">
                  <ion-icon name="logo-linkedin" />
                </a>
              </li>
              <li>
                <a className="social-link" href="#">
                  <ion-icon name="logo-instagram" />
                </a>
              </li>
              <li>
                <a className="social-link" href="#">
                  <ion-icon name="logo-twitter" />
                </a>
              </li>
              <li>
                <a className="social-link" href="#">
                  <ion-icon name="logo-youtube" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p style={{ color: "white" }} className="copyright">
            Copyright 2024 All Rights Reserved by © Future Industries
          </p>
        </div>
      </div>
    </footer>
  );
}

function Main() {
  return (
    <article>
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <FifthSection />
      <SixthSection />
      <SeventhSection />
    </article>
  );
}

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Main />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
