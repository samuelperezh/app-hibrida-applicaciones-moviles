import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color: 'golden' | 'blue' | 'green' | 'gray';
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'golden':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className={`rounded-2xl p-4 border-2 ${getColorClasses()} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold font-poppins">{value}</p>
        </div>
        {icon && (
          <div className="opacity-70">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;