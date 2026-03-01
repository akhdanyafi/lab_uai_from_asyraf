import { getScheduledPracticums } from '@/features/scheduled-practicum/actions';
import { Clock, MapPin, BookOpen, Calendar } from 'lucide-react';

const DAY_NAMES = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default async function StudentScheduledPracticumPage() {
    const schedules = await getScheduledPracticums();

    // Group schedules by day
    const schedulesByDay: Record<number, typeof schedules> = {};
    for (const s of schedules) {
        const day = s.dayOfWeek;
        if (!schedulesByDay[day]) schedulesByDay[day] = [];
        schedulesByDay[day].push(s);
    }

    // Sort days and sort each day's schedules by startTime
    const sortedDays = Object.keys(schedulesByDay)
        .map(Number)
        .sort((a, b) => a - b);

    for (const day of sortedDays) {
        schedulesByDay[day].sort((a: any, b: any) =>
            (a.startTime || '').localeCompare(b.startTime || '')
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Jadwal Praktikum</h1>
                <p className="text-gray-500 text-sm mt-1">Jadwal praktikum mingguan</p>
            </div>

            {sortedDays.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Belum ada jadwal praktikum</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedDays.map(day => (
                        <div key={day}>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#0F4C81]" />
                                {DAY_NAMES[day] || `Hari ${day}`}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {schedulesByDay[day].map((schedule: any) => (
                                    <div
                                        key={schedule.id}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {schedule.courseName || 'Praktikum'}
                                                </h3>
                                                {schedule.moduleName && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Modul: {schedule.moduleName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                {schedule.startTime} - {schedule.endTime}
                                            </div>
                                            {schedule.roomName && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                    {schedule.roomName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
