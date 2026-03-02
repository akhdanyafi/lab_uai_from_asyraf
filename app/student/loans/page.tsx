import { redirect } from 'next/navigation';

export default async function MyLoansPage() {
    redirect('/student/items?tab=loans');
}

