                                <h3>Tác động xã hội & Đối tác</h3>
                                <p>
                                    <b>Tác động xã hội:</b> Dự án đã và đang góp phần:
                                    <ul>
                                        <li>Trồng mới hơn 2.000 cây bản địa, phục hồi rừng tự nhiên.</li>
                                        <li>Hỗ trợ sinh kế cho hơn 30 hộ dân địa phương thông qua hợp tác sản xuất và du lịch cộng đồng.</li>
                                        <li>Tổ chức hơn 10 đợt thiện nguyện, trao tặng sách vở, vật tư học tập cho trẻ em vùng cao.</li>
                                        <li>Đào tạo kỹ năng nông nghiệp hữu cơ, bảo tồn giống bản địa cho thanh niên và phụ nữ.</li>
                                    </ul>
                                    <b>Đối tác tiêu biểu:</b>
                                    <ul>
                                        <li>HTX Trường Hải</li>
                                        <li>Bảo tàng Hà Giang</li>
                                        <li>Đoàn thanh niên địa phương</li>
                                        <li>Các nhóm thiện nguyện, tình nguyện viên quốc tế</li>
                                    </ul>
                                    <i>Báo cáo tác động xã hội chi tiết sẽ được cập nhật định kỳ trên website.</i>
                                </p>
import React from 'react'

export default function ProjectPage() {
    return (
        <div className="page-enter project-profile-page">
            <div className="project-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80)' }}>
                <div className="project-hero-overlay" />
                <div className="project-hero-content">
                    <h1>Trang trại sinh thái 10.000m²</h1>
                    <p>Địa chỉ: <a href="https://maps.app.goo.gl/TAkW8iLehHjLaWAt8" target="_blank" rel="noopener noreferrer">Bấm để xem bản đồ</a></p>
                    <p>Không gian trải nghiệm, học tập, canh tác hữu cơ, bảo tồn giống bản địa và phát triển cộng đồng tại Hà Giang.</p>
                </div>
            </div>
            <div className="container project-profile-body">
                <h2>Giới thiệu dự án</h2>
                <p>
                    Trang trại sinh thái 10.000m² là dự án phát triển nông nghiệp bền vững, kết hợp du lịch trải nghiệm, giáo dục và bảo tồn di sản bản địa. <b>Dự án cam kết giữ gìn sự nguyên sơ của thiên nhiên, không xây dựng nhà bê tông/gạch, không kêu gọi đầu tư xây dựng hiện đại.</b> Nếu có lưu trú, chỉ sử dụng nhà gỗ, nhà sàn, trình tường truyền thống, ưu tiên vật liệu tự nhiên, bảo vệ nguồn nước, tuyệt đối không rác thải nhựa. Mục tiêu là tạo không gian trải nghiệm, học tập, giao lưu văn hóa và đóng góp cho cộng đồng, đồng thời bảo tồn cảnh quan và giá trị bản địa.
                </p>
                <h3>Hoạt động nổi bật</h3>
                <ul>
                    <li>Trồng cây, gây rừng, bảo tồn giống bản địa</li>
                    <li>Workshop nông nghiệp, ẩm thực, thủ công</li>
                    <li>Đón tiếp tình nguyện viên, khách trải nghiệm</li>
                    <li>Không gian học tập ngoài trời cho trẻ em</li>
                    <li>Phát triển sản phẩm nông nghiệp sạch</li>
                </ul>

                <h3>Video hoạt động</h3>
                <div style={{ margin: '18px 0' }}>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, boxShadow: '0 2px 12px #0002' }}>
                        <iframe
                            src="https://www.youtube.com/embed/1L0yqmRs0m0"
                            title="Video hoạt động dự án"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
                <p>
                    Xem thêm video trên kênh YouTube:
                    <a href="https://www.youtube.com/@yourchannel" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', marginLeft: 6 }}>youtube.com/@yourchannel</a>
                </p>

                <h3>Thông tin liên hệ</h3>
                <p>Địa chỉ: <a href="https://maps.app.goo.gl/TAkW8iLehHjLaWAt8" target="_blank" rel="noopener noreferrer">Xem trên Google Maps</a></p>
                <p>Điện thoại: 0385.737.705</p>
                <p>Email: duan@htxtruonghai.com</p>
            </div>
        </div>
    )
}
