const DIGIT_WORDS = [
  'không',
  'một',
  'hai',
  'ba',
  'bốn',
  'năm',
  'sáu',
  'bảy',
  'tám',
  'chín',
];
const GROUP_UNITS = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

function readOnes(ones: number, tens: number): string {
  if (ones === 1 && tens >= 2) {
    return 'mốt';
  }
  if (ones === 4 && tens >= 2) {
    return 'tư';
  }
  if (ones === 5 && tens >= 1) {
    return 'lăm';
  }
  return DIGIT_WORDS[ones];
}

/** Nhóm không đứng đầu phải đọc đủ "không trăm", "linh", vd 1.005.000: "một triệu không trăm linh năm nghìn". */
function readTriple(value: number, isLeading: boolean): string {
  const hundreds = Math.floor(value / 100);
  const tens = Math.floor((value % 100) / 10);
  const ones = value % 10;
  const words: string[] = [];
  if (hundreds > 0 || !isLeading) {
    words.push(DIGIT_WORDS[hundreds], 'trăm');
  }
  if (tens === 1) {
    words.push('mười');
  } else if (tens > 1) {
    words.push(DIGIT_WORDS[tens], 'mươi');
  } else if (ones > 0 && words.length > 0) {
    words.push('linh');
  }
  if (ones > 0) {
    words.push(readOnes(ones, tens));
  }
  return words.join(' ');
}

/** Số tiền bằng chữ in trên hóa đơn, vd 108000 → "Một trăm linh tám nghìn đồng". */
export function formatAmountInWords(amount: number): string {
  const value = Math.round(Math.abs(amount));
  if (value === 0) {
    return 'Không đồng';
  }
  const groups: number[] = [];
  for (let rest = value; rest > 0; rest = Math.floor(rest / 1000)) {
    groups.push(rest % 1000);
  }
  const parts: string[] = [];
  for (let index = groups.length - 1; index >= 0; index -= 1) {
    if (groups[index] === 0) {
      continue;
    }
    const isLeading = index === groups.length - 1;
    parts.push(readTriple(groups[index], isLeading), GROUP_UNITS[index]);
  }
  const sentence = parts.filter(Boolean).join(' ');
  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)} đồng`;
}
