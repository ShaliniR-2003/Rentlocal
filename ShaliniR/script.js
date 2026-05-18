// Auth helpers
function isAuthenticated() {
  return localStorage.getItem('authToken') !== null;
}

function getUsers() {
  return JSON.parse(localStorage.getItem('vendorUsers') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('vendorUsers', JSON.stringify(users));
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.clear();
    window.location.href = 'index.html';
  }
}

// Login page: show/hide password toggle
function toggleLoginPassword() {
  const input = document.getElementById('loginPass');
  const span = document.getElementById('eyeLogin');
  if (input.type === 'password') {
    input.type = 'text';
    if (span) span.setAttribute('data-visible', 'true');
  } else {
    input.type = 'password';
    if (span) span.removeAttribute('data-visible');
  }
}

// LOGIN FUNCTION
function login() {
  let user = document.getElementById("loginUser").value.trim();
  let pass = document.getElementById("loginPass").value;

  if (user === "" || pass === "") {
    showMessage('Please fill all fields', 'error');
    return;
  }

  let regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(pass)) {
    showMessage('Password must be 8+ chars with uppercase, number & special char', 'error');
    return;
  }

  let users = getUsers();
  if (!users[user] || users[user].pass !== pass) {
    showMessage('Invalid email or password. Check and try again.', 'error');
    return;
  }

  localStorage.setItem('authToken', 'vendor_' + Date.now());
  localStorage.setItem('user', users[user].name);
  
  document.getElementById("loginUser").value = '';
  document.getElementById("loginPass").value = '';
  
  showMessage('Login Successful! Redirecting...', 'success');
  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 1500);
}

// REGISTER FUNCTIONS
function verifyEmail() {
  let email = document.getElementById("email").value.trim();

  if (email === "") {
    showMessage('Please enter email', 'error');
    return;
  }

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter valid email', 'error');
    return;
  }

  localStorage.setItem('emailVerified', 'true');
  showMessage('Email verified successfully (Demo)', 'success');
}

// OTP Timer Logic
let otpTimerInterval = null;

function startOTPTimer() {
  let seconds = 60;
  const timerSection = document.getElementById('otpTimerSection');
  const countdown = document.getElementById('otpCountdown');
  const timerText = document.getElementById('otpTimerText');
  const resendBtn = document.getElementById('resendOtpBtn');

  if (!timerSection) return;

  timerSection.style.display = 'block';
  timerText.style.display = 'inline';
  resendBtn.style.display = 'none';
  countdown.textContent = seconds;

  if (otpTimerInterval) clearInterval(otpTimerInterval);

  otpTimerInterval = setInterval(() => {
    seconds--;
    countdown.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
      timerText.style.display = 'none';
      resendBtn.style.display = 'inline-block';
    }
  }, 1000);
}

function resendOTP() {
  let mobile = document.getElementById("mobile").value.trim();
  if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
    showMessage('Valid 10-digit mobile number required', 'error');
    return;
  }
  showMessage('OTP resent! (Demo: Use 1234)', 'success');
  startOTPTimer();
}

function sendOTP() {
  let mobile = document.getElementById("mobile").value.trim();

  if (mobile === "") {
    showMessage('Enter mobile number', 'error');
    return;
  }

  if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
    showMessage('Valid 10-digit mobile number required', 'error');
    return;
  }

  showMessage('OTP sent! (Demo: Use 1234)', 'success');
  startOTPTimer();
}

function verifyOTP() {
  let otp = document.getElementById("otp").value.trim();
  

  if (otp === "1234") {
    localStorage.setItem('otpVerified', 'true');
    showMessage('OTP Verified! You can now create account.', 'success');
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    const timerSection = document.getElementById('otpTimerSection');
    if (timerSection) timerSection.style.display = 'none';
  } else {
    showMessage('Invalid OTP. Demo OTP is 1234', 'error');
  }
}

