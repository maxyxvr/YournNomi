/**
 * Payroll calculation logic for Colombia (standard defaults)
 */

export const PAYROLL_CONSTANTS = {
    ARL_RATE: 0.00522, // 0.522% (Risk Level 1)
};

export const calculatePayroll = (baseSalary, bonuses = 0, transportAllowance = 0) => {
    const salary = parseFloat(baseSalary) || 0;
    const bonus = parseFloat(bonuses) || 0;
    const transport = parseFloat(transportAllowance) || 0;

    // ARL is usually employer-paid, kept for info
    const arlDeduction = salary * PAYROLL_CONSTANTS.ARL_RATE;

    // Total income including manual transport allowance
    const totalIncome = salary + transport + bonus;

    // Total deductions (Health and Pension removed)
    const totalDeductions = 0;

    const netPay = totalIncome - totalDeductions;

    return {
        baseSalary: salary,
        bonuses: bonus,
        arlDeduction,
        transportAllowance: transport,
        totalIncome,
        totalDeductions,
        netPay
    };
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(amount);
};
