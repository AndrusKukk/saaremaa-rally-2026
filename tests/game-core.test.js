// Load after game-core.js in a browser, or in a JavaScript runtime with window defined.
(() => {
  const {parse,score,overall}=window.GameCore;
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  const sum=(p,r)=>score(p,r).reduce((s,x)=>s+x.points,0);
  const drivers=['Pajari','Fourmaux','Solberg','Ogier','Neuville'];
  assert(sum(drivers,drivers)===80,'Perfect prediction');
  assert(sum(['Solberg','Evans','Pajari','Ogier','Neuville'],drivers)===32,'Colab stage one Andrus');
  assert(sum(['Solberg','Neuville','Fourmaux','Evans','Katsuta'],drivers)===19,'Colab stage one Kaido');
  assert(sum(['a','b','c','d','e'],drivers)===0,'No correct drivers');
  assert(score(['Fourmaux','Pajari','Solberg','Ogier','Neuville'],drivers)[0].points===12.5,'Half points retain decimals');
  assert(sum(['pájari','fourmaux','solberg','ogier','neuville'],drivers)===80,'Case and accent normalization');
  assert(Object.keys(parse('# comment\n\nSS1: '+drivers.join(', '),true)).length===1,'Comments and whitespace');
  for(const bad of ['SS1: a,b,c,d','SS1: a,a,c,d,e','SS10: a,b,c,d,e','SS1: a,b,c,d,e\nSS1: a,b,c,d,e']) {
    let rejected=false;try{parse(bad,true);}catch{rejected=true;}assert(rejected,'Reject malformed results');
  }
  const entries=drivers.map((d,i)=>({sourceId:String(i),driver:'Name '+d}));
  const rows=drivers.map((d,i)=>({entry_id:String(i),position:i+1,total_ms:i*100})).reverse();
  assert(overall({overall:rows},entries).join()===drivers.join(),'Use overall position regardless of input ordering');
  let rejected=false;try{overall({overall:rows.slice(1)},entries);}catch{rejected=true;}assert(rejected,'Reject incomplete live standings');
})();
