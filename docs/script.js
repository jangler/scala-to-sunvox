(()=>{var i=class{};function p(t,e){return 1200*Math.log(t/e)/Math.log(2)}function E(t){if(t=t.trim(),/^\d+$/.test(t)){let e=parseInt(t);return p(e,1)}else if(/^\d+\/\d+$/.test(t)){let e=t.split("/").map(parseInt);return p(e[0],e[1])}else if(/^\d*.\d*$/.test(t))return parseFloat(t);throw new Error(`Could not parse pitch value: ${t}`)}function f(t){let e=t.split(`
`).filter(o=>!o.startsWith("!"));if(e.length<2)throw new Error("Invalid scale file");let n=new i;n.description=e[0];let r=parseInt(e[1]);if(n.notes=e.slice(2).filter(o=>o.length>0).map(E),n.notes.length!=r)throw new Error("Wrong number of notes in scale");return n}var a=class{};function d(t){let e=t.split(`
`).filter(r=>!r.startsWith("!"));if(e.length<7)throw new Error("Invalid mapping file");let n=new a;if(n.size=parseInt(e[0]),n.firstNote=parseInt(e[1]),n.lastNote=parseInt(e[2]),n.middleNote=parseInt(e[3]),n.referenceNote=parseInt(e[4]),n.frequency=parseFloat(e[5]),n.formalOctave=parseInt(e[6]),n.mapping=e.slice(7).map(r=>r=="x"?null:parseInt(r)),n.mapping.length!=n.size)throw new Error("Wrong number of keys in mapping");return n}function b(t){let e=new a;return e.size=t,e.firstNote=0,e.lastNote=127,e.middleNote=60,e.referenceNote=69,e.frequency=440,e.formalOctave=t,e.mapping=[...new Array(t).keys()],e}var h=128,g=31744,w=60,S=100,y=256,v=0,M=65535;function l(t,e){let n=new Uint8Array(h*2);for(let r=0;r<h;r++){let o=r>=e.firstNote&&r<=e.lastNote?T(t,e,r):g+(r-w)*y;n[r*2]=o&255,n[r*2+1]=o>>8}return n}function T(t,e,n){let r=n-1-e.middleNote,o=Math.floor(r/e.size),s=r%e.size;for(;s<0;)s+=e.size;let c=g+Math.round((t.notes[s]+o*t.notes[t.notes.length-1])*y/S);return Math.max(v,Math.min(M,c))}var x=document.querySelector("#sclInput"),A=document.querySelector("#kbmInput"),U=document.querySelector("#convertButton"),u=document.querySelector("#messageArea");function m(t){u.setAttribute("style","display: block;"),u.innerText=t.message+"."}function k(){u.setAttribute("style","display: none;")}function L(t,e){let n=URL.createObjectURL(t),r=document.createElement("a");r.setAttribute("style","display: none"),r.href=n,r.download=e,document.body.appendChild(r),r.click(),setTimeout(()=>{URL.revokeObjectURL(n),document.body.removeChild(r)})}U.addEventListener("click",t=>{let e=x.files?.item(0),n=A.files?.item(0);e?e.text().then(r=>{try{let o=f(r);if(n)n.text().then(s=>{let c=d(s),N=l(o,c);I(N,e.name)});else{let s=b(o.notes.length),c=l(o,s);I(c,e.name)}}catch(o){m(o)}}):m(new Error("No scale selected"))});function I(t,e){k();try{let n=new Blob([t],{type:"application/octet-stream"});console.log(t),console.log(n),n.arrayBuffer().then(r=>console.log(r.slice(0,256))),L(n,e.replace(".scl",".curve16bit"))}catch(n){m(n)}}})();
