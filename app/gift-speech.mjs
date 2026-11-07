export function dbg(msg){try{fetch('/__diag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:'tts',msg:String(msg).slice(0,150)})}).catch(()=>{})}catch(e){}}

export class GiftSpeech {
 constructor(onStatus=()=>{}){this.enabled=true;this.volume=.85;this.rate=1.08;this.voiceURI='';this.onStatus=onStatus;this.unlocked=false;this.previous=-1;this.queue=[];this.speaking=false;this.generation=0;this.neural=true;this.neuralVoice='zh-CN-XiaoxiaoNeural';this.audioUrls=new Map();this.currentAudio=null}
 voices(){return globalThis.speechSynthesis?.getVoices()||[]}
 preferred(){const voices=this.voices();return voices.find(v=>v.voiceURI===this.voiceURI)||voices.find(v=>/zh|cmn/i.test(v.lang)&&/xiaoxiao|xiaoyi|huihui|yaoyao|female|女/i.test(v.name))||voices.find(v=>/zh-CN/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang))}
 text(name,gift,amount){
  const safe=String(name).replace(/[<>\n\r]/g,'').slice(0,24);
  const phrases=[
   `谢谢${safe}送来的${amount}个${gift}，祝你今天开心，明天也有好消息！`,
   `感谢${safe}的${amount}个${gift}，愿你想做的事情，都慢慢变成现实。`,
   `${safe}，你的${amount}个${gift}收到啦！祝你吃得香，睡得好，每天都有小惊喜。`,
   `谢谢${safe}送的${amount}个${gift}呀，祝你好运常在，烦恼拜拜！`,
   `感谢${safe}送来${amount}个${gift}，愿你一路有风景，身边有温暖。`,
   `${safe}送来的${amount}个${gift}好暖心，谢谢你！祝你钱包鼓鼓，快乐满满。`,
   `收到${safe}的${amount}个${gift}啦，愿你所有认真，都有美好的回应。`,
   `谢谢${safe}的${amount}个${gift}，祝你今天顺顺利利，往后闪闪发光！`,
   `哇，${safe}的${amount}个${gift}到货啦！祝你笑口常开，好运挡不住。`,
   `${safe}送的${amount}个${gift}我收下啦，祝你天天有盼头，事事有着落。`,
   `谢谢${safe}的${amount}个${gift}，愿你被生活温柔对待，被好运常常想起。`,
   `${safe}的${amount}个${gift}超给力！祝你接下来的日子一路绿灯。`,
   `感谢${safe}送来${amount}个${gift}，祝你吃好喝好，心情天天晴朗。`,
   `${safe}的${amount}个${gift}收到！愿你今晚有好梦，明天有好天气。`,
   `谢谢${safe}的${amount}个${gift}呀，祝你烦恼清零，快乐续满格！`,
   `${safe}送来${amount}个${gift}，愿你的每一天都像今天一样被惊喜填满。`,
   `谢谢${safe}的${amount}个${gift}！愿你手上做的事，都有人看见，也有人喜欢。`,
   `${safe}，${amount}个${gift}收到了，祝你出门遇贵人，回家有热饭。`,
   `感谢${safe}的${amount}个${gift}，愿你想要的生活，正在一步一步靠近你。`,
   `${safe}的${amount}个${gift}真及时！祝你今天话有人听，事有人帮。`,
   `谢谢${safe}的${amount}个${gift}，愿你烦心事一件件变小，开心事一件件变大。`,
   `${safe}送来${amount}个${gift}，祝你今年顺、明年顺，年年都顺。`,
   `收到${safe}的${amount}个${gift}，谢谢你！愿你身体倍儿棒，运气倍儿旺。`,
   `谢谢${safe}的${amount}个${gift}，祝你睡得早、笑得多、赚得稳。`,
   `${safe}的${amount}个${gift}我记下啦，愿你走到哪里都有人喜欢，有人等你。`,
   `感谢${safe}的${amount}个${gift}，祝你眉头舒展，心里亮堂。`,
   `谢谢${safe}的${amount}个${gift}！愿你今天的努力，明天就开花。`,
   `${safe}送来${amount}个${gift}，愿你事事不将就，样样都如意。`,
   `谢谢${safe}的${amount}个${gift}，祝你越努力越幸运，越简单越快乐。`,
   `${safe}的${amount}个${gift}收好啦，愿你的好消息一个接一个，停不下来。`
  ];
  let n=Math.floor(Math.random()*phrases.length);if(n===this.previous)n=(n+1)%phrases.length;this.previous=n;return phrases[n]}
 printing(name,finished=false){
  if(!this.unlocked||!this.enabled)return;
  const safe=String(name).replace(/[<>\n\r]/g,'').slice(0,24);
  const options=finished?[
   `${safe}，头像打印好啦！`,
   `${safe}，快看你的专属头像！`,
   `${safe}，制作完成，祝你好运！`,
   `${safe}，你的专属头像出炉啦，快来验收！`,
   `${safe}，打印完成，愿这份好运天天陪着你！`,
   `${safe}，成品新鲜出炉，快看看满不满意！`,
   `${safe}，你的头像做好啦，全世界就这一份！`,
   `${safe}，出炉了出炉了，快截个图纪念一下！`
  ]:[
   `${safe}，开始打印啦！`,
   `${safe}，轮到你啦，祝你开心！`,
   `${safe}，头像安排上啦！`,
   `${safe}，机器转起来，你的头像马上好！`,
   `${safe}，正在为你定制专属头像哦！`,
   `${safe}，轮到你的头像啦，愿你好运连连！`,
   `${safe}，喷头已经就位，你的头像马上开工！`,
   `${safe}，稳住，你的专属头像正在一层层长出来。`
  ];
  const text=options[Math.floor(Math.random()*options.length)];if(this.speaking||this.queue.length)return;this.enqueue(text)}
 welcome(name){
  this.unlocked=true;
  const safe=String(name).replace(/[<>\n\r]/g,'').slice(0,24);
  const lines=[
   `欢迎${safe}来到直播间，祝你今天好运满满，开心加倍！`,
   `欢迎${safe}，很高兴见到你呀，愿你接下来遇到的都是好事情。`,
   `${safe}来啦，欢迎欢迎！祝你生活有甜头，日子有盼头。`,
   `欢迎${safe}进来坐坐，愿你烦恼少一点，快乐多一点。`,
   `欢迎${safe}来到这里，祝你今天顺心，今晚睡个好觉！`,
   `${safe}，欢迎你呀！愿你所遇皆温暖，所行皆坦途。`,
   `欢迎${safe}，送你一份好心情，祝你吃嘛嘛香，做什么都顺顺利利。`,
   `欢迎${safe}来到直播间，愿你心里有光，每天都有小惊喜！`,
   `欢迎${safe}！今天人齐聚齐的，就等你来一起开心啦。`,
   `${safe}来啦！愿你今天的好心情像打印机的灯一样亮。`,
   `欢迎${safe}进直播间，愿你所求皆如愿，所行化坦途。`,
   `${safe}你好呀，愿你从今天起好运连连，笑容不断。`,
   `欢迎${safe}！搬好小板凳，精彩马上开始。`,
   `${safe}来啦，愿你的生活像新打印的头像一样，又亮又体面。`,
   `欢迎${safe}！祝你点的每一餐都好吃，走的每一步都顺。`,
   `${safe}来啦！愿你被这个世界温柔以待，天天都有小欢喜。`,
   `欢迎${safe}，愿你今天遇到的都是好事，碰到的都是好人。`,
   `${safe}来啦，欢迎欢迎！愿你心里踏实，日子顺当。`,
   `欢迎${safe}进直播间，祝你工作顺、家里和、身体棒。`,
   `${safe}你好呀！愿你今天的每一分钟，都不白费。`,
   `欢迎${safe}，愿你有花有酒有朋友，有梦有路有归处。`,
   `${safe}进来啦，欢迎！祝你今天的运气，比昨天再好一点。`,
   `欢迎${safe}，愿你被善意包围，被好运送达。`,
   `${safe}，欢迎你呀！愿你心中有数，手里有活，兜里有钱。`,
   `欢迎${safe}来到直播间，愿你今天说的话都有人接，做的事都有人夸。`,
   `${safe}来啦！坐好，慢慢看，愿你不虚此行。`,
   `欢迎${safe}，祝你吃得好、睡得好、事事都好。`,
   `${safe}你好，欢迎光临！愿你的日子像这台打印机，一层一层稳稳往上。`,
   `欢迎${safe}，愿你今天的开心不止一点点。`,
   `${safe}来啦，欢迎！愿你眼睛里有光，日子里有钱。`
  ];
  let n=Math.floor(Math.random()*lines.length);if(n===this.lastWelcome)n=(n+1)%lines.length;this.lastWelcome=n;this.enqueue(lines[n])}
 enqueue(text){if(!this.enabled)return;if(!globalThis.speechSynthesis){this.onStatus('当前浏览器不支持语音播报');return}if(this.queue.length>=12){this.onStatus('播报队列已满，本次仅显示字幕：'+text);return}this.queue.push(text);this.pump()}
 say(name,gift,amount=1){this.unlocked=true;this.enqueue(this.text(name,gift,amount))}
 pump(){
  if(!this.enabled||this.speaking||!this.queue.length)return;
  const text=this.queue.shift(),token=this.generation;
  this.speaking=true;this.onStatus(text);
  const finish=()=>{this.speaking=false;if(token===this.generation)this.pump()};
  if(this.neural){this.speakNeural(text,token,finish).catch(()=>this.speakSystem(text,token,finish))}
  else this.speakSystem(text,token,finish)}
 async audioFor(text){
  if(this.audioUrls.has(text))return this.audioUrls.get(text);
  const res=await fetch('/__tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,voice:this.neuralVoice,rate:Math.round((this.rate-1)*100)})});
  dbg('tts http '+res.status+' '+(res.headers.get('content-type')||'-'));
  if(!res.ok||!(res.headers.get('content-type')||'').includes('audio'))throw new Error('tts unavailable '+res.status);
  const blob=await res.blob(),url=URL.createObjectURL(blob);
  if(this.audioUrls.size>=200){const k=this.audioUrls.keys().next().value;try{URL.revokeObjectURL(this.audioUrls.get(k))}catch(e){}this.audioUrls.delete(k)}
  this.audioUrls.set(text,url);return url}
 async speakNeural(text,token,finish){
  const url=await this.audioFor(text);
  if(token!==this.generation)return;
  const audio=new Audio(url);
  audio.volume=this.volume;
  audio.onended=finish;
  audio.onerror=finish;
  this.currentAudio=audio;
  try{await audio.play()}catch(e){dbg('play fail '+e.name+' '+e.message);finish();throw e}}
 speakSystem(text,token,finish){
  dbg('system speak');
  if(!globalThis.speechSynthesis){this.onStatus('当前浏览器不支持语音播报');finish();return}
  const u=new SpeechSynthesisUtterance(text),voice=this.preferred();
  if(voice)u.voice=voice;
  u.lang=voice?.lang||'zh-CN';u.rate=this.rate;u.pitch=1.16;u.volume=this.volume;
  u.onend=finish;
  u.onerror=e=>{this.onStatus('语音播放失败：'+e.error+'，请点击试听或更换语音');this.queue=[];finish()};
  speechSynthesis.speak(u)}
 stop(){this.generation++;this.queue=[];this.speaking=false;try{this.currentAudio?.pause()}catch(e){}this.currentAudio=null;globalThis.speechSynthesis?.cancel()}
}
