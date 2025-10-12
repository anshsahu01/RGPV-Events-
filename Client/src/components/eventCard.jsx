import React from "react";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EventCard = ({ _id, title, bannerImage, date, deadline, location, category }) => {
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(isoString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      onClick={() => navigate(`/events/${_id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer w-full max-w-sm mx-auto"
    >
      {/* Event Banner */}
      <img
        src={bannerImage}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        {/* Title + Category */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{title}</h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{category}</span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <FiMapPin className="w-5 h-5 mr-2" />
          <span className="truncate">{location}</span>
        </div>

        {/* Event Date */}
        <div className="flex items-center text-gray-600 text-sm mb-1">
          <FiCalendar className="w-5 h-5 mr-2" />
          <span>Event: {formatDate(date)}</span>
        </div>

        {/* Registration Deadline */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FiCalendar className="w-5 h-5 mr-2" />
          <span>Deadline: {formatDate(deadline)}</span>
        </div>

        {/* View Details */}
        <span className="text-blue-600 hover:underline font-medium cursor-pointer">
          View Details →
        </span>
      </div>
    </div>
  );
};

export default EventCard;
