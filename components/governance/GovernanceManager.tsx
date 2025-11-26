'use client';

import { useState } from 'react';
import { FileText, Users, FileCheck } from 'lucide-react';
import DocumentList from '@/components/academic/DocumentList'; // Reusing DocumentList
import { deleteGovernanceDoc } from '@/lib/actions/governance';
import GovernanceUploadForm from './GovernanceUploadForm';
import UserList from './UserList';
import UserForm from './UserForm';

interface GovernanceManagerProps {
    sops: any[];
    lpjs: any[];
    users: any[];
    roles: any[];
    adminId: number;
}

export default function GovernanceManager({ sops, lpjs, users, roles, adminId }: GovernanceManagerProps) {
    const [activeTab, setActiveTab] = useState<'sop' | 'lpj' | 'users'>('sop');
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingDoc, setEditingDoc] = useState<any>(null);

    const handleEdit = (doc: any) => {
        setEditingDoc(doc);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingDoc(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tata Kelola</h1>
                    <p className="text-gray-500 text-sm mt-1">Manajemen SOP, LPJ, dan Pengguna Sistem</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                <button
                    onClick={() => { setActiveTab('sop'); setEditingDoc(null); }}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'sop'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <FileCheck className="w-4 h-4" />
                    Dokumen SOP
                </button>
                <button
                    onClick={() => { setActiveTab('lpj'); setEditingDoc(null); }}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'lpj'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    LPJ Bulanan
                </button>
                <button
                    onClick={() => { setActiveTab('users'); setEditingDoc(null); }}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'users'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    Manajemen User
                </button>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'sop' && (
                    <>
                        <GovernanceUploadForm
                            adminId={adminId}
                            allowedTypes={['SOP']}
                            initialData={editingDoc?.type === 'SOP' ? editingDoc : null}
                            onCancel={handleCancelEdit}
                        />
                        <DocumentList
                            documents={sops}
                            canDelete={true}
                            onEdit={handleEdit}
                            onDelete={deleteGovernanceDoc}
                        />
                    </>
                )}

                {activeTab === 'lpj' && (
                    <>
                        <GovernanceUploadForm
                            adminId={adminId}
                            allowedTypes={['LPJ Bulanan']}
                            initialData={editingDoc?.type === 'LPJ Bulanan' ? editingDoc : null}
                            onCancel={handleCancelEdit}
                        />
                        <DocumentList
                            documents={lpjs}
                            canDelete={true}
                            onEdit={handleEdit}
                            onDelete={deleteGovernanceDoc}
                        />
                    </>
                )}

                {activeTab === 'users' && (
                    <>
                        {!showUserForm ? (
                            <>
                                <div className="mb-6 flex justify-end">
                                    <button
                                        onClick={() => setShowUserForm(true)}
                                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <Users className="w-4 h-4" />
                                        Tambah User Baru
                                    </button>
                                </div>
                                <UserList users={users} roles={roles} />
                            </>
                        ) : (
                            <UserForm
                                roles={roles}
                                onSuccess={() => setShowUserForm(false)}
                                onCancel={() => setShowUserForm(false)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
