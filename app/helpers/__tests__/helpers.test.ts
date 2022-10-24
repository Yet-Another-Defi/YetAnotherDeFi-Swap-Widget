import { compactAddress, countDecimals, formatNumber } from '../helpers';

describe('Count decimals for float value(String) with different digits(default=5)', () => {
  test('Pass 0, expect 0 decimals', () => {
    expect(countDecimals('0')).toBe(0);
  });
  test('Pass float 0. and custom digits. Expect 0', () => {
    expect(countDecimals('0.')).toBe(0);
  });
  test('Pass float 3.0 and. Expect 0', () => {
    expect(countDecimals('3.0')).toBe(0);
  });
  test('Pass integer 4321, with default 5 digits expect 0 decimals', () => {
    expect(countDecimals('4321')).toBe(0);
  });
  test('Pass float 4321.23, with default 5 digits expect 1 decimals', () => {
    expect(countDecimals('4321.23')).toBe(1);
  });
  test('Pass float 43221.232, with default 5 digits expect 0 decimals', () => {
    expect(countDecimals('43221.232')).toBe(0);
  });
  test('Pass float 0.232, with default 5 digits expect 3 decimals', () => {
    expect(countDecimals('0.232')).toBe(3);
  });
  test('Pass float 0.23221, with default 5 digits expect 5 decimals', () => {
    expect(countDecimals('0.23221')).toBe(5);
  });
  test('Pass float 0.32100322. It should cut ended zeros. With default 5 digits expect 3 decimals', () => {
    expect(countDecimals('0.32100322')).toBe(3);
  });
  test('Pass float 0.32100322 and custom digits. It should cut ended zeros. With 4 digits expect 2 decimals', () => {
    expect(countDecimals('0.32000322', 4)).toBe(2);
  });
  test('Pass 0.0000003232. Expect 8 because we need 2 meaningful digits', () => {
    expect(countDecimals('0.0000003232', 4)).toBe(8);
  });
  test('Format string 0.00000434668. With default digits 5. Expect 7', () => {
    expect(countDecimals('0.00000434668')).toBe(7);
  });
  test('Pass 0.0000003021. Expect 7 because we need 2 meaningful digits but it ends with 0', () => {
    expect(countDecimals('0.0000003021', 4)).toBe(7);
  });
  test('Pass random string. Excpect error', () => {
    expect(() => countDecimals('432few.few32', 4)).toThrowError('It is not a number 432few.few32');
  });
});

describe('Format string or number with digits and thousands separator', () => {
  describe('Format decimals', () => {
    test('Format number 0.0000003021. Expect 0.0000003', () => {
      expect(formatNumber('0.0000003021', 4)).toBe('0.0000003');
    });
    test('Format string 0.003002. With default digits 5. Expect 0.003', () => {
      expect(formatNumber('0.003002')).toBe('0.003');
    });
    test('Format string 0.00000434668. With default digits 5. Expect 0.0043', () => {
      expect(formatNumber('0.00000434668 ')).toBe('0.0000043');
    });
    test('Format string 123.32. With default digits 5. Expect 0.003', () => {
      expect(formatNumber('123.32')).toBe('123.32');
    });
    test('Format string 123. . With default digits 5. Expect 10023', () => {
      expect(formatNumber('123.')).toBe('123');
    });
    test('Format string 213. . With default digits 5. Expect 10023', () => {
      expect(formatNumber('213')).toBe('213');
    });
    test('Format string 7.00. With default digits 5. Expect 7', () => {
      expect(formatNumber('7.00')).toBe('7');
    });
    test('Format string 5.00000000001. With default digits 5. Expect 5', () => {
      expect(formatNumber('5.00000000001')).toBe('5');
    });
    test('Format string 123.003 . With default digits 5. Expect 123', () => {
      expect(formatNumber('123.003')).toBe('123');
    });
    test('Format string 123.003 . With default digits 5. Expect 123', () => {
      expect(formatNumber('123.003')).toBe('123');
    });
    test('Format float number 123.003. With default digits 5. Expect 123', () => {
      expect(formatNumber(123.003)).toBe('123');
    });
    test('Format integer number 1233. With default digits 5. Expect 1233', () => {
      expect(formatNumber(233)).toBe('233');
    });
  });
  describe('Format thousands with different separators', () => {
    test("Format number 1230.321. With default digits 5 and default thousand sepprator' '. Expect 1 230", () => {
      expect(formatNumber('1230.321')).toBe('1 230.3');
    });
    test("Format number 1230.321. With default digits 5 and default thousand sepprator' '. Expect 1 230", () => {
      expect(formatNumber('1230')).toBe('1 230');
    });
    test("Format number 132230. With default digits 5 and custom thousand sepprator $' '. Expect 132$230", () => {
      expect(formatNumber('132230', 5, '$')).toBe('132$230');
    });
    test("Format number 123123.0320102. With default digits 10 and default thousand sepprator' '. Expect 123 123.032", () => {
      expect(formatNumber('123123.0320102', 10, ' ')).toBe('123 123.032');
    });
    test('Format random string. Expect error', () => {
      expect(() => formatNumber('32few23few.ew32')).toThrowError(
        'It is not a number 32few23few.ew32'
      );
    });
  });
});

describe('Compact address', () => {
  test('Should create small address with dots between and total 8 numbers after 0x, default count = 4', () => {
    expect(compactAddress('0xcd3B766CCDd6AE721141F452C550Ca635964ce71')).toBe('0xcd3B...ce71');
  });
  test('Should create small address with dots between and total 6 numbers after 0x, custom count 3', () => {
    expect(compactAddress('0xcd3B766CCDd6AE721141F452C550Ca635964ce71', 3)).toBe('0xcd3...e71');
  });
});
