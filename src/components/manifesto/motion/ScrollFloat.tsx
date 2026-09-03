"use client";
import { type ReactNode,useLayoutEffect,useRef } from "react";
import { configureGsap,gsap } from "@/lib/motion/gsap";
export default function ScrollFloat({children,className,strength="soft"}:{children:ReactNode;className?:string;strength?:"soft"|"strong"}){const ref=useRef<HTMLDivElement>(null);useLayoutEffect(()=>{if(!ref.current)return;configureGsap();const element=ref.current;const context=gsap.context(()=>{gsap.fromTo(element,{opacity:.58,scaleX:.97,scaleY:strength==="strong"?1.1:1.06,yPercent:8},{opacity:1,scaleX:1,scaleY:1,yPercent:0,ease:"none",scrollTrigger:{trigger:element,start:"top 78%",end:"top 38%",scrub:true}})},element);return()=>context.revert()},[strength]);return <div ref={ref} className={className}>{children}</div>}
