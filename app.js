const state = {
  currentModule: 'what-is-agent',
  progress: JSON.parse(localStorage.getItem('agentAcademy.progress') || '{}'),
  builder: JSON.parse(localStorage.getItem('agentAcademy.builder') || '{}'),
  sandboxRuns: []
};

const modules = [
  ['what-is-agent','1) What Is an Agent?'],['instructions','2) Agent Instructions'],['tools','3) Tools & Tool Calling'],['memory','4) Memory'],['planning','5) Planning'],['approval','6) Human Approval'],['multi','7) Multi-Agent Teams'],['builder','8) Agent Business Builder'],['sandbox','9) Sandbox'],['capstone','10) Capstone']
];

function save(){localStorage.setItem('agentAcademy.progress', JSON.stringify(state.progress));localStorage.setItem('agentAcademy.builder', JSON.stringify(state.builder));}
function markDone(id){state.progress[id]=true;save();render();}

function layout(content){
  const nav = modules.map(([id,label])=>`<button class="nav ${state.currentModule===id?'active':''}" onclick="go('${id}')">${label}${state.progress[id]?' ✅':''}</button>`).join('');
  return `<div class='layout'><aside><h1>Agent Academy</h1><p>Interactive beginner lab</p>${nav}</aside><main>${content}</main></div>`;
}
window.go=(id)=>{state.currentModule=id;render();};

function card(title, body){return `<section class='card'><h2>${title}</h2>${body}</section>`;}

function renderWhatIsAgent(){
  return layout(
    card('Explain', `<p>An <b>agent</b> is like a digital employee: it has a goal, follows rules, uses tools, remembers context, and makes step-by-step decisions.</p>`) +
    card('Show: Chatbot vs Agent', `<div class='grid2'><div><h3>Chatbot</h3><p>Gives general advice only.</p></div><div><h3>Agent</h3><ol><li>Understand goal</li><li>Find needed info</li><li>Pick tools</li><li>Research vendors</li><li>Compare options</li><li>Recommend</li><li>Ask approval</li></ol></div></div>
      <button onclick='alert("Click through the other modules to see each part in depth.")'>Show visual step walkthrough</button>`)+
    card('Apply to business',`<p>Use this for vendor selection, outreach, reporting, and SOP updates with approvals for risky actions.</p><button onclick="done('what-is-agent')">Mark complete</button>`)
  );
}

function renderInstructions(){
  const r=(id,d='')=> state.builder[id]||d;
  return layout(card('Build agent instructions',`
  <p>Choose settings and watch output change.</p>
  <label>Role <input id='role' value='${r('role','Operations Assistant')}'/></label>
  <label>Goal <input id='goal' value='${r('goal','Reduce manager busywork by 5 hours/week')}'/></label>
  <label>Allowed actions <input id='allow' value='${r('allow','Research, summarize, draft emails')}'/></label>
  <label>Forbidden actions <input id='forbid' value='${r('forbid','Send external email without approval')}'/></label>
  <label>Tone <input id='tone' value='${r('tone','calm and concise')}'/></label>
  <label>Escalation <input id='escalate' value='${r('escalate','Escalate legal/financial risk')}'/></label>
  <label>Output format <input id='format' value='${r('format','bullet summary + next action')}'/></label>
  <button onclick='buildPrompt()'>Generate instruction prompt</button>
  <pre id='promptBox'>${state.builder.prompt||''}</pre>
  <button onclick="done('instructions')">Mark complete</button>`));
}
window.buildPrompt=()=>{
  ['role','goal','allow','forbid','tone','escalate','format'].forEach(k=>state.builder[k]=document.getElementById(k).value);
  state.builder.prompt=`Role: ${state.builder.role}\nGoal: ${state.builder.goal}\nAllowed: ${state.builder.allow}\nForbidden: ${state.builder.forbid}\nTone: ${state.builder.tone}\nEscalation: ${state.builder.escalate}\nOutput: ${state.builder.format}`;
  save();render();
};

function renderTools(){
  return layout(card('Tool selection simulation',`
  <p>Task: Schedule a follow-up meeting with a lead and send them a recap.</p>
  ${['Calendar','Email','CRM','Notes','Calculator'].map(t=>`<label><input type='checkbox' id='tool_${t}' ${state.builder['tool_'+t]?'checked':''}/> ${t}</label>`).join('')}
  <button onclick='runTools()'>Run simulation</button>
  <pre>${state.builder.toolsResult||''}</pre>
  <button onclick="done('tools')">Mark complete</button>`));
}
window.runTools=()=>{
  const has=t=>document.getElementById('tool_'+t).checked;
  ['Calendar','Email','CRM','Notes','Calculator'].forEach(t=>state.builder['tool_'+t]=has(t));
  const steps=[];
  steps.push('Request received.');
  if(has('CRM')) steps.push('Pulled lead info from CRM.'); else steps.push('Cannot fetch lead details (CRM missing).');
  if(has('Calendar')) steps.push('Found open slots in calendar.'); else steps.push('Cannot book meeting (Calendar missing).');
  if(has('Notes')) steps.push('Drafted recap from notes.');
  if(has('Email')) steps.push('Prepared follow-up email.'); else steps.push('Cannot send recap (Email missing).');
  steps.push('Final response generated with limitations noted.');
  state.builder.toolsResult=steps.join('\n');save();render();
};

