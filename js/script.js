// ------ GLOBAL LADDNING OCH FADE LOGIK ------

// Kör skriptet när hela DOM är inläst
window.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('site-logo');
    const loaderBg = document.getElementById('loader-bg');
    
    // Kolla om användaren redan har sett animationen denna session
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
        
        // ------ FÖRSTA BESÖKET ELLER HARD REFRESH ------
        sessionStorage.setItem('hasVisited', 'true');
        
        // Starta animationen på loggan
        if (logo) logo.classList.add('run-anim');
        
        // Tona ut bakgrunden efter att animationen är klar
        if (loaderBg) {
            setTimeout(() => {
                loaderBg.classList.add('loader-finished');
            }, 2500);
        }
    } else {
        
        // ------ HAR REDAN BESÖKT SIDAN ------
        
        // Hoppa direkt till slutläget för loggan
        if (logo) logo.classList.add('no-anim');
        
        // Göm laddningsbakgrunden omedelbart utan övergång
        if (loaderBg) {
            loaderBg.style.display = 'none';
        }
    }

    // Hantera intoning av resten av sidans innehåll
    document.body.style.transition = "opacity 0.5s ease-in-out";
    document.body.style.opacity = "1";
    document.body.classList.add("page-loaded");
});


// ------ FADE OUT VID KLICK PÅ LÄNKAR ------

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetUrl = link.href;
            
            if (link.hostname === window.location.hostname && targetUrl.includes(".html")) {
                e.preventDefault();
                document.body.style.transition = "opacity 0.5s ease-in-out";
                document.body.style.opacity = "0";

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            }
        });
    });
});


// ------ MODAL ------

