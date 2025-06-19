import React from "react";
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Clock, User, CheckCircle, AlertCircle, Circle } from 'lucide-react';

const statusIcons = {
  open: Circle,
  'in-progress': AlertCircle,
  closed: CheckCircle
};

const statusColors = {
  open: 'text-blue-500 bg-blue-50',
  'in-progress': 'text-yellow-500 bg-yellow-50',
  closed: 'text-green-500 bg-green-50'
};

const TicketList = ({ refresh, onTicketClick }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Circle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
        <p className="text-gray-500">
          {user?.role === 'admin' ? 'No tickets have been created.' : 'Create your first ticket to get started.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const StatusIcon = statusIcons[ticket.status] || Circle;
        const statusColorClass = statusColors[ticket.status] || 'text-gray-500 bg-gray-50';
        
        return (
          <div
            key={ticket._id}
            onClick={() => onTicketClick && onTicketClick(ticket)}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
                {ticket.title}
              </h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColorClass}`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {ticket.status || 'open'}
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {ticket.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                {user?.role === 'admin' && ticket.assignedTo && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{ticket.assignedTo.email}</span>
                  </div>
                )}
              </div>
              
              {user?.role === 'admin' && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  ID: {ticket._id.slice(-6)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketList;