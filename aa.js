const socket = io('http://localhost:3000/');




document.querySelector("button").addEventListener("click",(e)=>{
    e.preventDefault();
    const uid=document.querySelector("#user").value;
    const tid=document.querySelector("#ticket").value;
    console.log("Sending",uid,tid)
    socket.emit("join",{id:uid,room:tid})
})
console.log("started")



socket.on("message",(data)=>{
    console.log("message",data);
})


socket.on("error",(data)=>{
    console.log("Error",data);
})
