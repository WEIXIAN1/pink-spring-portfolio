"use client"

import { useEffect, useRef, useState } from "react"

const scenes = [
  { id: "hero", label: "Opening" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Practice" },
  { id: "projects", label: "Selected" },
  { id: "contact", label: "Contact" },
]

const projects = [
  {
    index: "01",
    type: "VIBE CODING / INTERACTIVE STORY",
    title: "甄嬛 MBTI 改命局",
    english: "Rewrite Your Character",
    note: "把人格训练做成一场有选择、有后果的宫廷叙事。",
    tags: "AI prototype · Narrative UX · Mobile",
    href: "https://weixian1.github.io/zhenhuan-mbti-mobile-demo/",
  },
  {
    index: "02",
    type: "BCI / RESEARCH",
    title: "睡眠 EEG 与抑郁早筛",
    english: "Signals Beneath Sleep",
    note: "从脑电微弱变化中，寻找可以被理解的健康线索。",
    tags: "EEG · PyTorch · MindSpore",
    href: "https://doi.org/10.15888/j.cnki.csa.009671",
  },
  {
    index: "03",
    type: "LLM / EMBODIED AI",
    title: "AI 机械臂科创体验",
    english: "Language Into Motion",
    note: "让一句自然语言指令，变成机械臂清晰、安全的动作反馈。",
    tags: "LLM · Prompt design · Education",
  },
]

export function CinematicPortfolio() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const posterPath = `${basePath}/media/spring-bullet-time-final.jpg`
  const videoPath = `${basePath}/media/spring-bullet-time.mp4`
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [activeScene, setActiveScene] = useState("hero")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const update = () => {
      rafRef.current = null
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const nextProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      const video = videoRef.current

      setProgress(nextProgress)
      if (video?.duration && Number.isFinite(video.duration)) {
        video.currentTime = nextProgress * Math.max(0, video.duration - 0.04)
      }

      let nearest = scenes[0].id
      let nearestDistance = Number.POSITIVE_INFINITY
      for (const scene of scenes) {
        const element = document.getElementById(scene.id)
        if (!element) continue
        const rect = element.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const distance = Math.abs(rect.top - viewportHeight * 0.42)
        const travel = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)))
        const centerDistance = Math.abs(rect.top + rect.height * 0.5 - viewportHeight * 0.5)
        const visibility = Math.min(1, Math.max(0, 1 - centerDistance / (viewportHeight * 0.82)))
        const easedVisibility = visibility * visibility * (3 - 2 * visibility)

        element.style.setProperty("--scene-travel", travel.toFixed(4))
        element.style.setProperty("--scene-opacity", easedVisibility.toFixed(4))
        element.style.setProperty("--scene-blur", `${((1 - easedVisibility) * 13).toFixed(2)}px`)
        element.style.setProperty("--scene-shift", `${((0.5 - travel) * 150).toFixed(2)}px`)
        element.style.setProperty("--scene-scale", (0.985 + easedVisibility * 0.015).toFixed(4))
        element.style.setProperty("--cue-opacity", Math.max(0, 1 - travel * 2.3).toFixed(4))
        element.style.setProperty("--cue-shift", `${(travel * -45).toFixed(2)}px`)
        element.style.setProperty("--row-opacity", (0.18 + easedVisibility * 0.82).toFixed(4))
        element.style.setProperty("--row-shift", `${((1 - easedVisibility) * 38).toFixed(2)}px`)
        element.toggleAttribute("data-scene-active", easedVisibility > 0.45)

        if (distance < nearestDistance) {
          nearest = scene.id
          nearestDistance = distance
        }
      }
      setActiveScene(nearest)
    }

    const requestUpdate = () => {
      if (rafRef.current === null) rafRef.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <main className={`cinematic-site ${ready ? "is-ready" : ""}`}>
      <div className="film-stage" aria-hidden="true">
        <div className="film-fallback" style={{ backgroundImage: `url("${posterPath}")` }} />
        <video
          ref={videoRef}
          className="film-video"
          muted
          playsInline
          preload="auto"
          poster={posterPath}
          onLoadedMetadata={(event) => {
            event.currentTarget.currentTime = 0.01
            setReady(true)
          }}
          onError={() => setReady(true)}
        >
          <source src={videoPath} type="video/mp4" />
        </video>
        <div className="film-wash" />
        <div className="film-grain" />
      </div>

      <header className="site-header">
        <a className="monogram" href="#hero" aria-label="Back to opening">ZJH</a>
        <nav aria-label="Main navigation">
          {scenes.slice(1).map((scene) => (
            <a key={scene.id} className={activeScene === scene.id ? "active" : ""} href={`#${scene.id}`}>
              {scene.label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="mailto:3342764301@qq.com">Let&apos;s talk <span>↗</span></a>
      </header>

      <aside className="scene-rail" aria-label="Scene progress">
        <span className="scene-number">{String(scenes.findIndex((scene) => scene.id === activeScene) + 1).padStart(2, "0")}</span>
        <div className="scene-track"><i style={{ height: `${Math.max(2, progress * 100)}%` }} /></div>
        <span className="scene-number">06</span>
      </aside>

      <section id="hero" className="story-section hero-scene">
        <div className="hero-copy">
          <p className="eyebrow">AI PRODUCT · CREATIVE TECHNOLOGY · 2026</p>
          <h1>张嘉慧<span>Designing ideas</span><em>into experience.</em></h1>
          <p className="hero-intro">欢迎来到我的春日存档。<br />一些想法在这里发芽，一些故事正在慢慢盛开。</p>
        </div>
        <div className="scroll-cue"><span>SCROLL TO BEND TIME</span><i /></div>
      </section>

      <section id="about" className="story-section align-right">
        <article className="glass-note">
          <p className="eyebrow">01 / ABOUT · 关于</p>
          <h2>Curiosity is the first prototype.</h2>
          <p>人工智能本科背景，香港中文大学（深圳）金融科技方向硕士拟入学。我关心复杂技术如何被转译成有温度、可理解、愿意被使用的体验。</p>
          <div className="micro-grid"><span>AI Product</span><span>AIGC Prototype</span><span>Research</span></div>
        </article>
      </section>

      <section id="journey" className="story-section align-left">
        <article className="glass-note">
          <p className="eyebrow">02 / JOURNEY · 路径</p>
          <h2>From signals to stories.</h2>
          <div className="timeline-list">
            <div><time>2026 — 2028</time><h3>金融科技 · CUHK(SZ)</h3><p>让 AI 进入更真实、更审慎的业务场景。</p></div>
            <div><time>2023 — 2026</time><h3>Brain-Computer Interface</h3><p>研究睡眠 EEG、抑郁早筛与信号理解。</p></div>
            <div><time>2022 — NOW</time><h3>AI × Product × Story</h3><p>持续把想法做成可以亲手体验的原型。</p></div>
          </div>
        </article>
      </section>

      <section id="skills" className="story-section align-right">
        <article className="glass-note">
          <p className="eyebrow">03 / PRACTICE · 能力</p>
          <h2>Thinking across disciplines.</h2>
          <div className="skill-list">
            <div><span>01</span><strong>AI Product Strategy</strong><small>需求洞察 · 场景定义 · 产品原型</small></div>
            <div><span>02</span><strong>Creative Development</strong><small>Vibe Coding · Interaction · AIGC</small></div>
            <div><span>03</span><strong>Machine Learning</strong><small>Python · PyTorch · EEG · LLM</small></div>
          </div>
        </article>
      </section>

      <section id="projects" className="story-section projects-scene">
        <div className="projects-wrap">
          <div className="section-heading"><p className="eyebrow">04 / SELECTED WORK · 作品</p><h2>Ideas, made tangible.</h2></div>
          <div className="project-list">
            {projects.map((project) => {
              const content = <><span>{project.index}</span><div><small>{project.type}</small><h3>{project.title}</h3><em>{project.english}</em><p>{project.note}</p><b>{project.tags}</b></div><strong>{project.href ? "↗" : "·"}</strong></>
              return project.href ? <a key={project.index} className="project-row" href={project.href} target="_blank" rel="noreferrer">{content}</a> : <div key={project.index} className="project-row">{content}</div>
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="story-section contact-scene">
        <div className="contact-copy">
          <p className="eyebrow">05 / CONTACT · 联系</p>
          <h2>Let&apos;s make<br />something <em>felt.</em></h2>
          <p>下一次有趣的相遇，也许从一封邮件开始。</p>
          <a href="mailto:3342764301@qq.com">3342764301@qq.com <span>↗</span></a>
        </div>
        <footer><span>ZHANG JIAHUI · PORTFOLIO 2026</span><span>AI PRODUCT / CREATIVE TECHNOLOGY</span></footer>
      </section>
    </main>
  )
}
