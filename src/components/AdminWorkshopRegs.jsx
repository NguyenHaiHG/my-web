import { useEffect, useState } from 'react'

export default function AdminWorkshopRegs() {
    const [regs, setRegs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/workshop-regs')
            .then(res => res.json())
            .then(data => { setRegs(data); setLoading(false) })
            .catch(e => { setError('Lỗi tải dữ liệu'); setLoading(false) })
    }, [])

    const handleComplete = async (reg) => {
        if (!window.confirm('Xác nhận khách đã hoàn thành trải nghiệm?')) return
        const res = await fetch(`/api/workshop-regs/${reg._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reg, status: 'completed' })
        })
        if (res.ok) {
            setRegs(regs.map(r => r._id === reg._id ? { ...r, status: 'completed' } : r))
            alert('Đã gửi email cảm ơn và chứng nhận!')
        } else {
            alert('Có lỗi khi xác nhận!')
        }
    }

    if (loading) return <div>Đang tải danh sách đăng ký...</div>
    if (error) return <div>{error}</div>

    return (
        <div style={{ marginTop: 40 }}>
            <h2>Quản lý đăng ký Workshop</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Tên khách</th>
                        <th>Email</th>
                        <th>Workshop</th>
                        <th>Trạng thái</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {regs.map(reg => (
                        <tr key={reg._id}>
                            <td>{reg.name}</td>
                            <td>{reg.email}</td>
                            <td>{reg.workshopTitle}</td>
                            <td>{reg.status}</td>
                            <td>
                                {reg.status !== 'completed' && (
                                    <button onClick={() => handleComplete(reg)} className="btn3d btn3d-green btn-sm">Xác nhận hoàn thành</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
