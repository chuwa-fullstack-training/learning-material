/**
 * 🔴 Perception Phase — Do NOT use AI to generate code.
 * Write the prototype version by hand BEFORE the ES6 class version.
 * Feeling the verbosity of prototype is what makes you appreciate `class`.
 *
 * Submit `learning-log.md`:
 *   - Explain the difference between `__proto__` and `prototype`.
 *   - Why does `Triangle.prototype = Object.create(Shape.prototype)` work but
 *     `Triangle.prototype = Shape.prototype` break things?
 */

function Shape() {
    this.type = 'shape';
}

Shape.prototype.getType = function() {
    return this.type;
}

function Triangle(a, b, c) {
    this.type = 'triangle';
    this.a = a;
    this.b = b;
    this.c = c;
}

Triangle.prototype = Object.create(Shape.prototype);
Triangle.prototype.constructor = Triangle;

// your code goes here
// 1. implement a method getPerimeter for Triangle class
// 2. implement a method getArea for Triangle class

// 3. implement a new class Circle. this class should inherit from Shape class, and have a radius property.
// 4. implement a method area for Circle class
// 5. implement a method circumference for Circle class

// 6. change all code above to use ES6 class syntax