import{i as t,g as e,b as s,c as a,s as i}from"./subfile-c9305737.js";import o from"file-saver";import r from"jszip";import"dayjs";class n{metadata;coverImage;showContents;sections;css;filesForTOC;customFile;images;runtime;_generateContentsCallback;constructor(t){this.metadata={},this.coverImage={},this.showContents=!0,this.sections=[],this.css="",this.filesForTOC=[],this.customFile=[],this.images=[],this.runtime="browser",t&&this.setMeta(t)}_verify(){const e=["id","title","author","cover"];if(t(this.metadata))throw new Error("Missing metadata, You can use the setMeta function to set it");{const t=this.metadata;e.forEach((e=>{const s=t[e];if(null==s||void 0===s||""===s.toString().trim())throw new Error(`Missing required metadata: ${e}`)}))}}setMeta(t){Object.assign(this.metadata,t),this.showContents=t.showContents??!0,t.cover&&this.addCover(t.cover),t.images&&this.addImagesAll(t.images)}addCover(t){this.coverImage="string"==typeof t?{name:e(t),data:t}:t}setContents(t){this._generateContentsCallback=t}addImage(t){"string"==typeof t.data?(t.data=function(t,e){const s=t.split(",");if(!(e=e??s[0].match(/:(.*?);/)?.[1]))throw new Error("TypeError: image data should be a Blob/File or base64 dataURI");let a="";try{a=atob(s[1])}catch(t){throw new Error("TypeError: image data should be a Blob/File or base64 dataURI")}let i=a.length;const o=new Uint8Array(i);for(;i--;)o[i]=a.charCodeAt(i);return new Blob([o],{type:e})}(t.data),this.images.push(t)):this.images.push(t)}addImagesAll(t){t.forEach((t=>{this.addImage(t)}))}addSection(t){let{title:e,overrideFilename:s,content:a,isFrontMatter:i,excludeFromContents:o}=t;if(null==s||void 0===s||""===s.toString().trim()){s=`s${this.sections.length+1}`}s=`${s}.xhtml`,this.sections.push({title:e,content:a,excludeFromContents:o||!1,isFrontMatter:i||!1,overrideFilename:s})}addSectionsAll(t){t.forEach((t=>{this.addSection(t)}))}addCustomFile(t){this.customFile.push(t)}getSectionsCount(){return this.sections.length}addCss(t){this.css=t}genUuid(){return s()}async build(t,e){this._verify();const s=new r;a(this).forEach((t=>{const e=t.folder.length>0?`${t.folder}/${t.name}`:t.name;s.file(e,t.content,{compression:t.compress?"DEFLATE":"STORE"})}));const n=await s.generateAsync({type:"blob",mimeType:i.getMimetype()},(t=>{e&&e(t.percent)}));o(n,t.endsWith(".epub")?t:`${t}.epub`)}}export{n as default};
