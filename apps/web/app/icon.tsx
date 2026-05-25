import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#008080',
          borderRadius: '16px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '26px',
            fontWeight: 700,
            fontFamily: 'sans-serif',
            letterSpacing: '-1px',
          }}
        >
          PE
        </span>
      </div>
    ),
    { ...size },
  )
}
