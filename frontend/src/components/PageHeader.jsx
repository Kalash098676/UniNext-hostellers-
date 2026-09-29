import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ title, showBack = false, backTo = "/" }) => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(backTo)}
           className="md:hidden">
            <ArrowLeft className="w-5 h-5 text-[#083067] dark:text-white" />
          </button>
        )}

        <h1 className="text-lg font-semibold text-[#083067] dark:text-white">
          {title}
        </h1>
      </div>

      <p className="text-sm text-gray-400 mt-1">{today}</p>
    </div>
  );
};

export default PageHeader;