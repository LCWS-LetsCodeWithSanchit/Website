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
// Google Login/Signup
// =======================
const googleLoginBtn = document.getElementById('google-login');
const googleSignupBtn = document.getElementById('google-signup');
const loginMsg = document.getElementById('login-msg');
const signupMsg = document.getElementById('signup-msg');
const loginLoader = document.getElementById('login-loader');
const signupLoader = document.getElementById('signup-loader');

// Function to handle Google login/signup
function googleAuth(button, msgElement, loader) {
  button.addEventListener('click', () => {
    loader.style.display = 'block';
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
      .then(result => {
        loader.style.display = 'none';
        const user = result.user;
        msgElement.style.color = '#00ff99';
        msgElement.textContent = `✅ Logged in as ${user.displayName} (${user.email})`;

        // Optionally, you can redirect to a dashboard page
        // window.location.href = 'dashboard.html';
      })
      .catch(error => {
        loader.style.display = 'none';
        msgElement.style.color = 'red';
        msgElement.textContent = `❌ Error: ${error.message}`;
        console.error(error);
      });
  });
}

// Attach Google auth to buttons
googleAuth(googleLoginBtn, loginMsg, loginLoader);
googleAuth(googleSignupBtn, signupMsg, signupLoader);

// =======================
// Optional: Logout Button
// =======================
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Logout';
logoutBtn.style.marginTop = '20px';
logoutBtn.style.padding = '10px';
logoutBtn.style.borderRadius = '10px';
logoutBtn.style.border = '2px solid #ff0000';
logoutBtn.style.background = 'transparent';
logoutBtn.style.color = '#ff0000';
logoutBtn.style.cursor = 'pointer';
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    alert('Logged out successfully!');
    location.reload(); // refresh to show login screen
  });
});
document.body.appendChild(logoutBtn);
