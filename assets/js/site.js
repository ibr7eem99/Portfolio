window.onload = () => {
    $("#home").load("header.html");

    $("#profile").load("profile.html");
    displayProfileInfo();

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

    displaySkillsInfo();

    function displaySkillsInfo() {
        getData("data/skills.json").then(
            (data) => {
                let response = Array.from(data.data);
                response = groupByType(response);

                for (const key in response) {
                    let skillContainer = document.createElement("div");
                    skillContainer.classList.add("col-md-6");
                    skillContainer.setAttribute("id", key.replace(" ", "-"));
                    document.getElementById("skills").appendChild(skillContainer);
                    let innerSkillsContainer = document.createElement("div");
                    innerSkillsContainer.classList.add("px-lg-3");
                    innerSkillsContainer.innerHTML = `<h4 class="wow fadeInUp">${key}</h4>`;
                    skillContainer.appendChild(innerSkillsContainer);

                    for (const item of response[key]) {
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
                        innerSkillsContainer.appendChild(skill);
                    }
                }
            }
        );
    }

    function groupByType(data) {
        return data.reduce((previousValue, currentValue) => {
            if (!previousValue[currentValue.type]) previousValue[currentValue.type] = [];
            previousValue[currentValue.type].push(currentValue);
            return previousValue;
        }, {});
    }

    displayPersonLifeTimeInfo();

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
}