// TEMPORARY on-device test for the iOS Safari status-bar strip. Open any page
// with ?viewport-debug (?viewport-debug=off to stop). Unlike the first test
// panel, every option is applied by an inline script before first paint, so a
// tested combination behaves exactly as it would if shipped. Remove once the
// strip is solved.

import { InlineScript } from "@/components/inline-script";
import { StatusBarPanel } from "./status-bar-panel";

// detect: "load" = grain under the header from the start (what's live now);
// "off" = grain above the header (Safari never sees it);
// "load-late" / "scroll-late" = start like "off", then put the grain under the
// header 1s after load / once the visitor stops scrolling past the warning.
const script = `(function(){try{
var K="vh-sbt",q=new URLSearchParams(location.search).get("viewport-debug");
if(q==="off"){sessionStorage.removeItem(K);return}
if(q!==null&&sessionStorage.getItem(K)===null)sessionStorage.setItem(K,"{}");
var raw=sessionStorage.getItem(K);if(raw===null)return;
if(sessionStorage.getItem(K+"-top")){sessionStorage.removeItem(K+"-top");history.scrollRestoration="manual"}
var t=JSON.parse(raw)||{},h=document.documentElement,d=t.detect||"load";
h.dataset.sbt="";h.dataset.sbtDetect=d;
if(t.band)h.dataset.sbtBand="";
h.style.setProperty("--sbt-pad",(t.pad||0)+"px");
var on=function(){h.dataset.sbtDetect="on"};
if(d==="load-late")addEventListener("load",function(){setTimeout(on,1000)});
if(d==="scroll-late"){var tm=0,f=function(){clearTimeout(tm);tm=setTimeout(function(){if(scrollY>300){on();removeEventListener("scroll",f)}},400)};addEventListener("scroll",f,{passive:true})}
}catch(e){}})()`;

const css = `
html[data-sbt-detect="off"] body::after,
html[data-sbt-detect="load-late"] body::after,
html[data-sbt-detect="scroll-late"] body::after { z-index: 200; }
@media (width < 64rem) {
  html[data-sbt-band] #site > header::before {
    content: ""; position: absolute; inset-inline: 0; bottom: 100%; height: 8rem;
    background: var(--color-ink-900); pointer-events: none;
  }
  html[data-sbt-stuck] #site > header {
    padding-top: var(--sbt-pad);
    margin-bottom: calc(-1 * var(--sbt-pad));
  }
}`;

export function StatusBarTest() {
  return (
    <>
      <InlineScript html={script} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <StatusBarPanel />
    </>
  );
}