function createAccount() {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let mobile = document.getElementById("mobile").value.trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let otpVerified = localStorage.getItem('otpVerified') === 'true';

  if (!name || !email || !mobile || !password || !confirmPassword) {
    showMessage('Please fill all fields including password and confirm password', 'error');
    return;
  }

  if (!otpVerified) {
    showMessage('Complete email & OTP verification first', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'error');
    return;
  }

  let passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passRegex.test(password)) {
    showMessage('Password must be 8+ chars with uppercase, number & special char', 'error');
    return;
  }

  let users = getUsers();
  if (users[email]) {
    showMessage('Email already registered. Please login.', 'error');
    return;
  }

  users[email] = { name, mobile, pass: password };
  saveUsers(users);

  document.querySelectorAll('input').forEach(input => input.value = '');
  localStorage.removeItem('emailVerified');
  localStorage.removeItem('otpVerified');
  
  showMessage('Account created successfully! Please login with your email & password.', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// ===== PROFILE STEP FLOW =====
let currentStep = 1;
const totalSteps = 3;

function goToStep(stepNum) {
  if (stepNum > currentStep) {
    if (!validateStep(currentStep)) return;
  }

  for (let i = 1; i <= totalSteps; i++) {
    const pane = document.getElementById('step' + i);
    if (pane) pane.classList.remove('active');
    const ind = document.getElementById('stepIndicator' + i);
    if (ind) {
      ind.classList.remove('active', 'completed');
      if (i < stepNum) ind.classList.add('completed');
    }
  }

  const target = document.getElementById('step' + stepNum);
  if (target) target.classList.add('active');
  const targetInd = document.getElementById('stepIndicator' + stepNum);
  if (targetInd) targetInd.classList.add('active');

  currentStep = stepNum;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function tryGoToStep(target) {
  if (target < currentStep) {
    goToStep(target);
    return;
  }
  if (target === currentStep) return;
  for (let s = currentStep; s < target; s++) {
    if (!validateStep(s)) return;
  }
  goToStep(target);
}

function validateStep(step) {
  if (step === 1) {
    return validatePersonalDetails();
  }
  if (step === 2) {
    return validateAccountDetails();
  }
  return true;
}

function validatePersonalDetails() {
  const checks = [
    { id: 'firstName',  msg: 'Please enter your First Name' },
    { id: 'lastName',   msg: 'Please enter your Last Name' },
    { id: 'phone',      msg: 'Please enter your Phone Number' },
    { id: 'email',      msg: 'Please enter your Email ID' },
    { id: 'dob',        msg: 'Please enter your Date of Birth' },
    { id: 'gender',     msg: 'Please select your Gender' },
    { id: 'house',      msg: 'Please enter your House / Flat No' },
    { id: 'street',     msg: 'Please enter your Street / Area' },
    { id: 'city',       msg: 'Please enter your City' },
    { id: 'district',   msg: 'Please enter your District' },
    { id: 'state',      msg: 'Please enter your State' },
    { id: 'country',    msg: 'Please enter your Country' },
    { id: 'postal',     msg: 'Please enter your Zip / Pin Code' },
  ];
  for (const { id, msg } of checks) {
    const el = document.getElementById(id);
    if (!el) continue;
    const val = el.value.trim();
    if (!val) {
      showMessage(msg, 'error');
      el.focus();
      return false;
    }
  }
  const phone = document.getElementById('phone').value.trim();
  if (!/^\d{10}$/.test(phone)) {
    showMessage('Phone number must be exactly 10 digits', 'error');
    document.getElementById('phone').focus();
    return false;
  }
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address', 'error');
    document.getElementById('email').focus();
    return false;
  }
  // ===== AGE VALIDATION (18+) =====
const dobValue = document.getElementById('dob').value;

if (dobValue) {
  const dob = new Date(dobValue);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 18) {
    showMessage('You must be at least 18 years old to register.', 'error');
    document.getElementById('dob').focus();
    return false;
  }
}
  return true;
}

function validateAccountDetails() {
  const checks = [
    { id: 'Beneficiaryname', msg: 'Please enter the Beneficiary Name' },
    { id: 'BankName',        msg: 'Please enter the Bank Name' },
    { id: 'AccountNumber',   msg: 'Please enter the Account Number' },
    { id: 'ifsc',            msg: 'Please enter the IFSC Code' },
    { id: 'accountType',     msg: 'Please select the Account Type' },
    { id: 'branchAddress',   msg: 'Please enter the Branch Address' },
  ];
  for (const { id, msg } of checks) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (!el.value.trim()) {
      showMessage(msg, 'error');
      el.focus();
      return false;
    }
  }
  return true;
}

function validateProfile() {
  return validatePersonalDetails();
}

function loadProfileData() {
  const data = localStorage.getItem('profileData');
  if (data) {
    try {
      const profile = JSON.parse(data);
      ['firstName', 'lastName', 'phone', 'altPhone', 'email', 'dob'].forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = profile.personal?.[field] || '';
      });
      const genderEl = document.getElementById('gender');
      if (genderEl) genderEl.value = profile.personal?.gender || '';
      
      ['house', 'street', 'landmark', 'city', 'district', 'state', 'country', 'postal'].forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = profile.address?.[field] || '';
      });

      ['Beneficiaryname', 'BankName', 'AccountNumber', 'ifsc', 'gstNumber', 'branchAddress'].forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = profile.account?.[field] || '';
      });
      const accType = document.getElementById('accountType');
      if (accType) accType.value = profile.account?.accountType || '';
      
      if (profile.documents) {
        Object.keys(profile.documents).forEach(key => {
          const img = document.getElementById(key + 'Preview');
          if (img && profile.documents[key]) {
            img.src = profile.documents[key];
            img.style.display = 'block';
          }
        });
      }
      showMessage('Profile data loaded successfully!', 'success');
    } catch (e) {
      showMessage('Error loading data. Clearing corrupt data.', 'error');
      localStorage.removeItem('profileData');
    }
  } else {
    showMessage('No saved data found', 'info');
  }
}

function saveProfileData() {
  if (!validatePersonalDetails()) return;

  const profile = {
    personal: {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      altPhone: document.getElementById('altPhone').value.trim(),
      email: document.getElementById('email').value.trim(),
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value
    },
    address: {
      house: document.getElementById('house').value.trim(),
      street: document.getElementById('street').value.trim(),
      landmark: document.getElementById('landmark').value.trim(),
      city: document.getElementById('city').value.trim(),
      district: document.getElementById('district').value.trim(),
      state: document.getElementById('state').value.trim(),
      country: document.getElementById('country').value.trim(),
      postal: document.getElementById('postal').value.trim()
    },
    account: {
      Beneficiaryname: (document.getElementById('Beneficiaryname') || {}).value || '',
      BankName: (document.getElementById('BankName') || {}).value || '',
      AccountNumber: (document.getElementById('AccountNumber') || {}).value || '',
      ifsc: (document.getElementById('ifsc') || {}).value || '',
      gstNumber: (document.getElementById('gstNumber') || {}).value || '',
      accountType: (document.getElementById('accountType') || {}).value || '',
      branchAddress: (document.getElementById('branchAddress') || {}).value || ''
    },
    documents: window.documentPreviews || {}
  };

  localStorage.setItem('profileData', JSON.stringify(profile));
  localStorage.setItem('profileComplete', 'true');
  showMessage('Profile completed! Redirecting to Categories...', 'success');
  
  setTimeout(() => {
    window.location.href = 'categories.html';
  }, 2000);
}

