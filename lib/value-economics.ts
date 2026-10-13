/** Browser-only illustrative economics. Neither measured savings nor a client forecast. */
export type ValueInput={
 cases:number; manual:number; cost:number; eligible:number; success:number;
 reviewShare:number; reviewMinutes:number; failureShare:number; recoveryMinutes:number;
 perCaseAi:number; operation:number; setup:number; realizable:number
};
export const demonstration:ValueInput={
 cases:1200,manual:14,cost:18,eligible:65,success:72,
 reviewShare:30,reviewMinutes:4,failureShare:5,recoveryMinutes:15,
 perCaseAi:0.2,operation:900,setup:15000,realizable:100
};
export type Scenario="conservative"|"base"|"optimistic";
export const scenarioMultipliers:Record<Scenario,{success:number;reviewShare:number;failureShare:number}>={
 conservative:{success:60,reviewShare:40,failureShare:8},
 base:{success:72,reviewShare:30,failureShare:5},
 optimistic:{success:84,reviewShare:20,failureShare:3}
};
export function withScenario(v:ValueInput,scenario:Scenario):ValueInput{
 if(scenario==="base")return {...v,success:scenarioMultipliers.base.success,reviewShare:scenarioMultipliers.base.reviewShare,failureShare:scenarioMultipliers.base.failureShare};
 return {...v,...scenarioMultipliers[scenario]};
}
export function evaluateValue(v:ValueInput){
 const all=Object.values(v);
 if(all.some(n=>!Number.isFinite(n)||n<0)||v.cases>1e7||v.manual>100000||v.cost>1e6||v.operation>1e9||v.setup>1e10||
  [v.eligible,v.success,v.reviewShare,v.failureShare,v.realizable].some(n=>n>100))return null;
 const eligibleCases=v.cases*v.eligible/100;
 const completedCases=eligibleCases*v.success/100;
 const manualBaseline=v.cases*v.manual/60*v.cost;
 const avoidedLabor=completedCases*v.manual/60*v.cost;
 const remainingManual=manualBaseline-avoidedLabor;
 const reviewCost=eligibleCases*v.reviewShare/100*v.reviewMinutes/60*v.cost;
 const recoveryCost=eligibleCases*v.failureShare/100*v.recoveryMinutes/60*v.cost;
 const aiCost=eligibleCases*v.perCaseAi;
 const gross=avoidedLabor;
 const realizableSavings=avoidedLabor*v.realizable/100;
 const retainedLabor=manualBaseline-realizableSavings;
 const afterCost=retainedLabor+reviewCost+recoveryCost+aiCost+v.operation;
 const net=manualBaseline-afterCost;
 const netPerYear=net*12-v.setup;
 const paybackMonths=net>0?v.setup/net:null;
 const hours=completedCases*v.manual/60-(reviewCost+recoveryCost)/(v.cost||1);
 const minutesPerCase=v.manual;
 return {eligibleCases,completedCases,manualBaseline,remainingManual,retainedLabor,
  avoidedLabor,reviewCost,recoveryCost,aiCost,operationCost:v.operation,
  afterCost,gross,realizableSavings,net,netPerYear,paybackMonths,
  hours,minutesPerCase,baselineHours:v.cases*v.manual/60};
}
