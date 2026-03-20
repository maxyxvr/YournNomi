/**
 * Payroll calculation logic for Colombia (standard defaults)
 */

export const PAYROLL_CONSTANTS = {
    HEALTH_RATE: 0.04, // 4%
    PENSION_RATE: 0.04, // 4%
    ARL_RATE: 0.00522, // 0.522% (Risk Level 1)
    TRANSPORT_ALLOWANCE: 162000,
    TRANSPORT_ALLOWANCE_THRESHOLD: 2600000,
};

export const calculatePayroll = (baseSalary, bonuses = 0) => {
    const salary = parseFloat(baseSalary) || 0;
    const bonus = parseFloat(bonuses) || 0;

    const healthDeduction = salary * PAYROLL_CONSTANTS.HEALTH_RATE;
    const pensionDeduction = salary * PAYROLL_CONSTANTS.PENSION_RATE;
    const arlDeduction = salary * PAYROLL_CONSTANTS.ARL_RATE;

    const transportAllowance = salary <= PAYROLL_CONSTANTS.TRANSPORT_ALLOWANCE_THRESHOLD
        ? PAYROLL_CONSTANTS.TRANSPORT_ALLOWANCE
        : 0;

    // Total additions
    const totalIncome = salary + transportAllowance + bonus;

    // Total deductions
    const totalDeductions = healthDeduction + pensionDeduction; // Employee only pays health/pension usually

    const netPay = totalIncome - totalDeductions;

    return {
        baseSalary: salary,
        bonuses: bonus,
        healthDeduction,
        pensionDeduction,
        arlDeduction, // Info only, usually employer pays
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