function handleFileUpload(id) {
  const fileInput = document.getElementById(id);
  const previewId = id + 'Preview';
  const fileNameId = id + 'FileName';
  const file = fileInput.files[0];

  if (file && file.size < 5 * 1024 * 1024) {

    if (!window.documentPreviews) window.documentPreviews = {};

    const reader = new FileReader();

    reader.onload = function(e) {

      // show preview
      const previewEl = document.getElementById(previewId);
      if (previewEl) {
        previewEl.src = e.target.result;
        previewEl.style.display = 'block';
      }

      // store preview
      window.documentPreviews[id] = e.target.result;

      // show selected file name
      const fileNameEl = document.getElementById(fileNameId);
      if (fileNameEl) {
        fileNameEl.textContent = "Selected: " + file.name;
      }

      showMessage(file.name + " uploaded successfully", "success");
    };

    reader.readAsDataURL(file);

  } else {
    showMessage("File too large (max 5MB) or invalid", "error");
    fileInput.value = "";
  }
}
function initProfile() {
  const user = localStorage.getItem('user') || 'Vendor';
  document.getElementById('userGreeting').textContent = `Complete your profile, ${user}!`;
  
  if (!isAuthenticated()) {
    showMessage('Session expired. Redirecting to login...', 'error');
    setTimeout(() => window.location.href = 'index.html', 2000);
    return;
  }
  
  if (localStorage.getItem('profileComplete') === 'true') {
    showMessage('Profile complete! Redirecting to Categories...', 'success');
    setTimeout(() => window.location.href = 'categories.html', 1500);
    return;
  }
  
  goToStep(1);
  // ===== DOB LIMIT (18+ ONLY) =====
const dobInput = document.getElementById('dob');
if (dobInput) {
  const today = new Date();
  const minAgeDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  dobInput.max = minAgeDate.toISOString().split('T')[0];
}
  
  const data = localStorage.getItem('profileData');
  if (data) {
    loadProfileData();
    showMessage('Profile loaded. Complete remaining fields and save.', 'success');
  } else {
    showMessage('Welcome! Fill your profile details step by step.', 'info');
  }
}

// Legacy tab function for categories page
function showTab(tabName) {
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (event && event.target) event.target.classList.add('active');
}

// Message helper (for all pages)
function showMessage(text, type = 'info', duration = 4000) {
  const existing = document.querySelector('.app-message');
  if (existing) existing.remove();
  
  const msg = document.createElement('div');
  msg.className = `app-message ${type}-msg`;
  msg.textContent = text;
  
  document.body.appendChild(msg);
  
  setTimeout(() => {
    if (msg.parentNode) msg.remove();
  }, duration);
}

// ===== RESET PASSWORD FUNCTIONS =====
let currentResetOTP = null;
let resetTimerInterval = null;

function sendResetOTP() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) {
    showMessage('Please enter your email', 'error');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email', 'error');
    return;
  }
  const users = getUsers();
  if (!users[email]) {
    showMessage('No account found with this email', 'error');
    return;
  }

  currentResetOTP = Math.floor(100000 + Math.random() * 900000).toString();
  showMessage('OTP sent! Demo OTP: ' + currentResetOTP, 'success', 30000);

  document.getElementById('otpSection').style.display = 'block';
  document.getElementById('newPasswordSection').style.display = 'none';
  startResetTimer();
}

function startResetTimer() {
  let seconds = 60;
  const timerText = document.getElementById('resetTimerText');
  const countdown = document.getElementById('resetCountdown');
  const resendBtn = document.getElementById('resendResetBtn');

  timerText.style.display = 'inline';
  resendBtn.style.display = 'none';
  countdown.textContent = seconds;

  if (resetTimerInterval) clearInterval(resetTimerInterval);

  resetTimerInterval = setInterval(() => {
    seconds--;
    countdown.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(resetTimerInterval);
      timerText.style.display = 'none';
      resendBtn.style.display = 'inline-block';
    }
  }, 1000);
}

function resendResetOTP() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) {
    showMessage('Please enter your email first', 'error');
    return;
  }
  currentResetOTP = Math.floor(100000 + Math.random() * 900000).toString();
  showMessage('OTP resent! Demo OTP: ' + currentResetOTP, 'success', 30000);
  startResetTimer();
}

function verifyResetOTP() {
  const entered = document.getElementById('resetOTP').value.trim();
  if (!entered) {
    showMessage('Please enter the OTP', 'error');
    return;
  }
  if (!currentResetOTP) {
    showMessage('Please send OTP first', 'error');
    return;
  }
  if (entered !== currentResetOTP) {
    showMessage('Invalid OTP. Please check and try again.', 'error');
    return;
  }
  if (resetTimerInterval) clearInterval(resetTimerInterval);
  showMessage('OTP verification successful', 'success');
  document.getElementById('newPasswordSection').style.display = 'block';
  document.getElementById('otpSection').querySelector('div[style]').style.display = 'none';
}

