import { getLecturers } from '@/features/users/actions';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
    const lecturers = await getLecturers();

    return <RegisterForm lecturers={lecturers} />;
}
