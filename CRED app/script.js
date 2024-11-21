import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase,ref,push,onValue,remove,set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
const appSettings = {
    databaseURL: "https://js-crud-528f7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app); //original data
const userdata = ref(database,"users");

const i_id = document.querySelector("#i_id");
const i_first = document.getElementById("i_first");
const i_last = document.getElementById("i_last");
const i_mail = document.getElementById("i_mail");
const frm = document.getElementById("frm");
const tbody = document.getElementById("tbody");

frm.addEventListener("submit" , function(e){
    e.preventDefault();
    if(!i_first.value.trim() || !i_last.value.trim() || !i_mail.value.trim() ){
        alert("Please fill all details");
        return;
    }
    e.preventDefault();
    if(i_id.value){
        //Update Record
        set(ref(database,"users/"+i_id.value),{
            first : i_first.value.trim(),
            last : i_last.value.trim(),    
            mail : i_mail.value.trim(), 
        });
        clearEle();
        return;
    }
    //Insert
    const newUser = {
      first : i_first.value.trim(),
      last : i_last.value.trim(),    
      mail : i_mail.value.trim(), 
    };
    push(userdata, newUser);
    clearEle(); 

});

function clearEle(){
    i_id.value = "";
    i_first.value = "";
    i_last.value = "";
    i_mail.value = "";
}

onValue(userdata,function(snapshot) {
    if(snapshot.exists()){
        let userArray = Object.entries(snapshot.val());
        console.log(userArray);
        tbody.innerHTML=""
        for(let i = 0;i<userArray.length;i++){
            let currentUser = userArray[i];
            console.log(currentUser);
            let currentUserID = currentUser[0];
            let currentUserValue = currentUser[1];
            tbody.innerHTML +=`
                    <tr class="table-row"> 
                    <td>${i + 1}</td>
                    <td>${currentUserValue.first}</td>
                    <td>${currentUserValue.last}</td>
                    <td>${currentUserValue.mail}</td>
                    <td>
                        <button data-id ="${currentUserID}" class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-delete" data-id ="${currentUserID}"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`
        }
    }
    else{
        tbody.innerHTML='<tr><td colspan = "5">No Record Found</td></tr>';
    }
})

document.addEventListener("click",function(e){
    if(e.target.classList.contains("btn-edit")){
        const id = e.target.dataset.id;
        const ele = e.target.closest("tr").children;
        i_id.value = id; 
        i_first.value = ele[1].textContent;
        i_last.value = ele[2].textContent;
        i_mail.value = ele[3].textContent;
        console.log("edit",id);
    }
    else if (e.target.classList.contains("btn-delete")){
        if(confirm("Are you sure to remove the Record")){
            const id = e.target.dataset.id;
            let data = ref(database,`users/${id}`);
            remove(data); 
            console.log("delete");
        }
        else{
            return;
        }
    }
});