/**
 * 🟡 Understanding Phase — try to solve by hand first, then compare with AI.
 * This teaches type narrowing / discriminated unions — a core TS skill.
 *
 * Submit `learning-log.md`:
 *   - Why does TypeScript complain on `person.role` / `person.occupation`?
 *   - Which narrowing technique did you use? (`in`, `instanceof`, type predicate, discriminant)
 */

interface User {
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  name: string;
  age: number;
  role: string;
}

type Person = User | Admin;

const persons: Person[] = [
  {
    name: "Aaron",
    age: 99,
    occupation: "TypeScript Developer",
  },
  {
    name: "Alex",
    age: 98,
    role: "System Administrator",
  },
];

// fix the error showing in the following code:
function logPerson(person: Person) {
  let additionalInformation: string;
  if (person.role) {
    additionalInformation = person.role;
  } else {
    additionalInformation = person.occupation;
  }
  console.log(` - ${person.name}, ${person.age}, ${additionalInformation}`);
}

persons.forEach(logPerson);
