function calculateJapanTax({
  income,
  investment,
  realEstate,
  spouse,
  dependents,
  specialDependents,
  elderlyDependents,
  medicalDeduction,
  lifeInsuranceDeduction,
  mortgageDeduction,
  earthquakeInsuranceDeduction,
  donationDeduction,
  otherDeduction
}) {
  const totalIncome = income + investment + realEstate;
  let deductions = 480000;

  if (spouse === "full") deductions += 380000;
  else if (spouse === "partial") deductions += 260000;

  deductions += dependents * 380000;
  deductions += specialDependents * 630000;
  deductions += elderlyDependents * 480000;
  deductions += totalIncome * 0.15;

  deductions += Math.min(lifeInsuranceDeduction, 120000);
  deductions += Math.min(earthquakeInsuranceDeduction, 50000);
  deductions += medicalDeduction + mortgageDeduction + donationDeduction + otherDeduction;

  const taxable = Math.max(0, totalIncome - deductions);

  let incomeTax = 0;
  const brackets = [
    { limit: 1950000, rate: 0.05, deduction: 0 },
    { limit: 3300000, rate: 0.10, deduction: 97500 },
    { limit: 6950000, rate: 0.20, deduction: 427500 },
    { limit: 9000000, rate: 0.23, deduction: 636000 },
    { limit: 18000000, rate: 0.33, deduction: 1536000 },
    { limit: 40000000, rate: 0.40, deduction: 2796000 },
    { limit: Infinity, rate: 0.45, deduction: 4796000 }
  ];

  for (const b of brackets) {
    if (taxable <= b.limit) {
      incomeTax = taxable * b.rate - b.deduction;
      break;
    }
  }

  incomeTax = Math.max(0, incomeTax);

  const residentTax = taxable * 0.10;
  const totalTax = incomeTax + residentTax;
  const effectiveRate = (totalTax / totalIncome) * 100;

  return {
    totalIncome,
    taxableIncome: taxable,
    incomeTax,
    residentTax,
    totalTax,
    effectiveTaxRate: effectiveRate.toFixed(2)
  };
}