const modal = document.getElementById("projectModal");
if (modal) {
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalLinkDetails = document.getElementById("modal-readmore"); 
    const modalLinkProject = document.getElementById("modal-github"); 
    const closeBtn = document.querySelector(".modal .close");

    document.querySelectorAll(".portfolio-scroll .project").forEach(project => {
        project.addEventListener("click", () => {
            
            modalImg.style.display = "block";
            const modalLinks = document.querySelector(".modal-links");
            if (modalLinks) modalLinks.style.display = "flex";
            
            const modalContentBox = document.querySelector(".modal-content");
            if (modalContentBox) {
                modalContentBox.style.maxWidth = "800px";
                modalContentBox.style.textAlign = "left";
            }

            // Tvinga texten att vara mörk (ifall påskägget gjort den vit)
            modalTitle.style.color = "var(--color-slate)";
            modalDesc.style.color = "var(--color-charcoal)";

            // 1. Hämta bild
            if (project.dataset.img) {
                modalImg.src = project.dataset.img;
            } else {
                const innerImg = project.querySelector("img");
                modalImg.src = innerImg ? innerImg.src : "";
            }

            // 2. Hämta texter
            modalTitle.textContent = project.dataset.title || "Projekttitel saknas";
            modalDesc.textContent = project.dataset.desc || "Ingen beskrivning tillgänglig.";
            
            // 3. Uppdatera "Läs mer" länken
            if (project.dataset.page) {
                modalLinkDetails.href = project.dataset.page;
                modalLinkDetails.style.display = "inline-block";
            } else {
                modalLinkDetails.style.display = "none";
            }

            // 4. Uppdatera Projekt/GitHub länken
            if (project.dataset.github) {
                modalLinkProject.href = project.dataset.github;
                modalLinkProject.style.display = "inline-block";
            } else {
                modalLinkProject.style.display = "none";
            }

            modal.style.display = "flex";
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}


// ------ SCROLL HORISONTALT OCH SCROLL BAR ------

const scrollContainer = document.querySelector(".portfolio-scroll");
const scrollBar = document.getElementById('scrollBar');
const scrollHint = document.getElementById('scrollHint');
const scrollText = document.querySelector('.scroll-text');
const siteLogo = document.getElementById('site-logo');

if (scrollContainer) {
    let targetScrollLeft = 0;
    let currentScrollLeft = 0;
    const speed = 0.02; // Hastigheten på inbromsningen
    
    // 1. DESKTOP: EVENT LISTENER FÖR SCROLL-HJULET
    scrollContainer.addEventListener("wheel", (e) => {
        // Avbryt direkt om vi är på mobil/iPad så att fingrar inte blockeras
        if (window.innerWidth <= 1024) return;
        
        if (e.deltaX !== 0) return;
        
        e.preventDefault();
        targetScrollLeft += e.deltaY;
        
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScroll));
    }, { passive: false });


    // 2. DESKTOP: ANIMATIONSLOOP (Exakt din gamla kod)
    function update() {
        if (window.innerWidth > 1024) {
            const velocity = targetScrollLeft - currentScrollLeft;
            const skew = velocity * 0.008;
            scrollContainer.style.transform = `skewX(${skew}deg)`;

            currentScrollLeft += (targetScrollLeft - currentScrollLeft) * speed;
            scrollContainer.scrollLeft = currentScrollLeft;

            // Göm text och logga på desktop
            if (currentScrollLeft > 10) {
                if (scrollHint) scrollHint.classList.add('hidden');
                if (scrollText) scrollText.classList.add('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '0';
                    siteLogo.style.pointerEvents = 'none';
                }
            } else {
                if (scrollHint) scrollHint.classList.remove('hidden');
                if (scrollText) scrollText.classList.remove('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '1';
                    siteLogo.style.pointerEvents = 'auto';
                }
            }

            // Progress bar för desktop (horisontell)
            if (scrollBar) {
                const maxScrollDesktop = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                if (maxScrollDesktop > 0) {
                    const scrollPercentageDesktop = (scrollContainer.scrollLeft / maxScrollDesktop) * 100;
                    scrollBar.style.height = scrollPercentageDesktop + '%';
                }
            }
        } else {
            // Nollställ eventuell skevning om fönstret krymps till mobil
            scrollContainer.style.transform = 'none';
        }
        
        requestAnimationFrame(update);
    }
    update();

    // 3. MOBIL & IPAD: VANLIG SCROLL-LYSSNARE (Helt oberoende)
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 1024) {
            // Läs av hur långt ner vi har scrollat
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;

            // Göm text och logga
            if (currentScrollY > 10) {
                if (scrollHint) scrollHint.classList.add('hidden');
                if (scrollText) scrollText.classList.add('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '0';
                    siteLogo.style.pointerEvents = 'none';
                }
            } else {
                if (scrollHint) scrollHint.classList.remove('hidden');
                if (scrollText) scrollText.classList.remove('hidden');
                if (siteLogo) {
                    siteLogo.style.opacity = '1';
                    siteLogo.style.pointerEvents = 'auto';
                }
            }

            // Progress bar för mobil (vertikal neråt)
            if (scrollBar) {
                const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                const maxScrollHeight = docHeight - window.innerHeight;
                
                if (maxScrollHeight > 0) {
                    const scrollPercentage = (currentScrollY / maxScrollHeight) * 100;
                    scrollBar.style.height = scrollPercentage + '%';
                }
            }
        }
    });
}

// ------ KONTAKT FORMULÄR ------

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {

        // Stoppar så att det endast skickar en gång
        e.preventDefault(); // Stoppar HTML inskick 
        e.stopImmediatePropagation(); // Hindrar andra event lyssnare från att köra

        const data = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Visa tack meddelandet 
                contactForm.innerHTML = "<h3>Tack för ditt meddelande!</h3><p>Jag återkommer så snart jag kan.</p>";
            } else {
                alert("Något gick fel. Försök igen!");
            }
        } catch (error) {
            console.error("Fel vid inskick:", error);
        }
    });
}


// ------ WEBBLÄSARENS BAKÅT KNAPP ------

