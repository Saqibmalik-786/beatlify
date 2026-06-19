import { Track } from './types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synthwave Project',
    album: 'Grid Runner',
    duration: 372, // 6:12
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
    genre: 'Electronic',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Summer Breeze',
    artist: 'Chill Out Collective',
    album: 'Horizon Drift',
    duration: 423, // 7:03
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=300&auto=format&fit=crop',
    genre: 'Chill',
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Midnight Chase',
    artist: 'Cybernetica',
    album: 'Vector Space',
    duration: 302, // 5:02
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop',
    genre: 'Electronic',
    isFavorite: true,
  },
  {
    id: '4',
    title: 'Retro Wave',
    artist: '80s Vibe Orchestra',
    album: 'Analog Dreams',
    duration: 345, // 5:45
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop',
    genre: 'Electronic',
    isFavorite: false,
  },
  {
    id: '5',
    title: 'After Hours',
    artist: 'Fred again.. Clone',
    album: 'Secret Studio Session',
    duration: 402, // 6:42
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop',
    genre: 'Chill',
    isFavorite: true,
  },
  {
    id: '6',
    title: 'Dark Techno Beat',
    artist: 'Berlin Club Resident',
    album: 'Basement Echoes',
    duration: 318, // 5:18
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop',
    genre: 'Hip-Hop', // Or Electronic/techno
    isFavorite: false,
  },
  {
    id: '7',
    title: 'Jazz Horizons',
    artist: 'Smooth Quartet',
    album: 'Blue Note Drift',
    duration: 326, // 5:26
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    artworkUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=300&auto=format&fit=crop',
    genre: 'Jazz',
    isFavorite: false,
  },
];

export const GENRE_DATA = [
  {
    name: 'Electronic',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGdIhtHnX6t409z9i5Edo1NeViM9l3K088GXeRZCl3bIHJtBQy4rzX1OwKAZIecMBQCUCV7LKsQU2sEFP0q6dylIzSJ_e0lmyJMUd_kqLTgLwoWks_Fg_MrFWFoX6GxKfXK_QvbmE1iuKZBxKcmYDDRWOJXsDqcgCwYXtDD-Hpp4JjUhI4HUFaRknUaXSbkKouGR1xT2zv54OVNsNm5XakLSbQUKnVczP_3OCjGnz9tht3Ryn2Wa0zKotcKe1ZRoxrGe0P1GHD8S8L',
    colorFrom: 'rgba(0, 255, 102, 0.4)',
  },
  {
    name: 'Hip-Hop',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkIsZBxzZ2BykJkwCizlOHIayr_9WP4fM43sRqruNEInPeHx0g9PplbDvnT1gW62B2T_rcnS8QkRdAwY1u4vg9bmef4HswbBbOqBjwokOlYI5-IYnilr638GtLH7VlJFBpaZfunRid9p-YoO_AemIwIQ9ATFu-ZLHBzzoCB_vguQ3o5kq8-RwiOpfjwZC8782WaS9ACCKbPdDhnGs-Tizk0_L4KDUn1y7V1OOnVxm2p6HAV7yJ0X3cgQ2UhLDK6EXrk2MHxClBZMuY',
    colorFrom: 'rgba(191, 191, 191, 0.4)',
  },
  {
    name: 'Chill',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwGF1ElmyQ6kxB0nQOYHRoaSc16PBgu47n-uotJgTIOIloCfoezGyd6qWbKuFYNqmCq21LYJQ3EHDmo-qw4StfTs3zbQtXsD__kgm0ECd3bC0V_1wdIvyMkgt6tGC3jONKa7YHsq6KcMZaMws9WKLy2-7PfBVs7uwqHaHnEazL0axhYFVq5H4hDKw1hdq8t09HaF5fXkYYlgQl09GjnHiMrI9PL7j_avOzVb744f_Xw95JvG1v2wBuKnwaZmeAmJ6sZFM155Rgt1M2',
    colorFrom: 'rgba(0, 229, 91, 0.3)',
    isDoubleWidth: true,
  },
  {
    name: 'Rock',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOC_JOpjq0URIIkcdKB1b7OIURoscDeTSzntIpBuXLm4OuXJpd0fyyXIl7_75HOfy44UIOlI7X4RIJk7QbdXaIWVH3Ir_mH6UjIsn-NdJ_w8CXN4tYT08b_qPCVBLUnNfwQVACWTIxEpxzJtX_Pf-OvOZZcC6vihieAfRliKkUkKOKaJrA6dPCuSHESqtUNs72GBORJn7ZF0n4rGXOO_fBroEQsZKCw7GKcZtbnkRCWmTW4zELqWe_FyCOkRVZI3tZV8-076lbsTdE',
    colorFrom: 'rgba(255, 180, 171, 0.4)',
  },
  {
    name: 'Jazz',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA01ckLN9tMiE_YweJanpw6ISt0ILmfmpYm8AKzJnNGg67THgsX7pBsnRCGhfVw2gDUMSSM_iIQgLz7ekR365A5DJjwtUlgGgRKGmIyyaFUN10-C5kiQNjJdN1tnKMibokd8iE4jQPgegc39CQh29ZFecRZ16xJ8QxFGdbP5UQtU3VPkquXQmFOAckOna040Hx1dsfrUTSTMJx5lprh1GtSg-w1grFZ1Sp4QVWpSwNCVt_sagBiVUsbjNlu2tTdsjEKmSJtlw5stlJr',
    colorFrom: 'rgba(198, 198, 199, 0.4)',
  },
];
