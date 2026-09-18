import type { Difficulty, Question, TopicId } from "@/types/learning";

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const int = (low: number, high: number) => Math.floor(Math.random() * (high - low + 1)) + low;
const makeId = () => Date.now().toString() + "-" + Math.random().toString(36).slice(2);
const make = (topicId: TopicId, conceptId: string, difficulty: Difficulty, prompt: string, answer: string | number, answerKind: Question["answerKind"], explanation: string[], hint: string, acceptedTolerance?: number): Question => ({ id: makeId(), topicId, conceptId, difficulty, prompt, answer, answerKind, explanation, hint, acceptedTolerance });

function order(d: Difficulty) {
  if (d === "beginner") { const a=int(2,12), b=int(2,9), c=int(2,7); return make("order","order.precedence",d,"What is "+a+" + "+b+" × "+c+"?",a+b*c,"number",[b+" × "+c+" = "+b*c,a+" + "+b*c+" = "+(a+b*c)],"Multiply before adding."); }
  if (d === "intermediate") { const a=pick([12,18,24,36]), b=pick([2,3,4,6]), c=int(2,6); return make("order","order.left-to-right",d,"What is "+a+" ÷ "+b+" × "+c+"?",a/b*c,"number",[a+" ÷ "+b+" = "+a/b,(a/b)+" × "+c+" = "+a/b*c],"Division and multiplication go left to right."); }
  const a=int(2,5), b=int(2,5), c=int(2,4); return make("order","order.powers",d,"What is "+a+" × ("+b+" + "+c+"²)?",a*(b+c**2),"number",[c+"² = "+c**2,"("+b+" + "+c**2+") = "+(b+c**2),a+" × "+(b+c**2)+" = "+a*(b+c**2)],"Finish the parentheses before multiplying.");
}
function fractions(d: Difficulty) {
  if (d === "beginner") { const den=pick([3,4,5,6,8]), a=int(1,den-2), b=int(1,den-a); return make("fractions","fractions.common-denominator",d,"What is "+a+"/"+den+" + "+b+"/"+den+"? Give a fraction or decimal.",(a+b)/den,"fraction",["The pieces already have the same size: "+den+"ths.","Count "+a+" + "+b+" = "+(a+b)+" pieces."],"Add the numerators only.",.0005); }
  if (d === "intermediate") { const a=pick([2,3,4]), b=pick([3,4,5,6]), value=1/a+1/b; return make("fractions","fractions.common-denominator",d,"What is 1/"+a+" + 1/"+b+"? Give a fraction or decimal.",value,"fraction",["Rewrite both fractions using equally sized pieces.","Then add the numerators."],"Find a common denominator.",.0005); }
  const den=pick([3,4,5]), num=den+int(1,den*2); return make("fractions","fractions.improper",d,"Write "+num+"/"+den+" as a decimal.",num/den,"fraction",[num+" ÷ "+den+" = "+num/den,"It contains "+Math.floor(num/den)+" whole(s)."],"Divide the numerator by the denominator.",.0005);
}
function decimals(d: Difficulty) {
  if (d === "beginner") { const a=int(1,9)/10, b=int(1,9)/100; return make("decimals","decimals.operations",d,"What is "+a.toFixed(1)+" + "+b.toFixed(2)+"?",a+b,"number",["Line up tenths and hundredths.",a.toFixed(2)+" + "+b.toFixed(2)+" = "+(a+b).toFixed(2)+"."],"Write both values to hundredths.",.0001); }
  if (d === "intermediate") { const a=int(10,99)/100,b=int(10,99)/100; return make("decimals","decimals.comparison",d,"Which is larger: "+a.toFixed(2)+" or "+b.toFixed(2)+"? Enter the larger decimal.",Math.max(a,b),"number",[Math.max(a,b).toFixed(2)+" has more hundredths than "+Math.min(a,b).toFixed(2)+"."],"Compare digit by digit.",.0001); }
  const n=int(100,999)/100; return make("decimals","decimals.rounding",d,"Round "+n.toFixed(2)+" to one decimal place.",Number(n.toFixed(1)),"number",["Look at the hundredths digit.","The rounded value is "+n.toFixed(1)+"."],"Use the next digit to choose.",.0001);
}
function percentages(d: Difficulty) {
  if (d === "beginner") { const p=pick([5,10,20,25,50]), v=pick([80,100,120,200,240]); return make("percentages","percentages.of-quantity",d,"What is "+p+"% of "+v+"?",v*p/100,"number",[p+"% = "+p/100+".",v+" × "+p/100+" = "+v*p/100+"."],"Turn the percent into a decimal."); }
  if (d === "intermediate") { const old=pick([100,200,250,400]), p=pick([10,15,20,25]), next=old*(1+p/100); return make("percentages","percentages.change",d,"A value moves from "+old+" to "+next+". What is the percentage increase?",p,"percentage",["The change is "+(next-old)+".","("+ (next-old) +" ÷ "+old+") × 100 = "+p+"%."],"Compare the change with the old value."); }
  const up=pick([10,20,25]), down=pick([10,20,25]), end=100*(1+up/100)*(1-down/100); return make("percentages","percentages.successive",d,"Start at 100. Increase by "+up+"% then decrease by "+down+"%. What is the final value?",end,"number",["100 becomes "+100*(1+up/100)+".","Then it changes by −"+down+"% to "+end+"."],"The second percentage acts on the new value.",.0001);
}
function ratios(d: Difficulty) {
  if (d === "beginner") { const a=pick([2,3,4,5]),b=pick([2,3,4,5]),f=pick([2,3,4]); return make("ratios","ratios.equivalent",d,"Complete: "+a+":"+b+" = "+a*f+":x. What is x?",b*f,"number",[a+" became "+a*f+" by ×"+f+".",b+" × "+f+" = "+b*f+"."],"Scale both terms equally."); }
  if (d === "intermediate") { const wins=pick([20,30,40,45]),losses=pick([10,15,20,25]); return make("ratios","ratios.part-whole",d,wins+" wins and "+losses+" losses: what is the win rate as a percentage?",wins/(wins+losses)*100,"percentage",[wins+"+"+losses+"="+(wins+losses)+" total trades.",wins+"/"+(wins+losses)+" = "+wins/(wins+losses)*100+"%."],"Win rate uses total trades.",.0001); }
  const a=pick([2,3,4,5]),b=pick([3,4,5,6]),f=pick([2,3,4]); return make("ratios","ratios.proportion",d,"If "+a+"/"+b+" = "+a*f+"/x, what is x?",b*f,"number",[a+" becomes "+a*f+" by ×"+f+".",b+" also becomes "+b*f+"."],"Use the same scale factor.");
}
function negatives(d: Difficulty) {
  if (d === "beginner") { const a=-int(1,8),b=int(2,10); return make("negatives","negatives.number-line",d,"What is "+a+" + "+b+"?",a+b,"number",["Start at "+a+".","Move "+b+" steps right to "+(a+b)+"."],"Adding a positive moves right."); }
  if (d === "intermediate") { const a=int(1,10),b=int(1,8); return make("negatives","negatives.subtract",d,"What is "+a+" − (−"+b+")?",a+b,"number",["Subtracting a negative is adding its opposite.",a+" + "+b+" = "+(a+b)+"."],"Two negatives make a move right here."); }
  const a=-int(2,9),b=-int(2,9); return make("negatives","negatives.multiply",d,"What is ("+a+") × ("+b+")?",a*b,"number",["A negative times a negative is positive.","The magnitudes multiply to "+a*b+"."],"Use the sign pattern.");
}
function exponents(d: Difficulty) {
  if (d === "beginner") { const base=pick([2,3,4]),power=pick([2,3,4]); return make("exponents","exponents.meaning",d,"What is "+base+"^"+power+"?",base**power,"number",[base+" multiplied by itself "+power+" times is "+base**power+"."],"Write the repeated multiplication."); }
  if (d === "intermediate") { const a=int(1,5),b=int(1,5); return make("exponents","exponents.rules",d,"Simplify 2^"+a+" × 2^"+b+". Enter the value.",2**(a+b),"number",["Same base: add exponents: "+a+"+"+b+"="+(a+b)+".","2^"+(a+b)+"="+2**(a+b)+"."],"Join the copies of the base."); }
  const base=pick([2,3,4]),power=pick([1,2,3]); return make("exponents","exponents.zero-negative",d,"What is "+base+"^−"+power+"? Give a fraction or decimal.",base**(-power),"fraction",[base+"^−"+power+" = 1/"+base+"^"+power+".","= 1/"+base**power+"."],"Negative exponent means reciprocal.",.0005);
}
function roots(d: Difficulty) {
  if (d === "beginner") { const root=pick([2,3,4,5,6,7,8,9,10,11,12]); const area=root*root; return make("roots","roots.meaning",d,"What is √"+area+"?",root,"number",[root+" × "+root+" = "+area+".","So √"+area+" = "+root+"."],"Ask which number squares to the area."); }
  if (d === "intermediate") { const n=pick([50,70,80,90]); return make("roots","roots.approximation",d,"√"+n+" lies between which two whole numbers? Enter the lower one.",Math.floor(Math.sqrt(n)),"number",["Compare nearby perfect squares.",Math.floor(Math.sqrt(n))+"² < "+n+" < "+Math.ceil(Math.sqrt(n))+"²."],"Find the nearest lower square."); }
  const root=pick([2,3,4,5]); return make("roots","roots.cube",d,"What is ∛"+root**3+"?",root,"number",[root+"³ = "+root**3+".","So ∛"+root**3+" = "+root+"."],"Which number multiplied three times gives the value?");
}
const factories: Record<TopicId, (d: Difficulty) => Question> = { order, fractions, decimals, percentages, ratios, negatives, exponents, roots };
export const generateQuestion = (topicId: TopicId, difficulty: Difficulty) => factories[topicId](difficulty);
export const generateSession = (topicId: TopicId, difficulty: Difficulty, count = 10) => Array.from({length:count}, () => generateQuestion(topicId,difficulty));
export const generateFinalTest = () => Array.from({length:32}, (_,i) => generateQuestion((["order","fractions","decimals","percentages","ratios","negatives","exponents","roots"] as TopicId[])[i%8],(["beginner","intermediate","mastery"] as Difficulty[])[Math.floor(i/8)%3]));