function resetPassword() {
  const email = document.getElementById('forgotEmail').value.trim();
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;

  if (!newPass || !confirmPass) {
    showMessage('Please fill both password fields', 'error');
    return;
  }
  if (newPass !== confirmPass) {
    showMessage('Passwords do not match', 'error');
    return;
  }
  const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passRegex.test(newPass)) {
    showMessage('Password must be 8+ chars with uppercase, number & special char', 'error');
    return;
  }

  const users = getUsers();
  if (!users[email]) {
    showMessage('Email not found. Please restart the process.', 'error');
    return;
  }
  users[email].pass = newPass;
  saveUsers(users);

  currentResetOTP = null;
  showMessage('Password reset successful! Redirecting to login...', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
}

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ===== CATEGORIES FUNCTIONS =====
const productCategories = {
  vehicles: ['Bicycles', 'Scooters & Mopeds', 'Motorcycles', 'Passenger Cars', 'Vans & Tempo', 'Auto-Rickshaws', 'Electric Bicycles', 'Boats & Watercraft'],
  tools_equipment: ['Power Drills', 'Diesel Generators', 'Welding Machines', 'Ladders & Scaffolding', 'Lawn Mowers', 'High-Pressure Washers', 'Concrete Mixers', 'Water Pumps'],
  furniture: ['Folding Tables', 'Folding Chairs', 'Sofas & Couches', 'Beds & Mattresses', 'Office Workstations', 'Wardrobes & Almirahs', 'Study Tables', 'Baby Cribs & Cradles'],
  electronics: ['Laptops & Notebooks', 'Projectors', 'DSLR & Mirrorless Cameras', 'Video Cameras & Camcorders', 'Speakers & PA Systems', 'LED Displays & Screens', 'Set-Top Boxes & DTH', 'Gaming Consoles'],
  event_party: ['Tents & Shamianas', 'Stage & Event Lighting', 'DJ & Sound Systems', 'Decoration & Floral Items', 'Banquet Tables & Chair Sets', 'Catering Equipment', 'Portable Sanitation Units', 'Canopies & Outdoor Gazebos'],
  sports_outdoor: ['Trekking & Hiking Gear', 'Camping Tents', 'Cricket Equipment', 'Football Kits & Accessories', 'Badminton Sets', 'Cycling Gear', 'Gym & Fitness Equipment', 'Swimming & Water Accessories'],
  baby_kids: ['Baby Prams & Strollers', 'High Chairs & Booster Seats', 'Baby Carriers & Slings', "Children's Bicycles", 'Baby Bouncers & Swings', 'Baby Cots & Cradles', 'Activity Play Gyms', 'Educational Toys & Activity Sets'],
  construction: ['Scaffolding Systems', 'Floor Polishing Machines', 'Tile Cutters & Grinders', 'Soil Compactors', 'Mini Excavators & JCB', 'Concrete Vibrators', 'Personal Protective Equipment', 'Surveying & Levelling Instruments']
};

function initCategories() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }
  
  const user = localStorage.getItem('user') || 'Vendor';
  const email = localStorage.getItem('userEmail') || user;
  
  document.getElementById('categoryGreeting').textContent = `Select Your Categories`;
  document.getElementById('smallScreenGreeting').textContent = `Hello ${email}`;
}

function showCategoryTab(tabName) {

  // hide all tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  // show selected tab
  const targetPane = document.getElementById(tabName);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // update active tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  if (event && event.target) {
    event.target.classList.add('active');
  }

  // FIX: force re-render for product cards
  if (tabName === 'product') {
    const grid = document.querySelector('#product .category-grid');
    if (grid) {
      grid.style.display = 'none';
      grid.offsetHeight; 
      grid.style.display = 'grid';
    }
  }
}

function selectCategory(category) {
  window.location.href = 'product-subcategory.html?category=' + encodeURIComponent(category);
}

// ===== PRODUCT SUBCATEGORY PAGE =====
const productBrands = {
  'Laptops':              ['HP', 'Dell', 'Lenovo', 'Apple', 'Asus', 'Acer', 'MSI', 'Samsung', 'Other'],
  'Projectors':           ['Epson', 'BenQ', 'ViewSonic', 'Sony', 'LG', 'Optoma', 'Other'],
  'DSLR Cameras':         ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Olympus', 'Other'],
  'Video Cameras':        ['Sony', 'Canon', 'Panasonic', 'GoPro', 'Blackmagic', 'Other'],
  'Speakers & PA Systems':['JBL', 'Bose', 'Sony', 'Yamaha', 'Ahuja', 'Bosch', 'Other'],
  'LED Screens':          ['Samsung', 'LG', 'Sony', 'Philips', 'Panasonic', 'Other'],
  'DTH / Set-top Boxes':  ['Tata Sky', 'Dish TV', 'Sun Direct', 'Airtel DTH', 'Jio', 'Other'],
  'Gaming Consoles':      ['Sony PlayStation', 'Microsoft Xbox', 'Nintendo', 'Other'],
  'Bicycles':             ['Hero', 'Atlas', 'Hercules', 'Firefox', 'Trek', 'Giant', 'Other'],
  'Scooters / Mopeds':    ['Honda', 'TVS', 'Bajaj', 'Suzuki', 'Hero', 'Other'],
  'Motorcycles':          ['Royal Enfield', 'Bajaj', 'Honda', 'TVS', 'Yamaha', 'KTM', 'Other'],
  'Cars':                 ['Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Kia', 'Other'],
  'Vans & Tempo':         ['Tata', 'Mahindra', 'Force', 'Ashok Leyland', 'Other'],
  'Power Drills':         ['Bosch', 'Makita', 'DeWalt', 'Black & Decker', 'Stanley', 'Other'],
  'Generators':           ['Honda', 'Kirloskar', 'Mahindra', 'Greaves', 'Cummins', 'Other'],
  'Folding Tables':       ['Nilkamal', 'Godrej', 'Durian', 'Featherlite', 'Other'],
  'Folding Chairs':       ['Nilkamal', 'Godrej', 'Durian', 'Featherlite', 'Other'],
  'Sofas':                ['Godrej Interio', 'Durian', 'Pepperfry', 'Urban Ladder', 'Other'],
  'Tents & Shamiana':     ['Aman Tent', 'Pioneer', 'Generic', 'Other'],
  'Camping Tents':        ['Quechua', 'Coleman', 'NatureHike', 'Wildcraft', 'Other'],
  'Baby Prams / Strollers':['Graco', 'Chicco', 'Mamas & Papas', 'R for Rabbit', 'Other'],
  'Scaffolding':          ['Layher', 'Safway', 'Local Fabricated', 'Other'],
  'DEFAULT':              ['Other / Local Brand', 'Other']
};

