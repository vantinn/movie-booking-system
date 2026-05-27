/**
 * Da Nang Cinema Seed
 * ───────────────────
 * Inserts 6 VT Cinema locations across Đà Nẵng districts.
 * Run once with:
 *   npx ts-node -r tsconfig-paths/register src/seeds/danang-cinemas.seed.ts
 *
 * Safe to re-run — skips any cinema whose name already exists.
 */

import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../config/database';
import { Cinema } from '../entities/cinema.entity';

const DA_NANG_CINEMAS = [
    {
        name: 'VT Cinema Hải Châu',
        address: '72 Hải Phòng, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
        regions: 'Hải Châu',
        distance: '0 km từ trung tâm',
        facilities: '2D • 3D • IMAX • Dolby Atmos',
        image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80',
    },
    {
        name: 'VT Cinema Sơn Trà',
        address: '255 Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
        regions: 'Sơn Trà',
        distance: '4 km từ trung tâm',
        facilities: '2D • 3D • 4DX',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
    },
    {
        name: 'VT Cinema Ngũ Hành Sơn',
        address: '10 Trường Sa, Phường Hoà Hải, Quận Ngũ Hành Sơn, Đà Nẵng',
        regions: 'Ngũ Hành Sơn',
        distance: '8 km từ trung tâm',
        facilities: '2D • 3D • Ghế VIP',
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600&q=80',
    },
    {
        name: 'VT Cinema Hoà Khánh',
        address: '123 Tôn Đức Thắng, Phường Hoà Khánh Bắc, Quận Liên Chiểu, Đà Nẵng',
        regions: 'Hoà Khánh',
        distance: '11 km từ trung tâm',
        facilities: '2D • 3D',
        image: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=600&q=80',
    },
    {
        name: 'VT Cinema Điện Bàn',
        address: '45 Nguyễn Tất Thành, Thị Xã Điện Bàn, Quảng Nam (gần Đà Nẵng)',
        regions: 'Điện Bàn',
        distance: '15 km từ trung tâm',
        facilities: '2D • 3D • Phòng Couple',
        image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80',
    },
    {
        name: 'VT Cinema Tam Kỳ',
        address: '15 Phan Bội Châu, Phường An Xuân, TP. Tam Kỳ, Quảng Nam',
        regions: 'Tam Kỳ',
        distance: '70 km từ Đà Nẵng',
        facilities: '2D • 3D • Dolby Stereo',
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80',
    },
];

async function seed() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Cinema);

    let created = 0;
    let skipped = 0;

    for (const data of DA_NANG_CINEMAS) {
        const exists = await repo.findOne({ where: { name: data.name } });
        if (exists) {
            console.log(`  ⏭  Skipped (already exists): ${data.name}`);
            skipped++;
            continue;
        }
        await repo.save(repo.create(data));
        console.log(`  Created: ${data.name}`);
        created++;
    }

    console.log(`\nSeed complete — ${created} created, ${skipped} skipped.`);
    await AppDataSource.destroy();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
