import React, { useState, useEffect } from 'react';
import { Plus, Download, FileText, UserCircle, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import jsPDF from 'jspdf';
import Dashboard from './components/Dashboard';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import { formatCurrency } from './utils/payrollLogic';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('yournomi_employees');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 1, name: 'Valentina Mendoza', idNumber: '1.020.455.789', position: 'Gerente de Proyectos',
        baseSalary: 4500000, bonuses: 500000, transportAllowance: 0, healthDeduction: 180000, pensionDeduction: 180000, netPay: 4640000
      },
      {
        id: 2, name: 'Andrés Felipe Castro', idNumber: '1.032.112.334', position: 'Diseñador UI/UX',
        baseSalary: 2200000, bonuses: 0, transportAllowance: 162000, healthDeduction: 88000, pensionDeduction: 88000, netPay: 2186000
      },
      {
        id: 3, name: 'Sofía Rodríguez', idNumber: '1.015.667.889', position: 'Contadora',
        baseSalary: 3800000, bonuses: 100000, transportAllowance: 0, healthDeduction: 152000, pensionDeduction: 152000, netPay: 3596000
      }
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    localStorage.setItem('yournomi_employees', JSON.stringify(employees));
  }, [employees]);

  const handleSaveEmployee = (employee) => {
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === employee.id ? employee : e));
    } else {
      setEmployees([...employees, employee]);
    }
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar la sesión?')) {
      alert('Sesión cerrada correctamente. (Mockup)');
      // In a real app, logic to clear tokens/context would go here
    }
  };

  const exportCSV = () => {
    const headers = ['Nombre,Cédula,Cargo,Sueldo Base,Bonos,Aux. Transporte,Salud,Pensión,Neto'];
    const rows = employees.map(e =>
      `${e.name},${e.idNumber},${e.position},${e.baseSalary},${e.bonuses || 0},${e.transportAllowance},${e.healthDeduction},${e.pensionDeduction},${e.netPay}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sabana_nomina.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadStub = (emp) => {
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text("YourNomi", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Comprobante de Pago de Nómina", 105, 30, { align: "center" });

    doc.setDrawColor(224, 231, 255);
    doc.line(20, 35, 190, 35);

    // Employee Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Nombre: ${emp.name}`, 20, 50);
    doc.text(`Cédula: ${emp.idNumber}`, 20, 60);
    doc.text(`Cargo: ${emp.position}`, 20, 70);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 150, 50);

    // Details Table
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 80, 170, 70, 'F');

    const startY = 90;
    doc.text("Concepto", 25, startY);
    doc.text("Valor", 160, startY, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.text("Sueldo Base", 25, startY + 10);
    doc.text(formatCurrency(emp.baseSalary), 160, startY + 10, { align: "right" });

    doc.text("Bonificaciones/Extras", 25, startY + 20);
    doc.text(`+ ${formatCurrency(emp.bonuses || 0)}`, 160, startY + 20, { align: "right" });

    doc.text("Auxilio de Transporte", 25, startY + 30);
    doc.text(`+ ${formatCurrency(emp.transportAllowance)}`, 160, startY + 30, { align: "right" });

    doc.setTextColor(239, 68, 68);
    doc.text("Deducción Salud (4%)", 25, startY + 40);
    doc.text(`- ${formatCurrency(emp.healthDeduction)}`, 160, startY + 40, { align: "right" });

    doc.text("Deducción Pensión (4%)", 25, startY + 50);
    doc.text(`- ${formatCurrency(emp.pensionDeduction)}`, 160, startY + 50, { align: "right" });

    // Net
    doc.line(25, startY + 55, 160, startY + 55);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("NETO A PAGAR", 25, startY + 62);
    doc.text(formatCurrency(emp.netPay), 160, startY + 62, { align: "right" });

    doc.save(`colilla_${emp.name.replace(/\s+/g, '_')}.pdf`);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 italic tracking-tight">¡Bienvenido al Panel!</h2>
                <p className="text-slate-500 font-medium">Gestiona la nómina de tu equipo con eficiencia.</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={exportCSV} className="button-secondary flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Exportar Sábana</span>
                </button>
                <button onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }} className="button-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Trabajador</span>
                </button>
              </div>
            </header>
            <Dashboard employees={employees} />
            <EmployeeTable employees={employees} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee} onDownloadStub={downloadStub} />
          </>
        );
      case 'users':
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
            <UserCircle className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl">Módulo de Usuarios - Próximamente</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl">Configuración del Sistema - Próximamente</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white-smoke text-slate-800">
      <aside className="w-64 bg-white border-r border-slate-100 p-6 flex-col hidden md:flex">
        <div className="flex items-center space-x-2 mb-12">
          <div className="bg-lavender-blue p-2 rounded-xl">
            <span className="text-xl font-bold text-indigo-600 italic uppercase tracking-tighter">YN</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight tracking-wider">YourNomi</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center space-x-3 w-full p-3 rounded-xl font-medium transition-all ${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Panel</span>
          </button>
          <button
            onClick={() => setActiveView('users')}
            className={`flex items-center space-x-3 w-full p-3 rounded-xl font-medium transition-all ${activeView === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <UserCircle className="w-5 h-5" />
            <span>Usuarios</span>
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className={`flex items-center space-x-3 w-full p-3 rounded-xl font-medium transition-all ${activeView === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Ajustes</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-50">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-400 p-3 w-full hover:text-rose-500 transition-colors italic">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {renderContent()}

        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEmployee}
          employeeToEdit={editingEmployee}
        />
      </main>
    </div>
  );
}

export default App;