const productSpecs = {
  'Laptops':        ['RAM (e.g. 8GB)', 'Storage (e.g. 512GB SSD)', 'Processor (e.g. Intel i5)', 'Operating System', 'Laptop Size (e.g. 15.6 inch)'],
  'DSLR Cameras':   ['Megapixels', 'Sensor Type', 'Lens Mount', 'Video Resolution'],
  'Video Cameras':  ['Resolution', 'Sensor Size', 'Battery Life (hours)', 'Storage Type'],
  'Projectors':     ['Resolution', 'Brightness (Lumens)', 'Throw Ratio', 'Connectivity'],
  'Speakers & PA Systems': ['Power Output (Watts)', 'Frequency Response', 'Connectivity', 'Number of Units'],
  'LED Screens':    ['Screen Size (inches)', 'Resolution', 'Panel Type', 'Refresh Rate'],
  'Gaming Consoles':['Storage Capacity', 'Generation / Model', 'Controllers Included', 'Condition'],
  'Bicycles':       ['Wheel Size', 'Gear Type', 'Frame Material', 'Brakes Type'],
  'Motorcycles':    ['Engine CC', 'Fuel Type', 'Year of Manufacture', 'Mileage (kmpl)'],
  'Cars':           ['Engine CC', 'Fuel Type', 'Year of Manufacture', 'Seating Capacity'],
  'Vans & Tempo':   ['Load Capacity (tons)', 'Engine Type', 'Year of Manufacture', 'Fuel Type'],
  'Power Drills':   ['Chuck Size', 'Power (Watts)', 'Speed (RPM)', 'Corded / Cordless'],
  'Generators':     ['Power Output (kVA)', 'Fuel Type', 'Run Time (hours)', 'Phase'],
  'Camping Tents':  ['Capacity (persons)', 'Season Rating', 'Material', 'Setup Time'],
  'Baby Prams / Strollers': ['Age Range', 'Weight Capacity', 'Folding Type', 'Harness Type'],
  'Scaffolding':    ['Height (feet)', 'Material', 'Load Capacity', 'Number of Sections'],
  'DEFAULT':        ['Condition', 'Year of Purchase', 'Additional Info']
};

let currentSubcategory = null;

const subcategoryIcons = {
  'Bicycles': '\u{1F6B2}', 'Scooters / Mopeds': '\u{1F6F5}', 'Motorcycles': '\u{1F3CD}\uFE0F', 'Cars': '\u{1F697}',
  'Vans & Tempo': '\u{1F690}', 'Auto-rickshaws': '\u{1F6FA}', 'Electric Cycles': '\u26A1', 'Boats / Kayaks': '\u{1F6A4}',
  'Power Drills': '\u{1F529}', 'Generators': '\u26A1', 'Welding Machines': '\u{1F525}', 'Ladders & Scaffolding': '\u{1FA9C}',
  'Lawn Mowers': '\u{1F33F}', 'Pressure Washers': '\u{1F4A7}', 'Concrete Mixers': '\u{1F3D7}\uFE0F', 'Water Pumps': '\u26FD',
  'Folding Tables': '\u{1FA91}', 'Folding Chairs': '\u{1FA91}', 'Sofas': '\u{1F6CB}\uFE0F', 'Beds & Mattresses': '\u{1F6CF}\uFE0F',
  'Office Desks': '\u{1F5A5}\uFE0F', 'Almirahs / Wardrobes': '\u{1F6AA}', 'Study Tables': '\u{1F4DA}', 'Baby Cribs': '\u{1F37C}',
  'Laptops': '\u{1F4BB}', 'Projectors': '\u{1F4FD}\uFE0F', 'DSLR Cameras': '\u{1F4F7}', 'Video Cameras': '\u{1F3A5}',
  'Speakers & PA Systems': '\u{1F50A}', 'LED Screens': '\u{1F4FA}', 'DTH / Set-top Boxes': '\u{1F4E1}', 'Gaming Consoles': '\u{1F3AE}',
  'Tents & Shamiana': '\u26FA', 'Stage Lighting': '\u{1F4A1}', 'DJ Sound Systems': '\u{1F3B5}', 'Decoration Items': '\u{1F380}',
  'Tables & Chair Sets': '\u{1FA91}', 'Catering Equipment': '\u{1F37D}\uFE0F', 'Portable Toilets': '\u{1F6BB}', 'Canopies & Gazebos': '\u{1F3D5}\uFE0F',
  'Trekking Gear': '\u{1F97E}', 'Camping Tents': '\u26FA', 'Cricket Equipment': '\u{1F3CF}', 'Football Kits': '\u26BD',
  'Badminton Sets': '\u{1F3F8}', 'Cycling Gear': '\u{1F6B4}', 'Gym Equipment': '\u{1F3CB}\uFE0F', 'Swimming Accessories': '\u{1F3CA}',
  'Baby Prams / Strollers': '\u{1F476}', "Kids' Cycles": '\u{1F6B2}', 'High Chairs': '\u{1FA91}', 'Baby Carriers': '\u{1F931}',
  'Bouncers': '\u{1F3A0}', 'Baby Cots': '\u{1F6CF}\uFE0F', 'Play Gyms': '\u{1F3AF}', 'Toys & Activity Sets': '\u{1F9F8}',
  'Scaffolding': '\u{1F3D7}\uFE0F', 'Floor Polishing Machines': '\u2728', 'Tile Cutters': '\u{1F52A}', 'Compactors': '\u{1F3D7}\uFE0F',
  'JCB / Mini Excavators': '\u{1F69C}', 'Concrete Vibrators': '\u2699\uFE0F', 'Safety Equipment': '\u{1F9BA}', 'Surveying Instruments': '\u{1F4D0}'
};

