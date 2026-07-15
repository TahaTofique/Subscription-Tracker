const cards = document.getElementById("cards");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const renewalInput = document.getElementById("renewal");

const monthly = document.getElementById("monthly");
const yearly = document.getElementById("yearly");
const count = document.getElementById("count");

const search = document.getElementById("search");
const addBtn = document.getElementById("addBtn");

const themeBtn = document.getElementById("themeBtn");

let subscriptions =
JSON.parse(localStorage.getItem("subscriptions")) || [];

/* ---------------- Theme ---------------- */

if(localStorage.getItem("theme")==="light"){
    document.body.classList.add("light");
    themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';
}

themeBtn.onclick=()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){
        localStorage.setItem("theme","light");
        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';
    }else{
        localStorage.setItem("theme","dark");
        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';
    }

}

/* ---------------- Add ---------------- */

addBtn.onclick=()=>{

    const name=nameInput.value.trim();
    const price=parseFloat(priceInput.value);
    const category=categoryInput.value;
    const renewal=renewalInput.value;

    if(!name || !price || !renewal){

        alert("Please complete all fields.");
        return;

    }

    subscriptions.push({

        id:Date.now(),

        name,

        price,

        category,

        renewal

    });

    save();

    nameInput.value="";
    priceInput.value="";
    renewalInput.value="";

    render();

}

/* ---------------- Save ---------------- */

function save(){

localStorage.setItem(

"subscriptions",

JSON.stringify(subscriptions)

);

}

/* ---------------- Delete ---------------- */

function deleteSubscription(id){

subscriptions=subscriptions.filter(

s=>s.id!==id

);

save();

render();

}

/* ---------------- Days Left ---------------- */

function daysLeft(date){

const today=new Date();

today.setHours(0,0,0,0);

const renew=new Date(date);

renew.setHours(0,0,0,0);

return Math.ceil(

(renew-today)/(1000*60*60*24)

);

}

/* ---------------- Search ---------------- */

search.oninput=render;

/* ---------------- Render ---------------- */

function render(){

cards.innerHTML="";

const keyword=search.value.toLowerCase();

let total=0;

const filtered=subscriptions.filter(sub=>{

return sub.name.toLowerCase().includes(keyword);

});

count.textContent=filtered.length;

filtered.forEach(sub=>{

total+=sub.price;

const days=daysLeft(sub.renewal);

let status="🟢";

if(days<=7) status="🔴";
else if(days<=15) status="🟡";

cards.innerHTML+=`

<div class="subCard">

<div class="subHeader">

<h3>${sub.name}</h3>

<span class="badge">

${sub.category}

</span>

</div>

<div class="price">

$${sub.price.toFixed(2)}

<span style="font-size:16px;color:#94a3b8">

/ month

</span>

</div>

<p class="info">

📅 Renewal

<b>${sub.renewal}</b>

</p>

<p class="info">

${status}

${days} day${days!==1?"s":""} left

</p>

<button

class="deleteBtn"

onclick="deleteSubscription(${sub.id})"

>

Delete Subscription

</button>

</div>

`;

});

monthly.textContent="$"+total.toFixed(2);

yearly.textContent="$"+(total*12).toFixed(2);

/* Empty */

if(filtered.length===0){

cards.innerHTML=`

<div class="empty">

<i class="fa-solid fa-wallet"></i>

<h2>No subscriptions yet</h2>

<p>

Start by adding your first subscription.

</p>

</div>

`;

}

}

render();
