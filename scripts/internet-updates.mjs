import {createHash} from "node:crypto";

const TRACKING_PARAMETER=/^(utm_.+|fbclid|gclid|oc)$/i;
const STATUS="पडताळणी प्रलंबित";

export function canonicalUrl(value){
  if(typeof value!=="string"||!value.trim())return "";
  try{
    const url=new URL(value.trim());
    if(!/^https?:$/.test(url.protocol))return "";
    url.hostname=url.hostname.toLowerCase();
    url.hash="";
    for(const key of [...url.searchParams.keys()])if(TRACKING_PARAMETER.test(key))url.searchParams.delete(key);
    url.searchParams.sort();
    if(url.pathname!=="/")url.pathname=url.pathname.replace(/\/+$/g,"");
    return url.toString();
  }catch{return "";}
}

export function titleFingerprint(title,publisher=""){
  let normal=String(title??"").normalize("NFKC").toLowerCase();
  const escaped=String(publisher??"").normalize("NFKC").trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  if(escaped)normal=normal.replace(new RegExp(`\\s*[-–—|]\\s*${escaped}\\s*$`,"iu"),"");
  else normal=normal.replace(/\s+[-–—|]\s+[^-–—|]+$/u,"");
  return normal.replace(/[^\p{L}\p{N}]+/gu," ").trim().replace(/\s+/g," ");
}

const validDate=value=>{const time=Date.parse(value);return Number.isFinite(time)?new Date(time).toISOString():"";};
const identityTuple=record=>`${titleFingerprint(record.title,record.source)}\n${String(record.source??"").normalize("NFKC").toLowerCase().trim()}\n${validDate(record.publishedAt)}`;
export function stableId(record){
  const url=canonicalUrl(record.sourceUrl);
  return createHash("sha256").update(url||identityTuple(record)).digest("hex");
}

export function migrateRecord(record,now){
  const sourceUrl=canonicalUrl(record.sourceUrl??record.url);
  const publishedAt=validDate(record.publishedAt);
  const queries=Array.isArray(record.queries)?record.queries:record.query?[record.query]:[];
  const migrated={id:"",title:String(record.title??"").trim(),source:String(record.source??"Google News").trim()||"Google News",sourceUrl,publishedAt,firstDiscoveredAt:validDate(record.firstDiscoveredAt) || now,queries:[...new Set(queries.map(String).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"mr")),status:STATUS};
  if(record.publisherUrl)migrated.publisherUrl=canonicalUrl(record.publisherUrl)||record.publisherUrl;
  migrated.id=stableId(migrated);
  return migrated;
}

function matchKey(record){return `${titleFingerprint(record.title,record.source)}\n${record.source.normalize("NFKC").toLowerCase()}\n${record.publishedAt}`;}
export function mergeUpdates(existing,discovered,{maximumStoredResults=120,now=new Date().toISOString()}={}){
  const output=[];
  for(const raw of [...existing,...discovered]){
    const record=migrateRecord(raw,now);
    if(!record.title||!record.sourceUrl)continue;
    const url=canonicalUrl(record.sourceUrl), tuple=matchKey(record);
    const found=output.find(item=>canonicalUrl(item.sourceUrl)===url||matchKey(item)===tuple);
    if(found){
      found.queries=[...new Set([...found.queries,...record.queries])].sort((a,b)=>a.localeCompare(b,"mr"));
      if(Date.parse(record.firstDiscoveredAt)<Date.parse(found.firstDiscoveredAt))found.firstDiscoveredAt=record.firstDiscoveredAt;
      continue;
    }
    output.push(record);
  }
  output.sort((a,b)=>{
    const ad=Date.parse(a.publishedAt),bd=Date.parse(b.publishedAt),av=Number.isFinite(ad),bv=Number.isFinite(bd);
    if(av!==bv)return av?-1:1;
    return av?bd-ad:a.title.localeCompare(b.title,"mr");
  });
  return output.slice(0,maximumStoredResults);
}
