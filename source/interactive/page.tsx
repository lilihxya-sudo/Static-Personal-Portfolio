"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Mail, MapPin, Phone } from "lucide-react";

const media = {
  miraiWide: ["/media/mirai-wide-01.png", "/media/mirai-wide-02.png", "/media/mirai-wide-03.png"],
  miraiPosters: ["/media/mirai-poster-01.png", "/media/mirai-poster-02.png"],
  gameWide: ["/media/game-hero.png", "/media/game-wide-01.png", "/media/game-wide-02.png", "/media/game-summer-wide.png"],
  gameCards: ["/media/game-card-01.png", "/media/game-card-02.png"],
};

const imageSet=(folder:string,count:number)=>Array.from({length:count},(_,i)=>"/portfolio-assets/"+folder+"/"+String(i+1).padStart(3,"0")+".webp");
const videoSet=(folder:string,count:number)=>Array.from({length:count},(_,i)=>"/portfolio-assets/"+folder+"/"+String(i+1).padStart(3,"0")+".mp4");

function Rail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (direction: number) => ref.current?.scrollBy({ left: direction * Math.min(innerWidth * 0.72, 980), behavior: "smooth" });
  return (
    <div className="rail-wrap">
      <div className="rail-controls" aria-label={`${label} 切换`}>
        <button onClick={() => move(-1)} aria-label="向左"><ChevronLeft /></button>
        <button onClick={() => move(1)} aria-label="向右"><ChevronRight /></button>
      </div>
      <div className="media-rail" ref={ref}>{children}</div>
    </div>
  );
}

function SectionTitle({ no, eyebrow, title, dark = false }: { no: string; eyebrow: string; title: string; dark?: boolean }) {
  return <div className={`section-title ${dark ? "inverse" : ""}`}><span>{no}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></div>;
}

