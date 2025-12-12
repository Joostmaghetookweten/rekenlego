import React, { useState } from 'react';
import AvatarBuilder from './AvatarBuilder';
import { useApp } from '../App.jsx';

export default function ProfileView() {
  const { user } = useApp();
  const [tab, setTab] = useState('overview');

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Profiel van {user.name || 'Leerling'}</h2>
        <div className="text-sm text-gray-500">Niveau {user.level || 1} • {user.coins || 0} munten</div>
      </div>

      <div className="mb-4">
        <button onClick={() => setTab('overview')} className={`px-4 py-2 rounded-l-xl ${tab === 'overview' ? 'bg-green-500 text-white' : 'bg-white'}`}>Overzicht</button>
        <button onClick={() => setTab('avatar')} className={`px-4 py-2 rounded-r-xl ${tab === 'avatar' ? 'bg-green-500 text-white' : 'bg-white'}`}>Avatar</button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm">
        {tab === 'overview' && (
          <div>
            <h3 className="font-semibold">Voortgang</h3>
            <p className="text-sm text-gray-600">Voltooide lessen: {user.completedLessons?.length || 0}</p>
            <p className="text-sm text-gray-600">XP: {user.xp || 0}</p>
          </div>
        )}

        {tab === 'avatar' && (
          <AvatarBuilder />
        )}
      </div>
    </div>
  );
}
