
// import React, { useState } from "react";
// import { Chart, registerables } from "chart.js";
// import { Pie } from "react-chartjs-2";

// Chart.register(...registerables);

// const InstructorChart = ({ courses }) => {
//   const [currChart, setCurrChart] = useState("Students");

//   const getRandomColors = (numColors) => {
//     const colors = [];
//     for (let i = 0; i < numColors; i++) {
//       const color = `rgb(${Math.floor(Math.random() * 200 + 30)},${Math.floor(
//         Math.random() * 200 + 30
//       )},${Math.floor(Math.random() * 200 + 30)})`;
//       colors.push(color);
//     }
//     return colors;
//   };

//   const chartDataForStudents = {
//     labels: courses.map((course) => course.courseName),
//     datasets: [
//       {
//         data: courses.map((course) => course.totalStudentsEnrolled),
//         backgroundColor: getRandomColors(courses.length),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartDataForIncome = {
//     labels: courses.map((course) => course.courseName),
//     datasets: [
//       {
//         data: courses.map((course) => course.totalAmountGenerated),
//         backgroundColor: getRandomColors(courses.length),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           color: "#f3f4f6",
//           font: { size: 14 },
//           generateLabels: (chart) => {
//             const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
//             const labelsOriginal = original.call(this, chart);
//             labelsOriginal.forEach((label) => {
//               label.text += ` (${chart.data.datasets[0].data[label.index]})`;
//             });
//             return labelsOriginal;
//           },
//         },
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: (tooltipItem) => {
//             const dataset = tooltipItem.dataset;
//             const value = dataset.data[tooltipItem.dataIndex];
//             return `${dataset.label || ""}: ${value}`;
//           },
//         },
//       },
//     },
//     animation: {
//       animateRotate: true,
//       animateScale: true,
//     },
//   };

//   return (
//     <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full">
//       <h2 className="text-xl font-semibold mb-4 text-gray-100">Visualize Data</h2>

//       <div className="flex gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded-lg font-medium transition-transform duration-200
//             ${currChart === "Students"
//               ? "bg-yellow-400 text-gray-900 shadow-lg scale-105"
//               : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"}`}
//           onClick={() => setCurrChart("Students")}
//         >
//           Students
//         </button>
//         <button
//           className={`px-4 py-2 rounded-lg font-medium transition-transform duration-200
//             ${currChart === "Income"
//               ? "bg-yellow-400 text-gray-900 shadow-lg scale-105"
//               : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"}`}
//           onClick={() => setCurrChart("Income")}
//         >
//           Income
//         </button>
//       </div>

//       <div className="w-full max-w-md mx-auto">
//         <Pie
//           data={currChart === "Students" ? chartDataForStudents : chartDataForIncome}
//           options={options}
//         />
//       </div>
//     </div>
//   );
// };

// export default InstructorChart;


import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  const [currChart, setCurrChart] = useState("Students");

  const getRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 200 + 30)},${Math.floor(
        Math.random() * 200 + 30
      )},${Math.floor(Math.random() * 200 + 30)})`;
      colors.push(color);
    }
    return colors;
  };

  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses.length),
        borderWidth: 1,
      },
    ],
  };

  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColors(courses.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#f3f4f6",
          font: { size: 14 },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Visualize Data</h2>

      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition
            ${currChart === "Students" ? "bg-yellow-400 text-gray-900 shadow scale-105" :
              "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => setCurrChart("Students")}
        >
          Students
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition
            ${currChart === "Income" ? "bg-yellow-400 text-gray-900 shadow scale-105" :
              "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => setCurrChart("Income")}
        >
          Income
        </button>
      </div>

      <div className="w-full max-w-md mx-auto">
        <Pie
          data={currChart === "Students" ? chartDataForStudents : chartDataForIncome}
          options={options}
        />
      </div>
    </div>
  );
};

export default InstructorChart;

