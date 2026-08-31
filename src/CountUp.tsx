import {useEffect,useRef,useState} from "react";

const toMarathiDigits=(value:string)=>value.replace(/\d/g,d=>"०१२३४५६७८९"[Number(d)]);

type CountUpProps={
  value:number;
  decimals?:number;
  duration?:number;
};

export function CountUp({value,decimals=0,duration=1350}:CountUpProps){
  const [display,setDisplay]=useState(0);
  const ref=useRef<HTMLSpanElement>(null);

  useEffect(()=>{
    const node=ref.current;
    if(!node)return;
    let frame:number|undefined;
    let hasRun=false;
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish=()=>setDisplay(value);
    if(reducedMotion){finish();return;}

    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting||hasRun)return;
      hasRun=true;
      observer.disconnect();
      const start=performance.now();
      const animate=(now:number)=>{
        const progress=Math.min((now-start)/duration,1);
        setDisplay(value*(1-Math.pow(1-progress,3)));
        if(progress<1)frame=requestAnimationFrame(animate);
        else finish();
      };
      frame=requestAnimationFrame(animate);
    },{threshold:.35});
    observer.observe(node);
    return()=>{observer.disconnect();if(frame!==undefined)cancelAnimationFrame(frame);};
  },[decimals,duration,value]);

  return <span ref={ref}>{toMarathiDigits(display.toLocaleString("en-IN",{minimumFractionDigits:decimals,maximumFractionDigits:decimals}))}</span>;
}
