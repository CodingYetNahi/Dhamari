import test from "node:test";
import assert from "node:assert/strict";
import {canonicalUrl,mergeUpdates,titleFingerprint} from "./internet-updates.mjs";

const NOW="2026-08-31T00:00:00.000Z";
const article=(overrides={})=>({title:"धामारी बातमी",source:"प्रकाशक",sourceUrl:"https://example.com/news",publishedAt:"2026-08-30T00:00:00.000Z",queries:["धामारी"],status:"पडताळणी प्रलंबित",...overrides});
const merge=(old,fresh,limit=120)=>mergeUpdates(old,fresh,{maximumStoredResults:limit,now:NOW});

test("identical URLs are stored once",()=>assert.equal(merge([], [article(),article()]).length,1));
test("tracking parameters do not change a URL",()=>assert.equal(canonicalUrl("https://EXAMPLE.com/news/?utm_source=x&b=2&a=1"),"https://example.com/news?a=1&b=2"));
test("fragments do not change a URL",()=>assert.equal(merge([], [article(),article({sourceUrl:"https://example.com/news#top"})]).length,1));
test("Marathi and English queries merge on one article",()=>assert.deepEqual(merge([], [article(),article({queries:["Dhamari"]})])[0].queries,["धामारी","Dhamari"]));
test("Google News publisher suffix is removed from fingerprints",()=>assert.equal(titleFingerprint("धामारी बातमी - प्रकाशक","प्रकाशक"),titleFingerprint("धामारी बातमी","प्रकाशक")));
test("an existing article in a later run keeps discovery time",()=>assert.equal(merge([article({firstDiscoveredAt:"2026-08-01T00:00:00Z"})],[article({queries:["Dhamari"]})])[0].firstDiscoveredAt,"2026-08-01T00:00:00.000Z"));
test("genuinely different articles remain separate",()=>assert.equal(merge([], [article(),article({title:"दुसरी बातमी",sourceUrl:"https://example.com/other"})]).length,2));
test("storage limit retains newest records",()=>{const records=[1,2,3].map(day=>article({title:`बातमी ${day}`,sourceUrl:`https://example.com/${day}`,publishedAt:`2026-08-${String(day).padStart(2,"0")}T00:00:00Z`}));assert.deepEqual(merge([],records,2).map(x=>x.title),["बातमी 3","बातमी 2"]);});
test("unchanged input serializes byte-for-byte unchanged",()=>{const once=merge([], [article()]);const bytes=`${JSON.stringify(once,null,2)}\n`;assert.equal(`${JSON.stringify(merge(JSON.parse(bytes),[]),null,2)}\n`,bytes);});
test("query names remain unique while merging",()=>assert.deepEqual(merge([], [article({queries:["धामारी","धामारी"]}),article()])[0].queries,["धामारी"]));
