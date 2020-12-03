const bcrypt = require('bcrypt');

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
