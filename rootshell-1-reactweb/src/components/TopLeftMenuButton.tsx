type Props = {
  onClick: () => void
}

export default function TopLeftMenuButton({ onClick }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        zIndex: 1000,
        background: '#111',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
      }}
      onClick={onClick}
    >
      ☰
    </div>
  )
}
