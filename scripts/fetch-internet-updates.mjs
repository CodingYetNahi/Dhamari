import {readFile,writeFile} from "node:fs/promises";
import {mergeUpdates} from "./internet-updates.mjs";

const config=JSON.parse(await readFile(new URL("../automation.config.json",import.meta.url),"utf8"));
const outputUrl=new URL(`../${config.output}`,import.meta.url);
const original=await readFile(outputUrl,"utf8");
const existing=JSON.parse(original);
const decode=value=>String(value??"").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/&#(x?[0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n.replace(/^x/i,""),/^x/i.test(n)?16:10))).replace(/&(amp|quot|apos|lt|gt);/g,(_,n)=>({amp:"&",quot:'"',apos:"'",lt:"<",gt:">"})[n]);
const tag=(item,name)=>decode(item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,"i"))?.[1]).trim();
const sourceInfo=item=>{const match=item.match(/<source(?:\s+url=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/source>/i);return {publisherUrl:decode(match?.[1]).trim(),source:decode(match?.[2]).trim()||"Google News"};};
const textContent=value=>decode(value).replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const required=(config.requiredTerms??[]).map(term=>String(term).toLocaleLowerCase("mr"));
const excluded=(config.excludedTerms??[]).map(term=>String(term).toLocaleLowerCase("mr"));
const discovered=[];let successfulQueries=0;

for(const query of config.queries){
  try{
    const response=await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=mr&gl=IN&ceid=IN:mr`,{headers:{"user-agent":"DhamariArchive/1.0 (+https://github.com/CodingYetNahi/Dhamari)"},signal:AbortSignal.timeout(config.timeoutMilliseconds??12000)});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const xml=await response.text();successfulQueries++;
    for(const item of xml.match(/<item>[\s\S]*?<\/item>/gi)??[]){
      const title=tag(item,"title"),sourceUrl=tag(item,"link"),description=textContent(tag(item,"description")),haystack=`${title} ${description}`.toLocaleLowerCase("mr");
      const publishedAt=tag(item,"pubDate"),publishedTime=Date.parse(publishedAt),maximumAge=(config.maximumArticleAgeDays??30)*86400000;
      if(!title||!sourceUrl||!required.some(term=>haystack.includes(term))||excluded.some(term=>haystack.includes(term)))continue;
      if(!Number.isFinite(publishedTime)||Date.now()-publishedTime>maximumAge||publishedTime>Date.now()+86400000)continue;
      const source=sourceInfo(item);
      discovered.push({title,source:source.source,sourceUrl,publisherUrl:source.publisherUrl||undefined,publishedAt,queries:[query],status:"पडताळणी प्रलंबित"});
    }
  }catch(error){console.warn(`Warning: search failed for ${query}: ${error.message}`);}
}
if(successfulQueries===0)throw new Error("Every configured search query failed; stored records were left unchanged.");
const now=new Date().toISOString();
const candidates=mergeUpdates([],discovered,{maximumStoredResults:config.maximumNewResultsPerRun??15,now});
const updates=mergeUpdates(existing,candidates,{maximumStoredResults:config.maximumStoredResults??120,now});
const rendered=`${JSON.stringify(updates,null,2)}\n`;
if(rendered===original)console.log("No new articles or query matches; file left unchanged.");
else{await writeFile(outputUrl,rendered);console.log(`Wrote ${updates.length} review candidates to ${config.output}.`);}
