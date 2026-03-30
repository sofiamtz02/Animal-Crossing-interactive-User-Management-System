/**
 * Animal Crossing Villager: Employee profile
 * 
 * This project is to simulate an Employee portal for a Company themed on Animal Crossing.
 *
 *-----------Villager Credentials ----------------------
 * username: user1  // password: user1  // Tom Nook
 * username: user2  // password: user2  // Isabelle ShihTzu
 * username: user3  // password: user3  // K.K. Slider
 * username: user4  // password: user4  // Celeste Stargazer
 * username: user5  // password: user5  // Resetti Mole
 * username: user6  // password: user6  // Mabel Able
 * username: user7  // password: user7  // Sable Able
 * username: user8  // password: user8  // Label Able
 * username: user9  // password: user9  // Brewster Roost
 * username: user10 // password: user10 // Kapp'n Sailor
 * username: user11 // password: user11 // Pascal Otterson
 * username: user12 // password: user12 // Leif Gardener
 * --Admin Accounts --
 * username: user13 // password: user13 // Timmy Nook
 * username: user14 // password: user14 // Tommy Nook
 * username: user15 // password: user15 // Sofia Mtz
 * -------------------------------------------------------
 *
 * 1. It uses a main list of users (baseUsers) that cannot be changed. It makes a copy called activeUsers so that employees can be deleted during the session
 * without breaking the original list. 
 * 
 * 2. users enter a username and password. It is checked against a Regex rule to make sure only letters and numbers are used, in order to prevent SQL injections. 
 * It then looks through activeUsers to find a match. 
 * Note: username and passwords are the same for testing purposes.
 * 
 * 3. there are two login roles, admins and employees. 
 * - Admins can see all user profiles, delete employees and see the Disposed list of employees. 
 *      (unlike the game, here you can get a chance to remove you're none favourite villagers >:) )
 * - Employees can only see the admins and their own cards.
 * 
 * When an admin deletes an employee, their cards fades away and is moved to the disposed section with the deletedUsers array List, and can no longer log back in. 
 * 
 * 5. When login out, the button clears the current user, hides the profiles and takes the user back to the main login screen page.
 * 
 * 
 * Profile Cards, 
 * - Each profile card includes the profile picture of the user, their current role (admin/employee), their full name, email, hobbies and birthday.
 * - Disposed employees includes their pfp, users full name and disposed status. 
 * 
 * 
 * By Sofia Martinez
 */
 

