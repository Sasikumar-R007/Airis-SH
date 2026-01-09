// Helper function to get asset URLs
// Assets should be in public/assets/ folder for Vite to serve them properly

export const getAssetUrl = (assetPath: string): string => {
  // Vite serves files from public/ folder at root
  // Encode the path to handle spaces and special characters
  // Split by path separators, encode each segment, then join
  const segments = assetPath.split('/').map(segment => encodeURIComponent(segment))
  const encodedPath = segments.join('/')
  const url = `/assets/${encodedPath}`
  
  return url
}

// Asset paths
export const ASSETS = {
  logo: 'Airis-SH Logo.jpeg',
  pdf: 'Airis-SH PPT.pdf',
  fieldVisits: [
    'fv 01.jpeg', 'fv 02.jpeg', 'fv 03.jpeg', 'fv 04.jpeg', 'fv 05.jpeg',
    'fv 06.jpeg', 'fv 07.jpg', 'fv 08.jpg', 'fv 09.jpg', 'fv 10.jpg', 'fv 11.jpg'
  ],
  fieldVisitVideos: [
    'fv video 1.mp4',
    'fv video 3.mp4',
    'fv video 4.mp4'
  ],
  productDesign: ['pd 01.jpeg', 'pd 02.jpeg'],
  prototypes: ['pr 01.png', 'pr 02.png', 'pr 03.png']
}

// Helper function to shuffle array (Fisher-Yates algorithm)
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

