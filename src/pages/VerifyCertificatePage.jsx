import { Link, useLocation, useParams } from 'react-router-dom'
import { ShieldCheck, ShieldAlert, ArrowLeft, Award, CalendarDays, ScanLine } from 'lucide-react'
import { usePassport } from '../context/PassportContext'

function normalizeCode(code) {
    return String(code || '').trim()
}

export default function VerifyCertificatePage() {
    const { certCode } = useParams()
    const location = useLocation()
    const { findCertificateByCode } = usePassport()

    const q = new URLSearchParams(location.search)
    const queryCode = q.get('code')
    const code = normalizeCode(certCode || queryCode)
    const cert = findCertificateByCode(code)

    return (
        <div className="verify-page container py-section">
            <Link to="/ho-chieu" className="btn-back"><ArrowLeft size={16} /> Quay về Passport</Link>

            <div className={`verify-card ${cert ? 'is-valid' : 'is-invalid'}`}>
                <div className="verify-status">
                    {cert ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
                    <h1>{cert ? 'Chứng Nhận Hợp Lệ' : 'Không Tìm Thấy Chứng Nhận'}</h1>
                </div>

                <p className="verify-sub">
                    {cert
                        ? 'Mã chứng nhận đã được phát hành bởi HTX Thương mại Sáng tạo Trường Hải, Hà Giang 2, Tuyên Quang, Việt Nam và lưu trong hệ thống Passport Hà Giang Loop.'
                        : 'Mã xác thực không tồn tại trong Passport registry. Hãy kiểm tra lại QR hoặc liên hệ admin.'}
                </p>

                <div className="verify-grid">
                    <div className="verify-item">
                        <ScanLine size={16} />
                        <div>
                            <span>Mã chứng nhận</span>
                            <strong>{code || 'N/A'}</strong>
                        </div>
                    </div>

                    <div className="verify-item">
                        <Award size={16} />
                        <div>
                            <span>Loại chứng nhận</span>
                            <strong>{cert?.certTitle || 'N/A'}</strong>
                        </div>
                    </div>

                    <div className="verify-item">
                        <CalendarDays size={16} />
                        <div>
                            <span>Ngày phát hành</span>
                            <strong>{cert?.issuedAt ? new Date(cert.issuedAt).toLocaleString('vi-VN') : 'N/A'}</strong>
                        </div>
                    </div>

                    <div className="verify-item">
                        <ShieldCheck size={16} />
                        <div>
                            <span>Người sở hữu</span>
                            <strong>{cert?.holder || 'N/A'}</strong>
                        </div>
                    </div>
                </div>

                {cert && (
                    <div className="verify-proof">
                        <p>Điểm tại thời điểm cấp: <strong>{cert.points ?? 0}</strong></p>
                        <p>Tổng dấu tại thời điểm cấp: <strong>{cert.stampsCount ?? 0}</strong></p>
                    </div>
                )}
            </div>
        </div>
    )
}