function initSubcategoryPage() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  if (!category || !productCategories[category]) {
    window.location.href = 'categories.html';
    return;
  }
  const label = category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  document.getElementById('subPageTitle').textContent = label + ' Products';
  document.getElementById('subPageHeading').textContent = '\u{1F4E6} Select a Subcategory \u2014 ' + label;

  const grid = document.getElementById('subcategoryGrid');
  grid.innerHTML = '';
  productCategories[category].forEach(sub => {
    const div = document.createElement('div');
    div.className = 'category-card';
    div.onclick = () => openProductDetail(sub, category);
    div.innerHTML = `<div class="category-icon">${subcategoryIcons[sub] || '\u{1F4E6}'}</div><h4>${sub}</h4>`;
    grid.appendChild(div);
  });
}

function openProductDetail(subcategory, category) {
  currentSubcategory = subcategory;
  document.getElementById('productDetailSection').style.display = 'block';
  document.getElementById('addProductSection').style.display = 'none';
  document.getElementById('productDetailTitle').textContent = '\u{1F6D2} ' + subcategory;

  const brandSelect = document.getElementById('brandSelect');
  const brands = productBrands[subcategory] || productBrands['DEFAULT'];
  brandSelect.innerHTML = '<option value="">-- Select Brand --</option>';
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    brandSelect.appendChild(opt);
  });

  // Show/hide "Other brand" text input
  let otherBrandGroup = document.getElementById('otherBrandGroup');
  if (!otherBrandGroup) {
    otherBrandGroup = document.createElement('div');
    otherBrandGroup.className = 'form-group';
    otherBrandGroup.id = 'otherBrandGroup';
    otherBrandGroup.style.display = 'none';
    otherBrandGroup.innerHTML = '<label>Brand Name <span style="color:red;">*</span></label><input type="text" id="otherBrandInput" placeholder="Type brand name here">';
    brandSelect.parentElement.parentElement.appendChild(otherBrandGroup);
  } else {
    otherBrandGroup.style.display = 'none';
    document.getElementById('otherBrandInput').value = '';
  }
  brandSelect.onchange = function() {
    const isOther = this.value === 'Other' || this.value === 'Other / Local Brand';
    otherBrandGroup.style.display = isOther ? 'block' : 'none';
    if (!isOther) document.getElementById('otherBrandInput').value = '';
  };

  const specs = productSpecs[subcategory] || productSpecs['DEFAULT'];
  const specsGrid = document.getElementById('specsGrid');
  specsGrid.innerHTML = '';

  // Manufacturing Year field (for all products)
  const yearDiv = document.createElement('div');
  yearDiv.className = 'form-group';
  const currentYear = new Date().getFullYear();
  let yearOptions = '<option value="">-- Select Year --</option>';
  for (let y = currentYear; y >= 1990; y--) {
    yearOptions += `<option value="${y}">${y}</option>`;
  }
  yearDiv.innerHTML = `<label>Manufacturing Year <span style="color:red;">*</span></label><select id="manufacturingYear">${yearOptions}</select>`;
  specsGrid.appendChild(yearDiv);

  specs.forEach(spec => {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `<label>${spec}</label><input type="text" placeholder="Enter ${spec}">`;
    specsGrid.appendChild(div);
  });

  // Rental Period dropdown
  const rentalDiv = document.createElement('div');
  rentalDiv.className = 'form-group';
  rentalDiv.innerHTML = `<label>Rental Period <span style="color:red;">*</span></label>
    <select id="rentalPeriod">
      <option value="">-- Select Period --</option>
      <option value="1 Week">1 Week</option>
      <option value="1 Month">1 Month</option>
      <option value="3 Months">3 Months</option>
      <option value="6 Months">6 Months</option>
      <option value="1 Year">1 Year</option>
    </select>`;
  specsGrid.appendChild(rentalDiv);

  // Price field
  const priceDiv = document.createElement('div');
  priceDiv.className = 'form-group';
  priceDiv.innerHTML = `<label>Price (₹) <span style="color:red;">*</span></label>
    <input type="number" id="productPrice" placeholder="e.g. 2500" min="0">`;
  specsGrid.appendChild(priceDiv);

  const descDiv = document.createElement('div');
  descDiv.className = 'form-group full-width';
  descDiv.innerHTML = '<label>Description</label><textarea id="productDescription" placeholder="Describe the product condition, usage, or any other details..." rows="3" style="resize:vertical;"></textarea>';
  specsGrid.appendChild(descDiv);

  document.getElementById('productDetailSection').scrollIntoView({ behavior: 'smooth' });
}

