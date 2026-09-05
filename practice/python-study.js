(function () {
  const grade = Number(document.body.dataset.grade);
  const lessons = {
    3: {
      title: 'Print, values & variables',
      summary: 'Learn how Python displays ideas, stores information, and works with numbers.',
      topics: [
        ['1. Show a message', 'Use <code>print()</code> to show words or numbers. Put text inside quotation marks.', "print('Hello, Maya!')", 'Quiz: predict what <code>print()</code> shows. Practice: personalise a greeting.'],
        ['2. Store a value', 'A variable is a named box. Use <code>=</code> to put a value into it.', "age = 8\nprint(age)", 'Quiz: identify what a variable stores. Practice: change the name or age.'],
        ['3. Do simple maths', 'Python can add, subtract, multiply and divide numbers.', 'apples = 5\nmore_apples = 3\nprint(apples + more_apples)', 'Quiz: work out outputs. Practice: make your own number story.']
      ]
    },
    4: {
      title: 'Print, variables & number patterns',
      summary: 'Use clear messages, named values, and simple calculations to solve small problems.',
      topics: [
        ['1. Print clear messages', 'Use <code>print()</code> for words, numbers, or both together.', "name = 'Riya'\nprint('Hello,', name)", 'Quiz: read <code>print()</code> carefully. Practice: change the message and name.'],
        ['2. Use variables', 'Variables help you remember information so that you can reuse it later.', 'score = 12\nscore = score + 3\nprint(score)', 'Quiz: identify stored values. Practice: change the score.'],
        ['3. Calculate with Python', 'Use <code>+</code>, <code>-</code>, <code>*</code>, <code>//</code>, and <code>**</code> for number work.', 'rows = 4\nseats = 6\nprint(rows * seats)', 'Quiz: predict arithmetic output. Practice: create a multiplication challenge.']
      ]
    },
    5: {
      title: 'Choices, loops & lists',
      summary: 'Teach Python to make decisions, repeat work, and keep several values together.',
      topics: [
        ['1. Make a choice with if', 'An <code>if</code> statement runs code only when its condition is true. <code>else</code> handles the other case.', "score = 7\nif score >= 5:\n    print('Great job!')\nelse:\n    print('Keep trying!')", 'Quiz: check conditions and equality. Practice: change the number and see which message appears.'],
        ['2. Repeat with loops', 'A <code>for</code> loop repeats an action. <code>range()</code> gives it a sequence of numbers.', "for number in range(1, 6):\n    print(number)", 'Quiz: predict loop output. Practice: change the range.'],
        ['3. Keep a list', 'A list keeps related values in one place. List positions start at 0.', "fruits = ['apple', 'banana', 'mango']\nprint(fruits[0])", 'Quiz: read list items and <code>append()</code>. Practice: add your favourite fruit.']
      ]
    },
    6: {
      title: 'Logic, loops & lists',
      summary: 'Build reliable programs by checking conditions, repeating patterns, and changing lists.',
      topics: [
        ['1. Compare values', 'Use <code>==</code> to check equality and <code>%</code> to find a remainder.', "number = 8\nif number % 2 == 0:\n    print('Even')", 'Quiz: practise <code>if</code>, <code>elif</code>, and comparison operators. Practice: test different numbers.'],
        ['2. Repeat carefully', 'Use <code>for</code> when you know the sequence and <code>while</code> while a condition remains true.', "count = 0\nwhile count < 3:\n    print(count)\n    count = count + 1", 'Quiz: predict ranges and loops. Practice: change the stopping value.'],
        ['3. Work with lists', 'Lists can be read, measured with <code>len()</code>, and extended with <code>append()</code>.', "tasks = ['read', 'code']\ntasks.append('share')\nprint(len(tasks))", 'Quiz: practise indexing and list changes. Practice: make your own task list.']
      ]
    },
    7: {
      title: 'Functions, strings & logic',
      summary: 'Write reusable code, transform text, and solve problems with lists and conditions.',
      topics: [
        ['1. Create functions', 'A function is a reusable recipe. Parameters let it accept different values.', "def greet(name):\n    print('Hello,', name)\n\ngreet('Arjun')", 'Quiz: identify function output and return values. Practice: call the function with new names.'],
        ['2. Transform strings', 'Strings are text. Useful methods include <code>upper()</code>, <code>lower()</code>, <code>strip()</code>, and <code>replace()</code>.', "message = 'hello python'\nprint(message.upper())", 'Quiz: predict string-method output. Practice: transform your own message.'],
        ['3. Solve with lists', 'Use built-ins such as <code>len()</code>, <code>sum()</code>, <code>max()</code>, and <code>sorted()</code>.', "numbers = [3, 1, 4]\nprint(sorted(numbers))", 'Quiz: practise list logic. Practice: try a different list of numbers.']
      ]
    },
    8: {
      title: 'Functions, strings & problem solving',
      summary: 'Combine reusable functions with string and list tools to solve multi-step problems.',
      topics: [
        ['1. Return a result', 'Use <code>return</code> when a function should send a value back to the rest of your program.', "def double(number):\n    return number * 2\n\nprint(double(6))", 'Quiz: trace functions and returns. Practice: change the input and build a new function.'],
        ['2. Process text', 'Split, replace, and measure text to turn a message into useful information.', "sentence = 'code is fun'\nprint(sentence.split())\nprint(len(sentence))", 'Quiz: practise string methods. Practice: edit the sentence.'],
        ['3. Use nested logic', 'A loop can contain another loop. This is useful for patterns and grids.', "for row in range(3):\n    for column in range(2):\n        print('*', end='')\n    print()", 'Quiz: predict loop patterns. Practice: change the rows and columns.']
      ]
    },
    9: {
      title: 'Dictionaries, classes & algorithms',
      summary: 'Organise structured data, create objects, and use compact problem-solving patterns.',
      topics: [
        ['1. Organise data with dictionaries', 'A dictionary connects keys to values. Access a value with its key.', "student = {'name': 'Arjun', 'score': 95}\nprint(student['name'])", 'Quiz: read and update dictionaries. Practice: add another key such as <code>city</code>.'],
        ['2. Model objects with classes', 'A class is a blueprint. <code>__init__</code> sets up each new object.', "class Animal:\n    def __init__(self, name):\n        self.name = name\n\ncat = Animal('Milo')\nprint(cat.name)", 'Quiz: identify classes, objects, and constructors. Practice: create another animal.'],
        ['3. Build efficient solutions', 'List comprehensions create lists compactly. Algorithms such as search, sorting, and recursion solve larger problems.', "numbers = [1, 2, 3, 4]\nsquares = [number ** 2 for number in numbers]\nprint(squares)", 'Quiz: practise comprehensions, sorting, recursion, and linear search. Practice: change the list.']
      ]
    },
    10: {
      title: 'Data, objects & algorithms',
      summary: 'Use Python structures and object-oriented ideas to design clear solutions to richer problems.',
      topics: [
        ['1. Structure data with dictionaries', 'Use dictionaries to model related data and loop through their keys and values.', "book = {'title': 'Orbit', 'pages': 240}\nfor key in book:\n    print(key, book[key])", 'Quiz: read, update, and iterate through dictionaries. Practice: extend a data record.'],
        ['2. Design with classes', 'Classes define data and behaviour. Each object has its own attributes.', "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\nstudent = Student('Asha', 92)\nprint(student.score)", 'Quiz: trace classes and <code>__init__</code>. Practice: create another object.'],
        ['3. Reason about algorithms', 'Use comprehensions, sorting, linear search, and recursion when choosing a solution.', "def factorial(number):\n    if number == 1:\n        return 1\n    return number * factorial(number - 1)\n\nprint(factorial(4))", 'Quiz: practise recursion, slices, sorting, and <code>O(n)</code> linear search. Practice: adapt the example.']
      ]
    }
  };

  const lesson = lessons[grade];
  if (!lesson) return;
  document.title = `Grade ${grade} Python Study Material — Brainy Break`;
  document.getElementById('study-root').innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> <span>›</span><a href="/practice/">All Grades</a> <span>›</span><a href="/practice/grade-${grade}/">Grade ${grade}</a> <span>›</span><span>Python Study</span></div>
    <section class="study-hero"><p class="eyebrow">PYTHON LEARNING PATH</p><h1>🐍 Grade ${grade} Python Study Material</h1><p>${lesson.summary}</p><div class="study-actions"><a href="/practice/grade-${grade}/python.html">📝 Take the Quiz</a><a href="/practice/grade-${grade}/python-practice.html">✏️ Open Practice Space</a></div></section>
    <section class="sync-note"><strong>Learn → quiz → practise</strong><span>Each lesson below matches the ideas used in this grade's Python quiz and coding exercises.</span></section>
    <section class="lesson-grid">${lesson.topics.map(([heading, explanation, code, connection]) => `<article class="lesson-card"><h2>${heading}</h2><p>${explanation}</p><pre><code>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code></pre><p class="connection">${connection}</p></article>`).join('')}</section>
    <section class="next-step"><h2>Ready to test your understanding?</h2><p>Start with the quiz, then use the practice space to change the examples and create your own program.</p><div class="study-actions"><a href="/practice/grade-${grade}/python.html">Take Grade ${grade} Quiz →</a><a href="/practice/grade-${grade}/python-practice.html">Write Python Code →</a></div></section>`;
})();
