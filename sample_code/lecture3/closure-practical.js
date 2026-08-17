// ========================================
// Closure Pitfall: for + var
// ========================================

// ❌ Common mistake
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('var loop:', i); // 3, 3, 3
  }, 100);
}

// ✅ Fix 1: use let
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('let loop:', i); // 0, 1, 2
  }, 200);
}

// ✅ Fix 2: use IIFE to capture value
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log('IIFE loop:', j); // 0, 1, 2
    }, 300);
  })(i);
}

// ========================================
// Practical Closure: debounce
// ========================================

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Simulate search input
const search = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// In real usage: input.addEventListener('input', (e) => search(e.target.value));
search('h');
search('he');
search('hel');
search('hello'); // Only this one fires after 300ms

// ========================================
// Practical Closure: once (run only once)
// ========================================

function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log('Initializing...'); // only logs once
  return { ready: true };
});

console.log(initialize()); // Initializing... { ready: true }
console.log(initialize()); // { ready: true } (no re-init)

// ========================================
// Practical Closure: private variables (Module Pattern)
// ========================================

function createUser(name) {
  let loginCount = 0; // private, can't be accessed directly

  return {
    getName: () => name,
    login: () => {
      loginCount++;
      console.log(`${name} logged in (total: ${loginCount})`);
    },
    getLoginCount: () => loginCount,
  };
}

const user = createUser('Aaron');
user.login(); // Aaron logged in (total: 1)
user.login(); // Aaron logged in (total: 2)
console.log(user.getLoginCount()); // 2
// console.log(user.loginCount); // undefined — truly private!
