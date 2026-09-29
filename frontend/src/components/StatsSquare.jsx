const StatsSquare = ({ icon, iconBg, value, label, description }) => {
  return (
    <div className="bg-white dark:bg-[#1A2F42] rounded-xl p-2 sm:p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div
        className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center mb-3`}
      >
        {icon}
      </div>

      <div className="text-2xl font-bold text-[#083067] dark:text-white">
        {value}
      </div>

      <div className="text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-wider mt-1 uppercase">
        {label}
      </div>

      {description && (
        <p className="mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatsSquare;