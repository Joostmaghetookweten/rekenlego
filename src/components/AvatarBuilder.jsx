import React, { useState, useEffect } from 'react';
import { useApp, SHOP_ITEMS } from '../App.jsx';

export default function AvatarBuilder() {
  const { user, updateUser, triggerConfetti } = useApp();
  const [gender, setGender] = useState(user.gender || 'boy');
  const [equipped, setEquipped] = useState(user.equippedAvatar || { head: null, body: null, accessory: null });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setEquipped(user.equippedAvatar || { head: null, body: null, accessory: null });
  }, [user.equippedAvatar]);

  const getItemEmoji = (id) => {
    if (!id) return null;
    const all = [ ...(SHOP_ITEMS.avatar || []), ...(SHOP_ITEMS.room || []), ...(SHOP_ITEMS.themes || []), ...(SHOP_ITEMS.powerups || []) ];
    const found = all.find(i => i.id === id || i.id === id.replace(/^item_/, ''));
    if (found) return found.icon || found.emoji || '🎁';
    return '🎁';
  };

  const equip = (slot, itemId) => {
    // toggle
    setEquipped(prev => {
      const now = { ...prev };
      if (now[slot] === itemId) {
        now[slot] = null;
      } else {
        now[slot] = itemId;
      }
      // optimistic update
      return now;
    });

    // persist
    updateUser({ equippedAvatar: { ...equipped, [slot]: (equipped[slot] === itemId ? null : itemId) } });

    // animation/message
    setMessage('Gekleed!');
    setTimeout(() => setMessage(null), 900);

    // confetti when all slots equipped for first time
    const willBe = { ...equipped, [slot]: (equipped[slot] === itemId ? null : itemId) };
    if (willBe.head && willBe.body && willBe.accessory) {
      triggerConfetti();
    }
  };

  const save = () => {
    updateUser({ equippedAvatar: equipped });
    setMessage('Opgeslagen!');
    setTimeout(() => setMessage(null), 1000);
  };

  // Inventory items (avatar bucket)
  const inv = user.inventory || { avatar: [], room: [], themes: [] };
  const avatarItems = (SHOP_ITEMS.avatar || []).filter(i => inv.avatar && inv.avatar.includes(i.id));

  return (
    <div className="flex gap-6 p-4">
      {/* Left: Tabs */}
      <div className="w-1/4">
        <h3 className="text-lg font-bold mb-3">Categorieën</h3>
        <div className="flex flex-col gap-2">
          <button className="px-4 py-3 rounded-xl bg-white shadow-md">Hoofd</button>
          <button className="px-4 py-3 rounded-xl bg-white shadow-md">Lichaam</button>
          <button className="px-4 py-3 rounded-xl bg-white shadow-md">Accessoires</button>
        </div>
      </div>

      {/* Center: Avatar Preview */}
      <div className="flex-1 text-center">
        <div className="relative w-64 h-64 mx-auto bg-amber-50 rounded-3xl flex items-center justify-center shadow-lg animate-fadeIn">
          {/* Base */}
          <div className="absolute inset-0 flex items-center justify-center text-9xl z-10">
            {gender === 'boy' ? '🧒' : '👧'}
          </div>
          {/* Clothing */}
          {equipped.body && (
            <div className="absolute inset-0 flex items-center justify-center text-8xl z-20">
              {getItemEmoji(equipped.body)}
            </div>
          )}
          {/* Head */}
          {equipped.head && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-7xl z-30">
              {getItemEmoji(equipped.head)}
            </div>
          )}
          {/* Accessory */}
          {equipped.accessory && (
            <div className="absolute bottom-8 right-8 text-5xl z-40">
              {getItemEmoji(equipped.accessory)}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button onClick={() => { setGender('boy'); updateUser({ gender: 'boy' }); }} className={`px-4 py-2 rounded-xl ${gender === 'boy' ? 'bg-green-500 text-white' : 'bg-white'}`}>Jongen</button>
          <button onClick={() => { setGender('girl'); updateUser({ gender: 'girl' }); }} className={`px-4 py-2 rounded-xl ${gender === 'girl' ? 'bg-pink-500 text-white' : 'bg-white'}`}>Meisje</button>
        </div>

        <div className="mt-4">
          <button onClick={save} className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold shadow-lg">Opslaan</button>
          {message && <span className="ml-3 font-semibold">{message}</span>}
        </div>
      </div>

      {/* Right: Inventory */}
      <div className="w-1/4">
        <h3 className="text-lg font-bold mb-3">Inventory</h3>
        <div className="grid grid-cols-1 gap-3">
          {avatarItems.length === 0 && <div className="text-sm text-gray-500">Geen gekochte avatar items</div>}
          {avatarItems.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{item.icon || '🎁'}</div>
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.price} munten</div>
                </div>
              </div>
              <div>
                <button onClick={() => equip('head', item.id)} className="px-3 py-2 bg-blue-500 text-white rounded-xl mr-2">Head</button>
                <button onClick={() => equip('body', item.id)} className="px-3 py-2 bg-blue-500 text-white rounded-xl mr-2">Body</button>
                <button onClick={() => equip('accessory', item.id)} className="px-3 py-2 bg-blue-500 text-white rounded-xl">Acc</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
