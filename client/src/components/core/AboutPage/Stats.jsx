import React from 'react'

const Stats = [
  { count: "5K+", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

function StatsComponent() {
  return (
    <section className="w-full bg-richblack-900 py-16 text-white">
      <div className="w-11/12 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Stats.map((stat, index) => (
            <div
              key={index}
              className="bg-richblack-800 border border-richblack-700 rounded-2xl shadow-md p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-3xl font-bold text-yellow-100">{stat.count}</h2>
              <p className="text-richblack-300 mt-2 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsComponent;
