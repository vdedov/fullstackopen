const Part = ({name, exercises}) => (<p>{name} {exercises}</p>)

const Course = ({ course }) => {
  return (
    <div>
      <h1>{ course.name }</h1>
      {course.parts.map(part =>
        <Part
          key={part.id}
          name={part.name}
          exercises={part.exercises}
        />
      )}
      <h4>total of {
        course.parts.reduce((s, p) =>
          s + p.exercises, 0
        )} exercises</h4>
    </div>
  )
}

const Courses = ({ courses }) => {
  return (
    <div>
      {courses.map(course =>
        <Course key={course.id} course={course}/>
      )}
    </div>
  )
}

export default Courses
