import bcrypt from 'bcrypt';

const password = 'admin123';

bcrypt.hash(password, 10)
  .then(hash => {
    console.log("\n🔥 Your Hashed Password:\n");
    console.log(hash);
    console.log("\n📋 Copy this and send it to me\n");
  })
  .catch(err => console.error(err));