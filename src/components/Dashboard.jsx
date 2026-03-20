import React from 'react';
import { Users, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/payrollLogic';

const Dashboard = ({ employees }) => {
    const totalPayroll = employees.reduce((acc, emp) => acc + emp.netPay, 0);
    const employeeCount = employees.length;
    const nextPayDate = "30 Mar 2026"; // Hardcoded for demo, or calculated

    const stats = [
        {
            label: 'Nómina Total (Mes)',
            value: formatCurrency(totalPayroll),
            icon: <DollarSign className="w-6 h-6 text-indigo-500" />,
            bg: 'bg-indigo-50'
        },
        {
            label: 'Número de Empleados',
            value: employeeCount,
            icon: <Users className="w-6 h-6 text-emerald-500" />,
            bg: 'bg-emerald-50'
        },
        {
            label: 'Próxima Fecha de Pago',
            value: nextPayDate,
            icon: <Calendar className="w-6 h-6 text-rose-500" />,
            bg: 'bg-rose-50'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="card flex items-center space-x-4">
                    <div className={`${stat.bg} p-3 rounded-2xl`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
