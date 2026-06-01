import { Link } from 'react-router-dom'

export default function HaGiangMap() {
    return (
        <div className="hg-map-section container" style={{ margin: '48px auto', maxWidth: 900 }}>
            <h2 className="dc-section-title" style={{ textAlign: 'center', marginBottom: 12 }}>
                🗺️ Bản đồ hành trình Hà Giang Loop
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 24 }}>
                Xem các điểm nổi bật trên cung đường, vị trí homestay, điểm check-in, và các địa danh nổi tiếng. Bạn có thể phóng to, thu nhỏ, hoặc bấm vào từng điểm để xem chi tiết.
            </p>
            <div style={{ width: '100%', height: 420, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px #0001', margin: '0 auto' }}>
                <iframe
                    title="Ha Giang Loop Map"
                    src="https://www.google.com/maps/d/embed?mid=1QwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw&hl=vi" // Thay link này bằng link bản đồ thực tế của bạn
                    width="100%"
                    height="420"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Link to="/tours" className="dc-btn-primary">Xem các tour Hà Giang</Link>
            </div>
        </div>
    )
}
