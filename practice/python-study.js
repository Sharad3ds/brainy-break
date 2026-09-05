(function () {
  const grade = Number(document.body.dataset.grade);
  const lessons = {
    3: {
      title: 'Print, values & variables',
      summary: 'Learn how Python displays ideas, stores information, and works with numbers.',
      topics: [
        ['1. Show a message', 'Use <code>print()</code> to display a value. Text is written as a string inside quotation marks.', "print('Hello, Maya!')", 'Quiz: predict what <code>print()</code> displays. Practice: personalise a greeting.'],
        ['2. Store a value', 'A variable is a name that refers to a value. Use <code>=</code> to assign or update that value.', "age = 8\nprint(age)", 'Quiz: identify what a variable refers to. Practice: change the name or age.'],
        ['3. Do simple maths', 'Python can add, subtract, multiply and divide numbers.', 'apples = 5\nmore_apples = 3\nprint(apples + more_apples)', 'Quiz: work out outputs. Practice: make your own number story.']
      ]
    },
    4: {
      title: 'Print, variables & number patterns',
      summary: 'Use clear messages, named values, and simple calculations to solve small problems.',
      topics: [
        ['1. Print clear messages', 'Use <code>print()</code> for words, numbers, or both together.', "name = 'Riya'\nprint('Hello,', name)", 'Quiz: read <code>print()</code> carefully. Practice: change the message and name.'],
        ['2. Use variables', 'A variable is a name that refers to a value. Assignment with <code>=</code> lets a program use that value again later.', 'score = 12\nscore = score + 3\nprint(score)', 'Quiz: identify stored values. Practice: change the score.'],
        ['3. Calculate with Python', 'Use <code>+</code>, <code>-</code>, <code>*</code>, <code>//</code> (floor division), and <code>**</code> (power) for number work.', 'rows = 4\nseats = 6\nprint(rows * seats)', 'Quiz: predict arithmetic output. Practice: create a multiplication challenge.']
      ]
    },
    5: {
      title: 'Choices, loops & lists',
      summary: 'Teach Python to make decisions, repeat work, and keep several values together.',
      topics: [
        ['1. Make a choice with if', 'An <code>if</code> statement conditionally runs a block when its condition is true. <code>else</code> runs when the condition is false.', "score = 7\nif score >= 5:\n    print('Great job!')\nelse:\n    print('Keep trying!')", 'Quiz: check conditions and equality. Practice: change the number and see which message appears.'],
        ['2. Repeat with loops', 'A <code>for</code> loop repeats an action for each item. <code>range()</code> produces numbers and excludes its ending value.', "for number in range(1, 6):\n    print(number)", 'Quiz: predict loop output. Practice: change the range.'],
        ['3. Keep a list', 'A list is an ordered collection of values. Its indexes start at 0.', "fruits = ['apple', 'banana', 'mango']\nprint(fruits[0])", 'Quiz: read list items and <code>append()</code>. Practice: add your favourite fruit.']
      ]
    },
    6: {
      title: 'Logic, loops & lists',
      summary: 'Build reliable programs by checking conditions, repeating patterns, and changing lists.',
      topics: [
        ['1. Compare values', 'Use <code>==</code> to test equality and <code>%</code> to calculate the remainder after division.', "number = 8\nif number % 2 == 0:\n    print('Even')", 'Quiz: practise <code>if</code>, <code>elif</code>, and comparison operators. Practice: test different numbers.'],
        ['2. Repeat carefully', 'Use <code>for</code> to iterate over items and <code>while</code> to repeat while a condition is true. Update the condition in a <code>while</code> loop so that it stops.', "count = 0\nwhile count < 3:\n    print(count)\n    count = count + 1", 'Quiz: predict ranges and loops. Practice: change the stopping value.'],
        ['3. Work with lists', 'Lists are ordered, mutable collections. Use <code>len()</code> to count items and <code>append()</code> to add one at the end.', "tasks = ['read', 'code']\ntasks.append('share')\nprint(len(tasks))", 'Quiz: practise indexing and list changes. Practice: make your own task list.']
      ]
    },
    7: {
      title: 'Functions, strings & logic',
      summary: 'Write reusable code, transform text, and solve problems with lists and conditions.',
      topics: [
        ['1. Create functions', 'A function is a named block of code that can be called again. Parameters let one function work with different values.', "def greet(name):\n    print('Hello,', name)\n\ngreet('Arjun')", 'Quiz: identify function output and return values. Practice: call the function with new names.'],
        ['2. Transform strings', 'A string is text. String methods such as <code>upper()</code>, <code>lower()</code>, <code>strip()</code>, and <code>replace()</code> create changed text values.', "message = 'hello python'\nprint(message.upper())", 'Quiz: predict string-method output. Practice: transform your own message.'],
        ['3. Solve with lists', 'Use built-ins such as <code>len()</code>, <code>sum()</code>, <code>max()</code>, and <code>sorted()</code>.', "numbers = [3, 1, 4]\nprint(sorted(numbers))", 'Quiz: practise list logic. Practice: try a different list of numbers.']
      ]
    },
    8: {
      title: 'Functions, strings & problem solving',
      summary: 'Combine reusable functions with string and list tools to solve multi-step problems.',
      topics: [
        ['1. Return a result', 'Use <code>return</code> to end a function and send a value back to the code that called it.', "def double(number):\n    return number * 2\n\nprint(double(6))", 'Quiz: trace functions and returns. Practice: change the input and build a new function.'],
        ['2. Process text', 'Split, replace, and measure text to turn a message into useful information.', "sentence = 'code is fun'\nprint(sentence.split())\nprint(len(sentence))", 'Quiz: practise string methods. Practice: edit the sentence.'],
        ['3. Use nested logic', 'A loop can contain another loop. This is useful for patterns and grids.', "for row in range(3):\n    for column in range(2):\n        print('*', end='')\n    print()", 'Quiz: predict loop patterns. Practice: change the rows and columns.']
      ]
    },
    9: {
      title: 'Dictionaries, classes & algorithms',
      summary: 'Organise structured data, create objects, and use compact problem-solving patterns.',
      topics: [
        ['1. Organise data with dictionaries', 'A dictionary is a mapping from keys to values. Access or update a value by using its key.', "student = {'name': 'Arjun', 'score': 95}\nprint(student['name'])", 'Quiz: read and update dictionaries. Practice: add another key such as <code>city</code>.'],
        ['2. Model objects with classes', 'A class bundles data and behaviour. If it is defined, <code>__init__</code> is called automatically when a new instance is created.', "class Animal:\n    def __init__(self, name):\n        self.name = name\n\ncat = Animal('Milo')\nprint(cat.name)", 'Quiz: identify classes, objects, and constructors. Practice: create another animal.'],
        ['3. Build efficient solutions', 'A list comprehension is a compact way to create a list. Searching, sorting, and recursion are algorithmic techniques for solving problems.', "numbers = [1, 2, 3, 4]\nsquares = [number ** 2 for number in numbers]\nprint(squares)", 'Quiz: practise comprehensions, sorting, recursion, and linear search. Practice: change the list.']
      ]
    },
    10: {
      title: 'Data, objects & algorithms',
      summary: 'Use Python structures and object-oriented ideas to design clear solutions to richer problems.',
      topics: [
        ['1. Structure data with dictionaries', 'A dictionary maps keys to values. Iterating over a dictionary gives its keys; use <code>.items()</code> when you need each key and value together.', "book = {'title': 'Orbit', 'pages': 240}\nfor key, value in book.items():\n    print(key, value)", 'Quiz: read, update, and iterate through dictionaries. Practice: extend a data record.'],
        ['2. Design with classes', 'Classes bundle data and behaviour. An instance can hold attributes that belong to that individual object.', "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\nstudent = Student('Asha', 92)\nprint(student.score)", 'Quiz: trace classes and <code>__init__</code>. Practice: create another object.'],
        ['3. Reason about algorithms', 'An algorithm is a step-by-step method for solving a problem. Linear search checks items in order and is <code>O(n)</code> in the worst case; recursion is a function calling itself on a smaller case.', "def factorial(number):\n    if number == 1:\n        return 1\n    return number * factorial(number - 1)\n\nprint(factorial(4))", 'Quiz: practise recursion, slices, sorting, and <code>O(n)</code> linear search. Practice: adapt the example.']
      ]
    }
  };

  const lesson = lessons[grade];
  if (!lesson) return;
  const logic = grade <= 4 ? {
    title: 'Think in steps',
    description: 'Good programs follow a plan. Start with a goal, write the steps in order (sequence), and predict what each line will do before you run it.',
    tools: ['Sequence: do steps in order.', 'Patterns: notice what changes and what stays the same.', 'Prediction: say what the output should be before running code.', 'Debugging: read the message, find the line, and try a small fix.']
  } : grade <= 6 ? {
    title: 'Choose, repeat, check',
    description: 'Turn a problem into small steps, then choose the right control structure: sequence for order, selection for choices, and iteration for repetition.',
    tools: ['Decomposition: split a big task into small actions.', 'Selection: use <code>if</code> when a decision is needed.', 'Iteration: use a loop for repeated work.', 'Testing: try normal, boundary, and unexpected values.']
  } : grade <= 8 ? {
    title: 'Design reusable solutions',
    description: 'Logical programmers describe a problem, separate it into parts, and reuse a tested solution instead of repeating the same code.',
    tools: ['Decomposition: divide a problem into functions.', 'Abstraction: focus on what a part does, not every internal detail.', 'Trace tables: record changing values after each step.', 'Debugging: reproduce the problem, isolate it, then test the fix.']
  } : {
    title: 'Reason about data and algorithms',
    description: 'For larger problems, choose a data structure, describe an algorithm step by step, and consider correctness and efficiency.',
    tools: ['Modeling: represent real information with dictionaries or objects.', 'Algorithm design: write clear steps before coding.', 'Correctness: test typical, boundary, and empty inputs.', 'Efficiency: compare approaches using ideas such as linear <code>O(n)</code> time.']
  };
  document.title = `Grade ${grade} Python Study Material — Brainy Break`;
  document.getElementById('study-root').innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> <span>›</span><a href="/practice/">All Grades</a> <span>›</span><a href="/practice/grade-${grade}/">Grade ${grade}</a> <span>›</span><span>Python Study</span></div>
    <section class="study-hero"><p class="eyebrow">PYTHON LEARNING PATH</p><h1>🐍 Grade ${grade} Python Study Material</h1><p>${lesson.summary}</p><div class="study-actions"><a href="/practice/grade-${grade}/python.html">📝 Take the Quiz</a><a href="/practice/grade-${grade}/python-practice.html">✏️ Open Practice Space</a></div></section>
    <section class="sync-note"><strong>Learn → quiz → practise</strong><span>Each lesson below matches the ideas used in this grade's Python quiz and coding exercises.</span></section>
    <section class="logic-toolkit"><h2>🧠 ${logic.title}</h2><p>${logic.description}</p><div class="logic-grid">${logic.tools.map(tool => `<span>✓ ${tool}</span>`).join('')}</div></section>
    <section class="lesson-grid">${lesson.topics.map(([heading, explanation, code, connection]) => `<article class="lesson-card"><h2>${heading}</h2><p>${explanation}</p><pre><code>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code></pre><p class="connection">${connection}</p></article>`).join('')}</section>
    <section class="next-step"><h2>Ready to test your understanding?</h2><p>Start with the quiz, then use the practice space to change the examples and create your own program.</p><div class="study-actions"><a href="/practice/grade-${grade}/python.html">Take Grade ${grade} Quiz →</a><a href="/practice/grade-${grade}/python-practice.html">Write Python Code →</a></div></section>`;
})();
