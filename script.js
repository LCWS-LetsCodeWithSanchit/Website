// =======================
// Particle Background
// =======================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const particleCount = 80;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = ['#0ff', '#ff00ff', '#00ff00', '#ffff00'][Math.floor(Math.random() * 4)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < particleCount; i++) particlesArray.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});
initParticles();
animateParticles();

// =======================
// Flip Card Logic
// =======================
const loginCard = document.getElementById('login-card');
document.getElementById('show-signup').addEventListener('click', e => {
  e.preventDefault();
  loginCard.classList.add('flip');
});
document.getElementById('show-login').addEventListener('click', e => {
  e.preventDefault();
  loginCard.classList.remove('flip');
});

// =======================
// Firebase Setup
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDNSat31gtkEoeXB7R9-DWICubl7u_xOlQ",
  authDomain: "otp1-3d23c.firebaseapp.com",
  projectId: "otp1-3d23c",
  storageBucket: "otp1-3d23c.firebasestorage.app",
  messagingSenderId: "471453612085",
  appId: "1:471453612085:web:11aa0034ebee098520d97c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// =======================
// Loaders
// =======================
const signupLoader = document.getElementById('signup-loader');
const loginLoader = document.getElementById('login-loader');

// =======================
// Signup Form
// =======================
const signupForm = document.getElementById('signupForm');
const signupMsg = document.getElementById('signup-msg');

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('new-username').value.trim();
  const password = document.getElementById('new-password').value.trim();
  if (!email || !password) return;

  signupLoader.style.display = "block";
  signupMsg.textContent = "";

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      user.sendEmailVerification()
        .then(() => {
          signupLoader.style.display = "none";
          signupMsg.textContent = "✅ Signup successful! Check your email to verify.";
          signupMsg.style.color = "#00ff99";
          signupForm.reset();
        });
    })
    .catch(err => {
      signupLoader.style.display = "none";
      signupMsg.textContent = "❌ Error: " + err.message;
      signupMsg.style.color = "red";
    });
});

// =======================
// Login Form
// =======================
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('error-msg');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return;

  loginLoader.style.display = "block";
  loginMsg.textContent = "";

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      loginLoader.style.display = "none";

      if (user.emailVerified) {
        loginMsg.textContent = "✅ Login Successful!";
        loginMsg.style.color = "#00ff99";
        loginForm.reset();
      } else {
        loginMsg.textContent = "⚠ Please verify your email before logging in.";
        loginMsg.style.color = "orange";
      }
    })
    .catch(err => {
      loginLoader.style.display = "none";
      loginMsg.textContent = "❌ Error: " + err.message;
      loginMsg.style.color = "red";
    });
});
