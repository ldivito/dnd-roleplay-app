'use client'

import React from 'react'

export default function DMDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Session Status</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Session: Not Started</p>
          <p className="text-sm text-gray-300">Players: 0/6</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4">
            Start Session
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Roll Initiative
          </button>
          <button className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
            Add NPC
          </button>
          <button className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Quick Note
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Campaign Info</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Campaign: New Adventure</p>
          <p className="text-sm text-gray-300">Session: #1</p>
          <p className="text-sm text-gray-300">Location: Tavern</p>
        </div>
      </div>
    </div>
  )
}
