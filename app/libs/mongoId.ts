import crypto from 'crypto';


export class MongoId {

  hexString(digits: number): string {
    const numBytes = Math.ceil(digits / 2);
    let bytes;
    // Try to get cryptographically strong randomness. Fall back to
    // non-cryptographically strong if not available.
    try {
      bytes = crypto.randomBytes(numBytes);
    } catch (e) {
      // XXX should re-throw any error except insufficient entropy
      bytes = crypto.pseudoRandomBytes(numBytes);
    }
    const result = bytes.toString('hex');
    // If the number of digits is odd, we'll have generated an extra 4 bits
    // of randomness, so we need to trim the last digit.
    return result.substring(0, digits);
  }

};
