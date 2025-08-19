import React from "react";
import { HighlightText } from "../HomePage/HighlightText";
import CTAButton from "../../core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for ",
    highlightText: "Anyone, Anywhere",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto grid-cols-1 lg:grid-cols-4 lg:w-fit gap-4">
      {LearningGridArray.map((card, index) => {
        const isFirstCard = card.order < 0;
        const isOdd = card.order % 2 === 1;
        const isThirdCard = card.order === 3;

        const baseStyle = `p-5 lg:h-[280px] rounded-md`;
        const bgStyle = isFirstCard
          ? "bg-transparent"
          : isOdd
          ? "bg-richblack-700"
          : "bg-richblack-800";
        const spanStyle = isFirstCard ? "lg:col-span-2" : "";
        const startStyle = isThirdCard ? "lg:col-start-2" : "";

        return (
          <div
            key={index}
            className={`${baseStyle} ${bgStyle} ${spanStyle} ${startStyle}`}
          >
            {isFirstCard ? (
              <div className="flex flex-col gap-3 lg:w-[90%] pb-5">
                <h1 className="text-4xl font-semibold">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </h1>
                <p className="font-medium text-richblack-300">
                  {card.description}
                </p>
                <div className="w-fit mt-4">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-richblack-5">
                  {card.heading}
                </h2>
                <p className="text-richblack-300">{card.description}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