function saveProductSelection() {
  let brand = document.getElementById('brandSelect').value;
  if (!brand) {
    showMessage('Please select a brand.', 'error');
    return;
  }
  // If "Other" selected, use the typed brand name
  if (brand === 'Other' || brand === 'Other / Local Brand') {
    const otherBrand = (document.getElementById('otherBrandInput')?.value || '').trim();
    if (!otherBrand) {
      showMessage('Please enter the brand name.', 'error');
      return;
    }
    brand = otherBrand;
  }
  // Manufacturing Year
  const manufacturingYear = document.getElementById('manufacturingYear')?.value || '';
  if (!manufacturingYear) {
    showMessage('Please select a Manufacturing Year.', 'error');
    return;
  }
  const specInputs = document.querySelectorAll('#specsGrid .form-group input');
  const specs = {};
  let emptyField = null;
  specInputs.forEach(input => {
    const label = input.previousElementSibling.textContent;
    const value = input.value.trim();
    if (!value && !emptyField) {
      emptyField = label;
    }
    specs[label] = value;
  });
  if (emptyField) {
    showMessage(`Please fill the "${emptyField}" field.`, 'error');
    return;
  }
  // Rental Period + Price
  const rentalPeriod = document.getElementById('rentalPeriod')?.value || '';
  if (!rentalPeriod) {
    showMessage('Please select a Rental Period.', 'error');
    return;
  }
  const productPrice = document.getElementById('productPrice')?.value || '';
  if (!productPrice || isNaN(productPrice) || Number(productPrice) < 0) {
    showMessage('Please enter a valid Price (₹).', 'error');
    return;
  }
  const description = document.getElementById('productDescription')?.value || '';
  let saved = JSON.parse(localStorage.getItem('vendorProducts') || '[]');
  saved.push({
    subcategory: currentSubcategory,
    brand,
    manufacturingYear,
    rentalPeriod,
    productPrice,
    specs,
    description
  });
  const photos = collectPhotos();
  localStorage.setItem('vendorProducts', JSON.stringify(saved));
  saved[saved.length - 1].photos = photos;
  localStorage.setItem('vendorProducts', JSON.stringify(saved));
  showMessage(`${currentSubcategory} (${brand}) saved successfully!`, 'success');
  document.getElementById('productDetailSection').style.display = 'none';
  // Reset Other brand input
  const otherBrandGroup = document.getElementById('otherBrandGroup');
  if (otherBrandGroup) otherBrandGroup.style.display = 'none';
  resetPhotoUploads();
}
function previewPhoto(input, previewId, labelId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.getElementById(previewId);
    const lbl = document.getElementById(labelId);
    img.src = e.target.result;
    img.style.display = 'block';
    lbl.style.display = 'none';
    // Add remove button if not already there
    const box = input.closest('.photo-upload-box');
    if (!box.querySelector('.photo-remove-btn')) {
      const btn = document.createElement('button');
      btn.className = 'photo-remove-btn';
      btn.innerHTML = '&times;';
      btn.title = 'Remove photo';
      btn.onclick = function(ev) {
        ev.stopPropagation();
        img.src = ''; img.style.display = 'none';
        lbl.style.display = 'flex';
        input.value = '';
        btn.remove();
      };
      box.appendChild(btn);
    }
  };
  reader.readAsDataURL(file);
}

function resetPhotoUploads() {
  ['Front','Back','Left','Right'].forEach(side => {
    const input = document.getElementById('photo' + side);
    const img   = document.getElementById('prev'  + side);
    const lbl   = document.getElementById('lbl'   + side);
    if (input) input.value = '';
    if (img)   { img.src = ''; img.style.display = 'none'; }
    if (lbl)   lbl.style.display = 'flex';
    const box = input?.closest('.photo-upload-box');
    const btn = box?.querySelector('.photo-remove-btn');
    if (btn) btn.remove();
  });
}

function collectPhotos() {
  const photos = {};
  ['Front','Back','Left','Right'].forEach(side => {
    const img = document.getElementById('prev' + side);
    if (img && img.src && img.style.display !== 'none') {
      photos[side.toLowerCase()] = img.src;
    }
  });
  return photos;
}

function toggleAddProduct() {
  const sec = document.getElementById('addProductSection');
  sec.style.display = sec.style.display === 'none' ? 'block' : 'none';
  if (sec.style.display === 'block') sec.scrollIntoView({ behavior: 'smooth' });
}
function saveCustomProduct() {
  const name = document.getElementById('customProductName').value.trim();
  const brand = document.getElementById('customBrand').value.trim();
  const specs = document.getElementById('customSpecs').value.trim();
  const manufacturingYear = document.getElementById('customMfgYear')?.value || '';
  if (!name || !brand) { showMessage('Product Name and Brand are required.', 'error'); return; }
  if (!manufacturingYear) { showMessage('Please select a Manufacturing Year.', 'error'); return; }
  let saved = JSON.parse(localStorage.getItem('vendorProducts') || '[]');
  saved.push({ subcategory: name, brand, manufacturingYear, specs, custom: true });
  localStorage.setItem('vendorProducts', JSON.stringify(saved));
  showMessage(`Custom product "${name}" added successfully!`, 'success');
  document.getElementById('customProductName').value = '';
  document.getElementById('customBrand').value = '';
  document.getElementById('customSpecs').value = '';
  if (document.getElementById('customMfgYear')) document.getElementById('customMfgYear').value = '';
  document.getElementById('addProductSection').style.display = 'none';
}

// ===== INDIA STATES & CITIES DATA =====
const indiaCities = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada", "Nellore", "Kurnool", "Rajahmundry"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tezpur"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Kalaburagi", "Ballari", "Tumkur"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Kolhapur", "Amravati"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar", "Bharatpur"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Moradabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Rishikesh", "Haldwani", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda"],
  "Andaman and Nicobar Islands": ["Port Blair", "Car Nicobar", "Diglipur"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket", "Lajpat Nagar", "Janakpuri", "Pitampura"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};

let selectedServiceName = null;

function initStateDropdown() {
  const stateSelect = document.getElementById('serviceState');
  if (!stateSelect) return;
  const states = Object.keys(indiaCities).sort();
  states.forEach(state => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });
}

