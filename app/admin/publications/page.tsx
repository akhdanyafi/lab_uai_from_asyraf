import { getDocuments } from '@/features/academic/actions';
import { getSession } from '@/lib/auth';
import DocumentList from '@/features/academic/components/DocumentList';
import UploadForm from '@/features/academic/components/UploadForm';

export default async function PublicationsPage() {
    const session = await getSession();
    const journals = await getDocuments('Jurnal Publikasi');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Jurnal Publikasi</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola jurnal dan publikasi ilmiah.</p>
            </div>

            <UploadForm
                uploaderId={session?.user.id || 0}
                allowedTypes={['Jurnal Publikasi']}
            />

            <DocumentList
                documents={journals}
                canDelete={true} // Admin can delete
            />
        </div>
    );
}
