# Employee & Company CRUD API

> 🟡 **AI Comparison Exercise** — This homework uses the Part A/B/C format.

## Part A: Independent Implementation (No AI)

Create a set of APIs to manage employees and companies. The data should be stored in MongoDB. The API should support the following operations:

- Create a new company
- Create a new employee
- Get a company by id
- Get an employee by id
- Update a company by id
- Update an employee by id
- Delete a company by id
- Delete an employee by id
- Get all companies
- Get all employees
- Get all employees of a company

**Schema Design (design this yourself):**

The Company schema should have the following fields:

- name: String
- description: String
- headquarters: String
- industry: String
- _employees: [EmployeeSchema]_

The Employee schema should have the following fields:

- firstName: String
- lastName: String
- company: CompanySchema
- startDate: Date
- jobTitle: String
- resigned: Boolean
- salary: Number
- _manager: EmployeeSchema_ (optional)

**Before coding**, answer these design questions in a `design-decisions.md`:

1. Should employees be embedded in the company document or referenced? Why?
2. How will you handle the manager relationship (self-referencing)?
3. What validations will you add to your schemas?

## Part B: AI Comparison

Give the same requirements to an AI tool (ChatGPT, Copilot, etc.) and let it generate an implementation. Then write a `comparison.md` that answers:

- How does the AI's Schema design differ from yours? (embed vs reference?)
- Does the AI handle error cases (invalid ID, duplicate entries) better or worse?
- Are there edge cases the AI considered that you missed?
- Are there design decisions in the AI's code that you disagree with? Why?

## Part C: Final Submission

Based on your own implementation and the AI comparison findings, submit your final version. Include a brief note explaining:

- What you changed after the AI comparison
- Why you accepted or rejected each AI suggestion
