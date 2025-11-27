export default function AnnouncementSection() {
    return (
        <div className="bg-gray-200 p-6 h-[250px] overflow-y-auto rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-center">Pengumuman</h3>
            <div className="space-y-4">
                {/* Placeholders for announcements */}
                <div className="bg-gray-400 h-16 rounded-sm"></div>
                <div className="bg-gray-400 h-16 rounded-sm"></div>
            </div>
        </div>
    );
}
