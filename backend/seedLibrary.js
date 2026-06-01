// Seed script for digital heritage (di sản số)
const mongoose = require('mongoose')
const LibraryItem = require('./models/LibraryItem')

const items = [
    {
        title: 'Khèn Mông cổ',
        desc: 'Nhạc cụ truyền thống của người Mông, dùng trong lễ hội và sinh hoạt cộng đồng.',
        type: 'audio',
        fileUrl: 'https://example.com/audio/khen-mong.mp3',
        origin: 'Đồng Văn, Hà Giang',
        contributor: 'HTX Trường Hải',
        date: '2020-11-01',
        tags: ['nhạc cụ', 'Mông', 'âm nhạc'],
    },
    {
        title: 'Tranh thổ cẩm Lô Lô',
        desc: 'Tác phẩm thổ cẩm truyền thống của người Lô Lô, thể hiện qua hoa văn đặc trưng.',
        type: 'image',
        fileUrl: 'https://example.com/images/tho-cam-lolo.jpg',
        origin: 'Mèo Vạc, Hà Giang',
        contributor: 'Bảo tàng Hà Giang',
        date: '2021-03-15',
        tags: ['thổ cẩm', 'Lô Lô', 'thủ công'],
    },
    {
        title: 'Lễ hội Gầu Tào',
        desc: 'Lễ hội truyền thống của người Mông, cầu phúc, cầu lộc đầu năm.',
        type: 'video',
        fileUrl: 'https://example.com/videos/gau-tao.mp4',
        origin: 'Quản Bạ, Hà Giang',
        contributor: 'Sở Văn hóa',
        date: '2019-02-10',
        tags: ['lễ hội', 'Mông', 'văn hóa'],
    },
    {
        title: 'Bài hát Then cổ',
        desc: 'Bài hát Then cổ của người Tày, được lưu truyền qua nhiều thế hệ.',
        type: 'audio',
        fileUrl: 'https://example.com/audio/then-tay.mp3',
        origin: 'Bắc Quang, Hà Giang',
        contributor: 'Nghệ nhân Nông Thị Lan',
        date: '2018-08-20',
        tags: ['Then', 'Tày', 'âm nhạc'],
    },
    {
        title: 'Sách cổ chữ Nôm Dao',
        desc: 'Tài liệu chữ Nôm Dao quý hiếm, ghi chép phong tục và truyện cổ.',
        type: 'document',
        fileUrl: 'https://example.com/docs/nom-dao.pdf',
        origin: 'Hoàng Su Phì, Hà Giang',
        contributor: 'Nhà nghiên cứu Vũ Văn Hòa',
        date: '2017-12-05',
        tags: ['tài liệu', 'Dao', 'chữ Nôm'],
    },
    {
        title: 'Khăn đội đầu Pà Thẻn',
        desc: 'Khăn đội đầu truyền thống của phụ nữ Pà Thẻn, thêu tay tinh xảo.',
        type: 'image',
        fileUrl: 'https://example.com/images/khan-pa-then.jpg',
        origin: 'Bắc Mê, Hà Giang',
        contributor: 'HTX Dệt Thổ Cẩm',
        date: '2022-05-12',
        tags: ['trang phục', 'Pà Thẻn', 'thủ công'],
    },
    {
        title: 'Truyện cổ tích "Cây khèn thần"',
        desc: 'Truyện cổ tích dân gian về nguồn gốc cây khèn của người Mông.',
        type: 'document',
        fileUrl: 'https://example.com/docs/cay-khen-than.pdf',
        origin: 'Yên Minh, Hà Giang',
        contributor: 'Nhà sưu tầm Nguyễn Văn Bình',
        date: '2016-09-30',
        tags: ['truyện cổ', 'Mông', 'văn học'],
    },
    {
        title: 'Video múa xòe Tày',
        desc: 'Màn trình diễn múa xòe truyền thống của người Tày tại lễ hội mùa xuân.',
        type: 'video',
        fileUrl: 'https://example.com/videos/mua-xoe-tay.mp4',
        origin: 'Bắc Quang, Hà Giang',
        contributor: 'Đoàn nghệ thuật Tày',
        date: '2023-02-18',
        tags: ['múa', 'Tày', 'lễ hội'],
    },
    {
        title: 'Ảnh đá tai mèo Đồng Văn',
        desc: 'Ảnh chụp di sản địa chất đá tai mèo nổi tiếng của cao nguyên đá Đồng Văn.',
        type: 'image',
        fileUrl: 'https://example.com/images/da-tai-meo.jpg',
        origin: 'Đồng Văn, Hà Giang',
        contributor: 'Nhiếp ảnh gia Lê Minh',
        date: '2021-07-22',
        tags: ['địa chất', 'ảnh', 'Đồng Văn'],
    },
    {
        title: 'Audio kể chuyện cổ Dao',
        desc: 'Ghi âm kể chuyện cổ dân tộc Dao, lưu giữ qua nhiều thế hệ.',
        type: 'audio',
        fileUrl: 'https://example.com/audio/chuyen-co-dao.mp3',
        origin: 'Hoàng Su Phì, Hà Giang',
        contributor: 'Nghệ nhân Triệu Văn Sáng',
        date: '2019-11-11',
        tags: ['truyện cổ', 'Dao', 'âm nhạc'],
    },
]

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webblog')
    await LibraryItem.deleteMany({})
    await LibraryItem.insertMany(items)
    console.log('Seeded 10 digital heritage items!')
    process.exit()
}

seed()
