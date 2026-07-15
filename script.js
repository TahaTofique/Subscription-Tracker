const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const renewalInput = document.getElementById("renewal");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const search = document.getElementById("search");

const monthly = document.getElementById("monthly");
const yearly = document.getElementById("yearly");
const count = document.getElementById("count");

const themeBtn = document.getElementById("themeBtn");

let subscriptions =
    JSON.parse(localStorage.getItem("subscriptions")) || [];

render();

// -------------------- Theme --------------------

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
    themeBtn.textContent="☀️";
}

themeBtn.onclick=()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeBtn.textContent="☀️";
    }else{
        localStorage.setItem("theme","light");
        themeBtn.textContent="🌙";
    }

}

// -------------------- Add --------------------

addBtn.onclick=()=>{

    const name=nameInput.value.trim();
    const price=parseFloat(priceInput.value);
    const category=categoryInput.value;
    const renewal=renewalInput.value;

    if(!name || !price || !renewal){

        alert("Please fill every field.");

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

    clearInputs();

    render();

}

// -------------------- Save --------------------

function save(){

    localStorage.setItem(

        "subscriptions",

        JSON.stringify(subscriptions)

    );

}

// -------------------- Clear --------------------

function clearInputs(){

    nameInput.value="";
    priceInput.value="";
    renewalInput.value="";

}

// -------------------- Delete --------------------

function deleteSubscription(id){

    subscriptions=subscriptions.filter(

        sub=>sub.id!==id

    );

    save();

    render();

}

// -------------------- Days Left --------------------

function daysLeft(date){

    const today=new Date();

    const renew=new Date(date);

    const diff=renew-today;

    return Math.ceil(

        diff/(1000*60*60*24)

    );

}

// -------------------- Render --------------------

function render(){

    list.innerHTML="";

    let total=0;

    let filtered=subscriptions.filter(sub=>

        sub.name.toLowerCase()

        .includes(

            search.value.toLowerCase()

        )

    );

    filtered.forEach(sub=>{

        total+=sub.price;

        const tr=document.createElement("tr");

        tr.innerHTML=`

        <td>${sub.name}</td>

        <td>

            <span class="badge">

            ${sub.category}

            </span>

        </td>

        <td>

        $${sub.price.toFixed(2)}

        </td>

        <td>

        ${sub.renewal}

        </td>

        <td>

        ${daysLeft(sub.renewal)}

        </td>

        <td>

        <button

        class="deleteBtn"

        onclick="deleteSubscription(${sub.id})"

        >

        Delete

        </button>

        </td>

        `;

        list.appendChild(tr);

    });

    monthly.textContent="$"+total.toFixed(2);

    yearly.textContent="$"+(total*12).toFixed(2);

    count.textContent=filtered.length;

}

// -------------------- Search --------------------

search.oninput=render;
