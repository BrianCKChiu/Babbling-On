// import React, { useEffect, useState } from 'react';
// // import { Course } from ''; // Import the Course type from application

// // Define your CourseList component
// const CourseList: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]); // State to store the fetched courses

//   useEffect(() => {
//     // Fetch the list of courses from your database and update the state
//     async function fetchCourses() {
//       try {
//         const response = await fetch('/api/courses'); // Replace with your actual API endpoint
//         const data = await response.json();
//         setCourses(data);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//       }
//     }

//     fetchCourses();
//   }, []);

//   return (
//     <div className="course-list">
//       {courses.map((course) => (
//         <div key={course.id} className="course-box">
//           <h2>{course.name}</h2>
//           <p>{course.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CourseList;
