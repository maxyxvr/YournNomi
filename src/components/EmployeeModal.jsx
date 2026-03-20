import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { calculatePayroll, formatCurrency } from '../utils/payrollLogic';

const EmployeeModal = ({ isOpen, onClose, onSave, employeeToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        idNumber: '',
        position: '',
        baseSalary: '',
        bonuses: '0'
    });

    const [calc, setCalc] = useState(calculatePayroll(0, 0));

    useEffect(() => {
        if (employeeToEdit) {
            setFormData({
                name: employeeToEdit.name,
                idNumber: employeeToEdit.idNumber,
                position: employeeToEdit.position,
                baseSalary: employeeToEdit.baseSalary.toString(),
                bonuses: (employeeToEdit.bonuses || 0).toString()
            });
            setCalc(calculatePayroll(employeeToEdit.baseSalary, employeeToEdit.bonuses || 0));
        } else {
            setFormData({
                name: '',
                idNumber: '',
                position: '',
                baseSalary: '',
                bonuses: '0'
            });
            setCalc(calculatePayroll(0, 0));
        }
    }, [employeeToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        setCalc(calculatePayroll(newFormData.baseSalary, newFormData.bonuses));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: employeeToEdit?.id || Date.now(),
            baseSalary: parseFloat(formData.baseSalary),
            ...calc
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">
                        {employeeToEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Nombre Completo</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Juan Pérez"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-1">Cédula</label>
                            <input
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                required
                                placeholder="1.000.000.000"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-1">Cargo</label>
                            <input
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Desarrollador"
                                className="input-field"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Sueldo Base (Mensual)</label>
                            <input
                                name="baseSalary"
                                type="number"
                                value={formData.baseSalary}
                                onChange={handleChange}
                                required
                                placeholder="0"
                                className="input-field"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Bonificaciones / Extras</label>
                            <input
                                name="bonuses"
                                type="number"
                                value={formData.bonuses}
                                onChange={handleChange}
                                placeholder="0"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2 mt-4">
                        <div className="flex justify-between text-sm italic">
                            <span className="text-slate-500">Bonos/Extras:</span>
                            <span className="font-semibold text-emerald-600">+{formatCurrency(calc.bonuses)}</span>
                        </div>
                        <div className="flex justify-between text-sm italic">
                            <span className="text-slate-500">Auxilio Transporte:</span>
                            <span className="font-semibold text-emerald-600">+{formatCurrency(calc.transportAllowance)}</span>
                        </div>
                        <div className="flex justify-between text-sm italic">
                            <span className="text-slate-500">Salud (4%):</span>
                            <span className="font-semibold text-rose-400">-{formatCurrency(calc.healthDeduction)}</span>
                        </div>
                        <div className="flex justify-between text-sm italic">
                            <span className="text-slate-500">Pensión (4%):</span>
                            <span className="font-semibold text-rose-400">-{formatCurrency(calc.pensionDeduction)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 mt-2 font-bold">
                            <span className="text-slate-900 italic">Neto a Recibir:</span>
                            <span className="text-indigo-600 underline underline-offset-4 decoration-lavender-blue/50 italic">{formatCurrency(calc.netPay)}</span>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="button-secondary flex-1">Cancelar</button>
                        <button type="submit" className="button-primary flex-1">Guardar Empleado</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
