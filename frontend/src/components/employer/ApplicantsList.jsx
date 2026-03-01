import { FileX, CircleCheck } from "lucide-react";

const STATUS = {
  pending:  { label: 'Pending',  dot: 'bg-yellow-400', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepted', dot: 'bg-green-400',  text: 'text-green-600',  badge: 'bg-green-100 text-green-700'  },
  rejected: { label: 'Rejected', dot: 'bg-red-400',    text: 'text-red-600',    badge: 'bg-red-100 text-red-700'      },
};

const ApplicantsList = ({ applications, selected, stats, onSelect }) => {
  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full">

      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Applicants</h2>

          {/* pending, accepted, rejected */}
          <div className="flex items-center gap-1.5">
            {[
              { value: stats.pending,  cls: 'bg-yellow-100 text-yellow-700' },
              { value: stats.accepted, cls: 'bg-green-100 text-green-700'  },
              { value: stats.rejected, cls: 'bg-red-100 text-red-700'      },
            ].map(({ value, cls }, i) => (
              <span key={i} className={`min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${cls}`}>
                {value}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 pt-1 border-t border-gray-200">
          Showing <span className="font-bold text-gray-900">{applications.length}</span> of{' '}
          <span className="font-bold text-gray-900">{stats.total}</span> applications
        </p>
      </div>

    </div>
  );
};

export default ApplicantsList;