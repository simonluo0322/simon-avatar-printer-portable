// 昵称/评论安全过滤：观众昵称会被打到 3D 屏幕上并进贡献榜，违规昵称上屏等于主播违规，
// 所以先在数据桥这一层拦掉。命中的事件直接丢弃：不打印、不上榜、不进播报。
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const EXTRA_FILE = join(DIR, 'safety-words.txt');

// 结构性规则：不用维护词表也能拦掉绝大多数广告/引流/灰产昵称。
const RULES = [
  [/1[3-9]\d{9}/, '手机号'],
  [/\d{5,}/, '长串数字（QQ/群号）'],
  [/QQ|qq号码|扣扣|群号|裙号/, 'QQ/群'],
  [/微信|薇信|威信|vxin|vx|VX|Vx|weixin|wechat|加[Vv]|[Vv]我|wx[:_-]?[a-z0-9]|加wx|wx号/, '微信/导流'],
  [/https?:\/\/|www\.|[a-z0-9-]+\.(com|cn|net|top|xyz|cc|vip)/i, '网址'],
  [/加群|进群|私聊|私信|加我|联系我|主页有|看主页|点头像|扣1|滴滴我/, '站外引流'],
  [/刷单|代练|外挂|脚本|辅助|收号|卖号|租号|解封|代实名|认证服务|接单/, '灰产'],
  [/博彩|菠菜|赌|六合彩|彩票|棋牌|上下分|上分器/, '赌博'],
  [/贷款|套现|洗钱|跑分|返利|日赚|躺赚|兼职|招募|招人/, '金融诈骗'],
  [/福利|送福利|免费领|领福利|大礼包|红包/, '福利钩子'],
  [/裸|约炮|嫖|骚|乳|臀|性交|口交|射精|强奸/, '低俗'],
  [/傻逼|煞笔|脑残|草泥马|你妈|妈的|去死|全家死|废物|贱/, '辱骂'],
];

let extraWords = [];
function loadExtra() {
  try {
    if (existsSync(EXTRA_FILE)) {
      extraWords = readFileSync(EXTRA_FILE, 'utf8')
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('#'));
    } else {
      extraWords = [];
    }
  } catch { extraWords = []; }
}
loadExtra();

// 让程序运行中能重载词表（改了 safety-words.txt 不必重启也能生效，下次检查时生效）。
export function reloadSafetyWords() { loadExtra(); return extraWords.length; }
export function safetyWordCount() { return extraWords.length; }

function norm(s) {
  return String(s || '')
    .replace(/[\u3000\s]+/g, '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu, '')
    .toLowerCase();
}

// 返回命中的原因字符串；空串表示放行。
export function checkName(raw) {
  const n = norm(raw);
  if (!n) return '';
  for (const [re, why] of RULES) if (re.test(n)) return why;
  for (const w of extraWords) if (n.includes(norm(w))) return '自定义词表';
  return '';
}

export function checkText(raw) {
  const t = norm(raw);
  if (!t) return '';
  for (const [re, why] of RULES) if (re.test(t)) return why;
  for (const w of extraWords) if (t.includes(norm(w))) return '自定义词表';
  return '';
}

// 一次性检查整个事件：昵称与评论内容都过一遍。
export function checkEvent(ev) {
  const byName = checkName(ev && ev.name);
  if (byName) return byName;
  if (ev && ev.text) { const byText = checkText(ev.text); if (byText) return byText; }
  return '';
}
