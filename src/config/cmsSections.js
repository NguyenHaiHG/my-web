export const CMS_SECTIONS = {
  home: {
    highlights: {
      label: 'Thẻ trang chủ', type: 'list', itemLabel: 'Thẻ',
      fields: [
        { key: 'emoji', label: 'Biểu tượng' }, { key: 'title', label: 'Tiêu đề' },
        { key: 'body', label: 'Mô tả', type: 'textarea' }, { key: 'buttonLabel', label: 'Nhãn nút' },
        { key: 'buttonHref', label: 'Liên kết' }, { key: 'highlight', label: 'Nổi bật', type: 'checkbox' },
      ],
    },
  },
  'ha-giang-loop': {
    'itinerary-3d': {
      label: 'Lịch trình 3N2Đ', type: 'list', itemLabel: 'Ngày',
      fields: [
        { key: 'day', label: 'Ngày' }, { key: 'dayEn', label: 'Ngày (English)' },
        { key: 'title', label: 'Tuyến đường' }, { key: 'titleEn', label: 'Tuyến đường (English)' },
        { key: 'desc', label: 'Nội dung', type: 'textarea' }, { key: 'descEn', label: 'Nội dung (English)', type: 'textarea' },
        { key: 'img', label: 'Ảnh', type: 'image' }, { key: 'highlights', label: 'Điểm nổi bật', type: 'tags' },
        { key: 'highlightsEn', label: 'Điểm nổi bật (English)', type: 'tags' }, { key: 'meal', label: 'Bữa ăn' },
        { key: 'hotel', label: 'Nơi nghỉ' }, { key: 'icon', label: 'Biểu tượng' }, { key: 'color', label: 'Màu' },
      ],
    },
    'itinerary-4d': {
      label: 'Lịch trình 4N3Đ', type: 'list', itemLabel: 'Ngày',
      fields: [
        { key: 'day', label: 'Ngày' }, { key: 'dayEn', label: 'Ngày (English)' },
        { key: 'title', label: 'Tuyến đường' }, { key: 'titleEn', label: 'Tuyến đường (English)' },
        { key: 'desc', label: 'Nội dung', type: 'textarea' }, { key: 'descEn', label: 'Nội dung (English)', type: 'textarea' },
        { key: 'img', label: 'Ảnh', type: 'image' }, { key: 'highlights', label: 'Điểm nổi bật', type: 'tags' },
        { key: 'highlightsEn', label: 'Điểm nổi bật (English)', type: 'tags' }, { key: 'meal', label: 'Bữa ăn' },
        { key: 'hotel', label: 'Nơi nghỉ' }, { key: 'icon', label: 'Biểu tượng' }, { key: 'color', label: 'Màu' },
      ],
    },
    faq: {
      label: 'FAQ', type: 'list', itemLabel: 'Câu hỏi',
      fields: [
        { key: 'q', label: 'Câu hỏi' }, { key: 'en_q', label: 'Câu hỏi (English)' },
        { key: 'a', label: 'Trả lời', type: 'textarea' }, { key: 'en_a', label: 'Trả lời (English)', type: 'textarea' },
      ],
    },
  },
  contact: {
    details: {
      label: 'Thông tin liên hệ', type: 'list', itemLabel: 'Kênh liên hệ',
      fields: [
        { key: 'title', label: 'Tên' }, { key: 'body', label: 'Thông tin' },
        { key: 'buttonHref', label: 'Liên kết' },
        { key: 'type', label: 'Loại', type: 'select', options: [
          { value: 'phone', label: 'Điện thoại' }, { value: 'message', label: 'Tin nhắn' },
          { value: 'chat', label: 'Chat' }, { value: 'map', label: 'Bản đồ' }, { value: 'clock', label: 'Giờ làm việc' },
        ] },
        { key: 'color', label: 'Màu' },
      ],
    },
  },
  passport: {
    steps: {
      label: 'Hướng dẫn Passport', type: 'list', itemLabel: 'Bước',
      fields: [{ key: 'icon', label: 'Biểu tượng' }, { key: 'title', label: 'Tiêu đề' }, { key: 'body', label: 'Mô tả', type: 'textarea' }],
    },
  },
  penpal: {
    guide: {
      label: 'Hướng dẫn Penpal', type: 'list', itemLabel: 'Bước',
      fields: [{ key: 'title', label: 'Tiêu đề' }, { key: 'body', label: 'Nội dung', type: 'textarea' }, { key: 'image', label: 'Ảnh', type: 'image' }],
    },
  },
  nature: {
    guidelines: {
      label: 'Hướng dẫn nhật ký', type: 'list', itemLabel: 'Hướng dẫn',
      fields: [{ key: 'title', label: 'Tiêu đề' }, { key: 'body', label: 'Nội dung', type: 'textarea' }, { key: 'image', label: 'Ảnh', type: 'image' }],
    },
  },
  heritage: {
    pillars: {
      label: 'Chúng tôi số hoá', type: 'list', itemLabel: 'Nhóm di sản',
      fields: [
        { key: 'emoji', label: 'Biểu tượng' }, { key: 'title', label: 'Tiêu đề' },
        { key: 'body', label: 'Mô tả', type: 'textarea' },
      ],
    },
    tools: {
      label: 'Công cụ số hoá', type: 'list', itemLabel: 'Công cụ',
      fields: [
        { key: 'emoji', label: 'Biểu tượng' }, { key: 'title', label: 'Tiêu đề' },
        { key: 'body', label: 'Mô tả', type: 'textarea' },
        { key: 'buttonLabel', label: 'Nhãn nút' }, { key: 'buttonHref', label: 'Liên kết' },
      ],
    },
  },
}