export default function Home() {
  const [miraiTab,setMiraiTab]=useState<"images"|"videos">("images");
  useEffect(()=>{const stop=(e:Event)=>e.preventDefault();document.addEventListener("contextmenu",stop);document.addEventListener("dragstart",stop);return()=>{document.removeEventListener("contextmenu",stop);document.removeEventListener("dragstart",stop)}},[]);
  return (
    <main>
      <section className="hero" id="home">
        <div className="hero-art" />
        <div className="hero-shade" />
        <nav className="nav shell">
          <a className="mark" href="#home" aria-label="返回首页">LHX<span>.</span></a>
          <div className="nav-links"><a href="#work">作品</a><a href="#about">关于</a><a href="#contact">联系</a></div>
          <div className="talk-wrap"><a className="glass-button" href="#contact">一起聊聊 <ArrowRight size={16} /></a><span>微信：yue66666789</span></div>
        </nav>
        <div className="hero-copy shell">
          <p className="kicker">VISUAL / MOTION PORTFOLIO</p>
          <h1>Portfolio</h1><h3>李宏鑫</h3><p className="hero-school">北京化工大学</p>
          <p className="hero-intro">用影像与设计，让创意连接现实。<br />让想象，成为可能。</p>
        </div>
        <a className="scroll-cue" href="#work"><span><ArrowDown size={18} /></span>SCROLL TO EXPLORE</a>
        <div className="hero-index"><span>BEIJING</span><span>2026 PORTFOLIO</span></div>
      </section>

      <section className="catalog" id="work">
        <div className="shell">
          <SectionTitle no="01" eyebrow="Selected Works" title="作品目录" dark />
          <p className="catalog-lead">四种尺度，一套方法。<br />从增长素材到品牌叙事。</p>
          <div className="catalog-grid">
            {[
              ["01", "Miraimind", "海外 AI 广告创意", "/media/mirai-cover.png", "AIGC · Video Ads"],
              ["02", "产品广告", "动态图像与质感表达", "/media/hero-product.mp4", "Product Film · Motion"],
              ["03", "公司关怀活动", "企业文化与活动内容", "/media/culture-beijing.mp4", "Brand · Culture"],
              ["04", "妖怪代行", "游戏图片素材设计", "/media/game-hero.png", "Game Art · Key Visual"],
            ].map(([no, name, desc, src, tag]) => (
              <a className="catalog-card" href={`#project-${no}`} key={no}>
                {src.endsWith(".mp4") ? <video src={src} muted autoPlay loop playsInline /> : <img src={src} alt="" />}
                <div className="card-wash" /><span className="card-no">{no}</span><span className="card-arrow"><ArrowRight size={16} /></span>
                <div className="card-copy"><h3>{name}</h3><p>{desc}</p><small>{tag}</small></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="project light" id="project-01">
        <div className="shell project-head"><SectionTitle no="01" eyebrow="AI Creative / Performance Ads" title="Miraimind 海外广告" /><div className="project-note"><p>围绕角色关系与情绪钩子，用 AIGC 快速验证不同创意方向。</p><span>创意策划 · 素材生成 · 版本迭代</span></div></div>
        <div className="shell archive-block"><img className="brand-logo" src="/portfolio-assets/brand/miraimind.png" alt="Miraimind Logo" /><div className="archive-tabs"><button className={miraiTab==="images"?"active":""} onClick={()=>setMiraiTab("images")}>图片</button><button className={miraiTab==="videos"?"active":""} onClick={()=>setMiraiTab("videos")}>视频</button></div>{miraiTab==="images"?<div className="archive-grid">{imageSet("mirai/images",51).map(src=><img key={src} src={src} alt="" loading="lazy" />)}</div>:<div className="archive-videos">{videoSet("mirai/videos",33).map(src=><video key={src} src={src} controls playsInline preload="metadata" controlsList="nodownload" />)}</div>}</div>
      </section>

      <section className="project blue" id="project-02">
        <div className="shell project-head"><SectionTitle no="02" eyebrow="Product Advertising" title="产品广告" dark /><div className="project-note inverse"><p>用克制的镜头语言呈现产品力量与未来质感。</p><span>概念视觉 · Motion · 剪辑</span></div></div>
        <div className="shell product-stage"><video src="/media/hero-product.mp4" controls playsInline preload="metadata" /><div className="stage-label"><span>PRODUCT FILM</span><strong>超能</strong><p>在光、材质与运动之间，建立产品的情绪记忆。</p></div></div>
        <div className="shell archive-videos">{videoSet("product/videos",1).map(src=><video key={src} src={src} controls playsInline preload="metadata" controlsList="nodownload" />)}</div>
      </section>

      <section className="project light" id="project-03">
        <div className="shell project-head"><SectionTitle no="03" eyebrow="Brand & Culture" title="公司关怀活动" /><div className="project-note"><p>把企业文化从内部信息，转译成愿意被观看的内容。</p><span>内容策划 · 拍摄剪辑 · AIGC</span></div></div>
        <div className="shell"><Rail label="品牌视频">{[["/media/culture-beijing.mp4","AI 北京地标"],["/media/culture-ai-story.mp4","AI 创意故事"],["/media/culture-ai-tool.mp4","AI 助力内容"]].map(([src,title])=><figure className="video-card" key={src}><video src={src} controls playsInline preload="metadata" /><figcaption><strong>{title}</strong><span>Company Culture / Motion</span></figcaption></figure>)}</Rail></div>
        <div className="shell archive-videos">{videoSet("culture/videos",5).map(src=><video key={src} src={src} controls playsInline preload="metadata" controlsList="nodownload" />)}</div>
      </section>

      <section className="project game" id="project-04">
        <div className="shell project-head"><SectionTitle no="04" eyebrow="Game Creative" title="妖怪代行 · 游戏图片素材" dark /><div className="project-note inverse"><p>在都市日常与幻想世界之间，塑造具有叙事张力的角色视觉。</p><span>Key Visual · Character · Social Media</span></div></div>
        <div className="shell"><Rail label="游戏横版视觉">{media.gameWide.map((src,i)=><figure className="game-frame" key={src}><img src={src} alt={`妖怪代行横版视觉 ${i+1}`} /><figcaption>KEY VISUAL <span>0{i+1}</span></figcaption></figure>)}</Rail></div>
        <div className="shell game-cards"><div><span className="tiny">SOCIAL VISUAL</span><h3>同一世界观，<br />不同内容触点。</h3></div>{media.gameCards.map((src,i)=><img key={src} src={src} alt={`妖怪代行竖版角色卡 ${i+1}`} />)}</div>
        <img className="brand-logo game-logo" src="/portfolio-assets/brand/game.png" alt="妖怪代行 Logo" />
        <div className="shell archive-grid dark-grid">{imageSet("game/images",71).map(src=><img key={src} src={src} alt="" loading="lazy" />)}</div>
      </section>

      <section className="about" id="about">
        <div className="shell"><SectionTitle no="05" eyebrow="About / Experience" title="从洞察到落地" /><div className="about-grid about-grid-clean"><div className="timeline">
          {[
            ["2026.06 — 2026.09","北京陌陌科技有限公司","AI 产品运营实习生","海外 AI 产品全链路营销、AIGC 素材生成与投放迭代"],
            ["2025.12 — 2026.05","北京石头世纪科技股份有限公司","企业文化实习生","公众号内容、活动海报、宣传视频与跨部门项目协作"],
            ["2025.06 — 2025.09","北京万惠通文化传媒有限公司","广告设计","社媒运营、视觉包装与活动影像制作"],
            ["2024.07 — 2024.09","九康正和（北京）医疗科技有限公司","产品助理","电商视觉、商品上架与产品宣传视频"],
          ].map(([date,company,role,desc])=><article key={company}><time>{date}</time><div><h3>{company}</h3><span>{role}</span><p>{desc}</p></div></article>)}
        </div></div><div className="skill-row"><span>Product Strategy</span><span>AIGC Workflow</span><span>Visual Design</span><span>Motion / 3D</span><span>Data Analysis</span></div></div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-orb" /><div className="shell contact-inner"><p className="kicker">OPEN TO NEW POSSIBILITIES</p><h2>一起把下一个想法，<br /><em>做成真实的体验。</em></h2><a className="contact-mail" href="weixin://dl/chat?yue66666789">微信：yue66666789 <ArrowRight /></a><div className="contact-meta"><span><Phone size={17} />18834780127</span><span><Mail size={17} />Email</span><span><MapPin size={17} />北京</span></div><div className="footer-line"><span>LHX. AI / PRODUCT DESIGN</span><span>© 2026 李宏鑫</span></div></div>
      </footer>
    </main>
  );
}
