"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type GatewayCharge = {
  method: string;
  percentage: number;
  fixedFee: number;
  enabled: boolean;
};

type GatewayStats = {
  method: string;
  transactions: number;
  grossRevenue: number;
  charges: number;
  netRevenue: number;
};

export default function RegistrationsGatewayPage() {
  const router = useRouter();
  
  const [gatewayCharges, setGatewayCharges] = useState<GatewayCharge[]>([
    { method: 'UPI', percentage: 2.0, fixedFee: 0, enabled: true },
    { method: 'Credit Card', percentage: 3.0, fixedFee: 5, enabled: true },
    { method: 'Debit Card', percentage: 2.5, fixedFee: 3, enabled: true },
    { method: 'Net Banking', percentage: 2.0, fixedFee: 2, enabled: true },
    { method: 'Wallet', percentage: 1.5, fixedFee: 0, enabled: false },
  ]);

  const [stats] = useState<GatewayStats[]>([
    { method: 'UPI', transactions: 150, grossRevenue: 45000, charges: 900, netRevenue: 44100 },
    { method: 'Credit Card', transactions: 80, grossRevenue: 35000, charges: 1450, netRevenue: 33550 },
    { method: 'Debit Card', transactions: 60, grossRevenue: 25000, charges: 805, netRevenue: 24195 },
    { method: 'Net Banking', transactions: 40, grossRevenue: 20000, charges: 480, netRevenue: 19520 },
  ]);

  const handleUpdateCharge = (index: number, field: keyof GatewayCharge, value: number | boolean) => {
    const updated = [...gatewayCharges];
    updated[index] = { ...updated[index], [field]: value };
    setGatewayCharges(updated);
  };

  const handleSaveSettings = () => {
    console.log('Saving gateway settings:', gatewayCharges);
    alert('Gateway charge settings saved successfully!');
  };

  const totalStats = stats.reduce(
    (acc, stat) => ({
      transactions: acc.transactions + stat.transactions,
      grossRevenue: acc.grossRevenue + stat.grossRevenue,
      charges: acc.charges + stat.charges,
      netRevenue: acc.netRevenue + stat.netRevenue,
    }),
    { transactions: 0, grossRevenue: 0, charges: 0, netRevenue: 0 }
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

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Gateway Management</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-indigo-600">{totalStats.transactions}</p>
            </div>
            <div className="text-4xl">💳</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Gross Revenue</p>
              <p className="text-2xl font-bold text-blue-600">₹{totalStats.grossRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">💵</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Gateway Charges</p>
              <p className="text-2xl font-bold text-red-600">-₹{totalStats.charges.toFixed(2)}</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-2 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Net Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{totalStats.netRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gateway Charge Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Gateway Charge Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure charge percentages and fixed fees for each payment method
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {gatewayCharges.map((gateway, index) => (
                <div key={gateway.method} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gateway.enabled}
                          onChange={(e) => handleUpdateCharge(index, 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                      <span className="font-semibold text-gray-800">{gateway.method}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${gateway.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {gateway.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Percentage (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={gateway.percentage}
                        onChange={(e) => handleUpdateCharge(index, 'percentage', parseFloat(e.target.value) || 0)}
                        disabled={!gateway.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fixed Fee (₹)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={gateway.fixedFee}
                        onChange={(e) => handleUpdateCharge(index, 'fixedFee', parseFloat(e.target.value) || 0)}
                        disabled={!gateway.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveSettings}
              className="w-full mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Gateway Statistics */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Gateway Performance Statistics</h2>
            <p className="text-sm text-gray-600 mt-1">
              Transaction volume and revenue breakdown by payment method
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.map((stat) => {
                const chargePercentage = ((stat.charges / stat.grossRevenue) * 100).toFixed(2);
                return (
                  <div key={stat.method} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-800">{stat.method}</span>
                      <span className="text-sm text-gray-500">{stat.transactions} transactions</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gross Revenue:</span>
                        <span className="font-semibold">₹{stat.grossRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Gateway Charges ({chargePercentage}%):</span>
                        <span className="font-semibold">-₹{stat.charges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-bold border-t pt-2">
                        <span>Net Revenue:</span>
                        <span>₹{stat.netRevenue.toFixed(2)}</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${((stat.netRevenue / stat.grossRevenue) * 100).toFixed(0)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {((stat.netRevenue / stat.grossRevenue) * 100).toFixed(1)}% net retention
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
