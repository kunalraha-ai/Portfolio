import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";
import { HeroRealm } from "@/components/hero-realm";
import { SiteNav } from "@/components/site-nav";
import { links, metrics, projects, skills } from "@/content/portfolio";
import portrait from "@/public/images/kunal-raha.png";
import observatory from "@/public/images/observatory.png";
import geminiLogo from "@/public/images/gemini-ambassador.png";
import tinyfishPoster from "@/public/images/tinyfish-acceptance.png";

const iconSize = 18;

function ExternalIcon() {
  return (
    <span className="button-icon" aria-hidden="true">
      <ArrowUpRight size={iconSize} weight="light" />
    </span>
  );
}

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kunal Raha",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: [links.github, links.linkedin],
    email: "kunal.raha.ai@gmail.com",
    jobTitle: "AI Systems Engineer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Alard College of Engineering & Management",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Autonomous Agents",
      "Python",
      "Golang",
      "React",
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Kunal Raha / AI systems engineer</p>
            <h1 id="hero-title">
              <span>Autonomous AI.</span>
              <span>Real-world impact.</span>
            </h1>
            <p className="hero-intro">
              I turn complex AI workflows into fast, dependable products that people can actually use.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                View work
                <span className="button-icon" aria-hidden="true">
                  <ArrowRight size={iconSize} weight="light" />
                </span>
              </a>
              <a className="button button-secondary" href={links.resume} download>
                Résumé
                <span className="button-icon" aria-hidden="true">
                  <DownloadSimple size={iconSize} weight="light" />
                </span>
              </a>
            </div>
          </div>

          <div className="hero-portrait">
            <HeroRealm />
            <div className="portrait-bezel">
              <div className="portrait-core">
                <Image
                  src={portrait}
                  alt="Kunal Raha"
                  fill
                  fetchPriority="high"
                  placeholder="blur"
                  sizes="(max-width: 767px) 78vw, (max-width: 1100px) 42vw, 520px"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="proof-strip section-shell" aria-label="Selected impact metrics">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>

        <section id="work" className="work-section section-shell section-reveal" aria-labelledby="work-title">
          <div className="section-heading">
            <h2 id="work-title">The Quest Log</h2>
            <p>Production systems, autonomous pipelines, and open-source work with measurable outcomes.</p>
          </div>

          <article className="feature-project bezel">
            <div className="feature-project-inner">
              <div className="feature-copy">
                <p className="project-kicker">Flagship build</p>
                <h3>{projects.omniprocure.name}</h3>
                <p className="project-descriptor">{projects.omniprocure.descriptor}</p>
                <p className="project-summary">{projects.omniprocure.summary}</p>
                <ul className="achievement-grid">
                  {projects.omniprocure.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
                <a className="text-link" href={projects.omniprocure.href} target="_blank" rel="noreferrer">
                  View repository
                  <ExternalIcon />
                </a>
              </div>

              <div className="project-visual">
                <Image
                  src={observatory}
                  alt="A moonlit medieval observatory representing the OmniProcure system architecture"
                  fill
                  placeholder="blur"
                  sizes="(max-width: 900px) 100vw, 48vw"
                />
                <div className="visual-scrim" />
              </div>
            </div>
          </article>

          <div className="secondary-work">
            <article className="crowd-project bezel">
              <div className="crowd-project-inner">
                <div>
                  <p className="project-kicker">Agent pipeline</p>
                  <h3>{projects.crowdWisdom.name}</h3>
                  <p className="project-descriptor">{projects.crowdWisdom.descriptor}</p>
                  <p>{projects.crowdWisdom.summary}</p>
                </div>
                <div className="constellation" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <ul className="compact-list">
                  {projects.crowdWisdom.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
                <a className="text-link" href={projects.crowdWisdom.href} target="_blank" rel="noreferrer">
                  View repository
                  <ExternalIcon />
                </a>
              </div>
            </article>

            <article className="open-source-project">
              <div className="open-source-mark" aria-hidden="true">
                <GithubLogo size={34} weight="light" />
              </div>
              <div>
                <p className="project-kicker">Open source</p>
                <h3>{projects.opensre.name}</h3>
                <p className="project-descriptor">{projects.opensre.descriptor}</p>
                <p>{projects.opensre.summary}</p>
              </div>
              <a
                className="round-link"
                href={projects.opensre.href}
                target="_blank"
                rel="noreferrer"
                aria-label="View Tracer-Cloud opensre on GitHub"
              >
                <ArrowUpRight size={22} weight="light" aria-hidden="true" />
              </a>
            </article>
          </div>
        </section>

        <section
          id="recognition"
          className="recognition-section section-shell section-reveal"
          aria-labelledby="recognition-title"
        >
          <p className="eyebrow">Recognition earned in 2026</p>
          <div className="section-heading">
            <h2 id="recognition-title">Guild Honors</h2>
            <p>Selected to represent, teach, and build within ambitious AI communities.</p>
          </div>

          <div className="recognition-grid">
            <article className="gemini-honor bezel">
              <div className="honor-inner">
                <div className="gemini-logo-wrap">
                  <Image
                    src={geminiLogo}
                    alt="Google Student Ambassador"
                    sizes="(max-width: 767px) 80vw, 42vw"
                  />
                </div>
                <div>
                  <h3>Google Gemini Student Ambassador</h3>
                  <p>
                    Led workshops, technical visits, and product demonstrations while helping students adopt practical AI workflows.
                  </p>
                </div>
                <span className="honor-year">2026</span>
              </div>
            </article>

            <article className="tinyfish-honor bezel">
              <div className="honor-inner">
                <a
                  className="poster-frame"
                  href="https://tinyfish.ai/accelerator"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit the TinyFish Accelerator website"
                >
                  <Image
                    src={tinyfishPoster}
                    alt="TinyFish Accelerator Phase 2 acceptance poster"
                    placeholder="blur"
                    sizes="(max-width: 767px) 92vw, 50vw"
                  />
                </a>
                <div className="tinyfish-copy">
                  <span className="honor-year">Cohort 2026</span>
                  <h3>TinyFish Accelerator</h3>
                  <p>
                    OmniProcure was selected in the top 4% of more than 2,000 applicants, then refined through direct client sprint feedback.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="arsenal" className="arsenal-section section-shell section-reveal" aria-labelledby="arsenal-title">
          <div className="section-heading">
            <h2 id="arsenal-title">The Arsenal</h2>
            <p>Tools selected for reliability, speed, and clear ownership across the stack.</p>
          </div>

          <div className="skill-map">
            {skills.map((group, index) => (
              <article className={`skill-group skill-group-${index + 1}`} key={group.title}>
                <h3>{group.title}</h3>
                <div className="skill-list">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="about-section section-shell section-reveal" aria-labelledby="about-title">
          <div className="about-index" aria-hidden="true">
            KR
          </div>
          <div className="about-copy">
            <h2 id="about-title">Engineering with an operator&apos;s mindset.</h2>
            <p className="about-lead">
              I build across model workflows, backend systems, infrastructure, and interfaces because production problems rarely stay inside one layer.
            </p>
            <p>
              I am pursuing a Bachelor of Engineering in Artificial Intelligence and Machine Learning at Alard College of Engineering &amp; Management, SPPU, from 2024 to 2028.
            </p>
          </div>
          <div className="education-seal">
            <span>B.E.</span>
            <p>Artificial Intelligence &amp; Machine Learning</p>
            <strong>2024-2028</strong>
          </div>
        </section>

        <section id="contact" className="contact-section section-shell section-reveal" aria-labelledby="contact-title">
          <div className="contact-copy">
            <h2 id="contact-title">Have a difficult system worth building?</h2>
            <p>I am open to ambitious AI engineering work, product collaborations, and research-driven opportunities.</p>
          </div>
          <div className="contact-actions">
            <a className="button button-primary contact-button" href={links.email}>
              Contact
              <span className="button-icon" aria-hidden="true">
                <EnvelopeSimple size={iconSize} weight="light" />
              </span>
            </a>
            <nav className="social-links" aria-label="Social profiles">
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubLogo size={21} weight="light" aria-hidden="true" />
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinLogo size={21} weight="light" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <span>Kunal Raha</span>
        <a href={links.email}>kunal.raha.ai@gmail.com</a>
        <span>Built with Next.js and Three.js</span>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
