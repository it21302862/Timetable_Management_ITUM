import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('');

  const fetchRooms = async () => {
    const res = await api.get('/rooms');
    setRooms(res.data);
  };

  const addRoom = async () => {
    await api.post('/rooms', {
      room_name: roomName,
      room_type: roomType
    });
    setRoomName('');
    setRoomType('');
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Room</h2>
      <input placeholder="Room Name" value={roomName}
        onChange={e => setRoomName(e.target.value)} />
      <input placeholder="Room Type" value={roomType}
        onChange={e => setRoomType(e.target.value)} />
      <button onClick={addRoom}>Add</button>

      <h3>Rooms</h3>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>{room.room_name} - {room.room_type}</li>
        ))}
      </ul>
    </div>
  );
}