// Tvinga sidan att bli synlig igen om användaren backar tillbaka till den via webbläsaren
window.addEventListener("pageshow", (event) => {
    
    // event.persisted betyder att sidan laddades från webbläsarens cache
    if (event.persisted) {
        document.body.style.opacity = "1";
        document.body.classList.add("page-loaded");
    }
});

// ------ GÖM LOGGA VID VERTIKAL SCROLL (För Jobbigt, CV, Kontakt) ------

window.addEventListener('scroll', () => {
    const siteLogo = document.getElementById('site-logo');
    
    // Kolla om loggan finns på sidan
    if (siteLogo) {
        // Om vi har scrollat ner mer än 50 pixlar
        if (window.scrollY > 50) {
            siteLogo.style.opacity = '0';
            siteLogo.style.pointerEvents = 'none'; // Gör att man inte kan klicka på den osynliga loggan
        } else {
            // Om vi är högst upp igen, visa loggan
            siteLogo.style.opacity = '1';
            siteLogo.style.pointerEvents = 'auto';
        }
    }
});


// ==========================================================================
// 🥚 EASTER EGGS (PÅSKÄGG)
// ==========================================================================

// --- Påskägg 1: Klicka på "Scroll"-texten ---
const oddElement = document.querySelector('.scroll-text');
if (oddElement) {
    oddElement.addEventListener('click', () => {
        document.documentElement.style.setProperty('--color-light', '#354F52'); 
        document.body.style.color = '#CAD2C5'; 
        alert("Påskägg 1 hittat! 🌙 Dark Mode aktiverat!");
    });
}

// --- Påskägg 2: Skriv "jonathan wenell" ---
let typedCode = '';
const secretName = 'jonathan wenell'; 

window.addEventListener('keydown', (e) => {
    typedCode += e.key.toLowerCase();
    
    if (typedCode.length > secretName.length) {
        typedCode = typedCode.slice(-secretName.length);
    }
    
    if (typedCode === secretName) {
        triggerJonathanBackground();
        
        const modal = document.getElementById("projectModal");
        if (modal) {
            const mTitle = document.getElementById("modal-title");
            const mDesc = document.getElementById("modal-desc");

            mTitle.textContent = "JONATHAN MODE";
            mDesc.textContent = "Du hittade det hemliga påskägget";
            
            mTitle.style.setProperty('color', '#354F52', 'important');
            mDesc.style.setProperty('color', '#2F3E46', 'important');
            
            document.getElementById("modal-img").style.display = "none";
            const mLinks = document.querySelector(".modal-links");
            if(mLinks) mLinks.style.display = "none";
            
            const modalContentBox = document.querySelector(".modal-content");
            if (modalContentBox) {
                modalContentBox.style.maxWidth = "450px";
                modalContentBox.style.textAlign = "center";
            }
            
            modal.style.display = "flex";
        }
        
        typedCode = ''; 
    }
});

function triggerJonathanBackground() {
    if (document.getElementById('jonathan-grid')) return;

    const grid = document.createElement('div');
    grid.id = 'jonathan-grid';
    Object.assign(grid.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '-1', 
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)', 
        gridTemplateRows: 'repeat(10, 1fr)',    
        backgroundColor: '#000' 
    });
    document.body.appendChild(grid);

    const img1 = 'url("images/Jag.jpg")'; 
    const img2 = 'url("images/Jag1.jpg")';

    let delay = 0;
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const box = document.createElement('div');
            box.style.backgroundImage = (row + col) % 2 === 0 ? img1 : img2;
            box.style.backgroundSize = 'cover';
            box.style.backgroundPosition = 'center';
            box.style.opacity = '0'; 
            box.style.transition = 'opacity 0.4s ease'; 

            grid.appendChild(box);
            setTimeout(() => { box.style.opacity = '1'; }, delay);
            delay += 25; 
        }
    }
    
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';

    const textSelectors = 'h1, h2, h3, p, li, nav a, .scroll-text, .scroll-hint, .top-left-name span';
    
    document.querySelectorAll(textSelectors).forEach(el => {
        // 🔥 NYTT: Undanta popup-rutan från att bli vit!
        if (!el.closest('.modal')) {
            el.style.setProperty('color', '#ffffff', 'important');
        }
    });

    const expandText = document.querySelectorAll('.expand');
    expandText.forEach(el => {
        el.style.setProperty('color', '#ffffff', 'important');
    });
}

