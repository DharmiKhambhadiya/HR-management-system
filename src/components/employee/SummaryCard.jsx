import React from "react";

const SummaryCard = ({ icon, title, value, highlight }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4">
      <div
        className={`p-3 rounded-lg ${highlight || "bg-blue-50"} text-blue-600`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
