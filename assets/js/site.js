'use strict';

let projectDataResponse = [];

window.onload = () => {
    $("#home").load("header.html");

    $("#profile").load("profile.html");
    displayProfileInfo();

    displaySkillsInfo();

    displayPersonLifeTimeInfo();

    displayCatagories();

    displayProjects();

    // $("#testimonial").load("testimonial.html");
}

function displayProfileInfo() {
    getData("data/profile.json").then(
        (data) => {
            var children = $("#details").children();
            children[0].innerHTML = data.data.fullName;
            children[1].innerHTML = data.data.role;
            children[2].innerHTML = data.data.description;
            displayContactInfo(children[3], data.data.contact);
            children[4].setAttribute("href", data.data.cv);
        }
    );
}

function displayContactInfo(element, contact) {
    for (const key in contact) {
        let listElement = document.createElement("li");
        listElement.innerHTML = `<b>${key}:</b> ${contact[key]}`;
        element.appendChild(listElement);
    }
}

// Skills Info
function displaySkillsInfo() {
    getData("data/skills.json").then(
        (data) => {
            let response = Array.from(data.data);
            response = groupByCategory(response);

            for (const key in response) {
                let skillContainer = getSkillContainer(key);
                document.getElementById("skills").appendChild(skillContainer);

                let innerSkillsContainer = getInnerSkillsContainer(key);
                skillContainer.appendChild(innerSkillsContainer);
                for (const item of response[key]) {
                    let skill = getSkills(item);
                    innerSkillsContainer.appendChild(skill);
                }
            }
        }
    );
}

function getSkillContainer(key) {
    let skillContainer = document.createElement("div");
    skillContainer.classList.add("col-md-6");
    skillContainer.setAttribute("id", key.replace(" ", "-"));

    return skillContainer;
}

function getInnerSkillsContainer(key) {
    let innerSkillsContainer = document.createElement("div");
    innerSkillsContainer.classList.add("px-lg-3");
    innerSkillsContainer.innerHTML = `<h4 class="wow fadeInUp">${key}</h4>`;
    return innerSkillsContainer;
}

function getSkills(item) {
    let skill = document.createElement("div");
    skill.classList.add("progress-wrapper", "wow", "fadeInUp");

    skill.innerHTML = `
    <div class="progress-wrapper wow fadeInUp">
    <span class="caption">${item.name}</span>
    <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: ${item.rate};" aria-valuenow="75"
            aria-valuemin="0" aria-valuemax="100">${item.rate}</div>
        </div>
    </div>
`;
    return skill;
}

// Person Life Time Info
function displayPersonLifeTimeInfo() {
    getData("data/personLifeTime.json").then(
        (data) => {
            let response = Array.from(data.data);
            response = groupByType(response);

            for (const key in response) {
                let innerContainer = document.createElement("div");
                innerContainer.classList.add("col-md-6", "wow", "fadeInRight");
                innerContainer.innerHTML = `
                <h2 class="fw-normal">${key}</h2>
                `;
                let listElement = document.createElement("ul");
                listElement.classList.add("timeline", "mt-4", "pr-md-5");
                innerContainer.appendChild(listElement);
                document.querySelector(".inner-life-time-container").appendChild(innerContainer);

                for (const item of response[key]) {
                    let element = document.createElement("li");
                    element.innerHTML = `
                    <div class="title">${item.duration}</div>
                    <div class="details">
                    <h5>${item.role}</h5>
                    <small class="fg-theme">${item.name}</small>
                    <p>${item.description}</p>
                    </div>
                    `;
                    listElement.appendChild(element);
                }
            }
        });
}

// Catagories
function displayCatagories() {
    getData("data/projects.json").then(
        (data) => {
            let response = Array.from(data.data);
            response = groupByCategory(response);

            let catagories = getCatagories();

            for (const key in response) {
                let filterBtn = getFilterBtn(key);
                catagories.appendChild(filterBtn);
            }
        });
}

function getCatagories() {
    let catagories = document.getElementById("catagories");
    catagories.innerHTML = `<button class="btn btn-theme-outline" data-filter=".apps">All</button>`;
    return catagories;
}

function getFilterBtn(key) {
    let filterBtn = document.createElement("button");
    filterBtn.classList.add("btn", "btn-theme-outline");
    filterBtn.setAttribute("data-filter", `.${key.toLowerCase()}`);
    filterBtn.innerHTML = key;
    return filterBtn;
}

let itemCount = 0;
// Projects
function displayProjects() {
    getData("data/projects.json").then(
        (data) => {
            projectDataResponse = Array.from(data.data);
            // response = groupByCategory(response);
            let copy = projectDataResponse.slice(itemCount, projectDataResponse.length);
            let projects = document.getElementById("projects");
            // for (const key in response) {
            for (var i = 0; i < 3; i++) {
                let projectContainer = getProjectContainer(i, copy);
                projects.appendChild(projectContainer);
            }
            // }
        });
}

function getProjectContainer(index, response) {
    let projectContainer = document.createElement("div");
    projectContainer.classList.add("grid-item", "wow", "zoomIn");
    projectContainer.innerHTML = `
                    <div class="img-place" style="min-height: 250px;" data-src="${response[index].video}" data-fancybox
                        data-caption="<h5 class='fg-theme'>${response[index].name}</h5><p>${response[index].description}</p>">
                        <img style="max-height: 250px; object-fit: cover;" src="${response[index].image}" alt="${response[index].name}"/>
                        
                        <div class="img-caption" style="max-height: 100px;">
                            <h5 class="fg-theme">${response[index].name}</h5>
                            <p>${response[index].description}</p>
                        </div>
                    </div>`;
    return projectContainer;
}

function loadMore(btnElement) {
    itemCount += 3;

    if (itemCount < projectDataResponse.length) {
        displayProjects();
        let projects = document.getElementById("projects");
        let minHeight = projects.style.minHeight;
        projects.style.minHeight = `${(parseInt(minHeight.substring(0, minHeight.length - 2)) + 285)}px`;
    }

    if (itemCount + 3 >= projectDataResponse.length) {
        btnElement.innerHTML = "Load Less";
        btnElement.setAttribute("onclick", "loadLess(this)");
        return;
    }
}

function loadLess(btnElement) {
    removeElement();

    document.getElementById("projects").style.minHeight = "300px";
    btnElement.innerHTML = "Load More";
    btnElement.setAttribute("onclick", "loadMore(this)");
    itemCount = 0;
}

function removeElement() {
    let childNodes = Array.from(document.getElementById("projects").childNodes);
    for (let index = childNodes.length - 1; index > 2; index--) {
        document.getElementById("projects").removeChild(childNodes[index]);
    }
}

function groupByCategory(data) {
    return data.reduce((previousValue, currentValue) => {
        if (!previousValue[currentValue.category]) previousValue[currentValue.category] = [];
        previousValue[currentValue.category].push(currentValue);
        return previousValue;
    }, {});
}