// ==========================================================================
// 🥚 EASTER EGG 1: Klicka på Scroll för att byta bakgrund (Med återställ-knapp)
// ==========================================================================

// 1. Skapa "Ljust läge"-knappen dynamiskt
const themeResetBtn = document.createElement('button');
themeResetBtn.innerHTML = '☀️ Ljust läge';
Object.assign(themeResetBtn.style, {
    position: 'fixed',
    top: '30px',
    right: '5vw',
    padding: '10px 20px',
    backgroundColor: '#CAD2C5',
    color: '#2F3E46',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: '1001',
    display: 'none', // Osynlig från start
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease'
});

// Liten hover-effekt på knappen
themeResetBtn.addEventListener('mouseenter', () => themeResetBtn.style.transform = 'scale(1.05)');
themeResetBtn.addEventListener('mouseleave', () => themeResetBtn.style.transform = 'scale(1)');
document.body.appendChild(themeResetBtn);

// Klicklyssnare för knappen (stänger av nattläge)
themeResetBtn.addEventListener('click', () => {
    toggleEasterEggTheme(false); 
});

// 2. Funktion som slår på/av nattläget
function toggleEasterEggTheme(showPopup = false) {
    const isDark = localStorage.getItem('easterEggDarkMode') === 'true';

    if (isDark) {
        // --- STÄNG AV NATTLÄGE ---
        localStorage.setItem('easterEggDarkMode', 'false');
        document.documentElement.style.setProperty('--color-light', '#CAD2C5'); 
        
        // Återställ textfärgen
        document.querySelectorAll('h1, h2, h3, p, span, a, li').forEach(el => {
            if (!el.closest('.modal')) { 
                el.style.color = ''; 
            }
        });
        
        themeResetBtn.style.display = 'none'; 
        
    } else {
        // --- SLÅ PÅ NATTLÄGE ---
        localStorage.setItem('easterEggDarkMode', 'true');
        document.documentElement.style.setProperty('--color-light', '#1A202C'); 
        
        // Gör all text ljus
        document.querySelectorAll('h1, h2, h3, p, span, a, li').forEach(el => {
            if (!el.closest('.modal')) {
                el.style.setProperty('color', '#CAD2C5', 'important');
            }
        });
        
        themeResetBtn.style.display = 'block'; 
    }
}

// 3. KOLLA MINNET VID SIDLADDNING
if (localStorage.getItem('easterEggDarkMode') === 'true') {
    localStorage.setItem('easterEggDarkMode', 'false'); 
    toggleEasterEggTheme(false); 
}

// 4. KLICK-LYSSNAREN FÖR SCROLL-TEXTEN
const scrollArea = document.querySelector('.scroll-indicator-wrap');
if (scrollArea) {
    scrollArea.style.cursor = 'pointer';
    
    let isClicking = false;

    scrollArea.addEventListener('click', (e) => {
        e.stopPropagation(); 
        
        if (isClicking) return; 
        isClicking = true;

        const isCurrentlyDark = localStorage.getItem('easterEggDarkMode') === 'true';
        
        // Om det redan är mörkt, stäng av (utan popup). Är det ljust, slå på (med popup).
        toggleEasterEggTheme(!isCurrentlyDark); 

        setTimeout(() => {
            isClicking = false;
        }, 1000);
    });
}