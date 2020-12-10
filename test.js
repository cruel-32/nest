/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');
const moment = require('moment');

const test = async () => {
  const salt = await bcrypt.genSalt();
  console.log('salt : ', salt);
  const password = '1q2w3e4r';
  const hash = await bcrypt.hash(password, salt);

  console.log('hash : ', hash);
};

const compare = async () => {
  const isMatch = await bcrypt.compare(
    '1q2w3e4r',
    '$2b$10$wW9UvdSNOmuC/24A7ExPBegBtVUtFMUZBRk8v9u91Fccc5cI90ZEu',
  );
  console.log('isMatch : ', isMatch);
};

test();

compare();

console.log('new Date() ::: ', new Date());
console.log(
  'new Date().toLocaleTimeString() ::: ',
  new Date().toLocaleString(),
);

const psTimestamp = (YYYYMMDD, isStart) => {
  const timeStamp = moment(YYYYMMDD).toDate();

  timeStamp.setHours(isStart ? 0 : 23);
  timeStamp.setMinutes(isStart ? 0 : 59);
  timeStamp.setSeconds(isStart ? 0 : 59);

  return parseInt(timeStamp.getTime().toString().substring(0, 10));
};

console.log('psTimestamp ::::: ', psTimestamp('2020-11-30', true));
console.log('psTimestamp ::::: ', psTimestamp('2020-11-30'));
