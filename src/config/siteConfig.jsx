import { FaYoutube, FaInstagram, FaFacebookF, FaXTwitter, FaTiktok } from 'react-icons/fa6';

// ============================================================================
// SITE CONFIGURATION
// Edit these values to update the site's content without digging into the code
// ============================================================================

export const HOME_CONFIG = {

  // An array of 4K wallpapers. The hero section will automatically crossfade between them!
  wallpapers: [
    '/assets/avengersdoomsday_teaser-a.jpg',
    '/assets/avengersdoomsday_teaser-b.jpg',
    '/assets/avengersdoomsday_teaser-c.jpg',
  ],

  // Logo is now in the background rotation
  heroLogoUrl: '',
  latestDrops: [
    {
      id: 'irVNGjRFZGk',
      title: 'Official Trailer',
      subtitle: 'In Theaters December 18',
    },
    {
      id: 'X1aFkAkFASk',
      title: 'Special Look',
      subtitle: 'In Theaters December 18',
    }
  ],

  // Character Return Clips — embed directly on page
  characterReturns: [
    {
      id: '399Ez7WHK5s',
      title: 'The Wakandans & Fantastic Four Will Return',
    },
    {
      id: 'kH1XlwHQv9o',
      title: 'The X-Men Will Return',
    },
    {
      id: '1clWprLC5Ak',
      title: 'Thor Will Return',
    },
    {
      id: 'UiMg566PREA',
      title: 'Steve Rogers Will Return',
    },
  ],

  // Official Theatrical Posters
  posters: [
    { id: 'poster-1', url: '/assets/avengersdoomsday_teaser-b.jpg', title: 'Official Teaser Poster' },
    { id: 'poster-2', url: '/assets/avengersdoomsday_teaser-c.jpg', title: 'Official Teaser Poster' },
    { id: 'poster-3', url: '/assets/avengersdoomsday_teaser-g.jpg', title: 'Official Teaser Poster' },
    { id: 'poster-4', url: '/assets/avengersdoomsday_teaser-d.jpg', title: 'Official Teaser Poster' },
    { id: 'poster-5', url: '/assets/avengersdoomsday_teaser-e.jpg', title: 'Official Teaser Poster' },
    { id: 'poster-6', url: '/assets/avengersdoomsday_teaser-f.jpg', title: 'Official Teaser Poster' },
 
  ],
  
  // The big cinematic title on the home page
  heroEyebrow: 'HELL ANSWERS TO ME. FOR I AM DOOM!',
  heroTitleLine1: 'AVENGERS',
  heroTitleLine2: 'DOOMSDAY'
};

export const SOCIAL_LINKS = [
  { name: 'YouTube', href: 'https://www.youtube.com/marvel', Icon: FaYoutube },
  { name: 'Instagram', href: 'https://www.instagram.com/marvel', Icon: FaInstagram },
  { name: 'Facebook', href: 'https://www.facebook.com/Marvel', Icon: FaFacebookF },
  { name: 'X', href: 'https://x.com/marvel', Icon: FaXTwitter },
  { name: 'TikTok', href: 'https://www.tiktok.com/@marvel', Icon: FaTiktok },
];
