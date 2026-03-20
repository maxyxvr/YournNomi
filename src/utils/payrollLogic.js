/**
 * Payroll calculation logic for Colombia (standard defaults)
 */

export const PAYROLL_CONSTANTS = {
    ARL_RATE: 0.00522, // 0.522% (Risk Level 1)
    TRANSPORT_ALLOWANCE: 162000,
    TRANSPORT_ALLOWANCE_THRESHOLD: 2600000,
};

export const calculatePayroll = (baseSalary, bonuses = 0) => {
    const salary = parseFloat(baseSalary) || 0;
    const bonus = parseFloat(bonuses) || 0;

    // ARL is usually employer-paid, kept for info
    const arlDeduction = salary * PAYROLL_CONSTANTS.ARL_RATE;

    const transportAllowance = salary <= PAYROLL_CONSTANTS.TRANSPORT_ALLOWANCE_THRESHOLD
        ? PAYROLL_CONSTANTS.TRANSPORT_ALLOWANCE
        : 0;

    // Total additions
    const totalIncome = salary + transportAllowance + bonus;

    // Total deductions (Health and Pension removed as per user request)
    const totalDeductions = 0;

    const netPay = totalIncome - totalDeductions;

    return {
        baseSalary: salary,
        bonuses: bonus,
        arlDeduction,
        transportAllowance,
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
