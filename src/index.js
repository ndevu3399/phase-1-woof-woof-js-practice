document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterBtn = document.getElementById("good-dog-filter");
    let allDogs = []; // Store all dogs here
    let filterGoodDogs = false; // Track filter state

    // Fetch and display all dogs in the dog bar
    fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(dogs => {
            allDogs = dogs; // Store all dogs
            renderDogBar(dogs);
        });

    // Function to render dogs in the dog bar
    function renderDogBar(dogs) {
        dogBar.innerHTML = ""; // Clear existing dogs
        dogs.forEach(dog => {
            const span = document.createElement("span");
            span.textContent = dog.name;
            span.addEventListener("click", () => showDogInfo(dog));
            dogBar.appendChild(span);
        });
    }

    // Function to show detailed info about a dog
    function showDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button id="toggle-btn">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;

        // Add event listener to toggle Good Dog status
        const toggleBtn = document.getElementById("toggle-btn");
        toggleBtn.addEventListener("click", () => toggleGoodness(dog, toggleBtn));
    }

    // Function to toggle Good Dog status
    function toggleGoodness(dog, button) {
        const newStatus = !dog.isGoodDog; // Toggle value
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isGoodDog: newStatus })
        })
        .then(response => response.json())
        .then(updatedDog => {
            dog.isGoodDog = updatedDog.isGoodDog; // Update object
            button.textContent = updatedDog.isGoodDog ? "Good Dog!" : "Bad Dog!";
        });
    }

    // Filter good dogs
    filterBtn.addEventListener("click", () => {
        filterGoodDogs = !filterGoodDogs; // Toggle filter
        filterBtn.textContent = `Filter good dogs: ${filterGoodDogs ? "ON" : "OFF"}`;
        const filteredDogs = filterGoodDogs ? allDogs.filter(dog => dog.isGoodDog) : allDogs;
        renderDogBar(filteredDogs);
    });
});