function loadCitiesForState() {
  const state = document.getElementById('serviceState').value;
  const citySelect = document.getElementById('serviceCity');
  citySelect.innerHTML = '<option value="">-- Select City --</option>';
  if (state && indiaCities[state]) {
    indiaCities[state].forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }
}


function detectGPS() {
  const btn = document.querySelector('[onclick="detectGPS()"]');
  const input = document.getElementById('gpsLocation');

  // Check if geolocation is supported at all
  if (!navigator.geolocation) {
    if (input) input.placeholder = 'GPS not supported — enter location manually';
    showMessage('GPS is not supported on this device. Please type your location manually.', 'error');
    return;
  }

  if (btn) { btn.textContent = '⏳ Detecting...'; btn.disabled = true; }

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      if (input) input.value = lat + '° N, ' + lng + '° E';
      if (btn) { btn.textContent = '🌍 Detect My Location'; btn.disabled = false; }
      showMessage('GPS location detected successfully!', 'success');
    },
    function(err) {
      if (btn) { btn.textContent = '🌍 Detect My Location'; btn.disabled = false; }
      let msg = 'Could not detect location. Please enter manually.';
      if (err.code === 1) msg = 'Location permission denied. Please allow access or enter manually.';
      else if (err.code === 2) msg = 'Location unavailable on this device. Please enter manually.';
      else if (err.code === 3) msg = 'Location request timed out. Please try again or enter manually.';
      if (input) input.placeholder = 'Enter location manually (e.g. 12.97° N, 77.59° E)';
      showMessage(msg, 'error');
    },
    { timeout: 10000, maximumAge: 60000 }
  );
}

function selectService(service) {
  selectedServiceName = service;

  // Show/hide Other service name input
  const otherSection = document.getElementById('otherServiceNameSection');
  if (otherSection) {
    if (service === 'other') {
      otherSection.style.display = 'block';
      otherSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      otherSection.style.display = 'none';
      if (document.getElementById('otherServiceNameInput')) {
        document.getElementById('otherServiceNameInput').value = '';
      }
    }
  }

  // Highlight selected card
  document.querySelectorAll('#services .category-card').forEach(c => c.classList.remove('selected'));
  event && event.currentTarget && event.currentTarget.classList.add('selected');

  document.getElementById('servicePricing').style.display = 'block';
  document.getElementById('serviceLocation').style.display = 'block';
  initStateDropdown();
  document.getElementById('serviceState').value = '';
  document.getElementById('serviceCity').innerHTML = '<option value="">-- Select City --</option>';

  const label = service === 'other' ? 'Other Service' : service.charAt(0).toUpperCase() + service.slice(1);
  showMessage(`${label} selected! Enter details and set your rates.`, 'success');
}

function saveCategories() {

  const chargePer = document.getElementById('chargePer');
  const rate = document.getElementById('rate');

  if (document.getElementById('servicePricing').style.display !== 'none') {

    // If "Other" service selected, require a name
    if (selectedServiceName === 'other') {
      const otherName = (document.getElementById('otherServiceNameInput')?.value || '').trim();
      if (!otherName) {
        showMessage('Please enter your service name.', 'error');
        document.getElementById('otherServiceNameInput').focus();
        return;
      }
    }

    if (!chargePer || !chargePer.value) {
      showMessage('Please select Charge Per.', 'error');
      chargePer.focus();
      return;
    }

    if (!rate || !rate.value.trim()) {
      showMessage('Please enter the Rate.', 'error');
      rate.focus();
      return;
    }

  }

  const locationSection = document.getElementById('serviceLocation');

  if (locationSection && locationSection.style.display !== 'none') {
    const state = document.getElementById('serviceState').value;
    const city = document.getElementById('serviceCity').value;

    if (!state || !city) {
      showMessage('Please select both State and City for your work location.', 'error');
      return;
    }
  }

  const categories = { products: [], services: [] };
  localStorage.setItem('vendorCategories', JSON.stringify(categories));
  localStorage.setItem('categoriesComplete', 'true');

  showMessage('Categories saved! Redirecting to Dashboard...', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 2000);
}

function toggleCategory(type, category, product) {
  let categories = JSON.parse(localStorage.getItem('vendorCategories') || '{}');
  if (!categories[type]) categories[type] = [];
  const index = categories[type].indexOf(product);
  if (index > -1) {
    categories[type].splice(index, 1);
  } else {
    categories[type].push(product);
  }
  localStorage.setItem('vendorCategories', JSON.stringify(categories));
}

// ===== ADD CUSTOMER PRODUCT FROM CATEGORIES PAGE =====

function toggleAddCustomerProduct() {
  const sec = document.getElementById('addCustomerProductSection');
  if (!sec) return;

  sec.style.display = sec.style.display === 'none' ? 'block' : 'none';

  if (sec.style.display === 'block') {
    sec.scrollIntoView({ behavior: 'smooth' });
  }
}

function saveCustomerProduct() {
  const name = document.getElementById('customerProductName').value.trim();
  const brand = document.getElementById('customerProductBrand').value.trim();
  const specs = document.getElementById('customerProductSpecs').value.trim();

  if (!name || !brand) {
    showMessage('Product Name and Brand are required.', 'error');
    return;
  }

  let saved = JSON.parse(localStorage.getItem('vendorProducts') || '[]');

  saved.push({
    subcategory: name,
    brand: brand,
    specs: specs,
    custom: true
  });

  localStorage.setItem('vendorProducts', JSON.stringify(saved));

  showMessage(`Custom product "${name}" added successfully!`, 'success');

  document.getElementById('customerProductName').value = '';
  document.getElementById('customerProductBrand').value = '';
  document.getElementById('customerProductSpecs').value = '';

  document.getElementById('addCustomerProductSection').style.display = 'none';
}