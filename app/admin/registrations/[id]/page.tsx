"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type Registration = {
  id: number;
  userName: string;
  email: string;
  phone: string;
  college: string;
  event: string;
  category: string;
  participationType: string;
  teamSize: number;
  registrationDate: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  amount: number;
  transactionId: string;
};

type PageProps = {
  params: { id: string };
};

export default function RegistrationDetailsPage({ params }: PageProps) {
  const router = useRouter();
  
  // Mock data - in real app, fetch by ID
  const [registration] = useState<Registration>({
    id: parseInt(params.id),
    userName: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    college: 'ABC College',
    event: 'Hackathon 2025',
    category: 'Technical',
    participationType: 'Solo',
    teamSize: 1,
    registrationDate: '2025-12-10',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    amount: 200,
    transactionId: 'TXN123456789',
  });

  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending' | 'Failed'>(registration.paymentStatus);

  const handleUpdateStatus = () => {
    console.log('Updating payment status to:', paymentStatus);
    alert('Payment status updated successfully!');
  };

  const gatewayChargePercentage = 2; // Example: 2% for UPI
  const gatewayCharge = registration.paymentStatus === 'Paid' 
    ? (registration.amount * gatewayChargePercentage) / 100 
    : 0;
  const netAmount = registration.amount - gatewayCharge;

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

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Registration Details #{registration.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Participant Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Participant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 font-medium">{registration.userName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{registration.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{registration.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">College</label>
                <p className="text-gray-900">{registration.college}</p>
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Event Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Event Name</label>
                <p className="text-gray-900 font-medium">{registration.event}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{registration.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Participation Type</label>
                <p className="text-gray-900">{registration.participationType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Team Size</label>
                <p className="text-gray-900">
                  {registration.teamSize} {registration.teamSize === 1 ? 'person' : 'people'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Registration Date</label>
                <p className="text-gray-900">{registration.registrationDate}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                <p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {registration.paymentMethod}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="text-gray-900 font-mono text-sm">{registration.transactionId}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                <p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      registration.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : registration.paymentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {registration.paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Financial Breakdown */}
            {registration.paymentStatus === 'Paid' && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Financial Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Amount:</span>
                    <span className="font-semibold">₹{registration.amount}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Gateway Charge ({gatewayChargePercentage}%):</span>
                    <span className="font-semibold">-₹{gatewayCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-2">
                    <span>Net Amount Received:</span>
                    <span>₹{netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Update Payment Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Update Payment Status</h3>
            <div className="space-y-4">
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Pending' | 'Failed')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update Status
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600 text-sm">Registration ID</span>
                <span className="font-semibold">#{registration.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600 text-sm">Total Amount</span>
                <span className="font-semibold text-indigo-600">₹{registration.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Status</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    registration.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : registration.paymentStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {registration.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Send Confirmation Email
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                Download Receipt
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Cancel Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
