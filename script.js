
document.addEventListener("mousemove",e=>{
const orb=document.querySelector(".orb");
orb.style.transform=`translate(${e.clientX*0.005}px,${e.clientY*0.005}px)`;
});
