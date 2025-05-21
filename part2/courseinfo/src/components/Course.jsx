const Header = ({ course }) => <h3>{course}</h3>

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => <Part key={part.id} part={part} />)}
  </div>
)

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({ parts }) => {
  const totalExercises = parts.reduce(((acc, currentElem) => acc + currentElem.exercises), 0)
  return (<h4>total of {totalExercises} exercises</h4>)
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course