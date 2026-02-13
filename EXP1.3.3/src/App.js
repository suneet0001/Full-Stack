// Base Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Hello, my name is ${this.name}.`;
  }
}

// Student Class
class Student extends Person {
  constructor(name, age, major) {
    super(name, age);
    this.major = major;
  }

  introduce() {
    return `Hello, my name is ${this.name} and I'm studying ${this.major}.`;
  }
}

// Teacher Class
class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  introduce() {
    return `Hello, my name is ${this.name} and I teach ${this.subject}.`;
  }
}

function App() {
  const people = [
    new Person("Alex Johnson", 30),
    new Student("Emma Watson", 20, "Computer Science"),
    new Teacher("Dr. James Wilson", 45, "Mathematics")
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-10">


      
      <h1 className="text-4xl font-bold text-center mb-12 text-white">

        Person Class Hierarchy
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {people.map((person, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-6 transition hover:shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              {person.name} ({person.constructor.name})
            </h2>

            <p className="text-gray-700">Age: {person.age}</p>

            <p className="italic text-gray-600 mt-2">
              {person.introduce()}
            </p>

            {person.major && (
              <p className="mt-3 font-medium text-indigo-600">
                Major: {person.major}
              </p>
            )}

            {person.subject && (
              <p className="mt-3 font-medium text-purple-600">
                Teaching: {person.subject}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
