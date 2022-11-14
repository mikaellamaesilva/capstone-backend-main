
const header = document.querySelector("header");
const ml_section = document.querySelector(".milestones");
const ml_counters = document.querySelectorAll(".number span");

const links = document.querySelectorAll(".nav-link")

window.addEventListener("scroll", () =>{
    activeLink();
    if(!mlPlayed) mlCounter();
})

function hasReached(el){
    let topPosition = el.getBoundingClientRect().top;

    if(window.innerHeight >= topPosition + el.offSetHeight) return true;
    return false;
}

function updateCount(num, maxNum){
    let currentNum = +num.innerText;

    if (currentNum < maxNum){
        num.innerText = currentNum +1;
        setTimeout(() => {
            updateCount(num, maxNum);
        }, 12);
    }
}
/* --------------- Grab elements from DOM --------------- */

/* --------------- Sticky Navbar --------------- */
function stickyNavbar(){
    header.classList.toggle("scrolled", window.pageYOffset > 0)
}

stickyNavbar();


window.addEventListener("scroll", stickyNavbar)
/* --------------- Reveal Animation --------------- */

let sr = ScrollReveal({
    duration:2500,
    distance:"60px"
});

sr.reveal(".showcase-info",{delay:400})
sr.reveal(".showcase-image",{origin: "top",delay:400})

/* --------------- Our Client Progress Bar Animation --------------- */

let mlPlayed = false;

function mlCounter(){
    if (!hasReached(ml_section)) return;
    mlPlayed = true;
    ml_counters.forEach((ctr) =>{
        let target = +ctr.dataset.target;

        setTimeout(() => {
            updateCount(ctr, target);
        }, 400);

    })

}


/* --------------- Services Counter Animation --------------- */

/* --------------- Portfolio Filter Animation --------------- */

/* --------------- Modal Pop Up Animation Animation --------------- */
const swiper = new Swiper('.swiper', {
    loop: true,
    speed:500,
    autoplay: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  
    
  });
/* --------------- Modal Pop Up Animation Animation --------------- */

/* --------------- Change Active Link On Scroll --------------- */
function activeLink(){
    let sections = document.querySelectorAll("section[id]")
    let passedSections = Array.from(sections).map((sct, i) => {
        return {
            y: sct.getBoundingClientRect().top - header.offsetHeight,
            id: i, };
    }).filter(sct => sct.y <= 0);

    let currSectionID = passedSections.at(-1).id;

    links.forEach(l => l.classList.remove("active"));
    links[currSectionID].classList.add("active");
}
/* --------------- Change Page Theme --------------- */

/* --------------- Open & Close Navbar Menu --------------- */