// Moving between occupied positions swaps both labels; a null target returns to the bank.
function moveMapLabel(state,target,id){
  const next={...state};
  const source=Object.keys(next).find(key=>next[key]===id);
  if(source===target)return next;
  const displaced=target===null?undefined:next[target];
  if(source!==undefined)delete next[source];
  if(target!==null)next[target]=id;
  if(source!==undefined&&displaced!==undefined)next[source]=displaced;
  return next;
}
if(typeof module!=='undefined')module.exports=moveMapLabel;
