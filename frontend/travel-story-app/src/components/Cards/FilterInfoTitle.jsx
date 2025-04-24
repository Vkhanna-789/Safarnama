import React from "react";
import moment from "moment";
import { MdOutlineClose } from "react-icons/md";

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {
  const DateRangeChip = ({ date }) => {
    if (!date || !date.from || !date.to) return null; // ✅ Ensure both dates exist

    const startDate = moment(date.from).format("Do MMM YYYY");
    const endDate = moment(date.to).format("Do MMM YYYY");

    return (
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded">
        <p className="text-xs font-medium">
          {startDate} - {endDate}
        </p>
        <button onClick={onClear}>
          <MdOutlineClose />
        </button>
      </div>
    );
  };

  return (
    <div className="mb-5">
      {filterType === "search" ? (
        <h3 className="text-lg font-medium py-3 px-3"> Here is Search Result</h3>
      ) : (
        filterDates?.from && filterDates?.to && (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Travel Stories from</h3>
            <DateRangeChip date={filterDates} />
          </div>
        )
      )}
    </div>
  );
};

export default FilterInfoTitle;
