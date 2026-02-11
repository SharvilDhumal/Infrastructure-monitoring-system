import React from 'react';
import { MapPin, Calendar, CheckCircle, Clock, XCircle, CheckSquare } from 'lucide-react';

const IssueCard = ({ issue }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'Resolved': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'Pending': return <Clock className="w-4 h-4 mr-1" />;
            case 'Rejected': return <XCircle className="w-4 h-4 mr-1" />;
            case 'Resolved': return <CheckSquare className="w-4 h-4 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <div className="flex items-start gap-4">
                {issue.imageUrl && (
                    <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-800"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-white truncate pr-2">{issue.title}</h3>
                        <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                            {getStatusIcon(issue.status)}
                            {issue.status}
                        </span>
                    </div>

                    <div className="mt-2 flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{issue.location}</span>
                    </div>

                    <div className="mt-1 flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>Reported {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-2 text-sm text-gray-300 line-clamp-2">
                        {issue.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
