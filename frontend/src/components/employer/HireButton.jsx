const HireButton = ({ status, onHire, onReject }) => {

  // Show hired badge if worker is already accepted
  if (status === 'accepted') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-semibold text-green-700">Worker Hired</span>
      </div>
    );
  }

};

export default HireButton;