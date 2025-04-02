let order_count = parseInt(document.getElementById("quantity").innerText.replace("Total cart: ", ""));
const productContainer = document.getElementById("product-container");

const showDefaultData = async () => {
    let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a`);
    let data = await response.json();
    data.drinks.forEach(element => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${element.strDrinkThumb}" class="card-img-top" alt="...">
            <div class="card-body">
                <h3>${element.strDrink}</h3>
                <h5>Category: ${element.strCategory}</h5>
                <p>Instruction: ${element.strInstructions.slice(0,15)}</p>
            <div class="buttons">
                <button class="button" onclick="handleDetails('${element.idDrink}')">Details</button>
                <button class="button" onclick="handleAddToCart('${element.strDrink}','${element.strDrinkThumb}',this)">Add to cart</button>
            </div>
            </div>
        </div>
        `
        productContainer.appendChild(card);
    })
    
}

const showAllData = async (search_input = "") => {
    productContainer.innerHTML = "Searching...";
    let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search_input}`);
    let all_data = await response.json();
    productContainer.innerHTML = "";
    if (!all_data.drinks) {
        productContainer.innerHTML = `<h2>Your search drink is not found</h2>`;
        return;
    }
    else {
        displayData(all_data, search_input);
    }
}

const displayData = (cocktails, target_menu) => {
    cocktails.drinks.forEach(element => {
        if (element.strDrink.toLowerCase().includes(target_menu.toLowerCase())) {
            const card = document.createElement("div");
            card.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src="${element.strDrinkThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h3>${element.strDrink}</h3>
                    <h5>Category: ${element.strCategory}</h5>
                    <p>Instruction: ${element.strInstructions.slice(0,15)}</p>
                <div class="buttons">
                    <button class="button" onclick="handleDetails('${element.idDrink}')">Details</button>
                    <button class="button" onclick="handleAddToCart('${element.strDrink}','${element.strDrinkThumb}',this)">Add to cart</button>
                </div>
                </div>
            </div>
            `
            productContainer.appendChild(card);
        }
    });
}

const handleAddToCart = (name, image, button) => {
    if (order_count < 7) {
        order_count = order_count + 1;
        document.getElementById("quantity").innerText = `Total cart: ${order_count}`;
        const cartItems = document.getElementById("cart-items");
        const cartItem = document.createElement("div");
        cartItem.classList.add("full-cart");
        cartItem.innerHTML = `
        <img src="${image}" class="cart-img" alt="...">
        <p>${name}</p>
        <button onclick="handleRemove(this,'${name}')" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        `
        cartItems.appendChild(cartItem);
        const hr = document.createElement("hr");
        cartItems.appendChild(hr);
        button.innerText = "Already added";
        button.disabled = true;
    }
    else {
        alert("You have reach the max limit");
    }
}

const handleDetails = async (id) => {
    let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    let data = await response.json();
    const drink = data.drinks[0];
    console.log(drink);
    const dataDetails = document.getElementById("data-details");
    dataDetails.innerHTML = `
        <img src="${drink.strDrinkThumb}" class="detail-img" alt="...">
        <h4>${drink.strDrink}</h4>
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
        <p>${drink.strInstructions}</p>
        `
    let modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();
}

const handleSearch = () => {
    document.getElementById("search-button").addEventListener("click", (event) => {
        event.preventDefault();
        const inputValue = document.getElementById("search-input").value.trim();
        showAllData(inputValue);
    })
}

const handleRemove = (remove_button,name) => {
    const parent = remove_button.parentNode;
    const nextElement = parent.nextElementSibling;
    parent.remove();
    if(nextElement && nextElement.tagName == "HR"){
        nextElement.remove();
    }
    const buttons = document.querySelectorAll(".button");
    buttons.forEach(element =>{
        if(element.innerText == "Already added" && element.getAttribute("onclick").includes(name)){
            element.innerText = "Add to cart";
            element.disabled = false;
        }
    })
    order_count = order_count - 1;
    document.getElementById("quantity").innerText = `Total cart: ${order_count}`;
}

handleSearch();
showDefaultData();