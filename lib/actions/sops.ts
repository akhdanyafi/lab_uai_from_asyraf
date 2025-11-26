'use server';

import { db } from '@/db';
import { governanceDocs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getSops() {
    try {
        const sops = await db
            .select()
            .from(governanceDocs)
            .where(eq(governanceDocs.type, 'SOP'))
            .orderBy(desc(governanceDocs.createdAt))
            .limit(4);

        return sops;
    } catch (error) {
        console.error('Error fetching SOPs:', error);
        return [];
    }
}