function renderMemory(){
  const on=!!state.builder.memoryOn;
  return layout(card('Memory toggle',`
  <label><input type='checkbox' id='memOn' ${on?'checked':''}/> Enable memory</label>
  <button onclick='runMemory()'>Simulate</button>
  <pre>${state.builder.memoryResult||''}</pre>
  <button onclick="done('memory')">Mark complete</button>`));
}
window.runMemory=()=>{
  const on=document.getElementById('memOn').checked;state.builder.memoryOn=on;
  state.builder.memoryResult= on?
`Remembered facts:\n- Preferred vendor: Acme Uniforms\n- Approval for purchases > $500\nAction: Draft order with Acme and ask manager approval checkpoint.`:
`No memory available. Agent asks: Which vendor? Any approval rules?`;
  save();render();
};

function renderPlanning(){
  const steps=state.builder.planSteps||['List training goals','Create week-1 schedule','Assign trainer','Define evaluation checklist'];
  return layout(card('Plan editor',`
  <p>Goal: Create onboarding plan for a new restaurant server.</p>
  <textarea id='planBox' rows='8'>${steps.join('\n')}</textarea>
  <button onclick='savePlan()'>Save plan</button>
  <pre>${(state.builder.planSteps||[]).map((s,i)=>`${i+1}. ${s}`).join('\n')}</pre>
  <button onclick="done('planning')">Mark complete</button>`));
}
window.savePlan=()=>{state.builder.planSteps=document.getElementById('planBox').value.split('\n').filter(Boolean);save();render();};

function renderApproval(){
  return layout(card('Approval rules simulator',`
  <p>Set rules and test customer refund messages.</p>
  <label>Auto-approve under $ <input id='limit' type='number' value='${state.builder.refundLimit||25}'/></label>
  <textarea id='msg' rows='3' placeholder='Customer message'>${state.builder.refundMsg||'I was charged $40 twice and I am very upset.'}</textarea>
  <button onclick='runApproval()'>Evaluate</button>
  <pre>${state.builder.refundResult||''}</pre>
  <button onclick="done('approval')">Mark complete</button>`));
}
window.runApproval=()=>{const limit=Number(document.getElementById('limit').value||25);const msg=document.getElementById('msg').value;state.builder.refundLimit=limit;state.builder.refundMsg=msg;const amount=(msg.match(/\$(\d+)/)||[])[1];let out='';if(/upset|angry/i.test(msg)) out+='Escalate tone risk: angry customer.\n';if(/suspicious|fraud/i.test(msg)) out+='Flag suspicious request.\n';if(amount){out += Number(amount)<=limit?'Auto-approved refund.':'Needs manager approval.';}else out+='Missing amount: ask follow-up question.';state.builder.refundResult=out;save();render();};

function renderMulti(){return layout(card('Multi-agent delegation',`<p>Task: Launch a catering promotion for local offices.</p><button onclick='runMulti()'>Run team simulation</button><pre>${state.builder.multi||''}</pre><button onclick="done('multi')">Mark complete</button>`));}
window.runMulti=()=>{state.builder.multi=`Manager Agent delegates:\n- Research Agent: find office parks + decision-makers\n- Sales Agent: draft outreach sequence\n- Support Agent: FAQ reply templates\n- Operations Agent: delivery capacity + SLA\nManager reviews and asks your approval before launch.`;save();render();};

