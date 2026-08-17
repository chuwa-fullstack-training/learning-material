// ========================================
// async/await Error Handling Patterns
// ========================================

// Simulated API function
function fetchData(url, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`Failed to fetch ${url}`));
      } else {
        resolve({ url, data: 'some data' });
      }
    }, 100);
  });
}

// ========================================
// Pattern 1: try-catch (most common)
// ========================================
async function getUser() {
  try {
    const user = await fetchData('/api/user');
    console.log('User:', user);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return null; // graceful fallback
  }
}

// ========================================
// Pattern 2: Reusable wrapper
// ========================================
async function tryCatch(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function main() {
  // Pattern 1
  const user = await getUser();
  console.log('Got user:', user);

  // Pattern 2
  const [data, err] = await tryCatch(fetchData('/api/posts'));
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Data:', data);
  }

  // Pattern 2 with error
  const [data2, err2] = await tryCatch(fetchData('/api/fail', true));
  if (err2) {
    console.error('Expected error:', err2.message);
  }

  // ========================================
  // Promise.all vs Promise.allSettled
  // ========================================
  console.log('\n--- Promise.all vs Promise.allSettled ---');

  // Promise.allSettled: all complete regardless of success/failure
  const results = await Promise.allSettled([
    fetchData('/api/users'),
    fetchData('/api/posts', true), // this one fails
    fetchData('/api/comments'),
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Request ${index}: ✅`, result.value);
    } else {
      console.log(`Request ${index}: ❌`, result.reason.message);
    }
  });

  // Promise.all: fails fast on first rejection
  try {
    const all = await Promise.all([
      fetchData('/api/users'),
      fetchData('/api/posts', true), // this one fails
      fetchData('/api/comments'),
    ]);
  } catch (error) {
    console.log('Promise.all failed:', error.message);
  }
}

main();
