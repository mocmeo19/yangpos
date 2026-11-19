// Mã VietQR theo chuẩn EMVCo: mỗi trường gồm ID 2 chữ số, độ dài 2 chữ số rồi tới giá trị.
const NAPAS_GUID = 'A000000727';
const SERVICE_TRANSFER_TO_ACCOUNT = 'QRIBFTTA';
const CURRENCY_VND = '704';
const COUNTRY_VIETNAM = 'VN';
const STATIC_QR = '11';
const DYNAMIC_QR = '12';
const CRC_FIELD_PREFIX = '6304';

function buildField(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

/** CRC-16/CCITT-FALSE mà chuẩn EMVCo yêu cầu cho trường kiểm tra cuối mã. */
function calculateCrc16(payload: string): string {
  let crc = 0xffff;
  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface VietQrInput {
  bankBin: string;
  accountNumber: string;
  amount?: number;
  /** Chỉ gồm chữ không dấu và số để mọi ứng dụng ngân hàng đọc đúng. */
  note?: string;
}

export function buildVietQrPayload({
  bankBin,
  accountNumber,
  amount,
  note,
}: VietQrInput): string {
  const hasAmount = amount !== undefined && amount > 0;
  const beneficiary =
    buildField('00', bankBin) + buildField('01', accountNumber);
  const merchantAccount =
    buildField('00', NAPAS_GUID) +
    buildField('01', beneficiary) +
    buildField('02', SERVICE_TRANSFER_TO_ACCOUNT);

  let payload =
    buildField('00', '01') +
    buildField('01', hasAmount ? DYNAMIC_QR : STATIC_QR) +
    buildField('38', merchantAccount) +
    buildField('53', CURRENCY_VND);
  if (hasAmount) {
    payload += buildField('54', String(Math.round(amount)));
  }
  payload += buildField('58', COUNTRY_VIETNAM);
  if (note) {
    payload += buildField('62', buildField('08', note));
  }
  payload += CRC_FIELD_PREFIX;
  return payload + calculateCrc16(payload);
}