function renderBuilder(){
  return layout(card('Business Builder wizard',`
  <label>Business type <input id='biz' value='${state.builder.biz||'Restaurant Group'}'/></label>
  <label>Repetitive tasks <input id='tasks' value='${state.builder.tasks||'Onboarding, review replies, weekly reports'}'/></label>
  <label>Human-only decisions <input id='human' value='${state.builder.human||'Refund exceptions, vendor contracts'}'/></label>
  <label>Tools <input id='toolsB' value='${state.builder.toolsB||'Email, calendar, CRM, docs'}'/></label>
  <label>Risks <input id='risks' value='${state.builder.risks||'Wrong promises, privacy leaks'}'/></label>
  <label>Success metric <input id='success' value='${state.builder.success||'8 hours saved/week + faster responses'}'/></label>
  <button onclick='genBlueprint()'>Generate editable blueprint</button>
  <textarea id='blueprint' rows='14'>${state.builder.blueprint||''}</textarea>
  <button onclick='saveBlueprint()'>Save edits</button>
  <button onclick='downloadMd()'>Export Markdown</button>
  <button onclick="done('builder')">Mark complete</button>`));
}
window.genBlueprint=()=>{['biz','tasks','human','toolsB','risks','success'].forEach(k=>state.builder[k]=document.getElementById(k).value);state.builder.blueprint=`# Agent Team Blueprint\n\n## Business\n${state.builder.biz}\n\n## Agent Role\nOperations Copilot\n\n## Instructions\nHandle: ${state.builder.tasks}. Escalate: ${state.builder.human}.\n\n## Tools\n${state.builder.toolsB}\n\n## Workflow\n1. Intake task\n2. Plan\n3. Use tools\n4. Ask approval for sensitive actions\n5. Deliver output\n\n## Risks\n${state.builder.risks}\n\n## Success\n${state.builder.success}`;save();render();};
window.saveBlueprint=()=>{state.builder.blueprint=document.getElementById('blueprint').value;save();};
window.downloadMd=()=>{const blob=new Blob([state.builder.blueprint||''],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='agent-blueprint.md';a.click();};

function renderSandbox(){return layout(card('Sandbox (most important)',`
<p>Experiment freely and compare runs.</p>
<label>Task <input id='sTask' value='${state.builder.sTask||'Research 3 uniform vendors and recommend one'}'/></label>
<label>Role <input id='sRole' value='${state.builder.sRole||'Procurement Agent'}'/></label>
<label>Tools comma-separated <input id='sTools' value='${state.builder.sTools||'search,spreadsheet,email'}'/></label>
<label>Memory facts <input id='sMem' value='${state.builder.sMem||'Preferred vendor Acme; >$500 needs approval'}'/></label>
<label>Approval rules <input id='sRules' value='${state.builder.sRules||'External actions require approval'}'/></label>
<button onclick='runSandbox()'>Run simulation</button>
<button onclick='explainSimple()'>Explain this more simply</button>
<button onclick='showBiz()'>Show business example</button>
<button onclick='riskBtn()'>What could go wrong?</button>
<button onclick='improveBtn()'>Improve this agent</button>
<pre>${(state.builder.sOut||'')}</pre>
<h3>Before/After Compare</h3><pre>${(state.sandboxRuns||[]).slice(-2).map((r,i)=>`Run ${i+1}: ${r}`).join('\n---\n')}</pre>
<button onclick="done('sandbox')">Mark complete</button>`));}
window.runSandbox=()=>{['sTask','sRole','sTools','sMem','sRules'].forEach(k=>state.builder[k]=document.getElementById(k).value);const out=`Role: ${state.builder.sRole}\nTask: ${state.builder.sTask}\nPlan: understand -> gather -> compare -> draft\nTools used: ${state.builder.sTools}\nMemory used: ${state.builder.sMem}\nApproval check: ${state.builder.sRules}\nResult: Recommendation draft ready.`;state.builder.sOut=out;state.sandboxRuns.push(out);save();render();};
window.explainSimple=()=>alert('Simple: the agent is following your job instructions like a new employee with a checklist.');
window.showBiz=()=>alert('Business example: use this setup for weekly vendor price checks with manager approval before switching suppliers.');
window.riskBtn=()=>alert('Risks: wrong data, missed policy rules, sending messages without approval, overconfident recommendations.');
window.improveBtn=()=>alert('Improve by tightening forbidden actions, adding clearer escalation rules, and adding memory facts.');

function renderCapstone(){return layout(card('Capstone project',`<p>Default case: local restaurant group.</p><ol><li>Set goals</li><li>Define 5 agent roles</li><li>Write instructions</li><li>Select tools</li><li>Set approvals</li><li>Simulate</li><li>Evaluate</li><li>Export blueprint</li></ol><button onclick='go("builder")'>Open Builder</button><button onclick='go("sandbox")'>Open Sandbox</button><button onclick="done('capstone')">Mark complete</button>`));}

window.done=markDone;

function render(){
  const map={ 'what-is-agent':renderWhatIsAgent, instructions:renderInstructions, tools:renderTools, memory:renderMemory, planning:renderPlanning, approval:renderApproval, multi:renderMulti, builder:renderBuilder, sandbox:renderSandbox, capstone:renderCapstone };
  document.getElementById('app').innerHTML=map[state.currentModule]();
}
render();
