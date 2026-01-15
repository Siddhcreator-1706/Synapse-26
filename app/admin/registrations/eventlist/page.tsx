"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type Registration = {
  id: number;
  userName: string;
  email: string;
  college: string;
  participationType: string;
  teamSize: number;
  paymentStatus: string;
  amount: number;
};

type EventGroup = {
  eventName: string;
  category: string;
  totalRegistrations: number;
  paidRegistrations: number;
  totalRevenue: number;
  registrations: Registration[];
};

const mockEventData: EventGroup[] = [
  {
    eventName: 'Hackathon 2025',
    category: 'Technical',
    totalRegistrations: 2,
    paidRegistrations: 1,
    totalRevenue: 200,
    registrations: [
      {
        id: 1,
        userName: 'John Doe',
        email: 'john@example.com',
        college: 'ABC College',
        participationType: 'Solo',
        teamSize: 1,
        paymentStatus: 'Paid',
        amount: 200,
      },
      {
        id: 3,
        userName: 'Mike Johnson',
        email: 'mike@example.com',
        college: 'DEF Institute',
        participationType: 'Group',
        teamSize: 5,
        paymentStatus: 'Pending',
        amount: 500,
      },
    ],
  },
  {
    eventName: 'Dance Battle',
    category: 'Cultural',
    totalRegistrations: 2,
    paidRegistrations: 2,
    totalRevenue: 970,
    registrations: [
      {
        id: 2,
        userName: 'Jane Smith',
        email: 'jane@example.com',
        college: 'XYZ University',
        participationType: 'Duet',
        teamSize: 2,
        paymentStatus: 'Paid',
        amount: 250,
      },
      {
        id: 5,
        userName: 'Tom Brown',
        email: 'tom@example.com',
        college: 'JKL University',
        participationType: 'Group',
        teamSize: 6,
        paymentStatus: 'Paid',
        amount: 720,
      },
    ],
  },
  {
    eventName: 'Coding Competition',
    category: 'Technical',
    totalRegistrations: 1,
    paidRegistrations: 1,
    totalRevenue: 150,
    registrations: [
      {
        id: 4,
        userName: 'Sarah Williams',
        email: 'sarah@example.com',
        college: 'GHI College',
        participationType: 'Solo',
        teamSize: 1,
        paymentStatus: 'Paid',
        amount: 150,
      },
    ],
  },
];

export default function EventListRegistrationsPage() {
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

  const totalStats = mockEventData.reduce(
    (acc, event) => ({
      registrations: acc.registrations + event.totalRegistrations,
      paid: acc.paid + event.paidRegistrations,
      revenue: acc.revenue + event.totalRevenue,
    }),
    { registrations: 0, paid: 0, revenue: 0 }
  );

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/registrations')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
        >
          ← Back to Registrations
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrations by Event</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Registrations</p>
              <p className="text-3xl font-bold text-indigo-600">{totalStats.registrations}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Paid Registrations</p>
              <p className="text-3xl font-bold text-green-600">{totalStats.paid}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">₹{totalStats.revenue}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {mockEventData.map((eventGroup) => (
          <div key={eventGroup.eventName} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => toggleEvent(eventGroup.eventName)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">{eventGroup.eventName}</h3>
                  <p className="text-sm text-gray-500">{eventGroup.category}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {eventGroup.totalRegistrations} registrations
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {eventGroup.paidRegistrations} paid
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    ₹{eventGroup.totalRevenue}
                  </span>
                </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {eventGroup.registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{reg.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{reg.userName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{reg.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{reg.college}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{reg.participationType}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{reg.teamSize}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{reg.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reg.paymentStatus === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : reg.paymentStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {reg.paymentStatus}
                          </span>
                        </td>
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
