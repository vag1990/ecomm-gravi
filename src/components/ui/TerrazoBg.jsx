function TerrazoDot({ x, y, r, op }) {
    return <circle cx={x} cy={y} r={r} fill="currentColor" opacity={op} />
}

export function TerrazoBg({ color = '#c2b5a3', density = 40 }) {
    const dots = []
    for (let i = 0; i < density; i++) {
        dots.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            r: Math.random() * 2.5 + 0.5,
            op: Math.random() * 0.4 + 0.1,
        })
    }
    return (
        <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color, pointerEvents: 'none' }}
            viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
        >
            {dots.map((d, i) => <TerrazoDot key={i} {...d} />)}
        </svg>
    )
}
