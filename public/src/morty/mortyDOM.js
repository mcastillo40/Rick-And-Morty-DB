// Function displays the attacks for a specific Morty
function displayMortyAttack(mortySection, ability, power) {
    
    let attack = document.createElement("p");
    attack.textContent = "ABILITY: " + ability;
    attack.textContent += " POWER: " + power;   

    mortySection.appendChild(attack);
}