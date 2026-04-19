import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // The Neo-Brutalist "TA" Logo for the browser tab
      <div
        style={{
          fontSize: 22,
          background: '#FF99D6', // Using the arena pink
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          fontWeight: 900,
          border: '2px solid black',
          borderRadius: '6px',
          boxShadow: '2px 2px 0px black',
        }}
      >
        TA
      </div>
    ),
    {
      ...size,
    }
  );
}
