import {readFile,writeFile} from "node:fs/promises";

const config=JSON.parse(await readFile(new URL("../automation.config.json",import.meta.url),"utf8"));
const outputUrl=new URL(`../${config.output}`,import.meta.url);
const existing=JSON.parse(await readFile(outputUrl,"utf8"));
const decode=value=>value.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
const tag=(item,name)=>decode(item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,"i"))?.[1]??"").trim();
const discovered=[];
for(const query of config.queries){
  const response=await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=mr&gl=IN&ceid=IN:mr`,{headers:{"user-agent":"DhamariArchive/1.0 (+https://github.com/CodingYetNahi/Dhamari)"}});
  if(!response.ok)throw new Error(`Search failed for ${query}: ${response.status}`);
  const xml=await response.text();
  for(const item of xml.match(/<item>[\s\S]*?<\/item>/gi)??[]){
    const title=tag(item,"title");const url=tag(item,"link");
    if(!title||!url)continue;
    discovered.push({title,url,source:tag(item,"source")||"Google News",publishedAt:tag(item,"pubDate"),query,status:"पडताळणी प्रलंबित"});
  }
}
const unique=new Map();
for(const result of [...existing,...discovered]){const key=`${result.url}`.replace(/[?#].*$/,"").replace(/\/$/,"").toLowerCase()||result.title.toLowerCase();if(!unique.has(key))unique.set(key,result)}
const updates=[...unique.values()].slice(0,config.maximumResults);
await writeFile(outputUrl,`${JSON.stringify(updates,null,2)}\n`);
console.log(`Wrote ${updates.length} review candidates to ${config.output}.`);
