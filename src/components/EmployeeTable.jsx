import React from 'react';
import { Edit2, Trash2, Download } from 'lucide-react';
import { formatCurrency } from '../utils/payrollLogic';

const EmployeeTable = ({ employees, onEdit, onDelete, onDownloadStub }) => {
    return (
        <div className="card overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Gestión de Trabajadores</h2>
                <div className="flex space-x-2">
                    {/* Add buttons or filters here if needed */}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 italic text-slate-500 text-sm">
                            <th className="py-4 px-4 font-medium">Nombre</th>
                            <th className="py-4 px-4 font-medium">Cédula</th>
                            <th className="py-4 px-4 font-medium text-right">Sueldo Base</th>
                            <th className="py-4 px-4 font-medium text-right">Deducciones</th>
                            <th className="py-4 px-4 font-medium text-right">Neto a Pagar</th>
                            <th className="py-4 px-4 font-medium text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-slate-400">
                                    No hay empleados registrados.
                                </td>
                            </tr>
                        ) : (
                            employees.map((emp) => (
                                <tr key={emp.id} className="group hover:bg-slate-50 transition-colors duration-150">
                                    <td className="py-4 px-4">
                                        <div className="font-semibold text-slate-900">{emp.name}</div>
                                        <div className="text-xs text-slate-400">{emp.position}</div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-600 font-mono text-sm">{emp.idNumber}</td>
                                    <td className="py-4 px-4 text-right font-medium">{formatCurrency(emp.baseSalary)}</td>
                                    <td className="py-4 px-4 text-right text-rose-400 font-medium">
                                        {formatCurrency(emp.healthDeduction + emp.pensionDeduction)}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                                            {formatCurrency(emp.netPay)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => onDownloadStub(emp)}
                                                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="Descargar Colilla"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(emp)}
                                                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(emp.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;
