# Authentication & Authorization

> 🔴 **Security-critical — implement yourself first.** JWT signing, token verification, and role-based access must be implemented independently. After completing Part A, use AI for security review in Part B.

## Part A: Independent Implementation (No AI)

Based on hw1 in lecture 9, implement authentication and authorization for the APIs.

### Requirements

- [ ] Create a login API: `POST /api/login`
  - Accept username and password (you can use `firstName` as username and `lastName` as password, or any combination that makes sense)
  - Return a JWT token on successful login
  - Use `bcrypt` to hash stored passwords
- [ ] Implement a JWT verification middleware
- [ ] Modify existing APIs to enforce authentication and authorization:
  - Only logged-in users can see full employee details (anonymous users can only see `firstName` and `lastName`)
  - Only logged-in users can access employees of their own company (Company A employees can only see Company A employees)
- [ ] Return proper error responses (401 Unauthorized, 403 Forbidden)
- [ ] Never reveal whether the username or password was wrong — use generic "Invalid credentials"

### Design Questions (answer in `design-decisions.md`)

1. Where do you store the JWT secret? Why?
2. What information do you include in the JWT payload? Why?
3. How long should the token be valid? What are the trade-offs?

## Part B: AI Security Review

After completing your implementation:

1. Give your auth code to an AI and ask it to perform a security review
2. Also ask AI to write the same auth system from scratch
3. Write a `comparison.md` answering:
   - What security issues did the AI find in your code?
   - How does the AI's implementation handle edge cases (expired tokens, malformed headers)?
   - Does the AI's error handling reveal too much information to attackers?
   - What would you change based on the AI's feedback?

## Part C: Final Submission

Submit your hardened version with security improvements. Document every security-related change you made.
