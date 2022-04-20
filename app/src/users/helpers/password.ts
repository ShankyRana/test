/**
 * Password helper file
 */

import bcrypt from 'bcrypt';
import SHA256 from './SHA256';

import { User, Users } from '../model/model';

const bcryptHash = bcrypt.hash;
const bcryptCompare = bcrypt.compare;

const bcryptRounds = () => 10;

// Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be String (the plaintext password)
//
const getPasswordString = (password: string): string => {
  let tempPassword: string = password;
  if (typeof tempPassword === 'string') {
    tempPassword = SHA256(tempPassword);
  }
  return tempPassword;
};

// Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt).
//
export const hashPassword = (password: string): string => {
  const tempPassword: string = getPasswordString(password);
  return bcryptHash(tempPassword, bcryptRounds());
};

// Extract the number of rounds used in the specified bcrypt hash.
const getRoundsFromBcryptHash = (hash: string): number => {
  let rounds: number;
  if (hash) {
    const hashSegments = hash.split('$');
    if (hashSegments.length > 2) {
      rounds = parseInt(hashSegments[2], 10);
    }
  }
  return rounds;
};


// Check whether the provided password matches the bcrypt'ed password in
// the database user record. `password` can be a string (in which case
// it will be run through SHA256 before bcrypt).
//

export const checkPassword = async (user: User, password: string): Promise<any> => {
  const result = {
    userId: user._id,
    error: '',
  };

  const formattedPassword = getPasswordString(password);
  const hash = user.password;
  const hashRounds = getRoundsFromBcryptHash(hash);
  const checkBcryptCompare = await bcryptCompare(formattedPassword, hash);
  console.log(checkBcryptCompare, '=-=>checkBcryptCompare');

  if (!checkBcryptCompare) {
    result.error = 'Incorrect password';
  } else if (hash && bcryptRounds() !== hashRounds) {
    // The password checks out, but the user's bcrypt hash needs to be updated.
    await Users.update({ _id: user._id }, {
      $set: {
        'password':
          bcryptHash(formattedPassword, bcryptRounds()),
      },
    });
  }

  return result;
};
