"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  name: string;
  email: string;
  college: string;
};

type EventGroup = {
  eventName: string;
  users: User[];
};

const mockEventData: EventGroup[] = [
  {
    eventName: 'Hackathon 2025',
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', college: 'ABC College' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', college: 'DEF Institute' },
    ],
  },
  {
    eventName: 'Dance Battle',
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', college: 'ABC College' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', college: 'GHI College' },
    ],
  },
  {
    eventName: 'Coding Competition',
    users: [
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', college: 'XYZ University' },
    ],
  },
  {
    eventName: 'Robotics Workshop',
    users: [
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', college: 'DEF Institute' },
    ],
  },
  {
    eventName: 'Gaming Tournament',
    users: [
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', college: 'DEF Institute' },
    ],
  },
];

export default function UsersEventListPage() {
  const router = useRouter();
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEvent = (eventName: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventName)) {
      newExpanded.delete(eventName);
    } else {
      newExpanded.add(eventName);
    }
    setExpandedEvents(newExpanded);
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/users')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
        >
          ← Back to Users
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users by Event</h1>

      <div className="space-y-4">
        {mockEventData.map((eventGroup) => (
          <div key={eventGroup.eventName} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => toggleEvent(eventGroup.eventName)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-800">{eventGroup.eventName}</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {eventGroup.users.length} {eventGroup.users.length === 1 ? 'user' : 'users'}
                </span>
              </div>
              <span className="text-2xl text-gray-400">
                {expandedEvents.has(eventGroup.eventName) ? '−' : '+'}
              </span>
            </button>

            {expandedEvents.has(eventGroup.eventName) && (
              <div className="border-t">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {eventGroup.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.college}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
