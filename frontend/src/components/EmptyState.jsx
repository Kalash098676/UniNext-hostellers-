import { ArrowRight } from "lucide-react";
import PageHeader from "./PageHeader";

const EmptyState = ({
  title,
  icon: Icon,
  description,
  primaryAction,
  primaryLabel,
  secondaryAction,
  secondaryLabel,
}) => {
  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] p-6">
      <PageHeader title={title} />
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "65vh" }}
      >
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#083067] flex items-center justify-center">
            <Icon className="w-10 h-10 text-blue-200" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-bold text-[#083067] dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col gap-3">
            {primaryAction && (
              <button
                onClick={primaryAction}
                className="w-full py-2.5 bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {primaryLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction}
                className="w-full py-2.5 border border-gray-200 dark:border-gray-600 text-[#083067] dark:text-white text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmptyState;