document.addEventListener("DOMContentLoaded", () => {

    /**
     * The User object of the current logged in user
     * Starts as null when no one is logged in or logged out. 
     * @type {null}
     */
    let currentUser;

    // ================= section 1. User class =============
    /**
     * Represents an Animal Crossing Villager (user) system
     * It includes all their information and has a method to generate the user profile card
     */
    class User {
        /**
         * Constructor to create a User instance
         * @param {string} uid - unique identifier of 5 characters
         * @param {string} userName - user's login username
         * @param {string} password - user's login password
         * @param {string} personalName - user first name
         * @param {string} familyName - user last name
         * @param {string} email - user's email address
         * @param {string} birthday - user birthday
         * @param {string} hobbies - the user's hobby
         * @param {boolean} admin - if true then user has an Admin role, if folse than user has employee role
         * @param {string} visual - image path to the users profile picture
         */
        constructor(uid, userName, password, personalName, familyName, email, birthday, hobbies, admin, visual) {
            this._uid = uid;
            this._userName = userName;
            this._password = password;
            this._personalName = personalName;
            this._familyName = familyName;
            this._email = email;
            this._birthday = birthday;
            this._hobbies = hobbies;
            this._admin = admin;
            this._visual = visual;
        }

        //Getters
        get uid() {
            return this._uid;
        }

        get userName() {
            return this._userName;
        }

        get password() {
            return this._password;
        }

        get personalName() {
            return this._personalName;
        }

        get familyName() {
            return this._familyName;
        }

        get email() {
            return this._email;
        }

        get birthday() {
            return this._birthday;
        }

        get hobbies() {
            return this._hobbies;
        }

        get admin() {
            return this._admin;
        }

        get visual() {
            return this._visual;
        }

        //Setters
        // only some can be updated
        set personalName(personalName) {
            this._personalName = personalName;
        }
        set admin(admin) {
            this._admin = admin;
        }
        set visual(visual) {
            this._visual = visual;
        }

        //Methods
        /**
         * Creates and returns the HTML string for the user's profile card
         * Only Admins can remove user profiles.
         *
         * Profile card appearance changes based on role such as,
         * - Admin cards are purple and Employee cards are green
         * - the logged in users card gets a "Current" label tag on their card
         *
         * Delete button visibility is indicated by,
         *  - logged in user must be an Admin
         *  - logged in user cannot delete themselvess
         *  - the card is an Employee and not another Admin
         *
         * @param {boolean} currentVillager - true when the card belongs to the logged in user
         * @returns {string} HTML string for the profile user card
         */
        profileCard(currentVillager) {
            // Role for Admin and Employee logic
            const isAdminBoolean = this.admin;
            const isEmployeeBoolean = isAdminBoolean === false;

            // card appearance based on admin status of user
            const cardColor = isAdminBoolean ? 'rgb(215, 215, 215)' : 'rgb(230, 236, 207)';
            const roleLabel = isAdminBoolean ? 'Admin' : 'Employee';
            // badge show the card belonging to the current logged in user
            const ownBadge = currentVillager ? "[Current]" : "";

            //delete button for admins
            // if current user logged in is admin AND is not looking at myself AND the target is employee
            // 1- logged in user must be admin (current.admin)
            // 2- logged in user cannot delete themselves (!currentVillager)
            // 3- villager cannot be an Admin (this._admin)
            const canDelete = currentUser.admin && !currentVillager && isEmployeeBoolean;
            //if canDelete is true, build the button HTML (true) : else empty string (false)
            const deleteButtonHtml = canDelete ?
                `<button class="btn btn-outline-danger btn-sm deleteBtn" data-uid="${this.uid}">
                    Delete Employee
                </button>` : "";

            // user card for html
            return `
             <div id="card-${this.uid}" class="col-12 col-md-6 col-xl-4 mb-5 d-flex justify-content-center align-items-center">
                <div class="card text-center text-md-start">
                    <!-- header -->
                    <div class="card-header">
                        <h1 class="card-head-decor">
                            <hr class="card-header-decor">
                            <p class="card-header-text text-center" >${roleLabel} ${ownBadge}</p>
                            <hr class="card-header-decor">
                        </h1>
                    </div>
                    <!-- body -->
                    <div class="showcard-body d-flex flex-column flex-lg-row align-items-center"
                         style="background-color: ${cardColor};">
                        <div class="pfp-section ">
                            <div class="pfp-photo">
                                <div class="pfp-frame">
                                    <div class="pfp-container">
                                        <img src="${this.visual}" class="pfp img-fluid rounded-start" alt="pfp">
                                    </div>
                                </div>

                            </div>
                        </div>
                        <!-- body content-->
                        <div class="card-body card-body-txt">
                            <h5 class="card-title">${this.personalName} ${this.familyName}</h5>
                            <hr class="hr-info-divider ">
                            <p class="card-text">${this.email}</p>
                            <hr class="hr-info-divider ">
                            <p class="card-text">Hobbies: ${this.hobbies}</p>
                            <hr class="hr-info-divider ">
                            <p class="card-text"><small class="text-body-secondary">Birth: ${this.birthday}</small></p>
                        </div>
                    </div>
                    <!-- card footer -->
                    <div  class="card-body mb-1 mb-md-2 p-0 ps-4 pt-2">
                    <!-- if current is admin and  -->
                            ${deleteButtonHtml} 
                    </div>
                </div>
            </div>
        `;
        }
    }

    // ================= section 2. DOM references =============
    // -- 1. main page sections
    const mainSection = document.getElementById("main");
    let showCard = document.getElementById("showCard");
    let showDisposedCard = document.getElementById("showDisposedCard");
    let navBar = document.getElementById("nav-styling");

    //-- 2. container where profile cards are shown
    const cardContainer = document.getElementById("card-container");

    //-- 3. buttons
    // buttons for logging in and out of system
    const btnSubmit = document.getElementById("btnSubmit");
    const btnBack = document.getElementById("btnBack");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // 4. navigation buttons for admin
    const navEmployees = document.getElementById("admin-nav-employees");
    const navDeleted = document.getElementById("admin-nav-deleted");

    //-- 5. error message for login form
    const errorMessage = document.getElementById("errorMessage");

    // ================= section 3. User array data =============
    /**
     * The original, for read only list of all the villager users.
     * It is frozen woth Object.freeze(baseUsers) so it can never be modified.
     * This project works from a copy (activeUsers) and leaves this one untouched.
     * @type {User[]}
     */
    const baseUsers = [
        new User("1QY1X", "user1", "user1", "Tom", "Nook", "tom.nook@nookinc.com", "May 30th", "Education", false, "images/pfp/pfp1-tom-nook.jpg"),
        new User("5B4CX", "user2", "user2", "Isabelle", "ShihTzu", "isabelle@townhall.ac", "Dec 20th", "Nature", false, "images/pfp/pfp2-isabelle.jpg"),
        new User("78BBB", "user3", "user3", "K.K.", "Slider", "kk.slider@acmusic.com", "August 2", "Music", false, "images/pfp/pfp3-kk.jpg"),
        new User("92VEU", "user4", "user4", "Celeste", "Stargazer", "celeste@museum.ac", "Sep 7th", "Education", false, "images/pfp/pfp4-celeste.jpg"),
        new User("FIKKC", "user5", "user5", "Resetti", "Mole", "resetti@islandservices.ac", "Apr 6th", "Education", false, "images/pfp/pfp15-resetti.jpg"),
        new User("J4QZV", "user6", "user6", "Mabel", "Able", "mabel@ablesisters.ac", "May 22nd", "Fashion", false, "images/pfp/pfp5-mabel.jpg"),
        new User("K2L9I", "user7", "user7", "Sable", "Able", "sable@ablesisters.ac", "Nov 22nd", "Education", false, "images/pfp/pfp6-sable.webp"),
        new User("KXTVJ", "user8", "user8", "Label", "Able", "label@ablesisters.ac", "Oct 31st", "Fashion", false, "images/pfp/pfp7-label.jpg"),
        new User("LRDCM", "user9", "user9", "Brewster", "Roost", "brewster@roost.cafe", "Oct 15th", "Education", false, "images/pfp/pfp8-brewster.jpg"),
        new User("OY9FO", "user10", "user10", "Kapp'n", "Sailor", "kappn@islandferry.ac", "Jul 12th", "Fitness", false, "images/pfp/pfp9-kappn.jpg"),
        new User("R5NJX", "user11", "user11", "Pascal", "Otterson", "pascal@deepsea.ac", "Jul 19th", "Music", false, "images/pfp/pfp10-pascal.jpg"),
        new User("SK9HR", "user12", "user12", "Leif", "Gardener", "leif@gardenshop.ac", "Aug 8th", "Nature", false, "images/pfp/pfp11-leif.jpg"),
        new User("T1DBJ", "user13", "user13", "Timmy", "Nook", "timmy@nookinc.com", "Jun 7th", "Music", true, "images/pfp/pfp12-timmy.jpg"),
        new User("VZV8U", "user14", "user14", "Tommy", "Nook", "tommy@nookinc.com", "Jun 7th", "Play", true, "images/pfp/pfp14-tommy.jpg"),
        new User("YLHZL", "user15", "user15", "Sofia", "Mtz", "sofia@townhall.ac", "Nov 30th", "Games", true, "images/pfp/pfp13-me.jpeg")
    ];
    Object.freeze(baseUsers); //base user read only

    /**
     * The live working copy of the baseUsers.
     * Modifications are made on this one instead of baseUsers.
     * Uses slice() to have a separate copy of the array,
     *
     * @type {User[]}
     */
    let activeUsers = baseUsers.slice(); // This is now a changeable copy

    /**
     * Includes users that have been deleted by an Admin.
     * Elements are discarded by removeUser() and displayed in the Disposed tab section.
     * @type {User[]}
     */
    let deletedUsers = [];

    // ================= section 4. important functions =============

    /**
     * Returns a list of users the currently logged in user is allowed to see.
     * Admins can see the full activeUsers list.
     * Employees can only see Admin accounts and their own card.
     * @param activeUsers - current live user list
     * @param currentUser - the logged in user
     * @returns {User[]} - filtered list based on admin role status
     */
    const getVisibleUsers = (activeUsers, currentUser) => {
        // If Admin, they see the whole array of users
        if (currentUser.admin) {
            return activeUsers;
        }
        // If Employee, they only see Admins AND thier own card
        // is the villager an admin OR is the villager the logged in user?
        return activeUsers.filter(villager => villager.admin === true || villager.uid === currentUser.uid);
    }
    /**
     * Render all visible profile cards of users, into the card container.
     * Filters the list by role, sorts admins to the top, then maps each user to their corresponding
     * profileCard() HTML.
     *
     * It also controls the visibility of the admin navigation buttons.
     */
    const showcaseProfiles = () => {
        // 1. filtered list (admins see all vs employees only themselves and admins
        const visibleUsers = getVisibleUsers(activeUsers, currentUser); //list of all users depemding on role

        // 2. sorting by admin status.
        // b.admin - a.admin places admins before the employees.
        const sortedUsers = Array.from(visibleUsers).sort((a, b) => b.admin - a.admin);

        // 3. maps each user and inserts into the container for the cards
        // passes true when the card belongs to the loged in user
        cardContainer.innerHTML = sortedUsers.map(villager => {
            // using uid to check for unique identifier of logged in user
            return villager.profileCard(villager.uid === currentUser.uid);
        }).join("");

        //4. admin nav sections should only be visible to admins
        const adminNavEmployee = document.getElementById("admin-nav-employees");
        const adminNavDeleted = document.getElementById("admin-nav-deleted");
        if (currentUser.admin) {
            //if current user is admin, show employee and deleted nav buttons
            adminNavEmployee.classList.remove("d-none");
            adminNavDeleted.classList.remove("d-none");
        } else {
            //if not admin then hide buttons for employees
            adminNavEmployee.classList.add("d-none");
            adminNavDeleted.classList.add("d-none");
        }

        //make cards page and navbar visible
        showCard.classList.remove("d-none");
        navBar.classList.remove("d-none");
    };

    /**
     *Removes a user from the activUsers and adds them to the deletedUsers array list.
     * It is called after the cards fade out animation that makes cards disappear.
     * @param uid
     */
    const removeUser = (uid) => {
        // 1- finds the user in the active list from their unique id
        const user = activeUsers.find(villager => villager.uid === uid);

        //if user was found
        if (user) {
            // 2- adds removed user to the deleted user list
            deletedUsers.push(user);
            // 3- filter returns everyone except the user with the matchng uid
            activeUsers = activeUsers.filter(villager => villager.uid !== uid);
            // 4- updated rendered view of the cards
            showcaseProfiles();
            renderDisposedUsers();
        }
    };

    /**
     * Renders the Disposed Employees section using the deletedUsers array list.
     * The cards are simplified to show only name, pfp and disposed status text.
     * This section is only visible to admins with the nav bar buttons.
     */
    const renderDisposedUsers = () => {
        const disposedContainer = document.getElementById("disposed-container");
        // a card for each deleted user, with a red color background
        disposedContainer.innerHTML = deletedUsers.map(user => `

             <div class="col-12 col-md-6 col-xl-4 mb-5 d-flex justify-content-center align-items-center">
                <div class="card text-center text-md-start">
                    <!-- header -->
                    <div class="card-header">
                        <h1 class="card-head-decor">
                            <hr class="card-header-decor" style="background-color: rgb(237 99 99);" >
                            <p class="card-header-text text-center" style="color: rgb(220 69 58);">Ex-employee</p>
                            <hr class="card-header-decor" style="background-color: rgb(237 99 99);" >
                        </h1>
                    </div>
                    <!-- body -->
                    <div class="showcard-body d-flex flex-column flex-lg-row align-items-center"
                         style="background-color: rgb(247 214 214);">
                        <div class="pfp-section ">
                            <div class="pfp-photo">
                                <div class="pfp-frame">
                                    <div class="pfp-container">
                                        <img src="${user.visual}" class="pfp img-fluid rounded-start" alt="pfp">
                                    </div>
                                </div>

                            </div>
                        </div>
                        <!-- body content-->
                        <div class="card-body card-body-txt">
                            <h5 class="card-title"><strong>${user.personalName} ${user.familyName}</strong></h5>
                            <hr class="hr-info-divider ">
                            <p class="card-text"><small class="text-muted">Status: Disposed</small></p>
                            <hr class="hr-info-divider ">
                        </div>
                    </div>
                    <!-- card footer -->
                    <div class="card-body mb-1 mb-md-2 p-0 ps-4 pt-2">
                    </div>
                </div>
            </div>
        `).join("");
    };

    // ================= section 5. event listeners =============

    /**
     * Manages the login form submission of the login modal.
     *
     * the validation order is,
     * - both fields must not be empty
     * - username and password must pass the login regex (letters/numbers, max 6 characters)
     *      - if any of the regex fails then it throws a combined error
     * - must find the users/villager in activeUser array by username and password
     *      - if no match found, throws invalid credential error
     *
     * Once successful login, a short loading spinner plays before the transition.
     * Then currentUser is set, the modal closes, the main section is hidden and showcaseProfiles() is called to render cards.
     */
    btnSubmit.addEventListener("click", () => {

        const userNameInput = document.getElementById("userName");
        const passwordInput = document.getElementById("inputPassword");
        // message for invalid feedback
        let invalidFeedback = document.getElementsByClassName("invalid-feedback");
        let isValid = true;

        //regex for password and login
        const loginRegex = /^[a-zA-Z0-9]{1,6}$/;

        // DEBUGGING
        // console.log(userNameInput.value);
        // console.log(passwordInput.value);
        // console.log("Searching for:", userNameInput.value, passwordInput.value);
        // console.log("Current Array:", baseUsers);
        // console.log("Current Array new:", activeUsers);

        //reset error style
        userNameInput.classList.remove("is-invalid");
        passwordInput.classList.remove("is-invalid");

        //reset text input
        errorMessage.textContent = "";
        invalidFeedback[0].textContent = "";
        invalidFeedback[1].textContent = "";

        try {
            //1. check if username AND password are empty
            if (userNameInput.value.trim() === "" && passwordInput.value.trim() === "") {
                if (userNameInput.value.trim() === "") userNameInput.setAttribute("class", "form-control is-invalid");
                if (passwordInput.value.trim() === "") passwordInput.setAttribute("class", "form-control is-invalid");
                throw new Error("Input cannot be empty");
            }
            //regex against sql injection
            //2. regex check for username input
            if (!loginRegex.test(userNameInput.value)) {
                userNameInput.setAttribute("class", "form-control is-invalid");
                invalidFeedback[0].textContent = "Letters and numbers only, max 6 characters";
                isValid = false;
                userNameInput.value = "";
            }

            //3. regex check for password input
            if (!loginRegex.test(passwordInput.value)) {
                passwordInput.setAttribute("class", "form-control is-invalid");
                invalidFeedback[1].textContent = "Letters and numbers only, max 6 characters";
                isValid = false;
                passwordInput.value = "";
            }

            //4. if username or password fail, throw invalid error
            if (!isValid) {
                throw new Error("Fix highlighted fields");
            }

            // AUTHENTICATE USERS
            // 5. authenticate users by searching(find) active Users (not baseUsers, so deleted users cant log in)
            // searches a user that matches in username and password
            const villager = activeUsers.find(users =>
                users.userName === userNameInput.value && users.password === passwordInput.value
            );

            //5.1 if user not found, throw an error
            if (!villager) {
                userNameInput.setAttribute("class", "form-control is-invalid");
                passwordInput.setAttribute("class", "form-control is-invalid");
                throw new Error("Invalid username or password");
            }

            // ---- Succesfull login ------

            // shows a spinner icon and hides submit button while spinner animates
            const loadingSpin = document.getElementById("spin");
            if (loadingSpin) {
                loadingSpin.classList.remove("d-none");
                btnSubmit.classList.add("d-none"); //hide submit button
                btnBack.classList.add("d-none"); //hide submit button
            }

            // after 1,5 seconds, it completes the login
            setTimeout(() => {
                // 1. hides login spining
                loadingSpin.classList.add("d-none");
                // current user is now the user villager
                currentUser = villager;

                // 2. hides main and shows logout button
                mainSection.classList.add("d-none");
                logoutBtn.classList.remove("d-none");

                //3. remove animation for fadeing out
                showCard.classList.remove("fade-out-card");
                showDisposedCard.classList.remove("fade-out-card");
                navBar.classList.remove("fade-out-card");

                //4. clears values from the form
                userNameInput.value = "";
                passwordInput.value = "";
                errorMessage.textContent = "";

                // 3. render profile card display
                showcaseProfiles();

                // 4. closes the login modal
                const modalElement = document.getElementById('myModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();

            }, 1500);

        } catch (error) {
            //error style
            errorMessage.style.color = "red";
            errorMessage.textContent = error.message;
        }

    });

    /**
     * Handles the user logout of the system.
     * Triggers a fade out animation, then after it restores the main page section,
     * resets the nav buttons, clears the card container, and sets currentUser back to null, to reset the login.
     */
    logoutBtn.addEventListener("click", () => {
        //1. starts fadeout on the card and navbar section
        showCard.classList.add("fade-out-card");
        showDisposedCard.classList.add("fade-out-card");
        navBar.classList.add("fade-out-card");

        //2. timer for 400ms before switching the section
        setTimeout(() => {
            //3. shows the main menu again and the form modal
            mainSection.classList.remove("d-none");
            loginBtn.classList.remove("d-none");
            btnSubmit.classList.remove("d-none");
            btnBack.classList.remove("d-none");

            // 2. hides the logout button
            logoutBtn.classList.add("d-none");

            // 3. clears shown cards and hides the navbar and  profile card
            cardContainer.innerHTML = "";
            showCard.classList.add("d-none"); //hide cards
            navBar.classList.add("d-none"); //hide navbar
            // 4. resets the user state
            currentUser = null;
        }, 400);
    });

    /**
     * Delete button clicks using event delegation
     *
     * A single listener is attached to the card container instead of each delete button.
     * When a delete button is clicked, it gives the user uid, applies a fade out animation to the card,
     * and them calls removeUser after the animation finishes with setTimeout of 800ms.
     */
    cardContainer.addEventListener("click", (eventCurrent) => {
        // Check if the clicked element has the deleteBtn class
        const deleteButtonClicked = eventCurrent.target.classList.contains("deleteBtn");
        //console.log(eventCurrent.target); //exact element clicked

        if (deleteButtonClicked) {
            // must check if delete button was clicked and not something else
            // gets the uid from the data-uid attribute
            const uid = eventCurrent.target.getAttribute("data-uid");
            //2. fade animation applied before card is removed
            const cardFadee = document.getElementById(`card-${uid}`);
            if (cardFadee) {
                cardFadee.classList.add("fade-out-card");
                //after animation it waits 800ms to call removeUser card
                setTimeout(() => {
                    removeUser(uid);
                }, 800);
            }
        }

    });

    // ================= section 5. Admin navigation buttons event listeners  =============
    //Employee tab button, shows active employee cards and hides disposed list
    navEmployees.addEventListener("click", (e) => {
        e.preventDefault();
        //if on employees section, then show employee cards and hide removed list cards
        showCard.classList.remove("d-none");
        showDisposedCard.classList.add("d-none");
    });

    //Disposes tab button, switched to the deleted employees view
    navDeleted.addEventListener("click", (e) => {
        e.preventDefault();
        //if admin, then show employee cards and hide removed list cards
        if (currentUser.admin) {
            showCard.classList.add("d-none");
            showDisposedCard.classList.remove("d-none");
            // shows disposes employees
            renderDisposedUsers();
        }
    });
});