// Sample data for populating the application

export const sampleLeaderboard = [
  { id: 1, name: 'Aarav Sharma', points: 1250, avatar: 'AS' },
  { id: 2, name: 'Diya Patel', points: 1120, avatar: 'DP' },
  { id: 3, name: 'Rohan Gupta', points: 1050, avatar: 'RG' },
  { id: 4, name: 'Priya Singh', points: 980, avatar: 'PS' },
  { id: 5, name: 'Arjun Kumar', points: 950, avatar: 'AK' },
  { id: 6, name: 'Ananya Reddy', points: 890, avatar: 'AR' },
  { id: 7, name: 'Vikram Joshi', points: 850, avatar: 'VJ' },
  { id: 8, name: 'Saanvi Desai', points: 820, avatar: 'SD' },
  { id: 9, name: 'Kabir Mehta', points: 780, avatar: 'KM' },
  { id: 10, name: 'Ishaan Verma', points: 750, avatar: 'IV' },
  { id: 11, name: 'Riya Agarwal', points: 720, avatar: 'RA' },
  { id: 12, name: 'Aditya Nair', points: 690, avatar: 'AN' }
];

export const sampleMenu = {
  lunch: [
    { name: 'Dal Makhani with Naan', price: 80, category: 'Main Course' },
    { name: 'Vegetable Biryani', price: 90, category: 'Main Course' },
    { name: 'Chicken Tikka Masala', price: 120, category: 'Main Course' },
    { name: 'Raita', price: 30, category: 'Side' }
  ],
  dinner: [
    { name: 'Butter Chicken', price: 130, category: 'Main Course' },
    { name: 'Paneer Tikka', price: 100, category: 'Main Course' },
    { name: 'Jeera Rice', price: 40, category: 'Side' },
    { name: 'Gulab Jamun', price: 50, category: 'Dessert' }
  ]
};

export const sampleLibraryBooks = [
  { title: 'The God of Small Things', author: 'Arundhati Roy', available: true },
  { title: 'Train to Pakistan', author: 'Khushwant Singh', available: true },
  { title: 'The White Tiger', author: 'Aravind Adiga', available: true },
  { title: 'Midnight\'s Children', author: 'Salman Rushdie', available: false },
  { title: 'The Namesake', author: 'Jhumpa Lahiri', available: true }
];

export const sampleEvents = [
  {
    id: 1,
    title: 'Annual Music Fest',
    date: '2024-11-15',
    club: 'Music Club',
    description: 'Join us for a night of amazing music from student bands and local artists.',
    image: 'music-fest',
    registered: 45,
    volunteers: 12
  },
  {
    id: 2,
    title: 'Innovate & Create Hackathon',
    date: '2024-11-22',
    club: 'Coding Club',
    description: 'A 24-hour coding competition to build innovative solutions. Prizes to be won!',
    image: 'hackathon',
    registered: 78,
    volunteers: 20
  },
  {
    id: 3,
    title: 'University Sports Day',
    date: '2024-12-05',
    club: 'Athletics Department',
    description: 'Compete in various track and field events and show your university spirit.',
    image: 'sports-day',
    registered: 120,
    volunteers: 30
  }
];

export const getRankIcon = (rank) => {
  if (rank === 1) return '👑';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

export const getAvatarColor = (name) => {
  const colors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', 
    '#F44336', '#00BCD4', '#8BC34A', '#FF5722',
    '#3F51B5', '#E91E63', '#009688', '#795548'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

