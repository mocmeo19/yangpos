import type { QrMatrix } from '@/lib/qr/create-qr-matrix';

export type TextAlign = 'left' | 'center' | 'right';

export interface TextStyle {
  size: number;
  weight?: 400 | 600 | 700;
  italic?: boolean;
  align?: TextAlign;
}

const LINE_HEIGHT_RATIO = 1.3;
const DASH_LENGTH = 8;
const DASH_GAP = 6;
const DIVIDER_THICKNESS = 2;
const DIVIDER_PADDING = 10;

/** Vẽ hóa đơn lần lượt từ trên xuống, tự xuống dòng theo bề rộng khổ giấy. */
export class ReceiptCanvasWriter {
  private cursorY = 0;

  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly width: number,
    private readonly fontFamily: string,
  ) {}

  get height(): number {
    return this.cursorY;
  }

  space(pixels: number): void {
    this.cursorY += pixels;
  }

  text(content: string, style: TextStyle): void {
    this.applyFont(style);
    for (const line of this.wrap(content, this.width)) {
      this.cursorY += this.headroom(line);
      this.context.fillText(line, this.alignX(line, style.align), this.cursorY);
      this.cursorY += this.lineHeight(style);
    }
  }

  /** Hai cột trên một dòng: cột trái tự xuống dòng, cột phải canh lề phải ở dòng đầu tiên. */
  columns(left: string, right: string, style: TextStyle): void {
    this.applyFont(style);
    const rightWidth = this.context.measureText(right).width;
    const leftLines = this.wrap(left, this.width - rightWidth - style.size);
    leftLines.forEach((line, index) => {
      const isFirstLine = index === 0;
      this.cursorY += this.headroom(line, isFirstLine ? right : '');
      this.context.fillText(line, 0, this.cursorY);
      if (isFirstLine) {
        this.context.fillText(right, this.width - rightWidth, this.cursorY);
      }
      this.cursorY += this.lineHeight(style);
    });
  }

  divider(): void {
    const y = this.cursorY + DIVIDER_PADDING;
    for (let x = 0; x < this.width; x += DASH_LENGTH + DASH_GAP) {
      this.context.fillRect(x, y, DASH_LENGTH, DIVIDER_THICKNESS);
    }
    this.cursorY = y + DIVIDER_THICKNESS + DIVIDER_PADDING;
  }

  qrCode(matrix: QrMatrix, targetSize: number): void {
    const moduleSize = Math.max(1, Math.floor(targetSize / matrix.size));
    const size = moduleSize * matrix.size;
    const left = Math.round((this.width - size) / 2);
    for (let row = 0; row < matrix.size; row += 1) {
      for (let column = 0; column < matrix.size; column += 1) {
        if (matrix.isDark(row, column)) {
          this.context.fillRect(
            left + column * moduleSize,
            this.cursorY + row * moduleSize,
            moduleSize,
            moduleSize,
          );
        }
      }
    }
    this.cursorY += size;
  }

  private applyFont({ size, weight = 400, italic = false }: TextStyle): void {
    const fontStyle = italic ? 'italic ' : '';
    this.context.font = `${fontStyle}${weight} ${size}px ${this.fontFamily}`;
  }

  private lineHeight({ size }: TextStyle): number {
    return Math.round(size * LINE_HEIGHT_RATIO);
  }

  /**
   * Dấu của chữ hoa tiếng Việt (Á, Ở, Ế) nhô cao hơn khung chữ; chừa thêm đúng phần nhô ra để dấu
   * không bị cắt ở đầu giấy hay đè lên dòng phía trên.
   */
  private headroom(...lines: string[]): number {
    const overflows = lines.map(
      (line) => this.context.measureText(line).actualBoundingBoxAscent,
    );
    return Math.max(0, Math.ceil(Math.max(...overflows)));
  }

  private alignX(line: string, align: TextAlign = 'left'): number {
    const lineWidth = this.context.measureText(line).width;
    switch (align) {
      case 'center':
        return (this.width - lineWidth) / 2;
      case 'right':
        return this.width - lineWidth;
      default:
        return 0;
    }
  }

  private wrap(content: string, maxWidth: number): string[] {
    const words = content.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return [''];
    }
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      const fits = this.context.measureText(candidate).width <= maxWidth;
      if (fits || !current) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
    return lines;
  }
}
